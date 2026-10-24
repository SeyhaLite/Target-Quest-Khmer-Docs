# ============================================================================
# contribute.py — MkDocs hook (on_page_content)
#
# គោលបំណង៖ បន្ថែម "របារសកម្មភាព" (action bar) បែប GitHub នៅចុងទំព័រនីមួយៗ
# ដើម្បីឱ្យអ្នកអានអាច —
#   ១. កែទំព័រនេះភ្លាមៗលើ GitHub (បើក editor → GitHub ស្នើ fork + Pull Request ឱ្យស្វ័យប្រវត្តិ)
#   ២. មើលប្រភព Markdown ដើម
#   ៣. រាយការណ៍បញ្ហា (issue) ដោយភ្ជាប់ឈ្មោះទំព័រ + URL ជាមុន
#   ៤. ស្នើឯកសារថ្មី (បង្កើតឯកសារថ្មីលើ GitHub ដោយផ្ទាល់)
#
# ហេតុអ្វី hook ជំនួស template override?
#   - hook មិនចម្លង template របស់ Material → មិនខូចពេល upgrade theme
#   - ដំណើរការដូចគ្នាទាំង `mkdocs serve` និង Read the Docs
#   - បិទបានតាមទំព័រដោយ front matter: `hide: [contribute]`
#
# ឯកសារយោង៖
#   - Hooks: https://www.mkdocs.org/dev-guide/plugins/#hooks
#   - GitHub issue form prefill: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository
# ============================================================================

from urllib.parse import quote, urlencode

from markupsafe import escape

# --- អថេរលំនាំដើម (override បានក្នុង mkdocs.yml → extra.github) --------------
DEFAULTS = {
    # ប្រើ repo_url + edit_uri ពី mkdocs.yml ដោយស្វ័យប្រវត្តិ
    "branch": "main",
    "docs_dir": "docs",
    # ទំព័រដែលអ្នកអានត្រូវយល់ព្រមមុន submit issue (GitHub issue forms)
    "issue_template": "docs-issue.yml",
    "issue_label": "documentation",
    # បិទរបារនេះទាំងស្រុង (global) បើ true
    "enabled": True,
}

# --- អត្ថបទ UI ជាភាសាខ្មែរ (+ អង់គ្លេសសម្រាប់ tooltip/aria) -----------------
# Material theme មិនទាន់មាន UI ភាសាខ្មែរ ដូច្នេះយើងកំណត់ខ្លួនឯងនៅទីនេះ។
TEXT = {
    "title": "ចូលរួមកែលម្អឯកសារនេះ",
    "title_en": "Help improve this page",
    "edit": "កែទំព័រនេះ",
    "edit_hint": "បើក editor លើ GitHub — អ្នកមិនត្រូវការ fork ឬ clone ទេ",
    "view": "មើលប្រភព",
    "view_hint": "មើលឯកសារ Markdown ដើមលើ GitHub",
    "issue": "រាយការណ៍បញ្ហា",
    "issue_hint": "បើក issue អំពីទំព័រនេះ (ខុស/មិនច្បាស់/link ខូច)",
    "new": "ស្នើឯកសារថ្មី",
    "new_hint": "បង្កើតឯកសារ Markdown ថ្មីក្នុង folder នេះលើ GitHub",
    "history": "មើលប្រវត្តិ commit",
    "history_hint": "ប្រវត្តិនៃការកែប្រែឯកសារនេះ",
    "footer": (
        "ចុច <strong>កែទំព័រនេះ</strong> ហើយ GitHub នឹងណែនាំអ្នកឱ្យ fork repository "
        "និងបើក Pull Request ដោយស្វ័យប្រវត្តិ។ មិនចាំបាច់ដំឡើងអ្វីក្នុងម៉ាស៊ីនទេ។"
    ),
    "guideline": "សូមអានគោលការណ៍សរសេរឯកសារខ្មែរក្នុង",
    "guideline_link": "CONTRIBUTING.md",
}

# --- រូបតំណាង SVG (Octicons — រចនាប័ទ្ម GitHub ផ្លូវការ 16px) ---------------
# ដាក់ inline ព្រោះ hook មិនអាច include partial របស់ Material បាន។
ICONS = {
    "github": (
        '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" '
        'fill="currentColor"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17'
        '-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59'
        '-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 '
        '.27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 '
        '3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27'
        '.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 '
        '7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>'
    ),
    "edit": (
        '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" '
        'fill="currentColor"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 '
        '2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235'
        '-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 '
        '1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263'
        '-1.263a.25.25 0 0 0 0-.354Z"></path></svg>'
    ),
    "view": (
        '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" '
        'fill="currentColor"><path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 '
        '3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 '
        '0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 '
        '2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 '
        '2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 '
        '2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 '
        '0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 '
        '10Z"></path></svg>'
    ),
    "issue": (
        '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" '
        'fill="currentColor"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 '
        '8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>'
    ),
    "new": (
        '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" '
        'fill="currentColor"><path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 '
        '0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path></svg>'
    ),
    "history": (
        '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" '
        'fill="currentColor"><path d="m.427 1.927 1.215 1.215a8.002 8.002 0 1 1-1.6 5.685.75.75 0 1 1 '
        '1.493-.154 6.5 6.5 0 1 0 1.18-4.458l1.358 1.358A.25.25 0 0 1 3.896 6H.25A.25.25 0 0 1 0 5.75V2.104a.25.25 '
        '0 0 1 .427-.177ZM7.75 4a.75.75 0 0 1 .75.75v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 '
        '0 0 1 7 8.25v-3.5A.75.75 0 0 1 7.75 4Z"></path></svg>'
    ),
}

