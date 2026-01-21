import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

export class GeminiProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePrompt(text: string, instruction?: string): Promise<string> {
    try {
      const scriptPath = path.join(__dirname, '..', 'gemini_api.py');
      const args = [this.apiKey, text, instruction || ''].map(arg => `"${arg.replace(/"/g, '\\"')}"`).join(' ');
      
      const { stdout, stderr } = await execAsync(`python "${scriptPath}" ${args}`);
      
      if (stderr) {
        console.error('Python stderr:', stderr);
        throw new Error(stderr);
      }
      
      const result = JSON.parse(stdout.trim());
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.text || 'No se generó respuesta';
    } catch (error: any) {
      console.error('Gemini Error:', error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
}
