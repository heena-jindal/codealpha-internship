// ---- Language list (ISO 639-1 codes supported by the MyMemory API) ----
const LANGS = [
  ["en","English"],["es","Spanish"],["fr","French"],["de","German"],["it","Italian"],
  ["pt","Portuguese"],["hi","Hindi"],["zh","Chinese (Simplified)"],["ja","Japanese"],
  ["ko","Korean"],["ar","Arabic"],["ru","Russian"],["bn","Bengali"],["ur","Urdu"],
  ["ta","Tamil"],["te","Telugu"],["mr","Marathi"],["gu","Gujarati"],["nl","Dutch"],
  ["tr","Turkish"],["vi","Vietnamese"],["th","Thai"],["pl","Polish"],["sv","Swedish"]
];
const speechLocale = {
  en:"en-US",es:"es-ES",fr:"fr-FR",de:"de-DE",it:"it-IT",pt:"pt-PT",hi:"hi-IN",
  zh:"zh-CN",ja:"ja-JP",ko:"ko-KR",ar:"ar-SA",ru:"ru-RU",bn:"bn-BD",ur:"ur-PK",
  ta:"ta-IN",te:"te-IN",mr:"mr-IN",gu:"gu-IN",nl:"nl-NL",tr:"tr-TR",vi:"vi-VN",
  th:"th-TH",pl:"pl-PL",sv:"sv-SE"
};

const sourceSel = document.getElementById('sourceLang');
const targetSel = document.getElementById('targetLang');
const inputText = document.getElementById('inputText');
const charCount = document.getElementById('charCount');
const translateBtn = document.getElementById('translateBtn');
const output = document.getElementById('output');
const statusEl = document.getElementById('status');
const copyBtn = document.getElementById('copyBtn');
const speakBtn = document.getElementById('speakBtn');
const swapBtn = document.getElementById('swapBtn');

function fillSelect(sel){
  LANGS.forEach(([code, name]) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = name;
    sel.appendChild(opt);
  });
}
fillSelect(sourceSel);
fillSelect(targetSel);
sourceSel.value = "en";
targetSel.value = "es";

let lastTranslation = "";

inputText.addEventListener('input', () => {
  charCount.textContent = inputText.value.length;
});

swapBtn.addEventListener('click', () => {
  const s = sourceSel.value, t = targetSel.value;
  sourceSel.value = t;
  targetSel.value = s;
});

function setStatus(msg, type){
  statusEl.textContent = msg || "";
  statusEl.className = "status" + (type ? " " + type : "");
}

async function translate(){
  const text = inputText.value.trim();
  if (!text) { setStatus("Please enter some text.", "error"); return; }
  if (sourceSel.value === targetSel.value) {
    output.textContent = text;
    lastTranslation = text;
    setStatus("Source and target languages are the same.", "ok");
    return;
  }

  translateBtn.disabled = true;
  translateBtn.textContent = "Translating...";
  output.innerHTML = '<span class="placeholder">Translating...</span>';
  setStatus("");

  const langpair = `${sourceSel.value}|${targetSel.value}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error: " + res.status);
    const data = await res.json();

    if (data.responseStatus && data.responseStatus !== 200) {
      throw new Error(data.responseDetails || "Translation failed");
    }

    lastTranslation = data.responseData.translatedText;
    output.textContent = lastTranslation;
    setStatus("Translated successfully.", "ok");
  } catch (err) {
    console.error(err);
    output.innerHTML = '<span class="placeholder">Translation failed.</span>';
    setStatus("Something went wrong: " + err.message, "error");
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = "Translate";
  }
}

translateBtn.addEventListener('click', translate);
inputText.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') translate();
});

copyBtn.addEventListener('click', async () => {
  if (!lastTranslation) { setStatus("Nothing to copy yet.", "error"); return; }
  try {
    await navigator.clipboard.writeText(lastTranslation);
    setStatus("Copied to clipboard!", "ok");
  } catch (e) {
    setStatus("Could not copy automatically — please select and copy manually.", "error");
  }
});

speakBtn.addEventListener('click', () => {
  if (!lastTranslation) { setStatus("Nothing to read yet.", "error"); return; }
  if (!('speechSynthesis' in window)) { setStatus("Text-to-speech not supported in this browser.", "error"); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(lastTranslation);
  utter.lang = speechLocale[targetSel.value] || "en-US";
  window.speechSynthesis.speak(utter);
});
