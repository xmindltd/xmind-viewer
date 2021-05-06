import 'core-js/stable'

import contentData from './content.json'
import JSZip from 'jszip'
import { SheetData } from 'model/sheet'
import { loadFromXMind, SnowbrushRenderer } from '../src/index'

// https://developer.mozilla.org/zh-CN/docs/Web/API/ParentNode/append
// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('append')) {
      return;
    }
    Object.defineProperty(item, 'append', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function append() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.appendChild(docFrag);
      }
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

/**
 * 获取地址栏参数值
 * @param param_key 地址栏参数键名
 */
function getUrlParam(param_key) {
    var arr = window.location.search.replace(/^[\?]/, '').split('&');
    for (var i = 0; i < arr.length; i++) {
        var value = arr[i].replace(/^[^\=]+[\=]/, '');
        if(arr[i].replace(value, '') == param_key + '=') {
            return value;
        }
    }
    return null;
}

/**
 * 加载XMind数据
 * @param {SheetData[]} data XMind数据
 */
function load(data: SheetData[]) {
  const container = document.getElementById('page-content')
  if (container.children.length > 0) {
    container.innerHTML = ''
  }

  const renderer = new SnowbrushRenderer(data)
  renderer.render()
  const rendererBounds = renderer.bounds

  const clientWidth = container.clientWidth
  const clientHeight = container.clientHeight
  const width = Math.max(clientWidth, rendererBounds.width)
  const height = Math.max(clientHeight, rendererBounds.height)

  const rendererContainer = document.createElement('div')
  rendererContainer.setAttribute('style', `width: ${width * 2}; height: ${height * 2}; position: relative;`)
  rendererContainer.className = 'sheet-container'
  renderer.svg.addTo(rendererContainer)
  rendererContainer.style.backgroundColor = renderer.svg.node.style.backgroundColor
  container.append(rendererContainer)
  
  renderer.transform(width + rendererBounds.x, height + rendererBounds.y)
  container.scrollTo(width - clientWidth / 2, height - clientHeight / 2)
}

/**
 * 全屏切换
 */
function toggleFullScreen() {
   var doc = window.document;
   var docEl = doc.documentElement;

   var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
   var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

   if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
       requestFullScreen.call(docEl);
   }
   else {
       cancelFullScreen.call(doc);
   }
}

let file = getUrlParam("file")
if (file !== null && file.length > 0) {
  var request = new XMLHttpRequest();
  // request.open('GET', "/cors-anywhere?url=" + file, true); // 防止跨域
  request.open('GET', file, true);
  request.responseType = 'blob';
  request.onload = function() {
    var reader = new FileReader();
    reader.onload =  function(e){
      console.log('DataURL:', e.target.result);
      const jszip = new JSZip()
      return Promise.all([
        Promise.resolve(file),
        jszip.loadAsync(e.target.result).then(zip => {
          loadFromXMind(zip).then((result: any) => {
            load(result.sheets)
          }).catch(function(err) {
            console.error(err)
            alert(err)
          })
        })
      ])
    };
    reader.readAsArrayBuffer(request.response);
  };
  request.send();
}
else {
  load(contentData)
}

document.getElementById('input-dialog').addEventListener('input', function() {
  const inputEle = this as HTMLInputElement
  if (inputEle.files.length === 0) { 
    return 
  }

  const file = inputEle.files[0]
  const fileName = inputEle.value
  // debugger
  const reader = new FileReader()
  reader.onload = e => {
    const jszip = new JSZip()
    return Promise.all([
      Promise.resolve(fileName),
      jszip.loadAsync(e.target.result).then(zip => {
        loadFromXMind(zip).then((result: any) => {
          load(result.sheets)
        })
      })
    ])
  }

  reader.readAsArrayBuffer(file)
})

document.getElementById('open-file').addEventListener('click', function(){
  const input = document.getElementById('input-dialog')
  input.click()
})

document.getElementById('toggle-fullscreen').addEventListener('click', toggleFullScreen)