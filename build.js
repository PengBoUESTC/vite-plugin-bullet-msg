const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')


function mv(from, to) {
  if(!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true })
  }
  fs.readdir(from, (err, files)=> {
    if(err) console.log(err)
    for(let file of files) {

      const fromPath = path.resolve(from, file)
      const toPath = path.resolve(to, file)
      console.log(fromPath, toPath)
      fs.copyFileSync(fromPath, toPath)
    }
  })
}

rimraf('./dist', () => {
  mv('./src/components', './dist/components')
})
