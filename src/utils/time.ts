// 格式化时间，hh:mm:ss
export const formatTime = (milliseconds: number, showHours?: boolean) => {
  const formattedSeconds = Math.floor(milliseconds % 60)
    .toFixed(0)
    .padStart(2, '0')

  if (!showHours) {
    const formattedMinutes = Math.floor(milliseconds / 60)
      .toFixed(0)
      .padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
  }

  const formattedHours = Math.floor(milliseconds / 3600)
    .toFixed(0)
    .padStart(2, '0')
  const formattedMinutes = (Math.floor(milliseconds / 60) % 60)
    .toFixed(0)
    .padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
