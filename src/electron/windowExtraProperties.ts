/**
 * Supported window material types.
 *
 * @public
 */
export type WindowMaterialType = "fluent" | "default";

/**
 * Supported UI theme identifiers (folder names under `core/styles/themes/`).
 *
 * @public
 */
export type UITheme = "windows11" | "windows10" | "default";

/**
 * Extra application window/runtime flags.
 *
 * @public
 */
export interface WindowExtraProperties {
    /** Use sidebar navigator menu. */
    useNavigator: boolean;

    /** Display window icon when `windowMaterialType` is `fluent`. */
    displayFluentIcon: boolean;

    /** Window material mode (affects frame/titlebar behavior). */
    windowMaterialType: WindowMaterialType;

    /** Components theme folder name. */
    uiTheme: UITheme;

    /** Focus existing instance instead of creating a new one. */
    disableSecondInstance: boolean;
}

/**
 * Extra properties used across the Electron main/renderer configuration.
 *
 * @public
 */
export const windowExtraProperties: WindowExtraProperties = {
    useNavigator: true,
    displayFluentIcon: true,
    windowMaterialType: "fluent",
    uiTheme: "windows11",
    disableSecondInstance: true,
};
