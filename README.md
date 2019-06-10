# uglify-es

UglifyES "harmony" variant packaged as a single file

See https://github.com/mishoo/UglifyJS2/tree/harmony for documentation

- Install as package: `npm install uglify-es-lib`
- Use as library in a TypeScript project: `cp -a uglify-es.js uglify-es.js.map uglify-es.d.ts ~/your/project/dir`
- Use as library with a Rollup or Webpack project: `cp -a uglify-es.js uglify-es.js.map ~/your/project/dir`
- Use directly in Nodejs: `require("./uglify-es.umd.js")`
- Use directly in web browser: `<script src="uglify-es.umd.js"></script><script>console.log(uglify)</script>`
- Build from source: `npm run build`
