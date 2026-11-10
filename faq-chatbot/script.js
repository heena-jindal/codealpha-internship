/* ---------- NLP PREPROCESSING (tokenize, clean, stopword removal, light stemming) ---------- */
const STOPWORDS = new Set(["a","an","the","is","are","was","were","do","does","did","i","you","he","she",
  "it","we","they","my","your","his","her","its","our","their","to","of","in","on","for","with","and","or",
  "but","if","at","by","from","as","this","that","these","those","be","been","being","have","has","had",
  "can","could","will","would","should","what","how","when","where","which","who","whom","about","please",
  "me","tell","know"]);

// lightweight suffix-stripping stemmer (Porter-ish, simplified)
function stem(word){
  if (word.length <= 3) return word;
  return word
    .replace(/(ational|tional)$/,'ate')
    .replace(/(izer|izing|ization)$/,'ize')
    .replace(/(ing|edly|ed)$/,'')
    .replace(/(ies|ied)$/,'y')
    .replace(/(sses)$/,'ss')
    .replace(/([^s])s$/,'$1')
    .replace(/(ly)$/,'')
    .replace(/(ment|ness|ity|ance|ence)$/,'');
}

function tokenize(text){
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g," ")      // strip punctuation
    .split(/\s+/)
    .filter(Boolean)
    .filter(t => !STOPWORDS.has(t))   // remove stopwords
    .map(stem);                        // stem
}

/* ---------- TF-IDF + COSINE SIMILARITY ---------- */
function buildIndex(faqs){
  const docsTokens = faqs.map(f => tokenize(f.q));
  const vocab = [...new Set(docsTokens.flat())];
  const N = docsTokens.length;

  const idf = {};
  vocab.forEach(term => {
    const df = docsTokens.filter(toks => toks.includes(term)).length;
    idf[term] = Math.log((N + 1) / (df + 1)) + 1;
  });

  function termFreq(tokens){
    const tf = {};
    tokens.forEach(t => tf[t] = (tf[t] || 0) + 1);
    const len = tokens.length || 1;
    Object.keys(tf).forEach(k => tf[k] /= len);
    return tf;
  }
  function vectorize(tokens){
    const tf = termFreq(tokens);
    return vocab.map(term => (tf[term] || 0) * idf[term]);
  }

  const faqVectors = docsTokens.map(vectorize);
  return { vectorize, faqVectors };
}

function cosineSim(a, b){
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++){ dot += a[i]*b[i]; normA += a[i]*a[i]; normB += b[i]*b[i]; }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/* ---------- CHATBOT ---------- */
const THRESHOLD = 0.15; // similarity below this = "I don't know"

async function main(){
  const res = await fetch('faqs.json');
  const FAQS = await res.json();
  const { vectorize, faqVectors } = buildIndex(FAQS);

  function findBestMatch(userText){
    const vec = vectorize(tokenize(userText));
    let best = -1, bestScore = 0;
    faqVectors.forEach((fv, i) => {
      const score = cosineSim(vec, fv);
      if (score > bestScore){ bestScore = score; best = i; }
    });
    return { index: best, score: bestScore };
  }

  const messagesEl = document.getElementById('messages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('userInput');
  const suggestionsEl = document.getElementById('suggestions');

  function addMessage(text, sender){
    const div = document.createElement('div');
    div.className = 'msg ' + sender;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function addMeta(text){
    const div = document.createElement('div');
    div.className = 'msg meta';
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function respondTo(userText){
    const { index, score } = findBestMatch(userText);
    if (index === -1 || score < THRESHOLD){
      addMessage("I'm not sure I have an answer for that. Could you rephrase, or try one of the topics below?", 'bot');
    } else {
      addMessage(FAQS[index].a, 'bot');
      addMeta(`matched: "${FAQS[index].q}"  ·  similarity ${score.toFixed(2)}`);
    }
  }

  function renderSuggestions(){
    suggestionsEl.innerHTML = '';
    const picks = [0, 3, 6, 9, 12, 15].filter(i => i < FAQS.length);
    picks.forEach(i => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = FAQS[i].q;
      chip.addEventListener('click', () => {
        input.value = FAQS[i].q;
        form.requestSubmit();
      });
      suggestionsEl.appendChild(chip);
    });
  }
  renderSuggestions();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    setTimeout(() => respondTo(text), 200);
  });

  addMessage("Hi! I'm the TechGadget support bot. Ask me about shipping, returns, payments, warranty, or your account.", 'bot');
}

main();
