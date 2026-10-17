# Campus Life Planner

A responsive campus task planner for organizing study blocks, deadlines, and student-life activities. Built with semantic HTML, CSS, and vanilla JavaScript ES modules; no framework or build step is required.

## Live Site

GitHub Pages: <https://tharcisse-irasubiza.github.io/Campus-Life-Planner/>

The deployment workflow publishes the repository root when code is pushed to `main`. To enable the first deployment, open **Repository Settings > Pages** and select **GitHub Actions** as the build and deployment source. The URL becomes available after that workflow completes.

## Features

- Dashboard totals for task count, planned time, most-used tag, a seven-day trend, and a weekly study target.
- Create and edit tasks in a responsive dialog; delete tasks from the records table.
- Validate task titles, durations, categories, and due dates with regular expressions.
- Search records with user-entered regular expressions, case options, safe handling of invalid patterns, and match highlighting.
- Sort records by due date, title, or duration.
- Persist records in `localStorage`; import and export JSON backups with structure validation.
- Convert minutes to hours and fractions.
- Responsive layouts, semantic landmarks, keyboard focus styles, skip navigation, and live status announcements.

## Rubric Coverage

| Area | Implementation |
| --- | --- |
| HTML structure and accessibility | Semantic landmarks, labeled controls, dialog semantics, skip link, focus visibility, and live regions |
| Responsive interface | Mobile-first layout with responsive navigation, dashboard, table, and task dialog |
| JavaScript architecture | ES modules split across app, state, storage, UI, search, and validation responsibilities |
| Validation and regular expressions | Field rules, duplicate-word detection, safe regex search, and highlighting |
| Data management | Add/edit/delete, sorting, weekly target, local storage, and validated JSON import/export |
| Verification | Browser-based assertions in `tests.html` |
| Deployment | GitHub Actions workflow deploys the static site to GitHub Pages from `main` |

## Validation Rules

| Field | Rule | Purpose |
| --- | --- | --- |
| Title | `/^\S(?:.*\S)?$/` | Rejects leading and trailing whitespace |
| Duration | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` | Accepts non-negative integer or decimal minutes |
| Due date | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | Checks the `YYYY-MM-DD` format and month/day ranges |
| Tag | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Accepts words separated by spaces or hyphens |
| Repeated words | `/\b(\w+)\s+\1\b/i` | Detects repeated consecutive words, such as `Study study notes` |

## Run Locally

Serve the project directory with any static HTTP server. For example:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000/>. The ES modules should be served over HTTP rather than opened directly as a `file://` URL. Open `/tests.html` to run the validation assertions.

## Keyboard and Accessibility

- Use Tab and Shift+Tab to move through links, buttons, fields, and table actions.
- Open the task dialog from **Add task**; Escape or the close and cancel buttons dismiss it.
- Submit a valid task with the **Save task** button.
- The skip link is the first focusable control and moves focus to the main content.
- Form feedback and dashboard status are announced through live regions.

## Demo

A demo video [This is DEMO LINK](https://drive.google.com/file/d/1I_zBy4QFX9bucHKpFVEx7RlFT6rn1LDu/view?usp=sharing)

## Contact

- Developer: [Tharcisse Irasubiza](https://github.com/Tharcisse-Irasubiza)
- Email: [t.irasubiza@alustudent.com](mailto:t.irasubiza@alustudent.com)
- Repository: <https://github.com/Tharcisse-Irasubiza/Campus-Life-Planner>
