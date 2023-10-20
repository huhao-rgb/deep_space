/**
 * 网易云api接口
 * useWymApi接受一个参数，该参数为请求方法，返回一个实例对象
 * 返回的实例对象中可以传入请求参数，以及fetch配置项
 * 项目运行逻辑： 加入缓存机制，将上次的请求的结果进行缓存，可以设置缓存时间
 * 接口方法：单独配置，使用时引入传给useWymApi hooks，hooks内部做逻辑处理
 */
import { useEffect, useRef } from 'react'

import type { SQLiteDatabase } from 'expo-sqlite'
import axios from 'axios'

import * as apiMethods from '@/api'

import {
  wyCloudEncode,
  openDatabase,
  API_CACHE
} from '@/utils'
import type { WyCloudOptions } from '@/utils'

/**
 * 网易云音乐请求接口
 * @param method string @/api 文件夹中导出的请求方法
 * @param cacheDuration number 缓存的时长，单位为毫秒，传0获取最新数据
 * @returns promise
 */
export const useWyCloudApi = (method: keyof typeof apiMethods, cacheDuration?: number) => {
  if (apiMethods[method] === undefined) {
    throw console.error(`请求方法 - ${method} 不存在`)
  }

  const db = useRef<SQLiteDatabase>()

  useEffect(
    () => {
      /**
       * 创建数据库
       * 
       */
      if (!db.current) {
        db.current = openDatabase()

        db.current.transaction(
          (tx) => {
            
          }
        )
      }
      

      // 页面卸载，需要同步关闭数据库
      () => db.current?.closeAsync()
    },
    []
  )

  // 请求的实例，返回一个promise
  const requestInstance = (options?: WyCloudOptions) => {
    const mergeOptions = {
      ...apiMethods[method](),
      ...options
    }
    const wyCloudRequestOption = wyCloudEncode(mergeOptions)

    return new Promise(() => {
      db.current?.transaction(
        (tx) => {
          tx.executeSql(
            `select * from ${API_CACHE}`,
            [],
            (_, { rows }) => {
              console.log('获取到的记录', rows)
            }
          )
        }
      )
      // if (first) {
      //   axios(wyCloudRequestOption)
      //     .then(response => {
      //       console.log('fetch请求：', response)
      //       console.log('fetch请求：', response.data)
      //     })
      // }
    })
  }

  return { wyCloud: requestInstance }
}
