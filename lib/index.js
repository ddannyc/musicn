const commander = require('./commander')
const choose = require('./choose')
const search = require('./search')
const download = require('./download')

module.exports = async () => {
  const result = await search(commander)
  const { songs } = await choose(result)
  let finishCount = 0
  songs.forEach((song) => download(song, finishCount, songs.length))
}
