# 🤖 FAQ Chatbot (NLP + Cosine Similarity)

A simple client-side chatbot that answers questions about a product/topic by
matching the user's message against a bank of FAQs using classic NLP
techniques — no server, no external API, no ML library required.

## How it works
1. **FAQ collection** — questions & answers live in [`faqs.json`](./faqs.json),
   pre-loaded with 20 sample FAQs for a fictional "TechGadget" store
   (shipping, returns, payments, warranty, account, etc.). Edit this file to
   use your own topic/product.
2. **Preprocessing** (`script.js`) — every question (and the user's message)
   is: lowercased, stripped of punctuation, tokenized, cleared of stopwords,
   and lightly stemmed. This mirrors what you'd do with NLTK/spaCy in Python
   (`word_tokenize`, stopword removal, `PorterStemmer`) — implemented here in
   plain JavaScript so the whole project runs in the browser with zero
   dependencies.
3. **Matching** — each FAQ question is turned into a **TF-IDF vector**; the
   user's message is vectorized the same way, and **cosine similarity** is
   computed against every FAQ. The highest-scoring match above a confidence
   threshold (0.15) is returned as the answer; below that, the bot admits it
   doesn't know.
4. **Chat UI** (`index.html` + `style.css`) — a simple message-bubble chat
   window with quick-suggestion chips and a text input.

## How to run
Because the page loads `faqs.json` via `fetch()`, it needs to be served over
HTTP (opening `index.html` directly as a `file://` URL will block the fetch
in most browsers). Serve it locally:

```bash
cd task2-faq-chatbot
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or use any static server (VS Code "Live Server" extension, `npx serve`, etc.),
or deploy the folder to **GitHub Pages**.

## Using a Python NLP stack instead
This implementation is JavaScript so it runs entirely client-side with no
backend. If you'd rather use **NLTK** or **spaCy** as the task suggests, the
equivalent Python pipeline would be:

```python
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('punkt'); nltk.download('stopwords')
stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def preprocess(text):
    tokens = nltk.word_tokenize(text.lower())
    return " ".join(stemmer.stem(t) for t in tokens if t.isalnum() and t not in stop_words)

questions = [preprocess(f["q"]) for f in faqs]
vectorizer = TfidfVectorizer().fit(questions)
faq_vectors = vectorizer.transform(questions)

def get_answer(user_input, threshold=0.15):
    user_vec = vectorizer.transform([preprocess(user_input)])
    scores = cosine_similarity(user_vec, faq_vectors)[0]
    best = scores.argmax()
    return faqs[best]["a"] if scores[best] >= threshold else "I'm not sure, could you rephrase?"
```
You could wrap this in a small Flask/FastAPI backend and have `script.js`
call it via `fetch('/api/ask', ...)` instead of computing TF-IDF in the
browser, if you need a Python-based pipeline for grading/demo purposes.

## File structure
```
task2-faq-chatbot/
├── index.html   # Chat UI markup
├── style.css    # Styling
├── script.js    # Preprocessing, TF-IDF, cosine similarity, chat logic
├── faqs.json    # Editable FAQ knowledge base
└── README.md
```

## License
MIT — free to use and modify.
