<h1 align="center">CodeAlpha AI Internship</h1>
<p align="center">
Four AI projects built during my Artificial Intelligence internship at CodeAlpha:<br>
computer vision, NLP, and sequence modelling.
</p>
<p align="center">
<img src="https://img.shields.io/github/last-commit/heena-jindal/codealpha-internship?style=flat-square" alt="last commit" />
<img src="https://img.shields.io/github/languages/top/heena-jindal/codealpha-internship?style=flat-square" alt="top language" />
<img src="https://img.shields.io/github/license/heena-jindal/codealpha-internship?style=flat-square" alt="license" />
<img src="https://img.shields.io/github/repo-size/heena-jindal/codealpha-internship?style=flat-square" alt="repo size" />
</p>
Projects
<!-- TASKS:START -->
Task
What it does
Stack
Result
Object Detection & Tracking
Real-time detection (YOLOv4-tiny, 80 COCO classes) with SORT multi-object tracking and persistent IDs
Python, OpenCV (DNN), NumPy, SciPy
Runs on CPU from a webcam or video file and shows live FPS
Language Translator
Browser translator for 24 languages with swap, copy-to-clipboard and text-to-speech
HTML, CSS, JavaScript, MyMemory API
No install and no API key needed
FAQ Chatbot
Client-side chatbot that matches questions to FAQs using TF-IDF and cosine similarity
JavaScript, HTML, CSS
20 sample FAQs; replies "not sure" below a 0.15 similarity score
Music Generation
Stacked LSTM trained on Bach chorale MIDI files that generates new melodies
Python, TensorFlow/Keras, music21
End-to-end pipeline from MIDI data to a generated .mid file
<!-- TASKS:END -->
How the projects fit together
> Loading Mermaid code…
​
Area
Project
Core technique
Computer vision
Object Detection & Tracking
Pre-trained YOLOv4-tiny + Kalman-filter SORT tracker
NLP
FAQ Chatbot
TF-IDF vectors + cosine similarity
NLP / web APIs
Translator
REST API integration, Web Speech API
Deep learning
Music Generation
2-layer LSTM predicting the next note
Repository layout
> Loading Plain Text code…
​
Each folder has its own README with setup steps and a short explanation of how it works.
<details>
<summary><b>Run each project (quick commands)</b></summary>
Object Detection & Tracking
> Loading Bash code…
​
Translator (static site, no install)
> Loading Bash code…
​
FAQ Chatbot (static site, must be served over HTTP)
> Loading Bash code…
​
Music Generation
> Loading Bash code…
​
</details>
Skills demonstrated
Python · OpenCV · object tracking (Kalman filter, Hungarian algorithm) · TF-IDF and cosine similarity · TensorFlow/Keras LSTMs · MIDI processing with music21 · REST API integration · vanilla JavaScript front ends
License
MIT. See LICENSE.