NEW_PAGE_BODY = """# ចំណងជើងឯកសារថ្មី

សរសេរជាភាសាខ្មែរធម្មជាតិ — កុំបកប្រែពាក្យមួយម្តងៗពីអង់គ្លេស។

!!! info "សំខាន់"
    ប្តូរឈ្មោះឯកសារខាងលើទៅជាអក្សរអង់គ្លេសតូច ដាក់សញ្ញា `-` ជំនួសដកឃ្លា
    (ឧ. `new-lesson.md`) ហើយបន្ថែមទំព័រនេះទៅ `nav` ក្នុង `mkdocs.yml`។
"""


def _settings(config):
    """បញ្ចូលការកំណត់ពី mkdocs.yml → extra.github (មាន fallback លំនាំដើម)។"""
    extra = (config.get("extra") or {}).get("github") or {}
    settings = dict(DEFAULTS)
    settings.update({k: v for k, v in extra.items() if v is not None})
    return settings


def _repo_base(config):
    """repo_url គ្មាន `/` នៅចុង (ឧ. https://github.com/user/repo)។"""
    return (config.get("repo_url") or "").rstrip("/")


def _src_url(base, branch, kind, path):
    """បង្កើត URL លើ GitHub: kind = edit | blob | raw | commits។"""
    return f"{base}/{kind}/{branch}/{path}"


def _button(href, icon, label, label_en, tooltip, style=""):
    """ប៊ូតុងតែមួយក្នុងរបារ (anchor → បើកផ្ទាំងថ្មី ដើម្បីមិនបាត់ទំព័រដែលកំពុងអាន)។"""
    aria = f"{label} — {label_en}"
    return (
        f'<a class="gh-btn{(" gh-btn--" + style) if style else ""}" href="{escape(href)}" '
        f'title="{escape(tooltip)}" aria-label="{escape(aria)}" '
        f'target="_blank" rel="noopener noreferrer">'
        f'<span class="gh-btn__icon">{icon}</span>'
        f'<span class="gh-btn__label">{escape(label)}</span>'
        f"</a>"
    )


def _render(page, config):
    """បង្កើត HTML នៃរបារសកម្មភាពសម្រាប់ទំព័រមួយ។"""
    settings = _settings(config)
    base = _repo_base(config)
    if not base:
        return ""

    branch = settings["branch"]
    docs_dir = settings["docs_dir"].strip("/")
    src_path = page.file.src_path                     # ឧ. lessons/player.md
    repo_path = f"{docs_dir}/{src_path}"              # ឧ. docs/lessons/player.md
    docs_subdir = "/".join(src_path.split("/")[:-1])  # ឧ. lessons
    title = (page.meta or {}).get("title") or page.title or src_path

    # ១. កែទំព័រនេះ → GitHub web editor (fork + PR ស្វ័យប្រវត្តិ)
    edit_url = page.edit_url or _src_url(base, branch, "edit", repo_path)

    # ២. មើលប្រភព + ប្រវត្តិ commit
    view_url = _src_url(base, branch, "blob", repo_path)
    history_url = f"{base}/commits/{branch}/{quote(repo_path)}"

    # ៣. រាយការណ៍បញ្ហា → prefill ឈ្មោះទំព័រ និង URL ជាមុន
    site_url = (config.get("site_url") or "").rstrip("/")
    page_url = f"{site_url}/{page.url}" if site_url else f"/{page.url}"
    issue_query = urlencode({
        "template": settings["issue_template"],
        "title": f"[ឯកសារ] {title}",
        "page": page_url,
        "page_path": repo_path,
        "labels": settings["issue_label"],
    })
    issue_url = f"{base}/issues/new?{issue_query}"

    # ៤. ស្នើឯកសារថ្មី → បង្កើតឯកសារក្នុង folder ដូចគ្នា
    new_dir = f"{docs_dir}/{docs_subdir}" if docs_subdir else docs_dir
    scope = docs_subdir or docs_dir
    new_query = urlencode({
        "filename": "new-page.md",
        "value": NEW_PAGE_BODY,
        "message": f"docs({scope}): add new page",
    })
    new_url = f"{base}/new/{branch}/{quote(new_dir)}?{new_query}"

    buttons = [
        _button(edit_url, ICONS["edit"], TEXT["edit"], "Edit this page on GitHub",
                TEXT["edit_hint"], style="primary"),
        _button(view_url, ICONS["view"], TEXT["view"], "View source of this page",
                TEXT["view_hint"]),
        _button(issue_url, ICONS["issue"], TEXT["issue"], "Report an issue with this page",
                TEXT["issue_hint"]),
        _button(new_url, ICONS["new"], TEXT["new"], "Propose a new documentation page",
                TEXT["new_hint"]),
        _button(history_url, ICONS["history"], TEXT["history"], "View commit history of this page",
                TEXT["history_hint"]),
    ]

    # CONTRIBUTING.md ស្ថិតនៅឫស repository (មិនមែនក្នុង docs/) → ភ្ជាប់ទៅ GitHub ផ្ទាល់
    contributing = f"{base}/blob/{branch}/CONTRIBUTING.md"

    return (
        '<aside class="gh-contribute" data-md-component="contribute" lang="km">'
        '<div class="gh-contribute__head">'
        f'<span class="gh-contribute__mark">{ICONS["github"]}</span>'
        f'<span class="gh-contribute__title">{escape(TEXT["title"])}'
        f'<span class="gh-contribute__title-en">{escape(TEXT["title_en"])}</span></span>'
        "</div>"
        f'<div class="gh-contribute__actions">{"".join(buttons)}</div>'
        f'<p class="gh-contribute__note">{TEXT["footer"]} '
        f'{escape(TEXT["guideline"])} '
        f'<a href="{escape(contributing)}" target="_blank" rel="noopener noreferrer">'
        f'{escape(TEXT["guideline_link"])}</a>.</p>'
        "</aside>"
    )


