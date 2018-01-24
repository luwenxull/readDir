/* eslint-disable */
const fs = require('fs')
const path = require('path')

function coroutine(generatorFunction) {
  return function(...args) {
    const generatorObject = generatorFunction(...args)
    generatorObject.next()
    return generatorObject
  }
}

module.exports = function readDir2(dir, filter, callback) {
  const fn = function (pi) {
    let filteredFiles = []
    fs.readdir(dir, function(err, files) {
      if (err) throw err
      const g = coroutine(function * () {
        for (const file of files) {
          const n = yield
          if (n !== null) {
            filteredFiles = filteredFiles.concat(n)
          }
        }
        if (pi) {
          pi.next(filteredFiles)
        } else if (callback) {
          callback(filteredFiles)
        }
      })
      const i = g()
      for (const file of files) {
        const fpath = path.resolve(dir, file)
        fs.stat(fpath, (err, stats) => {
          if (err) throw err
          if (stats.isDirectory()) {
            fn(fpath, i)
          } else {
            if (filters.length) {
              for (const filter of filters) {
                if (file.search(filter) >= 0) {
                  i.next(fpath)
                } else {
                  i.next(null)
                }
              }
            } else {
              i.next(fpath)
            }
          }
        })
      }
    })
  }
  fn()
}
// // readDir(path.resolve(__dirname, 'src'))
// readDir2(path.resolve(__dirname, 'src', ''))
