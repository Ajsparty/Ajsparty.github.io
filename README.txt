Personal Website Customization Guide

Use this checklist to fill in your real information.

1) Basic identity (index.html)
- <title>Your Name | Personal Site</title>
- Header logo text: YOUR NAME
- Hero intro text: I’m Your Name
- Footer text: © ... Your Name
- Meta description content in <head>

2) Resume link (script.js)
- Find: const resumeHref = "./resume.pdf";
- Option A: put your PDF at Personal_Website/resume.pdf
- Option B: replace with a full URL (Google Drive, Dropbox, etc.)

3) About section (index.html)
- Replace the "What I do" paragraph with your real 3-5 sentence bio
- Update the three bullet points under "What I do"
- Replace "Toolbox" pills with your actual tools/skills

4) Projects section (index.html)
- Replace Project One/Two/Three titles
- Replace years in each project chip
- Replace each project summary paragraph
- Replace tech tags (pills)
- Replace action links (Demo / Code / Case study / Writeup / Slides)
  Note: href="#" means placeholder. Add real links.

5) Writing section (index.html)
- Replace all post titles and descriptions
- Replace each href="#" with your real article or repo links

6) Contact info (index.html + script.js)
- In index.html contact card, replace:
  - you@example.com
  - GitHub link
  - LinkedIn link
  - X/Twitter link
- In script.js, update mail receiver:
  - const to = "you@example.com"; // CHANGE THIS

7) Optional polish
- Favicon color/shape is inline in index.html (<link rel="icon" ...>)
- Site subtitle and section headings can be rewritten to match your style

Quick start order (recommended)
1. Update name + email first
2. Update resumeHref
3. Replace project cards
4. Replace writing links
5. Final proofread in browser

Where to edit
- Main content: Personal_Website/index.html
- Behavior/links: Personal_Website/script.js
- Visual styling: Personal_Website/style.css