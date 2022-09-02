import { PluginOption } from 'vite';
export interface PluginConfig {
    wsPath: string;
    wsProtocol?: string;
    rootPath?: string;
    targetKey?: string;
}
export interface Msg {
    target: string;
    path: string;
}
export declare const bulletMsgPlugin: (configParams: PluginConfig) => PluginOption;
