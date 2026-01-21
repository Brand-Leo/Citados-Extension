import * as vscode from 'vscode';
import { Config, TextSelector, PromptGenerator } from './core';

export function activate(context: vscode.ExtensionContext) {
  // Comando: Generar Prompt
  const generateCmd = vscode.commands.registerCommand('text-prompt-generator.generate', async () => {
    const text = TextSelector.getSelected();
    if (!text) {
      vscode.window.showWarningMessage('Selecciona texto primero');
      return;
    }

    const instruction = await vscode.window.showInputBox({ prompt: 'Instrucciones adicionales (opcional)' });

    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'Generando prompt...' },
      async () => {
        try {
          const prompt = await PromptGenerator.generate(text, instruction);
          await PromptGenerator.show(prompt);
          vscode.window.showInformationMessage('✅ Prompt generado');
        } catch (error) {
          vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
        }
      }
    );
  });

  // Comando: Configurar API Key
  const configCmd = vscode.commands.registerCommand('text-prompt-generator.config', async () => {
    const key = await vscode.window.showInputBox({ prompt: 'Google Gemini API Key:', password: true });
    if (key) {
      await Config.setApiKey(key);
      vscode.window.showInformationMessage('✅ API Key configurada');
    }
  });

  context.subscriptions.push(generateCmd, configCmd);
}

export function deactivate() {}