def on_page_content(html, page, config, files, **kwargs):
    """ភ្ជាប់របារទៅចុងមាតិការបស់ទំព័រ។"""
    settings = _settings(config)
    if not settings.get("enabled", True):
        return html
    if not config.get("repo_url"):
        return html

    # បិទតាមទំព័រដោយ front matter: `hide: [contribute]` (ស្របគ្នានឹង Material)
    hide = (page.meta or {}).get("hide") or []
    if isinstance(hide, str):
        hide = [hide]
    if "contribute" in hide:
        return html

    return f"{html}\n{_render(page, config)}"


# --- បកប្រែ tooltip របស់ប៊ូតុងលំនាំដើម Material ទៅជាភាសាខ្មែរ --------------
# Material for MkDocs មិនទាន់មាន UI ភាសាខ្មែរ ដូច្នេះ tooltip ចេញជាអង់គ្លេស។
# យើងជំនួសវានៅពេល render ចុងក្រោយ (on_post_page) ដើម្បីឱ្យ UI ស្របភាសាគ្នា។
TOOLTIP_KM = {
    "edit": TEXT["edit_hint"],
    "view": "មើលឯកសារ Markdown ដើម (raw)",
    "repo": "ទៅកាន់ repository លើ GitHub",
}

# --- បកប្រែ tooltip របស់ប៊ូតុងលំនាំដើម Material ទៅជាភាសាខ្មែរ --------------
# Material for MkDocs មិនទាន់មាន UI ភាសាខ្មែរ ដូច្នេះ tooltip ចេញជាអង់គ្លេស។
#
# វិធីសាស្ត្រ៖ ជំនួសខ្សែអក្សរ `title="..."` ពេញលេញ (មិនមែន regex) ព្រោះ —
#   - លំដាប់ attribute របស់ Material មិនថេរ (title អាចនៅមុន ឬក្រោយ class)
#   - ការជំនួសពេញលេញមានសុវត្ថិភាពជាង និងមិនអាចប៉ះមាតិកាអ្នកនិពន្ធបានទេ
#     (ខ្សែអក្សរទាំងនេះកើតចេញពី lang pack របស់ theme តែប៉ុណ្ណោះ)
TOOLTIPS_EN_TO_KM = {
    # content.action.edit / content.action.view (partials/actions.html)
    'title="Edit this page"': f'title="{TOOLTIP_KM["edit"]}"',
    'title="View source of this page"': f'title="{TOOLTIP_KM["view"]}"',
    # តំណភ្ជាប់ repository ក្នុង header និង footer (partials/source.html)
    'title="Go to repository"': f'title="{TOOLTIP_KM["repo"]}"',
}


def on_post_page(output, page, config, **kwargs):
    """បកប្រែ tooltip ក្នុង HTML ចុងក្រោយ — មិនប៉ះមាតិកាខ្លួនឯងទេ។"""
    if not _settings(config).get("enabled", True):
        return output
    for english, khmer in TOOLTIPS_EN_TO_KM.items():
        if english in output:
            output = output.replace(english, khmer)
    return output
