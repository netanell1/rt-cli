export interface OptionModel {
    language: "js" | "ts",
    style: "css" | "scss" | "sass" | string,
    moduleStyle: boolean,
    componentFileFormat: "function" | "const",
    componentFileName: string,
    styleFileName: string,
    modelSuffix: boolean
}