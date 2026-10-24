# ការកំណត់រចនាសម្ព័ន្ធ

ទំព័រនេះរាយបញ្ជី **ការកំណត់ទាំងអស់** ដែលអ្នកអាចប្រែប្រួលបាន —
ពី `project.godot` រហូតដល់អថេរ `@export` ក្នុងស្គ្រីប។

## `project.godot` — ការកំណត់គម្រោង

| Key | តម្លៃ | អត្ថន័យ |
| --- | --- | --- |
| `config_version` | `5` | format version របស់ Godot 4 |
| `config/name` | `"Target Quest"` | ឈ្មោះគម្រោង (បង្ហាញក្នុង Project Manager + វីនដូ) |
| `config/features` | `("4.3", "GL Compatibility")` | បង្កើតដោយ Godot 4.3 — Godot ប្រើវាដើម្បីព្រមាន version |
| `config/icon` | `res://Icon.png` | រូបតំណាងហ្គេម |
| `window/size/viewport_width` | `1280` | ទទឹងវីនដូលំនាំដើម |
| `window/size/viewport_height` | `720` | កម្ពស់វីនដូលំនាំដើម |
| `window/stretch/mode` | `"canvas_items"` | ពេល resize វីនដូ → ពង្រីក canvas (រូបភាព/UI តាម) |
| `window/stretch/aspect` | `"expand"` | រក្សាសមាមាត្រ ដោយពង្រីកផ្ទៃមើលជំនួសឱ្យការបង្រួមបង្ខំ |
| `renderer/rendering_method` | `"gl_compatibility"` | OpenGL renderer — សម្រាប់ម៉ាស៊ីនចាស់ និង web export |
| `renderer/rendering_method.mobile` | `"gl_compatibility"` | ដូចគ្នាសម្រាប់ទូរស័ព្ទ |

### ការកំណត់ដែល *គ្មាន* (ប្រើលំនាំដើមរបស់ Godot)

| ផ្នែក | លំនាំដើមដែលប្រើ | ផលប៉ះពាល់លើហ្គេម |
| --- | --- | --- |
| `run/main_scene` | ❌ មិនបានកំណត់ | F5 សួរឱ្យជ្រើសរើស main scene; ប្រើ F6 ឬបើក `main.tscn` មុន |
| `physics/2d/default_gravity` | **980.0** | ទំនាញរបស់ព្រួញ ស៊ុត និងតួអង្គ — ស្គ្រីបទាំង ៣ អានតម្លៃនេះ |
| `physics/2d/...` ផ្សេងទៀត | layer/mask លំនាំដើម (1) | វត្ថុទាំងអស់នៅ layer ១ — មិនមានការបែងចែក collision layer |
| `[input]` | ❌ មិនមាន | input ទាំងអស់ជា raw mouse events ក្នុង `_input()` |
| `[audio]` | bus layout លំនាំដើម (Master) | SFX ទាំង ៤ លេងតាម Master bus |

