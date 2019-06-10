#!/bin/bash -e
cd "$(dirname "$0")"
mkdir -p build

# ----------------------------------------------------------------------------
# source-map

VERSION=$(node -p "require('./node_modules/source-map/package.json').version")
echo "/* source-map $VERSION */" > build/source-map.js
echo 'const module = {exports:{}};(function(){' >> build/source-map.js
cat ./node_modules/source-map/dist/source-map.js >> build/source-map.js
echo '}).apply({});' >> build/source-map.js
echo 'export default {' >> build/source-map.js
echo '  SourceMapGenerator: module.exports.SourceMapGenerator,' >> build/source-map.js
echo '  SourceMapConsumer: module.exports.SourceMapConsumer,' >> build/source-map.js
echo '  SourceNode: module.exports.SourceNode,' >> build/source-map.js
echo '}' >> build/source-map.js


# ----------------------------------------------------------------------------
# uglify-es

# file list extracted from uglify-es/tools/node.js
uglify_src_files=( \
  utils.js \
  ast.js \
  parse.js \
  transform.js \
  scope.js \
  output.js \
  compress.js \
  sourcemap.js \
  mozilla-ast.js \
  propmangle.js \
  minify.js \
)
VERSION=$(node -p "require('./node_modules/uglify-es/package.json').version")
echo "/* uglify-es $VERSION */" > build/uglify-es.js
echo 'import MOZ_SourceMap from "./source-map.js"' >> build/uglify-es.js
for f in ${uglify_src_files[@]}; do
  cat ./node_modules/uglify-es/lib/$f >> build/uglify-es.js
done
echo 'export default {' >> build/uglify-es.js
echo '  TreeWalker,' >> build/uglify-es.js
echo '  parse,' >> build/uglify-es.js
echo '  TreeTransformer,' >> build/uglify-es.js
echo '  Dictionary,' >> build/uglify-es.js
echo '  push_uniq,' >> build/uglify-es.js
echo '  minify,' >> build/uglify-es.js
echo '  ast: {' >> build/uglify-es.js
grep -E 'var AST_.+' ./node_modules/uglify-es/lib/ast.js \
  | sort -u \
  | sed -E 's/var AST_([a-zA-Z0-9_]+).+/    \1: AST_\1,/g' >> build/uglify-es.js
echo '  },' >> build/uglify-es.js
echo '}' >> build/uglify-es.js

# ----------------------------------------------------------------------------
# bundle

./node_modules/.bin/rollup entry.js \
  --file build/bundle-esm.js --format esm --name uglify --sourcemap &

./node_modules/.bin/rollup entry.js \
  --file build/bundle-umd.js --format umd --name uglify --sourcemap

wait

# ----------------------------------------------------------------------------
# optimize

echo "optimizing"

./node_modules/.bin/uglifyjs \
  --compress \
  --mangle \
  --toplevel \
  --ecma 7 \
  --source-map content=build/bundle-esm.js.map,includeSources=false \
  -o uglify-es.js \
  -- build/bundle-esm.js &

echo ""
./node_modules/.bin/uglifyjs \
  --compress \
  --mangle \
  --toplevel \
  --ecma 7 \
  --source-map content=build/bundle-umd.js.map,includeSources=false \
  -o uglify-es.umd.js \
  -- build/bundle-umd.js

wait

# ----------------------------------------------------------------------------
# remove embedded source code from sourcemap

echo "patching sourcemaps"
node <<_JS_
const fs = require('fs')
for (let file of [
  'uglify-es.js.map',
  'uglify-es.umd.js.map',
]) {
  const map = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (map.sourcesContent) {
    delete map.sourcesContent
    fs.writeFileSync(file, JSON.stringify(map), 'utf8')
  }
}
_JS_

cp -a node_modules/uglify-es/LICENSE LICENSE
