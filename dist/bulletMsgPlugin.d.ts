import { PluginOption } from 'vite';
export interface TargetData {
    target: string;
    path: string;
}
export interface PluginConfig {
    wsPath: string;
    wsProtocol?: string;
    rootPath?: string;
    targetKey?: string;
    duration?: number;
    hoverDuration?: number;
    dataHandler?: (data: Array<TargetData>) => void;
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
