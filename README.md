# Text Prompt Generator

Extensión VS Code para generar prompts IA desde texto seleccionado.

## Setup

```bash
npm install
npm run compile
F5  # Debug en VS Code
```

## Uso

1. Selecciona texto
2. Click derecho → "Generate Prompt"
3. Elige proveedor (DeepSeek o Gemini)
4. ¡Listo!

## Configuración

`Ctrl+Shift+P` → "Configure API Key"

Ingresa tu API key de:
- [DeepSeek](https://www.deepseek.com/)
- [Google Gemini](https://ai.google.dev/)

## Comandos

- `text-prompt-generator.generatePrompt` - Generar prompt
- `text-prompt-generator.configureApiKey` - Configurar API

## Estructura

```
src/
├── commands/          Comandos
├── providers/         DeepSeek y Gemini
├── services/          Lógica
├── types/             Tipos
└── extension.ts       Main
```
