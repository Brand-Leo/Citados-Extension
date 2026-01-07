import * as vscode from 'vscode';
import { SemanticScholar } from 'semanticscholarjs';
import { error } from 'console';

export function showSearchPanel(ctx: vscode.ExtensionContext, query: string)
{
  const panel = vscode.window.createWebviewPanel('semanticSearch', 'Semantic Scholar', vscode.ViewColumn.Beside, { enableScripts: true } );
if ( query ) { doSearch(panel,query); }
}

async function doSearch(panel: vscode.WebviewPanel, query: string)
{
try
{
const sch = new SemanticScholar();
const results = await sch.search_paper(query);
const firstPage = await results.nextPage();
const top4 = firstPage.slice(0,4);
panel.webview.postMessage({command: 'showResults', payload: top4});
}
catch(err)
{
panel.webview.postMessage({command: error, payload: String(err)});
}
}

function getHtml(webview: vscode.Webview, ctx: vscode.ExtensionContext, query: string): string 
{    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: var(--vscode-font-family); padding: 12px; }
        input { width: 100%; padding: 6px; margin-bottom: 12px; }
        .paper { border: 1px solid var(--vscode-panel-border); padding: 8px; margin-bottom: 8px; }
        .title { font-weight: bold; }
        .authors, .year { font-size: 0.9em; color: var(--vscode-descriptionForeground); }
      </style>
    </head>
    <body>
      <input id="q" value="${query}" />
      <div id="res">Buscando…</div>
  
      <script>
        const vscode = acquireVsCodeApi();
  
        window.addEventListener('message', event => {
          const { command, payload } = event.data;
          const box = document.getElementById('res');
  
          if (command === 'showResults') {
            box.innerHTML = payload.map(p => \`
              <div class="paper">
                <div class="title">\${p.title}</div>
                <div class="authors">\${(p.authors||[]).map(a=>a.name).join(', ')}</div>
                <div class="year">\${p.year||''}  —  Citas: \${p.citationCount||0}</div>
              </div>\`).join('');
          }
          if (command === 'error') {
            box.innerText = 'Error: ' + payload;
          }
        });
      </script>
    </body>
    </html>`;
}
