/**
 * 网易云api接口
 * useWymApi接受一个参数，该参数为请求方法，返回一个实例对象
 * 返回的实例对象中可以传入请求参数，以及fetch配置项
 * 项目运行逻辑： 加入缓存机制，将上次的请求的结果进行缓存，可以设置缓存时间
 * 接口方法：单独配置，使用时引入传给useWymApi hooks，hooks内部做逻辑处理
 */
import {
  useEffect,
  useRef,
  useCallback
} from 'react'

import type { SQLiteDatabase } from 'expo-sqlite'

import uuid from 'react-native-uuid'

import axios from 'axios'
import dayjs from 'dayjs'

import * as apiMethods from '@/api'

import {
  wyCloudEncode,
  wyCloudDecode,
  openDatabase,
  API_CACHE_TABLE
} from '@/utils'
import type {
  WyCloudOptions,
  WyCloudDecodeAnswer
} from '@/utils'

import { useNetInfo } from '@/store'

interface RequestInstance extends Partial<WyCloudOptions> {
  requestCacheDuration?: number
  recordUniqueId?: string // 同表结构中字段，如果该接口在cacheMultipleRecordApiList数组中出现，则必传，非则会导致缓存异常
}

const TAG = 'wyCloud'

/**
 * 需要缓存多条记录的api列表，如歌单，歌曲详情，用户详情等
 * 需要使用id作为唯一索引
 */
const cacheMultipleRecordApiList = [
  'https://music.163.com/api/v6/playlist/detail',
  'https://music.163.com/api/v3/song/detail'
]

/**
 * 网易云音乐请求接口
 * @param method string @/api 文件夹中导出的请求方法
 * @param cacheDuration number 缓存的时长，单位为毫秒，传0获取最新数据
 * @returns promise
 */
export function useWyCloudApi <T = any> (
  method: keyof typeof apiMethods,
  cacheDuration?: number
): (options?: RequestInstance) => Promise<WyCloudDecodeAnswer<T>> {
  if (apiMethods[method] === undefined) {
    throw console.error(`请求方法 - ${method} 不存在`)
  }

  const [ip] = useNetInfo((s) => [s.ip])

  const db = useRef<SQLiteDatabase>()

  useEffect(
    () => {
      if (!db.current) {
        db.current = openDatabase()

        db.current.transaction(
          (tx) => {
            /**
             * 创建表结构
             * cacheDuration 缓存时长，用于定期清理时间，毫秒
             * recordUniqueId 如果该接口需要存储多条记录，那么需要存储该字段，唯一id
             */
            tx.executeSql(
              `create table if not exists ${API_CACHE_TABLE} (
                id char(50) primary KEY not null,
                apiMethodName CHAR(50),
                responseJson TEXT,
                cookieHeaderJson TEXT,
                saveTimestamp INT,
                status INT,
                createItem INT,
                cacheDuration INT,
                recordUniqueId CHAR(255)
              )`
            )
          }
        )
      }

      // 页面卸载，需要同步关闭数据库
      () => db.current?.closeAsync()
    },
    []
  )

  // 请求对象，返回一个promise
  const requestInstance = useCallback(
    async (instanceOptions?: RequestInstance) => {
      const customOptions = instanceOptions ?? {}
      const {
        requestCacheDuration,
        data,
        recordUniqueId,
        ...options
      } = customOptions

      const duration = cacheDuration ?? requestCacheDuration ?? 0
      const {
        data: defaultData,
        ...defaultOptions
      } = apiMethods[method]()

      const mergeOptions = {
        data: { ...defaultData, ...data },
        ...defaultOptions,
        ...options
      }

      if (!mergeOptions.realIP && ip !== '') {
        mergeOptions.realIP = ip
      }

      const { url } = mergeOptions
      const wyCloudRequestOption = wyCloudEncode(mergeOptions)

      const isMultipleRecord = cacheMultipleRecordApiList.indexOf(url) !== -1

      return new Promise<WyCloudDecodeAnswer<T>>((resolve, reject) => {
        db.current?.transaction(
          (tx) => {
            const recordUniqueIdSql = ' and recordUniqueId = ?'
            const queryParmas = isMultipleRecord
              ? [method, recordUniqueId || null]
              : [method]

            tx.executeSql(
              `select * from ${API_CACHE_TABLE} where apiMethodName = ?${isMultipleRecord ? recordUniqueIdSql : ''}`,
              queryParmas,
              (_, { rows }) => {
                const currentTimestamp = dayjs().valueOf()
                const invalid =
                  duration === 0 ||
                  rows.length === 0 ||
                  currentTimestamp - rows._array[0].saveTimestamp > duration

                if (invalid) {
                  axios({
                    ...wyCloudRequestOption,
                    withCredentials: false
                  })
                    .then(response => {
                      // 解密网易云音乐数据
                      const requestResult = wyCloudDecode(mergeOptions.crypto, response)
                      const { status, body, cookie } = requestResult

                      if (status === 200) {
                        const bodyJson = JSON.stringify(body)
                        const cookieHeaderJson = JSON.stringify(cookie)
                        const saveTimestamp = dayjs().valueOf()

                        // 执行sqlite语句
                        if (rows.length === 0) {
                          db.current?.transaction(ttx => {
                            ttx.executeSql(
                              `insert into ${API_CACHE_TABLE}
                              (id, apiMethodName, responseJson, cookieHeaderJson, saveTimestamp, status, createItem, cacheDuration, recordUniqueId)
                              values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                              [
                                uuid.v4() as string,
                                method,
                                bodyJson,
                                cookieHeaderJson,
                                saveTimestamp,
                                status,
                                currentTimestamp,
                                1000 * 60 * 60 * 24 * 7, // 一个星期
                                recordUniqueId ?? ''
                              ]
                            )
                          })
                        } else {
                          const sqlPlaceholders = [
                            bodyJson,
                            cookieHeaderJson,
                            saveTimestamp,
                            status,
                            currentTimestamp,
                            method
                          ]
                          if (isMultipleRecord) sqlPlaceholders.push(recordUniqueId ?? '')

                          db.current?.transaction(ttx => {
                            ttx.executeSql(
                              `update ${API_CACHE_TABLE}
                              set responseJson = ?, cookieHeaderJson = ?, saveTimestamp =?, status =?, createItem =?
                              where apiMethodName = ?${isMultipleRecord ? recordUniqueIdSql : ''}`,
                              sqlPlaceholders
                            )
                          })
                        }
                      }

                      resolve(requestResult)
                    })
                    .catch(err => {
                      console.error(TAG, `请求错误：`, err)
                      reject(err)
                    })
                } else {
                  const {
                    responseJson,
                    cookieHeaderJson,
                    status
                  } = rows._array[0]

                  resolve({
                    status,
                    body: JSON.parse(responseJson),
                    cookie: JSON.parse(cookieHeaderJson)
                  })
                }
              },
              (_, err) => {
                console.log('查询出错', err)
              }
            )
          }
        )
      })
    },
    [ip]
  )

  return requestInstance
}
