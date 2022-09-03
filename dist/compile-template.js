"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const fs_1 = require("fs");
const artTemplate = require('art-template');
const path_1 = require("path");
// 替换 script 中的 变量
const replaceScriptVar = (code, regx, options) => {
    if (!code)
        return '';
    return code.replace(regx, (_, $1) => {
        console.log($1, options[$1]);
        return `'${options[$1]}'`;
    });
};
const replaceStyleVar = (code, regx, options) => {
    if (!code)
        return '';
    return code.replace(regx, (_, $1) => {
        console.log($1, options[$1]);
        return `${options[$1]}`;
    });
};
// 编译转换模板文件
const scriptStyleCompile = (source) => {
    // 获取模板内容
    // const templateRegx = /template>\n*?([\s\S]*)\n*?<\/template>/g
    const scriptRegx = /<script>\n*?([\s\S]*)\n*?<\/script>/g;
    const styleRegx = /<style>\n*?([\s\S]*)\n*?<\/style>/g;
    const varRegx = /'\#{([\s\S]*?)}'/g;
    const scriptRes = scriptRegx.exec(source);
    const styleRes = styleRegx.exec(source);
    // 获取指定文本
    let script = scriptRes ? (scriptRes[1] || '') : '';
    let style = styleRes ? (styleRes[1] || '') : '';
    return {
        script: (config) => replaceScriptVar(script, varRegx, config),
        style: (config) => replaceStyleVar(style, varRegx, config)
    };
};
const templateCompile = (source) => {
    //art template html 文件解析
    return artTemplate.compile(source);
};
const compile = (compileConfig) => {
    const { path, component } = compileConfig;
    const target = (0, path_1.resolve)((0, path_1.join)(__dirname, path, component));
    const { script, style } = scriptStyleCompile((0, fs_1.readFileSync)(`${target}.vue`).toString());
    const template = templateCompile((0, fs_1.readFileSync)(`${target}.art`).toString());
    return {
        style,
        script,
        template
    };
};
exports.compile = compile;
