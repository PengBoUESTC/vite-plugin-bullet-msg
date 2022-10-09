"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulletMsgPlugin = exports.DefaultConfig = void 0;
const path_1 = require("path");
const compile_template_1 = require("./compile-template");
const { style, script } = (0, compile_template_1.compile)({
    path: './components',
    component: 'Bullet',
});
exports.DefaultConfig = {
    wsProtocol: 'vite-hmr',
    targetKey: 'TODO',
    rootPath: '/',
    duration: 10,
    hoverDuration: 30,
};
const bulletMsgPlugin = (configParams) => {
    configParams = Object.assign(Object.assign({}, exports.DefaultConfig), configParams);
    const { targetKey, rootPath, dataHandler } = configParams;
    let _server;
    return {
        enforce: 'pre',
        name: 'vite:bullet-msg',
        apply: 'serve',
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
                    path: (0, path_1.relative)(rootPath, id),
                });
            }
            const { ws } = _server;
            resultList.length && ws.send('vite:bullet-msg', resultList);
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
                            children: script(configParams),
                        },
                        {
                            tag: 'style',
                            injectTo: 'head',
                            children: dataHandler ? '' : style(configParams),
                        },
                    ],
                };
            },
        },
    };
};
exports.bulletMsgPlugin = bulletMsgPlugin;
