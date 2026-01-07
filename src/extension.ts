import * as fs from 'fs';
import * as vscode from 'vscode';
import { showSearchPanel } from './display';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "citados-project" is now active!');
	vscode.window.showInformationMessage('Extension "lazy-bib" is now active!');

    const disp2 = vscode.commands.registerCommand('semanticsearch',async() => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return;}

// selected es el texto seleccionado
    const selected = editor.document.getText(editor.selection);
    if(!selected.trim()) { 
        vscode.window.showWarningMessage('Select some text first');
        return;
    }
    showSearchPanel(context,selected);
        });

	const disp = vscode.commands.registerCommand('citados-project.extraer_texto', () => {
	let editor = vscode.window.activeTextEditor;

if (!editor) {return;}
	
	let selection = editor.selection;
	// text es el texto seleccionado
	let text = editor.document.getText(selection);
	vscode.window.showInformationMessage('Texto seleccionado: ' + text);	
	
	let id : string = "";
	//pensaba en generar un string aleatorio como id
    id = Math.random().toString(36).substring(2, 10); // genera un id aleatorio de 8 caracteres
    //pensaba en separar cada dupla de id, string en objetos en el json por diferentes documentos a analizar

	appendRef(id,text);
	saveRefToWorkspaceJSON(id,text);
	});

    context.subscriptions.push(disp);
    context.subscriptions.push(disp2);
}

/**
 * Añade al final del documento activo una referencia en formato:
 *   ([id] string)
 * Si no hay editor abierto no hace nada.
 */
export async function appendRef(id: string, text: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const doc = editor.document;
    const lastLine = doc.lineAt(doc.lineCount - 1);
    const insertPos = new vscode.Position(lastLine.lineNumber, lastLine.text.length);

    // Si el archivo no termina en \n añadimos uno antes
    const needsNL = lastLine.text.length > 0;
    const ref = `${needsNL ? '\n' : ''}([${id}] ${text})\n`;

    await editor.edit((edit) => edit.insert(insertPos, ref));
}

export async function saveRefToWorkspaceJSON(id: string, text: string): Promise<void> {
    const wf = vscode.workspace.workspaceFolders?.[0];
    if (!wf) { return; } // no hay carpeta abierta

    const jsonPath = vscode.Uri.joinPath(wf.uri, 'refs.json').fsPath;
    let data: Record<string, string> = {};
    
    if (fs.existsSync(jsonPath)) {
        try 
        {
            data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        }
         catch { /* si el json está roto empezamos de cero */ }
    }

    data[id] = text;                           // upsert
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
}
// This method is called when your extension is deactivated
export function deactivate() {}


