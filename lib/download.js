const cliProgress = require('cli-progress')
const colors = require('colorette')
const fs = require('fs')
const https = require('https')
const path = require('path')

module.exports = async ({ name, downloadUrl }, count, length) => {
  const extension = path.extname(downloadUrl)

  if (fs.existsSync(`${name}${extension}`)) {
    console.warn(colors.red(`歌曲 ${name}${extension} 已存在`))
  }

  const progress = new cliProgress.SingleBar({
    format: '下载进度 | {bar} | {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  })

  console.log(colors.green('文件下载开始...'))

  https.get(downloadUrl, (res) => {
    const fileSteam = fs.createWriteStream(`${name}${extension}`)
    res.pipe(fileSteam)

    progress.start(res.headers['content-length'], 0)

    let dataLength = 0

    res.on('data', (chunk) => {
      dataLength += chunk.length
      progress.update(dataLength)
    })

    fileSteam.on('finish', () => {
      progress.stop()
      console.log(colors.green('文件下载完成'))
      fileSteam.end()
      count += 1
      if (count === length) process.exit(0)
    })
  })
}
