# ~~**DEPRECATED** - Never ever use it in a production environment!~~

# XMind Viewer 

XMind Viewer, is a lightweight library to parse a `.xmind` file and render it in `SVG`.

It's very useful for showing a mind map on any web pages. Like a blog post, a book introduction, a page navigation, etc. All versions of XMind files are compatiable, which means you can generate an XMind file with `XMind SDK` and then render it with `XMind Viewer`. Cool?

XMind Viewer is an official project, made by XMind team, and written in TypeScript.

## Quick Start

```bash
git clone https://github.com/xmindltd/xmind-viewer.git
cd xmind-viewer
# install project dependencies
npm install --registry=https://registry.npm.taobao.org
# install parcel
npm install --save-dev cssnano @babel/preset-env @babel/core --registry=https://registry.npm.taobao.org
npm install -g parcel --registry=https://registry.npm.taobao.org
npm install core-js@3 @babel/polyfill @babel/plugin-transform-classes --save --registry=https://registry.npm.taobao.org
# run
parcel --port 8989 --log-level 4 --target browser example\index.html
# build
# parcel build example\index.html
# parcel build --log-level 4 --target browser --public-url . example\index.html
# 参数解释
# - --public-url .: 资源引用，使用相对路径
```

### load xmind from url
```bash
# eg: http://localhost:8989/?file=http://127.0.0.1:8001/hello.xmind

# xmind file serving
# install http static server
npm install http-server -g
# run in folder(where hello.xmind is)
http-server -p 8001 --cors
# refer: https://stackoverflow.com/questions/21956683/enable-access-control-on-simple-http-server/28632834#28632834
```

## Usage and Getting Started

### Usage in Node.js

```shell
$ npm i --save xmind-viewer
```

```js
const { loadFromXMind, SnowbrushRenderer } = require('xmind-viewer')
```

### Simple Usage

```ts
import JSZip from 'jszip'
import { loadFromXMind, SnowbrushRenderer } from 'xmind-viewer'

new JSZip().loadAsync(zipFile).then(zip => {
	loadFromXMind(zip).then(data => {
		const renderer = new SnowbrushRenderer(data.sheets)
		return renderer.render({ sheetIndex: 0 })
	}).then(svg => {
		// document.body.appendChild(svg)
	})
})
```

### loadFromXMind()

`loadFromXMind()` can be used to convert `.xmind` files into `sheets` that can be read by Snowbrush Render

### Snowbrush Renderer

Snowbrush Renderer accepts an array of sheets as a constructor argument, and SVG will be generated based on the content of the sheet after using `render()`.

> P.S. Snowbrush is an internal code name for render engine.

#### Methods

##### .render(options: RenderOptions) => Svg

SVG will be generated based on the content of the sheet after using `render()`.
You can use options to determine which Sheet you want to display.

###### RenderOptions

`sheetIndex`: Select which sheet you want to render.

##### .svg => Svg

Get the generated SVG, it must be called after `render()`.

##### .transform(x, y)

Move the center point of the mindmap to the location (x, y).

## Notice

In addition to these exposed API, the rest of the code can change at any time.

## License
See the [MIT License](LICENSE).
