// string转uint8Array
export const stringToUint8Array = (str: string): Uint8Array => {
  const arr = []
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i))
  }
  return new Uint8Array(arr)
}

export const arrayBufferToHexStr = (buffer: ArrayBuffer) => {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
}
