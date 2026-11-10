# 🌐 Language Translation Tool

A simple browser-based translation tool. Enter text, pick a source and target
language, and get an instant translation — with copy-to-clipboard and
text-to-speech built in.

## Features
- Text input with live character count
- Source & target language selection (24 languages) with a one-click swap button
- Translation via the free **[MyMemory Translation API](https://mymemory.translated.net/doc/spec.php)** (no API key required)
- Clear display of the translated text
- 📋 Copy button (clipboard)
- 🔊 Text-to-speech playback of the translation (browser's built-in Web Speech API)

## How to run
No build step or install needed — it's plain HTML/CSS/JS.

1. Clone this repo / download this folder.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
3. Type some text, choose your languages, and click **Translate**.

You can also serve it locally if you prefer:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Using a different translation API
This project uses MyMemory because it's free and requires no signup, which
keeps the project easy to run out of the box. To swap in **Google Cloud
Translation API** or **Microsoft Translator** instead:

1. Get an API key from [Google Cloud](https://cloud.google.com/translate) or
   [Microsoft Azure Cognitive Services](https://azure.microsoft.com/en-us/products/ai-services/ai-translator).
2. In `script.js`, replace the `fetch(url)` call inside `translate()` with a
   request to your chosen provider's endpoint, passing your API key in the
   headers as required by that provider's docs.
3. Update the response parsing to match that API's JSON shape.

⚠️ Never commit a real API key to a public GitHub repo — use an environment
variable / backend proxy for production use.

## File structure
```
task1-language-translator/
├── index.html   # UI markup
├── script.js    # Language list, API call, copy & speech logic
└── README.md
```

## License
MIT — free to use and modify.
