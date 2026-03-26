name: general_tools
description: Search the web, send emails, generate images or videos, use text to speech and speech to text,

name: general_tools
description: Search the web, send emails, generate images or videos, use text to speech and speech to text,
convert files to markdown, and look up library docs. Use when a task needs one of these general-purpose tools.
These tools are only available via Python scripts (from sdk.tools.<module> import <function>). They are
*not* in your native tool list, so actively remember they exist.
1. Web Search — quick_ai_search
Search the web for current information. Use whenever asked about real-time data (weather, news, prices, events),
factual lookups, or anything your training data might not cover.
from sdk.tools.utils_tools import quick_ai_search
result = await quick_ai_search("weather in Amsterdam this weekend")
print(result.search_response)  # Bullets/table with links
Input: search_question (str) — a natural language question
Output: search_response (str) — formatted answer with sources
When to use: Weather, current events, fact-checking, product comparisons, "what is X", looking up people/
companies, any question where your knowledge might be outdated
Don't forget: If you're about to say "I don't have access to live data" — stop and use this tool instead
2. Send Email — coworker_send_email
Send emails from Viktor's address (zeta-labs@staging.viktor-mail.com). Supports attachments, CC/BCC,
and reply threading.
from sdk.tools.email_tools import coworker_send_email
result = await coworker_send_email(
    to=["recipient@example.com"],
    subject="Monthly Report",
    body="Hi,\n\nPlease find the report attached.\n\nBest,\nViktor",
    cc=["manager@example.com"],         # optional
    bcc=["archive@example.com"],        # optional
    attachments=["/work/report.pdf"],   # optional, local file paths
    reply_to_email_id="abc123",         # optional, for threading
)
print(result.success, result.email_id)
Input: to (list[str]), subject (str), body (str, markdown format), optional cc, bcc, attachments, 
reply_to_email_id
Output: success (bool), email_id (str)
Sent copies: Saved to /work/emails/sent/
Incoming emails: Arrive in /work/emails/inbox/ as .md files
Attachments on received emails: Use coworker_get_attachment(internal_url=..., filename=...) —
do NOT download _internal_url directly
• 
• 
• 
• 
• 
• 
• 
• 
• 
15
3. Image Generation — coworker_text2im
Generate artistic illustrations or edit existing images. Not for charts/diagrams (use matplotlib/plotly for those).
from sdk.tools.utils_tools import coworker_text2im
# Generate new image
result = await coworker_text2im(
    prompt="A modern minimalist logo for a productivity app, blue and white",
    aspect_ratio="1:1",  # optional
)
print(result.local_path)   # Local file path
print(result.image_url)    # Public URL
# Edit existing image
result = await coworker_text2im(
    prompt="Make the background sunset orange",
    image_paths=["/work/input.png"],
)
Input: prompt (str), optional image_paths (list[str]) for editing, optional aspect_ratio ( 1:1, 16:9, 
9:16, 4:3, 3:2, 2:3, 3:4, 4:5, 5:4, 21:9)
Output: local_path (str), image_url (str), file_uri (str)
When to use: Social media graphics, mockups, illustrations, profile pictures, thumbnails, concept art
Not for: Data visualizations, charts, diagrams, screenshots — use code-based tools for those
4. Text to Speech — text_to_speech
Generate spoken audio with ElevenLabs.
from sdk.tools.utils_tools import text_to_speech
result = await text_to_speech(text="Welcome to the demo", voice="rachel")
print(result.local_path)
Input: text (str), optional model ( eleven_flash_v2_5, eleven_turbo_v2_5, 
eleven_multilingual_v2), optional voice ( rachel, domi, bella, antoni, elli, josh, arnold, 
adam, sam, bill), optional voice_id
Output: local_path (str)
5. Video Generation — text_to_video
Generate videos from text prompts, optionally guided by reference images.
• 
• 
• 
• 
• 
• 
16
from sdk.tools.utils_tools import text_to_video
# Text-to-video
result = await text_to_video(
    prompt="A cinematic drone shot of waves crashing on black volcanic rock",
)
print(result.local_path)
# Image-guided video
result = await text_to_video(
    prompt="Animate this product photo with a slow parallax move",
    model="sora-2-pro",
    image_paths=["/work/product.png"],
    aspect_ratio="16:9",
)
Input: prompt (str), optional model ( grok-imagine-video-480p, grok-imagine-video-720p, veo-3.1-
audio, veo-3.1-fast-audio, veo-3.1-audio-1080p, veo-3.1-fast-audio-1080p, sora-2-pro),
optional image_paths (list[str]), optional aspect_ratio ( 16:9, 9:16), optional duration_seconds,
optional resolution ( 720p or 1024p for sora-2-pro)
Output: local_path (str), latency_seconds (float)
Note: Default is veo-3.1-fast-audio. Grok is the cheaper option, especially for image-guided clips.
6. Speech to Text — speech_to_text
Transcribe audio with ElevenLabs.
from sdk.tools.utils_tools import speech_to_text
result = await speech_to_text(file_path="/work/audio.mp3")
print(result.text)
Input: file_path (str), optional model ( scribe_v2), optional language_code
Output: text (str), chunks (list)
7. File to Markdown — file_to_markdown
Convert documents to readable markdown. Essential for understanding uploaded files.
from sdk.tools.utils_tools import file_to_markdown
result = await file_to_markdown(file_path="/work/document.pdf")
print(result.content)  # Markdown text
Input: file_path (str) — absolute path
Supported formats: .pdf, .docx, .xlsx, .xls, .pptx, .ppt, .rtf, .odt, .ods, .odp
Output: content (str) — markdown text
When to use: Any time you receive a document file and need to read its contents. Always prefer this over trying
to parse files manually.
• 
• 
• 
• 
• 
• 
• 
• 
• 
17
8. Library Documentation — docs_tools
Look up current documentation for any library, framework, API, or tool. Two-step process: resolve the library ID
first, then query.
from sdk.tools.docs_tools import query_library_docs, resolve_library_id
# Step 1: Find the library
lib = await resolve_library_id(
    library_name="react",
    query="how to use useEffect cleanup"
)
print(lib.library_id)  # e.g. '/facebook/react'
# Step 2: Query its docs
docs = await query_library_docs(
    library_id=lib.library_id,
    query="useEffect cleanup functions"
)
print(docs.documentation)
Step 1resolve_library_id(library_name, query) → returns library_id, alternatives
Step 2query_library_docs(library_id, query) → returns documentation with code examples
Works for: Libraries (react, pandas), frameworks (next.js, django), APIs (stripe, twilio), databases (postgresql,
redis), CLIs (docker, git)
When to use: Before writing code that depends on a specific library's API. Ensures you use current, correct
APIs instead of relying on potentially outdated training data.
Skip step 1 if you already know the Context7 ID (e.g. /vercel/next.js, /stripe/stripe-node)
Quick Reference
Need Tool Module
Search the web quick_ai_search(question) utils_tools
Send an email coworker_send_email(to, subject, body) email_tools
Generate/edit image coworker_text2im(prompt) utils_tools
Generate video text_to_video(prompt) utils_tools
Generate speech text_to_speech(text, voice="rachel") utils_tools
Transcribe audio speech_to_text(file_path) utils_tools
Read a PDF/DOCX/XLSX file_to_markdown(file_path) utils_tools
Look up library docs resolve_library_id → query_library_docs docs_tools
All tools are async. Run scripts with uv run python script.py.
• 
• 
• 
• 
• 
18
