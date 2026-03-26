from pathlib import Path
import re
import shutil

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
EXTERNAL = Path("/Users/vikashvardhan/IdeaProjects/viktron-backend/skills")
DEST = ROOT / "server" / "skills" / "viktor"


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9_]+", "_", value.lower()).strip("_")


def extract_pdf_text(path: Path) -> str:
    reader = PdfReader(str(path))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def write_skill(dir_name: str, name: str, description: str, body: str) -> None:
    target_dir = DEST / dir_name
    target_dir.mkdir(parents=True, exist_ok=True)
    content = f"name: {name}\ndescription: {description}\n\n{body.strip()}\n"
    (target_dir / "SKILL.md").write_text(content, encoding="utf-8")


def import_all_skill_files() -> None:
    text = extract_pdf_text(EXTERNAL / "all_skill_files.pdf")
    pattern = re.compile(r"\n(\d{2}) / 20 ([^\n]+)\n")
    matches = list(pattern.finditer(text))

    for i, match in enumerate(matches):
      start = match.end()
      end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
      section = text[start:end].strip()
      path_label = match.group(2).strip()
      key = slugify(path_label.replace("/SKILL.md", "").split("/")[-1])
      title_match = re.search(r"^name:\s*(.+)$", section, re.MULTILINE)
      desc_match = re.search(r"^description:\s*(.+)$", section, re.MULTILINE)
      name = title_match.group(1).strip() if title_match else key
      description = desc_match.group(1).strip() if desc_match else f"Imported from Viktor skill file: {path_label}"
      write_skill(key, name, description, section)


def import_reference_pdf(filename: str, skill_key: str, skill_name: str, description: str) -> None:
    text = extract_pdf_text(EXTERNAL / filename)
    body = f"Reference imported from {filename}\n\n{text.strip()}"
    write_skill(skill_key, skill_name, description, body)


def copy_human_thinking() -> None:
    source = EXTERNAL / "human-thinking" / "SKILL.md"
    target_dir = DEST / "human_thinking_source"
    target_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target_dir / "SKILL.md")


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    import_all_skill_files()
    import_reference_pdf(
        "viktor_skills_capabilities.pdf",
        "viktor_capabilities_reference",
        "viktor_capabilities_reference",
        "Technical reference for Viktor skills, capabilities, tools, and integration points.",
    )
    import_reference_pdf(
        "viktor_use_cases.pdf",
        "viktor_use_cases_reference",
        "viktor_use_cases_reference",
        "Use case reference for research, automation, web apps, documents, engineering, and workflow orchestration.",
    )
    copy_human_thinking()
    print(f"Imported skills into {DEST}")


if __name__ == "__main__":
    main()
