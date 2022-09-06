import { readFileSync } from 'fs';
const artTemplate = require('art-template');
import { join, resolve } from 'path';

export type SourceFn = (config?: Record<string, string>) => string;

// 替换 script 中的 变量
const replaceScriptVar = (
  code: string | null,
  regx: RegExp,
  options: Record<string, string>,
): string => {
  if (!code) return '';

  return code.replace(regx, (_, $1) => {
    const value = options[$1];
    if (value == null) return null;
    if (typeof value === 'function') return value;
    return `'${value}'`;
  });
};
const replaceStyleVar = (
  code: string | null,
  regx: RegExp,
  options: Record<string, string>,
): string => {
  if (!code) return '';

  return code.replace(regx, (_, $1) => {
    return `${options[$1]}`;
  });
};

// 编译转换模板文件
const scriptStyleCompile = (
  source: string,
): {
  script: SourceFn;
  style: SourceFn;
} => {
  // 获取模板内容
  // const templateRegx = /template>\n*?([\s\S]*)\n*?<\/template>/g
  const scriptRegx = /<script>\n*?([\s\S]*)\n*?<\/script>/g;
  const styleRegx = /<style>\n*?([\s\S]*)\n*?<\/style>/g;
  const varRegx = /'\#{([\s\S]*?)}'/g;

  const scriptRes = scriptRegx.exec(source);
  const styleRes = styleRegx.exec(source);

  // 获取指定文本
  let script = scriptRes ? scriptRes[1] || '' : '';
  let style = styleRes ? styleRes[1] || '' : '';

  return {
    script: (config: Record<string, string>) =>
      replaceScriptVar(script, varRegx, config),
    style: (config: Record<string, string>) =>
      replaceStyleVar(style, varRegx, config),
  };
};

const templateCompile: (source: string) => SourceFn = (source: string) => {
  //art template html 文件解析
  return artTemplate.compile(source);
};

export interface CompileConfig {
  path: string;
  component: string;
}

export const compile = (
  compileConfig: CompileConfig,
): {
  style: SourceFn;
  script: SourceFn;
  template: SourceFn;
} => {
  const { path, component } = compileConfig;
  const target = resolve(join(__dirname, path, component));
  const { script, style } = scriptStyleCompile(
    readFileSync(`${target}.vue`).toString(),
  );
  const template = templateCompile(readFileSync(`${target}.art`).toString());

  return {
    style,
    script,
    template,
  };
};
