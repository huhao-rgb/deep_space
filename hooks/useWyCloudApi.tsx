/**
 * 网易云api接口
 * useWyCloudApi接受一个参数，该参数为请求方法，返回一个实例对象
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
import { useShallow } from 'zustand/react/shallow'

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
import { useSystem } from '@/store'

type AnyObject = Record<string, any>

interface RequestInstance <D extends AnyObject> extends Partial<WyCloudOptions<D>> {
  requestCacheDuration?: number
  recordUniqueId?: string // 同表结构中字段
}

interface SqliteRequestDataItem {
  responseJson: string
  cookieHeaderJson: string
  status: number
}

const getSqliteRequestData = (arr: SqliteRequestDataItem[]) => {
  const {
    responseJson,
    cookieHeaderJson,
    status
  } = arr[0]

  return {
    status,
    body: JSON.parse(responseJson),
    cookie: JSON.parse(cookieHeaderJson)
  }
}

/**
 * 网易云音乐请求接口
 * @param method string @/api 文件夹中导出的请求方法
 * @param cacheDuration number 缓存的时长，单位为毫秒，传0获取最新数据
 * @returns promise
 */
export function useWyCloudApi <T = any, D extends AnyObject = {}> (
  method: keyof typeof apiMethods,
  cacheDuration?: number
): (options?: RequestInstance<D>, cb?: (data: WyCloudDecodeAnswer<T>) => void) => Promise<WyCloudDecodeAnswer<T>> {
  if (apiMethods[method] === undefined) {
    throw console.error(`请求方法 - ${method} 不存在`)
  }

  // const [ip] = useNetInfo((s) => [s.ip], shallow)
  const [cDuration] = useSystem(useShallow((state) => [state.cacheDuration]))

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
                recordUniqueId TEXT
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
    async (instanceOptions?: RequestInstance<D>, queryRowCb?: (data: any) => void) => {
      const customOptions = instanceOptions ?? {}
      const {
        requestCacheDuration,
        data,
        recordUniqueId,
        ...options
      } = customOptions

      const duration = cacheDuration ?? requestCacheDuration ?? cDuration
      const {
        data: defaultData,
        ...defaultOptions
      } = apiMethods[method as 'songUrlV1'](data as any)

      const mergeOptions = {
        data: defaultData,
        ...defaultOptions,
        ...options
      }

      // if (!mergeOptions.realIP && ip !== '') {
      //   mergeOptions.realIP = ip
      // }

      const { url } = mergeOptions
      const wyCloudRequestOption = wyCloudEncode(mergeOptions)

      const isMultipleRecord = recordUniqueId !== undefined

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
                if (rows.length > 0) {
                  // 确保在有数据的情况下，直接通过回调返回
                  queryRowCb?.(getSqliteRequestData(rows._array))
                }

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
                      reject(err)
                    })
                } else {
                  resolve(getSqliteRequestData(rows._array))
                }
              },
              (_, err) => {
                throw console.error('查询出错', err)
              }
            )
          }
        )
      })
    },
    []
  )

  return requestInstance
}