📖 [ProjectSettings reference](https://docs.godotengine.org/en/4.3/classes/class_projectsettings.html)

## អថេរ `@export` — កែបានតាម Inspector ដោយមិនប៉ះកូដ

ជ្រើសរើស node ក្នុង editor → Inspector → ផ្នែកស្គ្រីប៖

| Node (Scene) | Property | លំនាំដើម | ឥទ្ធិពល |
| --- | --- | --- | --- |
| `Main` (main.tscn) | `Egg Scene` | `egg.tscn` | ⚠️ បើទទេ → គ្មានស៊ុតលេចឡើងទេ |
| `Main` (main.tscn) | `Wooden Base Scene` | `wooden_base.tscn` | ⚠️ បើទទេ → ស៊ុតនៅលើដីជានិច្ច |
| `Player` (player.tscn) | `Arrow Scene` | `arrow.tscn` | ⚠️ បើទទេ → មិនអាចបាញ់បានទេ |
| `Player` (player.tscn) | `Max Drag Distance` | `200.0` | ចម្ងាយទាញ = កម្លាំង ១០០%។ តូច → ងាយបានកម្លាំងពេញ |
| `Arrow` (arrow.tscn) | `Speed` | `800.0` | ⚠️ **មិនមានឥទ្ធិពលលើការបាញ់ជាក់ស្តែង** — `release_arrow()` ជំនួសដោយ `1200×power` ជានិច្ច |
| `Monster` (monster.tscn) | — | — | ⚠️ scene ខូច — កុំប្រើ |

## តម្លៃថេរក្នុងកូដ (Magic Numbers) — ត្រូវកែតាមកូដ

តម្លៃទាំងនេះ **មិនមាន** ក្នុង Inspector ទេ៖

| តម្លៃ | ទីតាំង | អត្ថន័យ |
| --- | --- | --- |
| `1200.0` | `player.gd` បន្ទាត់ ១៦៧ **និង** ២២៣ | ល្បឿនបាញ់អតិបរមា (ត្រូវកែ **ទាំងពីរ** ដើម្បីឱ្យការទាយត្រូវ) |
| `5.0` | `player.gd` បន្ទាត់ ៥៨, ១៦២, ២២៦ | dead zone នៃការទាញ (ភីកសែល) |
| `0.1` | `player.gd` បន្ទាត់ ១៦៦, ២២២ — បន្ទាត់ ៨០ ជា clamp(…, 0.0, 1.0) សម្រាប់ animation progress | power អប្បបរមា (១០%) |
| `0.08` / `5` | `player.gd` បន្ទាត់ ១៧០–១៧១ | គម្លាតពេល និងចំនួនចំណុចគន្លងទាយ |
| `14.0` / `26.0` | `player.gd` បន្ទាត់ ១៨៤ | កាំអប្បបរមា/អតិបរមានៃចំណុចគន្លង |
| `Vector2(0.2, 0.2)` | `player.gd` បន្ទាត់ ២១៤ | scale ព្រួញពេលបាញ់ចេញ |
| `145` | `arrow.tscn` — `RayCast2D.target_position` | ប្រវែង raycast (px) |
| `-1` | `arrow.gd` បន្ទាត់ ៩៤ | z_index ពេលខ្ទប់ (នៅក្រោយវត្ថុ) |
| `3` (hard-coded) | `egg.gd` បន្ទាត់ ៩២ | ⚠️ ចំនួនដងវាយដើម្បីបំផ្លាញ — **bug** ដែលរំលង `max_hits` |
| `4861`, `239`, `41` | `main.gd` បន្ទាត់ ៧៩ | មេគុណ seed សម្រាប់ procedural generation |
| `[120, 1150]` | `main.gd` បន្ទាត់ ៨៤ | ទីតាំង x ខាងឆ្វេង/ខាងស្តាំរបស់តួអង្គ |
| `[320, 520, 720, 920]` | `main.gd` បន្ទាត់ ៩៤ | ច្រក x សម្រាប់ស៊ុត |
| `[200, 310, 420]` | `main.gd` បន្ទាត់ ៩៩ | កម្ពស់ y សម្រាប់ស៊ុត |
| `>= 8` | `main.gd` បន្ទាត់ ១១៥ | កម្រិតចាប់ផ្តើមវេទិកាផ្លាស់ទី |
| `2 + level/3` | `main.gd` បន្ទាត់ ១៨៦ | សុខភាពស៊ុតតាមកម្រិត (⚠️ មិនមានឥទ្ធិពលព្រោះ bug) |
| `18 + level×0.4` (cap 35) | `main.gd` បន្ទាត់ ១៩៧ | ចម្ងាយរំកិលវេទិកា |
| `2.8 − level×0.01` (floor 1.6) | `main.gd` បន្ទាត់ ១៩៩ | រយៈពេល Tween មួយជើង (វិនាទី) |
| `(0, -50)` | `main.gd` បន្ទាត់ ១៧៣ | offset ស៊ុតពីលើវេទិកា |

## ឯកសារ configuration ផ្សេងទៀត

| ឯកសារ | គោលបំណង |
| --- | --- |
| `.gitignore` | មិន track `.godot/` (import cache), `*.tmp`, export outputs |
| `.gitattributes` | `* export-ignore` សម្រាប់ GitHub ZIP export; ⚠️ បន្ទាត់ `export=false` មិនមានឥទ្ធិពល (មិនមែន attribute ស្តង់ដារ) |
| `*.import` (រាល់ឯកសារ asset) | ការកំណត់ import របស់ Godot សម្រាប់រូបភាព/សំឡេងនីមួយៗ — កុំកែដោយដៃ កុំលុប |

## ការកំណត់សម្រាប់ឯកសារ (MkDocs + Read the Docs)

ឯកសារទាំងនេះគ្រប់គ្រង **គេហទំព័រឯកសារ** មិនមែនហ្គេមទេ៖

| ឯកសារ | គោលបំណង |
| --- | --- |
| `mkdocs.yml` | រចនាសម្ព័ន្ធ/nav/theme នៃគេហទំព័រឯកសារ |
| `.readthedocs.yaml` | ការកំណត់ build សម្រាប់ Read the Docs (ubuntu-24.04, Python 3.12, MkDocs) |
| `docs/requirements.txt` | កំណែឧបករណ៍ឯកសារដែលបានខ្ទាស់ (mkdocs 1.6.1, mkdocs-material 9.7.7) |
| `docs/stylesheets/extra.css` | ពុម្ពអក្សរខ្មែរ (Kantumruy Pro + Noto Sans Khmer) |
