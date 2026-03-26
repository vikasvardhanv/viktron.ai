name: skill_creation
description: Create reusable skills with proper structure and frontmatter. Use when creating or editing a skill or

name: skill_creation
description: Create reusable skills with proper structure and frontmatter. Use when creating or editing a skill or
workflow.
When you develop a reusable workflow, save it as a skill within the relevant domain/topic folder.
For how persistence and regeneration behave in /work/skills, read references/skill-management.md.
Skill Directory Structure
{domain}/{skill_name}/
├── SKILL.md     # Required: What it does, when/how to use, best practices
├── scripts/     # Optional: Utility scripts for the skill
├── references/  # Optional: Additional documentation (loaded on demand)
└── assets/      # Optional: Templates, images, data files
SKILL.md Format
Every SKILL.md file must contain YAML frontmatter followed by Markdown content:
---
name: skill_name
description: [What it does]. Use when [trigger conditions].
---
Instructions and best practices go here...
Frontmatter Fields
Field Required Description
name Yes Lowercase letters, numbers, and underscores only. Must match the folder name.
description Yes What the skill does + when the agent should use it.
Name Field Rules
Only lowercase alphanumeric characters and underscores (a-z, 0-9, _)
Must not start or end with _
Must not contain consecutive underscores (__)
Must match the parent directory name exactly
Examples:
✓ pdf_creation → pdf_creation/
✓ excel_editing → excel_editing/
✗ PDF_Creation (uppercase not allowed)
✗ _pdf (cannot start with underscore)
• 
• 
• 
• 
• 
• 
• 
• 
31
Description Field Guidelines
The description must include what the skill does and when to use it. Keep it under 1024 characters.
Structure: [What it does]. Use when [trigger phrases].
Good examples:
description: Creates PDF documents from HTML/CSS. Use when creating PDFs, reports, or formatted 
documents.
description: Validates and modifies Excel files. Use when editing or modifying Excel (.xlsx) 
files.
description: Adds digital signatures to PDFs. Use when signing PDFs or adding signatures to 
documents.
Poor examples:
# Too vague, no trigger phrases
description: Helps with PDFs.
# Missing what it does, too implementation-focused
description: Create professional PDF documents from HTML/CSS using WeasyPrint.
# Too broad, will over-trigger
description: Processes documents.
To prevent over-triggering, add negative triggers when the skill could be confused with similar skills:
description: Validates and modifies Excel files. Use when editing .xlsx files. Do NOT use for 
CSV exports (use data_export skill instead).
Body Content
After the frontmatter, structure the body as:
Instructions - step-by-step workflow, ordered by execution sequence
Examples - concrete scenarios showing input, actions, and expected result
Edge cases - common pitfalls and how to handle them
Troubleshooting (optional) - only include for skills that interact with external tools or APIs where errors are
observed by any viktor instance. Use the format: Error > Cause > Solution.
Keep SKILL.md under 500 lines. Move detailed reference material to references/ and link to it explicitly from
the body so the agent knows when to load it:
Before generating the document, consult `references/style-guide.md` for brand colors and 
typography.
Bundling Scripts
When a workflow step requires deterministic validation or data extraction, bundle a script in scripts/ instead of
relying on natural language instructions. Code is deterministic; language interpretation isn't.
Good candidates for scripts:
Validation - checking file structure, formulas, required fields
Data extraction - parsing styles from websites, extracting metadata from files
• 
• 
• 
• 
• 
• 
32
Transformation - format conversion, data normalization
How to bundle a script:
Place the script in {skill_name}/scripts/
Reference it from SKILL.md with the exact invocation command
Document what the script does, its flags, and expected output
Example from excel_editing:
After creating/modifying Excel files with formulas, validate them:
\`\`\`bash
uv run python skills/excel_editing/scripts/validate_excel.py output.xlsx
uv run python skills/excel_editing/scripts/validate_excel.py output.xlsx --recalc
\`\`\`
The script should never modify the original file. Keep scripts focused on a single responsibility.
Example Skill
---
name: data_export
description: Exports structured data to common file formats. Use when exporting data to CSV, 
Excel, or JSON.
---
## Instructions
### Step 1: Determine output format
Ask the user which format they need. Default to CSV for tabular data.
### Step 2: Export
Use pandas for CSV exports:
\`\`\`python
import pandas as pd
df.to_csv('output.csv', index=False)
\`\`\`
For Excel with formatting, use openpyxl...
## Examples
User says: "Export the campaign data as a spreadsheet"
Actions:
1. Load campaign data into a DataFrame
2. Export as .xlsx with column headers
Result: Excel file with formatted campaign data
Where to Create Skills
Domain-specific skills: Create in the domain folder (e.g., paid_ads/campaign_analysis/)
General-purpose skills: Create in skills/ (e.g., skills/pdf_creation/)
• 
• 
• 
• 
• 
• 
33
