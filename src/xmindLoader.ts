import JSZip from 'jszip'
import { SheetData } from './model/sheet'
import { TopicData } from './model/topic'

const MANIFEST_XML_PATH = 'META-INF/manifest.xml'
const CONTENT_XML_PATH = 'content.xml'
const STYLES_XML_PATH = 'styles.xml'

const CONTENT_JSON_PATH = 'content.json'

const FILE_ENTRIES = 'file-entries'
const FILE_ENTRY = 'file-entry'
const FULL_PATH = 'full-path'

export function loadFromXMind(zip: JSZip) {
  if (zip?.files) {
    const files = zip.files
    if (CONTENT_JSON_PATH in files) {
      return _fromJSON(zip)
    } else if (CONTENT_XML_PATH in files) {
      return _fromXML(zip)
    }
  }
  return Promise.reject('Not a valid XMind file.')
}

function _fromJSON(zip: JSZip) {
  return new Promise((resolve, reject) => {
    const contentZipObj = zip?.file(CONTENT_JSON_PATH)
    if (!contentZipObj) {
      return reject('Must have a content.xml file.')
    }

    contentZipObj.async('text').then(jsonStr => {
      return JSON.parse(jsonStr)
    }).then(content => {
      resolve({
        sheets: content
      })
    }).catch((e) => {
      reject(e)
    })
  })
}

function _fromXML(zip: JSZip) {
  return new Promise((resolve, reject) => {
    if (!zip) {
      return reject('Must have a valid XMind file.')
    }

    const manifestZipObj = zip.file(MANIFEST_XML_PATH)
    if (!manifestZipObj) {
      return reject('Must have a manifest.xml file.')
    }

    let domParser
    if (typeof((<any>global).window) === 'undefined') {
      const jsdom = require("jsdom")
      const DOMParser = new jsdom.JSDOM('').window.DOMParser
      domParser = new DOMParser()
    } else {
      domParser = new DOMParser()
    }
    manifestZipObj.async('text').then(xmlStr => {
      const dom = domParser.parseFromString(xmlStr, 'application/xml')
      return _parseManifestDOM(dom)
    }).then(manifest => {
      const jobs = []
      jobs.push(Promise.resolve(manifest))

      // load content.xml
      const contentZipObj = zip.file(CONTENT_XML_PATH)
      if (!contentZipObj) {
        return reject('Must have a content.xml file.')
      }
      jobs.push(contentZipObj.async('text').then(xmlStr => {
        return domParser.parseFromString(xmlStr, 'application/xml')
      }))

      //load styles.xml
      const stylesZipObj = zip.file(STYLES_XML_PATH)
      if (stylesZipObj) {
        jobs.push(stylesZipObj.async('text').then(xmlStr => {
          return domParser.parseFromString(xmlStr, 'application/xml')
        }))
      } else {
        jobs.push(Promise.resolve(null))
      }

      Promise.all(jobs).then(([manifest, contentDOM, stylesDOM]) => {
        const sheets: SheetData[] = []
        const parseSheetPromises = []
        Array.from(contentDOM.getElementsByTagName('sheet')).forEach((sheetDOM: Document) => {
          parseSheetPromises.push(_parseSheetDOM(sheetDOM, sheets, { stylesDOM }))
        })

        Promise.all(parseSheetPromises).then(() => {
          if (!sheets.length) {
            return reject('Faild to load XMind file.')
          }

          resolve({
            sheets
          })
        })
      })
    }).catch(e => {
      reject(e)
    })
  })
}

function _parseManifestDOM(dom: Document) {
  const manifestJSON = { [FILE_ENTRIES]: {} }

  const fileEntries = dom.getElementsByTagName(FILE_ENTRY)
  Array.from(fileEntries).forEach(fileEntry => {
    const fullPath = fileEntry.getAttribute(FULL_PATH)
    manifestJSON[FILE_ENTRIES][fullPath] = {}
  })
  return manifestJSON
}

