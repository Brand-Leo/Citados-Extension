"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptGenerator = exports.TextSelector = exports.Config = void 0;
const vscode = __importStar(require("vscode"));
const gemini_1 = require("./gemini");
class Config {
    static getApiKey() {
        return vscode.workspace.getConfiguration('textPromptGenerator').get('gemini.apiKey');
    }
    static async setApiKey(key) {
        await vscode.workspace.getConfiguration('textPromptGenerator').update('gemini.apiKey', key, vscode.ConfigurationTarget.Global);
    }
}
exports.Config = Config;
class TextSelector {
    static getSelected() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty)
            return null;
        return editor.document.getText(editor.selection);
    }
}
exports.TextSelector = TextSelector;
class PromptGenerator {
    static async generate(text, instruction) {
        const apiKey = Config.getApiKey();
        if (!apiKey)
            throw new Error('API key no configurada');
        const provider = new gemini_1.GeminiProvider(apiKey);
        return await provider.generatePrompt(text, instruction);
    }
    static async show(prompt) {
        const doc = await vscode.workspace.openTextDocument({ language: 'plaintext', content: prompt });
        await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
    }
}
exports.PromptGenerator = PromptGenerator;
//# sourceMappingURL=core.js.map