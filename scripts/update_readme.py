import json, re, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
tasks = json.loads((root / "tasks.json").read_text(encoding="utf-8"))

rows = ["| Task | What it does | Stack | Result |", "|---|---|---|---|"]
for t in tasks:
    rows.append(f"| [{t['title']}]({t['folder']}/) | {t['summary']} | {t['stack']} | {t['result']} |")
table = "\n".join(rows)

readme = root / "README.md"
text = readme.read_text(encoding="utf-8")
text = re.sub(
    r"<!-- TASKS:START -->.*?<!-- TASKS:END -->",
    lambda m: f"<!-- TASKS:START -->\n{table}\n<!-- TASKS:END -->",
    text, flags=re.S,
)
readme.write_text(text, encoding="utf-8")
