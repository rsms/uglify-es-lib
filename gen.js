const fs = require("fs")
const http = require("https")

let sources = [
  "node_modules/uglify-es/lib/utils.js",
  "node_modules/uglify-es/lib/ast.js",
  "node_modules/uglify-es/lib/parse.js",
  "node_modules/uglify-es/lib/transform.js",
  "node_modules/uglify-es/lib/scope.js",
  "node_modules/uglify-es/lib/output.js",
  "node_modules/uglify-es/lib/compress.js",
  "node_modules/uglify-es/lib/sourcemap.js",
  "node_modules/uglify-es/lib/mozilla-ast.js",
  "node_modules/uglify-es/lib/propmangle.js",
  "node_modules/uglify-es/lib/minify.js",
  "node_modules/uglify-es/tools/exports.js",
  "extensions.js",
]

let js = "var UglifyJS = exports;\n" +
sources.map(file =>
  fs.readFileSync(__dirname + "/" + file, "utf8")
).join('\n')

fs.writeFileSync(__dirname + "/index.g.js", js, "utf8")

// fetch types
const typeFile = fs.createWriteStream(__dirname + "/index.d.ts", {
  flags: "w",
  encoding: "utf8",
})
let typingsUrl =
  "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped" +
  "/master/types/uglify-js/index.d.ts"
http.get(typingsUrl, res => {
  res.pipe(typeFile)
  // res.on('close', () => typeFile.close())
}).on('error', e => {
  console.error(e)
  process.exit(1)
})
