import { WindowMaterialType } from "../../core/types/WindowMaterialType";
import { ThemeMode } from "../../core/types/ThemeMode";
import { SoundEffect } from "../../core/types/SoundEffect";
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

    /** Sound pack. Leave undefined for disable sound effects. Sound packs must be placed in `/public/sound/ui/[sound_pack_name]`. */
    soundPack: string | undefined
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
    soundPack: "default"
};
