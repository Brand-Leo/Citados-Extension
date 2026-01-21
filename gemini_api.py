#!/usr/bin/env python3
import sys
import json
from google import genai

def generate_prompt(api_key, text, instruction=None):
    try:
        client = genai.Client(api_key=api_key)
        
        prompt = f'De este texto: "{text}". {instruction} Crea un prompt efectivo.' if instruction else f'De este texto: "{text}". Crea un prompt efectivo para usar con IA.'
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        return {"success": True, "text": response.text}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    api_key = sys.argv[1]
    text = sys.argv[2]
    instruction = sys.argv[3] if len(sys.argv) > 3 else None
    
    result = generate_prompt(api_key, text, instruction)
    print(json.dumps(result))
