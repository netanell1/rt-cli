export interface OptionModel {
    language: "js" | "ts",
    style: "css" | "scss" | "sass" | string,
    useModuleStyle: boolean,
    componentFileFormat: "function" | "const",
    componentFileName: string,
    styleFileName: string,
    useSuffix: boolean
}