import * as SQLite from 'expo-sqlite'

export const DEFAULT_DB_NAME = 'deepSpaceBaseDB'
export const DB_VERSION = '1.0'
export const DB_DESCRIPTION = '深空场音乐播放器本地数据库'
export const DB_SIZE = -1

export const openDatabase = (name?: string) => {
  return SQLite.openDatabase(
    name ?? DEFAULT_DB_NAME,
    DB_VERSION,
    DB_DESCRIPTION,
    DB_SIZE
  )
}

export const API_CACHE_TABLE = 'api_cache_table' // api缓存的数据的表名
