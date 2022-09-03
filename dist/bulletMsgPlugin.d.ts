import { PluginOption } from 'vite';
export interface PluginConfig {
    wsPath: string;
    wsProtocol?: string;
    rootPath?: string;
    targetKey?: string;
    duration?: number;
}
export interface Msg {
    target: string;
    path: string;
}
export declare const DefaultConfig: {
    wsProtocol: string;
    targetKey: string;
    rootPath: string;
    duration: number;
    hoverDuration: number;
};
export declare const bulletMsgPlugin: (configParams: PluginConfig) => PluginOption;