function _parseSheetDOM(sheetDOM: Document, sheets: SheetData[], options?: { stylesDOM: Document }) {
  
  const sheetTitleDOMArr = Array.from(sheetDOM.childNodes).filter(item => item.nodeName?.toLowerCase() == 'title')
  const sheetTitleDOM = sheetTitleDOMArr.length > 0 && sheetTitleDOMArr[0]
  const title = sheetTitleDOM?.firstChild?.nodeValue || 'Missing Sheet Title'
  const sheet: any = {
    id: UUID(),
    title
  }
  sheets.push(sheet)

  fillTheme()

  return new Promise(resolve => {
    Promise.all([fillTopic()]).then(resolve)
  })

  function fillTopic() {
    return new Promise(resolve => {

      parseTopicDOM(sheetDOM.getElementsByTagName('topic')[0]).then((topicInfo: TopicData) => {
        sheet.rootTopic = topicInfo
        resolve()
      })

      function parseTopicDOM(topicDOM: Element) {
        return new Promise(resolve => {
          const promises = []
          const topicData: any = {}

          // id
          topicData.id = topicDOM.getAttribute('id')

          // title
          const titleDomArr = topicDOM.getElementsByTagName('title')
          const titleNode = titleDomArr.length >0 && titleDomArr[0]
          
          if (titleNode?.firstChild) {
            const value = titleNode.firstChild.nodeValue
            if (value) topicData.title = value.replace(/\r/g, '')

            topicData.customWidth = titleNode.getAttribute('svg:width')
          }

          // structureClass
          topicData.structureClass = topicDOM.getAttribute('structure-class')

          // styles
          const styleId = topicDOM.getAttribute('style-id')
          if (styleId) {
            const stylesDOM = options?.stylesDOM

            const userStyleDOM = stylesDOM?.getElementById(styleId)
            const styleProps = userStyleDOM?.getElementsByTagName('topic-properties')
            if (styleProps && styleProps[0]) {
              topicData.style = { type: 'topic' }
              const props = {}
              Array.from(styleProps[0].attributes).forEach(attrNode => {
                props[attrNode.name] = attrNode.value
              })

              topicData.style.properties = props
            }
          }

          // extensions
          const extensionsDOMArr = Array.from(topicDOM.childNodes).filter(item => item.nodeName?.toLowerCase() == 'extensions')
          if (extensionsDOMArr.length > 0) {
            const extensionsDOM = extensionsDOMArr[0] as Element
            const extensionDOMArr = extensionsDOM.getElementsByTagName('extension')
            if (extensionDOMArr) {
              const extensionsResult = []
              Array.from(extensionDOMArr).forEach(extensionDOM => {
                const extensionData: any = {}

                extensionData.provider = extensionDOM.getAttribute('provider')
                const contentContainer =  extensionDOM.getElementsByTagName('content') && extensionDOM.getElementsByTagName('content')[0]
                const contentDomArray = Array.from(contentContainer.childNodes).filter(item => item.nodeType === item.ELEMENT_NODE)
                const contentResult = []
                contentDomArray.forEach((contentDom: Element) => {
                  contentResult.push({
                    name: contentDom.nodeName,//tagName && contentDom.tagName.toLowerCase(),
                    content: parseExtensionContent(contentDom)
                  })
                })
                extensionData.content = contentResult
                extensionsResult.push(extensionData)
              })

              topicData.extensions = extensionsResult
            }
          }

          function parseExtensionContent (extensionContentDOM: Element) {
            const getAttrs = (dom: Element) => {
              let attrs = {}
              for (let attr of Array.from(dom.attributes)) {
                attrs[attr.name] = attr.value
              }
              if (Object.keys(attrs))
                return attrs
              return null
            }

            let content: any
            let extensionChildrenDOM = Array.from(extensionContentDOM.childNodes).filter(item => item.nodeType === item.ELEMENT_NODE)
            if (extensionChildrenDOM && extensionChildrenDOM.length) {
              content = []
              extensionChildrenDOM.forEach((childDOM: Element) => {
                let obj: any = {}
                obj.name = childDOM.nodeName//childDom.tagName && childDom.tagName.toLowerCase()
                obj.content = parseExtensionContent(childDOM)
                let attrs = getAttrs(childDOM)
                if (attrs)
                  obj.attrs = attrs
                //resourceRefs

                content.push(obj)
              })
            } else if (extensionContentDOM.firstChild) {
              content = extensionContentDOM.firstChild.nodeValue
            }

            return content
          }

          // children
          let attached: TopicData[] = []
          const childrenDom = Array.from(topicDOM.childNodes).filter(item => item.nodeName?.toLowerCase() == 'children')
          if (childrenDom.length > 0) {
            topicData.children = {}
            parseChildDOM('attached')
          }

          function parseChildDOM(type: string) {
            const topicsDOM = Array.from(childrenDom[0].childNodes).find((item: Element) => {
              return item.nodeName?.toLowerCase() == 'topics' 
                && item.getAttribute('type') == type
            })

            if (topicsDOM) {
              topicData.children[type] = [] 
              const topicsDOMArr = Array.from(topicsDOM.childNodes).filter(item => item.nodeName?.toLowerCase() == 'topic')

              for (let index in topicsDOMArr) {
                const childDOM = topicsDOMArr[index] as Element
                promises.push(parseTopicDOM(childDOM).then(childTopicInfo => {
                  topicData.children[type][index] = childTopicInfo
                }))
              }
            }
          }

          Promise.all(promises).then(() => {
            resolve(topicData)
          })

        })
      }
    })
  }

  function fillTheme() {
    if (!sheetDOM || !options?.stylesDOM) return

    const sheetThemeId = (sheetDOM as any).getAttribute('theme')
    if (!sheetThemeId)
      return

    const stylesDOM = options.stylesDOM
    const masterStylesContainer = stylesDOM.getElementById(sheetThemeId)
    if (!masterStylesContainer) return

    const theme = {}

    const defaultStyleDomArray = Array.from(masterStylesContainer.getElementsByTagName('default-style'))
    defaultStyleDomArray.forEach((dsDom) => {
      const styleId = dsDom.getAttribute('style-id')
      const styleFamily = dsDom.getAttribute('style-family')

      if (!stylesDOM || !styleId)
        return

      const amStyleDom = stylesDOM.getElementById(styleId)
      if (!amStyleDom) return
      const type = amStyleDom.getAttribute('type')

      theme[styleFamily] = {
        type,
        properties: {}
      }

      amStyleDom.getElementsByTagName(type + '-properties') && amStyleDom.getElementsByTagName(type + '-properties')[0] &&
        Array.from(amStyleDom.getElementsByTagName(type + '-properties')[0].attributes).forEach((attrNode) => {
          theme[styleFamily].properties[attrNode.name] = attrNode.value
        })
    })

    sheet.theme = theme
  }

  function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  }

}