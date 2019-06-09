const fs = require("fs")

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

process.stdout.write(js)
