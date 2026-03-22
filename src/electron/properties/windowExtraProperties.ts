import { WindowMaterialType } from "../../core/types/WindowMaterialType";
import { uiTheme } from "../../core/types/uiTheme";

/**
 * Extra application window/runtime flags.
 *
 * @public
 */
export interface WindowExtraProperties {
    /** Use sidebar navigator menu. */
    useNavigator: boolean | undefined;

    /** Display window icon when `windowMaterialType` is `fluent`. */
    displayFluentIcon: boolean | undefined;

    /** Window material mode (affects frame/titlebar behavior). */
    windowMaterialType: WindowMaterialType | undefined;

    /** Focus existing instance instead of creating a new one. */
    disableSecondInstance: boolean | undefined;

    /** UI theme. */
    uiTheme: uiTheme | undefined;
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
    disableSecondInstance: true,
    uiTheme: "windows11",
};
