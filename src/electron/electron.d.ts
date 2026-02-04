import type { OpenDialogReturnValue, SaveDialogReturnValue } from "electron";
export {};

declare global {
    interface Window {
        application: {
            showSaveFileDialog: (
                options: object,
            ) => Promise<SaveDialogReturnValue>;
            showOpenFileDialog: (
                options: object,
            ) => Promise<OpenDialogReturnValue>;
            saveFileData: (filePath: string, data: string) => Promise<boolean>;
            openFileData: (filePath: string) => Promise<any>;
            openNewURLWindow: (url: string, windowProperties: any) => void;
        };
    }
}
