# XMind Viewer 

XMind Viewer, is a lightweight library to parse a `.xmind` file and render it in `SVG`.

It's very useful for showing a mind map on any web pages. Like a blog post, a book introduction, a page navigation, etc. All versions of XMind files are compatiable, which means you can generate an XMind file with `XMind SDK` and then render it with `XMind Viewer`. Cool?

XMind Viewer is an official project, made by XMind team, and written in TypeScript.


## Usage and Getting Started

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
