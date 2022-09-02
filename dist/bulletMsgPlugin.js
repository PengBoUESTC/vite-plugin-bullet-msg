"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulletMsgPlugin = void 0;
const path_1 = require("path");
const bulletMsgPlugin = (configParams) => {
    const { targetKey = 'TODO', rootPath = '/', wsPath, wsProtocol = 'vite-hmr' } = configParams;
    let _server;
    return {
        enforce: 'pre',
        name: 'vite:bullet-msg',
        configureServer(server) {
            _server = server;
        },
        transform(code, id) {
            let tempStr = code;
            const resultList = [];
            while (tempStr && !id.includes('node_modules') && !!targetKey) {
                const targetIdx = tempStr.indexOf(targetKey);
                if (targetIdx < 0)
                    break;
                tempStr = tempStr.slice(targetIdx + targetKey.length);
                const nextLineIdx = tempStr.indexOf('\n');
                resultList.push({
                    target: targetKey + tempStr.slice(0, nextLineIdx),
                    path: (0, path_1.relative)(rootPath, id)
                });
            }
            const { ws } = _server;
            resultList.length && ws.send("vite:bullet-msg", resultList);
            return code;
        },
        transformIndexHtml: {
            transform(html) {
                return {
                    html,
                    tags: [
                        {
                            tag: 'script',
                            injectTo: 'body',
                            children: wsPath ? `
                const wsToDO = new WebSocket('${wsPath}', '${wsProtocol}')
                wsToDO.addEventListener('message', async ({ data }) => {
                  data = JSON.parse(data)
                  const { event } = data
                  if(event === 'close') window.__Vite_Plugin_Info_ = undefined
                  if(!['vite:bullet-msg', 'updata'].includes(event)) return
              
                  if(event === 'updata') {
                    data = window.__Vite_Plugin_Info_ || []
                  }else {
                    data = data.data
                    window.__Vite_Plugin_Info_ = data || []
                  }
              
                  data.forEach(element => {
                    const { target, path } = element
                    if(!target) return
                    const dom = document.createElement('div')
                    dom.setAttribute('class', 'info-box')
                    dom.setAttribute('style', 'top: ' + (Math.random() * 6).toFixed(2) + 'rem')
                    dom.innerText = target + ':' + path
                    document.body.appendChild(dom)
                  });
                })
              ` : ''
                        },
                        {
                            tag: 'style',
                            injectTo: 'head',
                            children: `
              .info-box {
                font-size: 0.12rem;
                position: absolute;
                z-index: 1000;
                max-width: 200%;
                height: 0.16rem;
                line-height: 0.16rem;
                overflow: hidden;
                white-space: nowrap;
                color: #fff;
                background-color: rgba(0,0,0,0.6);
                animation-duration: 10s;
                animation-name: slidein;
                animation-iteration-count: infinite;
                animation-timing-function: cubic-bezier(0.42, 0.0, 0.58, 1.0);
              }
              .info-box:hover {
                animation-duration: 30s;
              }
              @keyframes slidein {
                from {
                  left: 100%;
                }
          
                to {
                  left: -100%;
                }
              }
              `
                        }
                    ]
                };
            }
        }
    };
};
exports.bulletMsgPlugin = bulletMsgPlugin;
