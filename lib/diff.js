//获取命令参数
const rawArgv = process.argv.slice(2)

const util = require('./util.js')
const manifest = require('./manifest.js')

let outputDir = 'dist';
let diffRootDir = 'diff'
let oldDir = `${diffRootDir}/old`
let diffDir = `${diffRootDir}/diff`

const compareDiff = function () {
  let curentManifest = manifest.curentManifest(outputDir, ['manifest.json'])
  let oldManifestData = util.readJson(`${oldDir}/manifest.json`)

  util.deleteFolder(diffDir)
  util.mkdirs(diffDir)

  for (let key in curentManifest) {
    let hash = curentManifest[key];

    if (typeof (hash) === 'string') {//静态拷贝
      if (!oldManifestData[key] || oldManifestData[key] !== hash) {
        util.copyFile(`${outputDir}/${key}`, `${diffDir}/${key}`)
      }
    } else {//webpack编译文件
      if (!oldManifestData[key] || oldManifestData[key][0] !== hash[0]) {
        util.copyFile(`${outputDir}/${hash[1]}`, `${diffDir}/${hash[1]}`)
      }
    }
  }

  console.info(`\n
  差异文件已拷贝至-->${diffDir}\n
  请手动把dist/manifest.json文件拷贝至${oldDir}`)
}

// compareDiff()

module.exports = function(){
  compareDiff()
}