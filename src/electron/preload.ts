import { initPreloadElectronAPIMethods } from "../core/scripts/preloadExpose";
import { contextBridge, ipcRenderer } from "electron";

initPreloadElectronAPIMethods();

//your methods here
contextBridge.exposeInMainWorld("application", {
    /**
     * Show a save file dialog to the user.
     * This method will send a message to the main process to show a save file dialog.
     * The main process will then show a save file dialog to the user based on the provided options.
     * @param {object} options The options to pass to the save file dialog.
     * @returns {Promise<SaveDialogReturnValue>} A promise that resolves with the result of the save file dialog.
     */
    showSaveFileDialog(options: object) {
        return ipcRenderer.invoke("show-save-file-dialog", options);
    },

    /**
     * Save the provided data to the provided file path.
     * This method will send a message to the main process to save the provided data to the provided file path.
     * The main process will then save the provided data to the provided file path.
     * @param {string} filePath The file path to save the data to.
     * @param {string} data The data to save.
     * @returns {Promise<boolean>} A promise that resolves with true if the data was saved successfully, false otherwise.
     */
    saveFileData(filePath: string, data: string) {
        return ipcRenderer.invoke("save-file-data", filePath, data);
    },

    /**
     * Show an open file dialog to the user.
     * This method will send a message to the main process to show an open file dialog.
     * The main process will then show an open file dialog to the user based on the provided options.
     * @param {object} options The options to pass to the open file dialog.
     * @returns {Promise<OpenDialogReturnValue>} A promise that resolves with the result of the open file dialog.
     */
    showOpenFileDialog(options: object) {
        return ipcRenderer.invoke("show-open-file-dialog", options);
    },

    /**
     * Opens the provided file path and reads its contents.
     * This method will send a message to the main process to open the provided file path and read its contents.
     * The main process will then open the provided file path, read its contents and return the result to the renderer process.
     * @param {string} filePath The file path to open and read.
     * @returns {Promise<string>} A promise that resolves with the contents of the file.
     */
    openFileData(filePath: string) {
        return ipcRenderer.invoke("open-file-data", filePath);
    },

    openNewURLWindow(url: string, windowProperties: any) {
        ipcRenderer.send("open-new-url-window", url, windowProperties);
    },
});
