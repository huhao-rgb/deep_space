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

interface RequestInstance extends Partial<WyCloudOptions> {
  requestCacheDuration?: number
}

const TAG = 'wyCloud'

/**
 * 网易云音乐请求接口
 * @param method string @/api 文件夹中导出的请求方法
 * @param cacheDuration number 缓存的时长，单位为毫秒，传0获取最新数据
 * @returns promise
 */
export function useWyCloudApi <T = any> (
  method: keyof typeof apiMethods,
  cacheDuration?: number
): (options?: Partial<WyCloudOptions>) => Promise<WyCloudDecodeAnswer<T>> {
  if (apiMethods[method] === undefined) {
    throw console.error(`请求方法 - ${method} 不存在`)
  }

  const db = useRef<SQLiteDatabase>()

  useEffect(
    () => {
      if (!db.current) {
        db.current = openDatabase()

        db.current.transaction(
          (tx) => {
            // 创建表结构
            tx.executeSql(
              `create table if not exists ${API_CACHE_TABLE} (
                id char(50) primary KEY not null,
                apiMethodName CHAR(50),
                responseJson TEXT,
                cookieHeaderJson TEXT,
                saveTimestamp INT,
                status INT
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
    (instanceOptions?: RequestInstance) => {
      const customOptions = instanceOptions ?? {}
      const {
        requestCacheDuration,
        ...options
      } = customOptions

      const duration = cacheDuration ?? requestCacheDuration ?? 0

      const mergeOptions = {
        ...apiMethods[method](),
        ...options
      }
      const wyCloudRequestOption = wyCloudEncode(mergeOptions)

      return new Promise<WyCloudDecodeAnswer<T>>((resolve, reject) => {
        db.current?.transaction(
          (tx) => {
            tx.executeSql(
              `select * from ${API_CACHE_TABLE} where apiMethodName = ?`,
              [method],
              (_, { rows }) => {
                const currentTimestamp = dayjs().valueOf()
                const invalid =
                  duration === 0 ||
                  rows.length === 0 ||
                  currentTimestamp - rows._array[0].saveTimestamp > duration

                if (invalid) {
                  axios(wyCloudRequestOption)
                    .then(response => {
                      // 解密网易云音乐数据
                      const requestResult = wyCloudDecode(mergeOptions.crypto, response)
                      const { status, body, cookie } = requestResult

                      const bodyJson = JSON.stringify(body)
                      const cookieHeaderJson = JSON.stringify(cookie)
                      const saveTimestamp = dayjs().valueOf()

                      // 执行sqlite语句
                      if (rows.length === 0) {
                        db.current?.transaction(ttx => {
                          ttx.executeSql(
                            `insert into ${API_CACHE_TABLE}
                            (id, apiMethodName, responseJson, cookieHeaderJson, saveTimestamp, status)
                            values (?, ?, ?, ?, ?, ?)`,
                            [
                              uuid.v4() as string,
                              method,
                              bodyJson,
                              cookieHeaderJson,
                              saveTimestamp,
                              status
                            ]
                          )
                        })
                      } else {
                        db.current?.transaction(ttx => {
                          ttx.executeSql(
                            `update ${API_CACHE_TABLE}
                            set responseJson = ?, cookieHeaderJson = ?, saveTimestamp =?, status =?
                            where apiMethodName = ?`,
                            [
                              bodyJson,
                              cookieHeaderJson,
                              saveTimestamp,
                              status,
                              method
                            ]
                          )
                        })
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
