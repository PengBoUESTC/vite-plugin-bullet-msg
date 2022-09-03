import { PluginOption, ViteDevServer } from 'vite'
import { relative } from 'path'
import { compile } from './compile-template'
export interface PluginConfig {
  wsPath: string
  wsProtocol?: string
  rootPath?: string
  targetKey?: string
  duration?: number
}
export interface Msg {
  target: string
  path: string
}
const { style, script, template } = compile({
  path: './components',
  component: 'Bullet',
})

export const DefaultConfig = {
  wsProtocol: 'vite-hmr',
  targetKey: 'TODO',
  rootPath: '/',
  duration: 10,
  hoverDuration: 30,
}

export const bulletMsgPlugin = (configParams: PluginConfig): PluginOption => {
  configParams = { ...DefaultConfig, ...configParams }
  const { targetKey, rootPath, } = configParams
  let _server: ViteDevServer

  return {
    enforce: 'pre',
    name: 'vite:bullet-msg',
    configureServer(server: ViteDevServer) {
      _server = server
    },

    transform(code: string, id: string) {
      let tempStr = code
      const resultList: Msg[] = []
      while(tempStr && !id.includes('node_modules') && !!targetKey) {
        const targetIdx = tempStr.indexOf(targetKey)
        if(targetIdx < 0) break
        tempStr = tempStr.slice(targetIdx + targetKey.length)
        const nextLineIdx = tempStr.indexOf('\n')
        resultList.push({
          target: targetKey + tempStr.slice(0, nextLineIdx),
          path: relative(rootPath, id)
        })
      }
      const { ws } = _server
      resultList.length && ws.send("vite:bullet-msg", resultList)
      return code
    },
    transformIndexHtml: {
      transform(html: string) {
        return {
          html,
          tags: [
            {
              tag: 'script',
              injectTo: 'body',
              children: script(configParams as any)
            },
            {
              tag: 'style',
              injectTo: 'head',
              children: style(configParams as any)
            }
          ]
        }
      }
    }
  }
}