# smart_park

## Project setup
```
npm install
```
## 在 node_modules/cesium 目录下找到它的 package.json 文件，然后修改 exports 字段
```
"exports": {
    "./package.json": "./package.json",
    ".": {
        "require": "./index.cjs",
        "import": "./Source/Cesium.js"
    },
    "./widgets.css": "./Source/Widgets/widgets.css"
},
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
