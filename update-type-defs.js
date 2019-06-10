const fs = require("fs")
const http = require("https")

let typingsUrl =
  "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped" +
  "/master/types/uglify-js/index.d.ts"

const typeFile = fs.createWriteStream(__dirname + "/uglify-es.d.ts", {
  flags: "w",
  encoding: "utf8",
})
http.get(typingsUrl, res => {
  res.pipe(typeFile)
}).on('error', e => {
  console.error(e)
  process.exit(1)
})
