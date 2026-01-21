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
exports.GeminiProvider = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path = __importStar(require("path"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class GeminiProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async generatePrompt(text, instruction) {
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
        }
        catch (error) {
            console.error('Gemini Error:', error.message);
            throw new Error(`Error: ${error.message}`);
        }
    }
}
exports.GeminiProvider = GeminiProvider;
//# sourceMappingURL=gemini.js.map