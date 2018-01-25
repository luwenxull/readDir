const readdir = require('..')
readdir(__dirname, ['hello'], (files) => {
  console.log(files)
})
