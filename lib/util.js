const fs = require('fs')
const $path = require('path')


function mkdirs(dir) {
  let flag = fs.existsSync(dir)
  if (!flag) {
    let parentDir = $path.dirname(dir);
    mkdirs(parentDir)
    fs.mkdirSync(dir);
  }
}

function readJson(file, defualt = {}) {
  try {
    let data = fs.readFileSync($path.join(file), 'utf8');
    if (data) {
      // console.log('data->', data);

      return JSON.parse(data);
    } else {
      return defualt
    }
  } catch (x) {
    console.log(`read file [${file}]`, x);
    return defualt
  }
}

function copyFile(from, to) {
  let readable, writable;
  let toDir = $path.dirname(to);
  mkdirs(toDir)

  readable = fs.createReadStream(from);
  // 创建写入流
  writable = fs.createWriteStream(to);
  // 通过管道来传输流
  readable.pipe(writable);
}

function deleteFolder(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file) {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

module.exports = {
  mkdirs,
  readJson,
  copyFile,
  deleteFolder
}