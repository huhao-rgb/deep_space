// Fisher-Yates Shuffle 洗牌算法
export const fyShuffle = <T = any> (arr: T[]) => {
  let len = arr.length
  while (len > 1) {
    const rand = Math.floor(Math.random() * len)
    len--
    const temp = arr[len]
    arr[len] = arr[rand]
    arr[rand] = temp
  }
  return arr
}

// 某段范围内的随机数
export const rangeRandomNumber = (min: number, max: number) => {
  return Math.ceil(Math.random() * (max - min)) + min
}
