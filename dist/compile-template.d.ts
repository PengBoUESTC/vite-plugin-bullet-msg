export declare type SourceFn = (config?: Record<string, string>) => string;
export interface CompileConfig {
    path: string;
    component: string;
}
export declare const compile: (compileConfig: CompileConfig) => {
    style: SourceFn;
    script: SourceFn;
};
