import * as vscode from 'vscode';
import { GeminiProvider } from './gemini';

export class Config {
  static getApiKey(): string | undefined {
    return vscode.workspace.getConfiguration('textPromptGenerator').get('gemini.apiKey');
  }

  static async setApiKey(key: string): Promise<void> {
    await vscode.workspace.getConfiguration('textPromptGenerator').update('gemini.apiKey', key, vscode.ConfigurationTarget.Global);
  }
}

export class TextSelector {
  static getSelected(): string | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) return null;
    return editor.document.getText(editor.selection);
  }
}

export class PromptGenerator {
  static async generate(text: string, instruction?: string): Promise<string> {
    const apiKey = Config.getApiKey();
    if (!apiKey) throw new Error('API key no configurada');

    const provider = new GeminiProvider(apiKey);
    return await provider.generatePrompt(text, instruction);
  }

  static async show(prompt: string): Promise<void> {
    const doc = await vscode.workspace.openTextDocument({ language: 'plaintext', content: prompt });
    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
  }
}
