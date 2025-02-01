export interface OptionsModel {
    js?: boolean;
    ts?: boolean;
    style?: "css" | "scss" | "sass" | string,
    useModuleStyle?: boolean,
    function?: boolean;
    const?: boolean;
    componentFileName?: string;
    styleFileName?: string;
    testLibrary?: string;
    useSuffix?: boolean;

}