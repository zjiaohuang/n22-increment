let manifest = {}

const fs = require('fs')
const $path = require('path')
const crypto = require('crypto')
const statSync = fs.statSync

const manifestFileName = 'manifest.json'

let hashReg = /\.(\S*)\./


const curentManifest = function (src, root, ignore = []) {
  let doBreak = false;
  let baseName = $path.basename(src);

  ignore.forEach(element => {
    if (baseName == element) {
      doBreak = true;
    }
  });

  if (doBreak) {
    return null;
  }

  let childs = fs.readdirSync(src)

  //排序，文件在前，文件夹在后
  childs.sort((a, b) => {
    let _a = statSync(src + '/' + a);
    let _b = statSync(src + '/' + b);

    if (_a.isFile() && _b.isFile()) {
      return _a > b;
    } else if (_a.isFile() && !_b.isFile()) {
      return false
    } else if (!_a.isFile() && _b.isFile()) {
      return true
    } else {
      return _a > b;
    }
  })

  childs.forEach((fileName) => {
    let _src = src + '/' + fileName
    let file = statSync(_src)

    if (file.isFile()) {
      ignore.forEach(element => {
        if (fileName == element) {
          doBreak = true;
        }
      });

      if (!doBreak) {
        let hashs = $path.basename(_src).match(hashReg);

        //文件上有hash值
        let key = null;
        let value = null;
        let filePath = _src.replace(root + '/', '')
        if (hashs) {
          key = filePath.replace('.' + hashs[1], '')
          value = [hashs[1], filePath];
        } else {
          try {
            let fileData = fs.readFileSync(_src);
            let hash = crypto.createHash('md5');
            hash.update(fileData.toString(), 'utf8');
            key = filePath
            value = hash.digest('hex')
          } catch (e) {
            // fail silently.
            console.log('e:', e);
          }
        }

        manifest[key] = value
      }
    } else {
      curentManifest(_src, root, ignore)
    }
  })
  return manifest;
}

module.exports = {
  curentManifest: function (src, ignore) {
    let manifestJson = curentManifest(src, src, ignore);
    let manifestStr = JSON.stringify(manifestJson, null, 2);

    let hash = crypto.createHash('md5');
    hash.update(manifestStr.toString(), 'utf8');
    manifestJson[manifestFileName] = hash.digest('hex')

    fs.writeFileSync($path.join(src, `/${manifestFileName}`), manifestStr)

    return manifestJson;
  }
}