# ផែនទីបង្ហាញផ្លូវ (ROADMAP)

ឯកសារនេះតាមដានវឌ្ឍនភាពនៃគម្រោងឯកសារភាសាខ្មែរសម្រាប់ Target Quest។
ស្ថានភាព៖ `planned` (គ្រោងទុក) · `in_progress` (កំពុងធ្វើ) · `blocked` (ជាប់គាំង) ·
`verified` (ផ្ទៀងផ្ទាត់ហើយ) · `complete` (បញ្ចប់)។

**គម្រោងយោង៖** [KernelVoltage/Target-Quest](https://github.com/KernelVoltage/Target-Quest) @ commit `a10b33c`
**ថ្ងៃធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖** 2026-10-23

| Phase | គោលដៅ | ស្ថានភាព | លទ្ធផល/ចំណាំ |
| --- | --- | --- | --- |
| ០. ការចូលដំណើរការ និងកំណត់អត្តសញ្ញាណ repo | ផ្ទៀងផ្ទាត់ token, ស្វែងរក repo ដើមពិត | ✅ complete | fork `SeyhaLite/Target-Quest` sync 100% ជាមួយ upstream `KernelVoltage/Target-Quest`; URL ក្នុងប្រភពដើម ("Target-QuestRCE") ជា placeholder មិនពិត (404) |
| ១. សវនកម្ម repository និងស្ថាបត្យកម្ម | អានកូដ ១០០% និងកត់ត្រាការរកឃើញ | ✅ verified | ឯកសារទាំង ៨៧ ក្នុង tree ត្រូវបានពិនិត្យ; រកឃើញភាពមិនស្របគ្នា README↔កូដ ២ កន្លែង, dead code ៣ ឯកសារ; មើល [repository-audit.md](research/repository-audit.md) |
| ២. License និងយុទ្ធសាស្ត្រ upstream | ពិនិត្យ MIT + assets license; រក្សា fork sync | ✅ verified | MIT (កូដ) + អប់រំប៉ុណ្ណោះ (assets); fork នៅ sync ជាមួយ upstream; យុទ្ធសាស្ត្រ = fork ដដែល + បន្ថែមឯកសារក្នុង `docs/` |
| ៣. ការស្រាវជ្រាវ និងផ្ទៀងផ្ទាត់ប្រភព | ផ្ទៀងផ្ទាត់ version/URL ទាំងអស់ | ✅ verified | Godot stable 4.7.2 (2026-08-18), គម្រោងប្រើ 4.3; gravity 980 ផ្ទៀងផ្ទាត់ពី ProjectSettings docs; mkdocs-material 9.7.7; RTD config v2; URL ទាំងអស់ពិនិត្យ HTTP 200 |
| ៤. ស្ថាបត្យកម្មឯកសារ + ពាក្យបច្ចេកទេសខ្មែរ | IA និង glossary | ✅ complete | ១៦ ទំព័រ; [glossary.md](docs/glossary.md) ជាង ៤០ ពាក្យ |
| ៥. មេរៀនស្នូល + ការដំឡើង | getting-started, fundamentals, architecture | ✅ complete | ៧ ទំព័រ |
| ៦. មេរៀនកូដ + tutorials + API + diagrams | lessons, tutorials, reference | ✅ complete | ៤ មេរៀនកូដ + ១ tutorial (៧ ជំហាន) + ២ reference + ៨ mermaid diagrams; bug egg-health **ផ្ទៀងផ្ទាត់ដោយ Godot 4.3 headless** ទាំងកូដដើម និងកូដកែ |
| ៧. README និង metadata | សម្អាត README, ដាក់ description | ✅ complete (រង់ចាំ push) | README សរសេរឡើងវិញ ខ្មែរ+អង់គ្លេស; រក្សា attribution |
| ៨. Read the Docs build config | `.readthedocs.yaml`, `mkdocs.yml`, requirements | ✅ verified locally | `mkdocs build --strict` ជោគជ័យក្នុងបរិយាកាសសរសេរឯកសារ (មើលលទ្ធផលក្នុង audit) |
| ៩. QA ស្វ័យប្រវត្តិ + manual | link check, secret scan, Khmer unicode check | ✅ verified | រាល់ internal link/image មានឯកសារ; គ្មាន secret ក្នុង diff; អក្សរខ្មែរសុទ្ធ (ពិនិត្យ codepoint) |
| ១០. Publish ទៅ GitHub | rename repo + push ទៅ `main` | ✅ complete | មើល commit hashes ក្នុងរបាយការណ៍ចុងក្រោយ |
| ១១. RTD import + build + ផ្សាយ | នាំចូលគម្រោងលើ app.readthedocs.org | ✅ verified | គេហទំព័រផ្សាយផ្ទាល់៖ <https://target-quest-khmer-docs.readthedocs.io/> (redirect → `/km/latest/`, HTTP 200, មាតិកាខ្មែរបង្ហាញត្រឹមត្រូវ — ផ្ទៀងផ្ទាត់ 2026-10-23) |
| ១២. ថែទាំ + sync upstream | របៀប sync និងបកប្រែការផ្លាស់ប្តូរ | ✅ complete (ឯកសារណែនាំ) | មើលផ្នែក "ការធ្វើសមកាលកម្មជាមួយ upstream" ក្នុង CONTRIBUTING.md |

## ការងារនៅសល់ (ត្រូវការសកម្មភាពពីអ្នក)

1. ~~**Import លើ Read the Docs**~~ — ✅ បញ្ចប់ហើយ គេហទំព័រផ្សាយផ្ទាល់នៅ
   <https://target-quest-khmer-docs.readthedocs.io/>
2. **Revoke GitHub token** ដែលបាន paste ក្នុង chat — សុវត្ថិភាព! (នៅតែណែនាំឱ្យធ្វើ)
3. **(ស្រេចចិត្ត) ជូនដំណឹង upstream** អំពី bug `max_hits` ក្នុង `egg.gd`

## គំនិតអភិវឌ្ឍន៍បន្ត (មិនទាន់គ្រោង)

- បន្ថែមមេរៀនអំពី web export (ត្រូវការ export templates + សាកល្បង)
- បន្ថែមវីដេអូ/GIF ពីការលេងពិត (ត្រូវការ screen recording)
- បកប្រែ README ដើមទាំងស្រុងជាខ្មែរ (បច្ចុប្បន្ន README ជាពីរភាសាសង្ខេប)
- ពិនិត្យលទ្ធភាពផ្លាស់ទៅ Zensical (successor របស់ Material for MkDocs) មុន EOL ថ្ងៃ 2026-11-05 — មើលកំណត់ត្រាក្នុង [repository-audit.md](research/repository-audit.md)
