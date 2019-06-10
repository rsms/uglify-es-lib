const fs = require("fs")
const http = require("https")

function readfile(name) {
  return fs.readFileSync(__dirname + "/" + name, "utf8")
}

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
  "extensions.js",
]
let js = sources.map(readfile).join('\n')

// fetch types
const typeFile = fs.createWriteStream(__dirname + "/uglify-es.d.ts", {
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

// // generate es5/nodejs file
// let js5 = (
//   "var MOZ_SourceMap = require('source-map');"+
//   "var UglifyJS = exports;\n" + js +
//   readfile("node_modules/uglify-es/tools/exports.js")
// )
// fs.writeFileSync(__dirname + "/uglify-es.g.js", js5, "utf8")

// generate es6 file
let es = (
  "import MOZ_SourceMap from 'source-map';\n" +
  js + readfile("exports-es.js")
)
fs.writeFileSync(__dirname + "/uglify-es.g.js", es, "utf8")
