# សវនកម្ម Repository និងកំណត់ត្រាស្រាវជ្រាវ (Repository Audit & Research Record)

ឯកសារនេះជាកំណត់ត្រាផ្លូវការនៃការសវនកម្មគម្រោង និងការផ្ទៀងផ្ទាត់ប្រភព
សម្រាប់ឯកសារសិក្សាភាសាខ្មែរនៃ Target Quest។

- **ថ្ងៃសវនកម្ម៖** 2026-10-23
- **អ្នកធ្វើសវនកម្ម៖** SeyhaLite (ជាមួយជំនួយពីឧបករណ៍ AI — ការវិភាគកូដ និងការសរសេរឯកសារ)
- **Commit យោង៖** `a10b33c0f862c7dc6c65b6d356b27bd2c873eb28` (`a10b33c`)

---

## ១. អត្តសញ្ញាណគម្រោង (Repository Identity)

| ធាតុ | តម្លៃ | ប្រភព/វិធីផ្ទៀងផ្ទាត់ |
| --- | --- | --- |
| គម្រោងដើម (upstream) | `KernelVoltage/Target-Quest` | GitHub API `/repos/KernelVoltage/Target-Quest` (2026-10-23) |
| Fork គោលដៅ | `SeyhaLite/Target-Quest` → ប្តូរឈ្មោះជា `Target-Quest-Khmer-Docs` | GitHub API; `fork: true`, `parent: KernelVoltage/Target-Quest` |
| Default branch | `main` | GitHub API |
| Commit ពិនិត្យ | `a10b33c` — fork និង upstream **ដូចគ្នា ១០០%** (`git diff --stat upstream/main main` = ទទេ) | git |
| ភាសាចម្បង | GDScript (Godot Engine) | GitHub API `language: GDScript` + ការអានកូដ |
| Engine version | Godot **4.3**, GL Compatibility | `project.godot` → `config/features=PackedStringArray("4.3", "GL Compatibility")` |
| License កូដ | MIT © 2026 KernelVoltage | `LICENSE` (អានពេញ) |
| License assets | អប់រម/មិនមែនពាណិជ្ជកម្ម — ហាម redistribute | `ASSETS_LICENSE.md` (អានពេញ) |
| ស្ថានភាព maintenance | upstream បង្កើត 2026-10-18, push ចុងក្រោយ 2026-10-19, 2 stars, 0 open issues | GitHub API |
| Homepage/docs ផ្លូវការ | ❌ គ្មាន (មានតែ README.md) | GitHub API + tree inspection |

!!! note "ការកត់សម្គាល់អំពី URL ក្នុងសំណើដើម"
    សំណើដើមយោង `KernelVoltage/Target-QuestRCE_REPOSITORY_URL` — URL នេះ
    **មិនមានពិត** (GitHub API ត្រឡប់ 404)។ វាជា placeholder ដែលខូចទ្រង់ទ្រាយ។
    Repository ពិតត្រូវបានកំណត់តាម metadata របស់ fork ផ្ទាល់
    (`parent.full_name = KernelVoltage/Target-Quest`)។

## ២. វិសាលភាពនៃការពិនិត្យ (Inspection Coverage)

**ឯកសារសរុបក្នុង git tree៖ ៨៧** (ផ្ទៀងផ្ទាត់តាម GitHub Trees API, `truncated: false`)។

| ប្រភេទ | ចំនួន | ស្ថានភាពពិនិត្យ |
| --- | --- | --- |
| ស្គ្រីប GDScript (`Script/*.gd`) | ៥ | ✅ អាន **១០០%** (រាល់បន្ទាត់) |
| Scenes (`Scenes/*.tscn` + `.tmp`) | ៧ | ✅ អានទាំងអស់ (`player.tscn` អានផ្នែក node tree + animation resource names; ផ្នែក animation keyframes អានត្រួតៗ) |
| Configuration (`project.godot`, `.gitignore`, `.gitattributes`) | ៣ | ✅ អាន ១០០% |
| Licenses + README | ៣ | ✅ អាន ១០០% |
| រូបភាព/សំឡេង + `.import` metadata | ៦៩ | ✅ ពិនិត្យបញ្ជី និងទំហំ; មាតិការូបភាពមិនបានពិនិត្យព័ត៌មានលម្អិតទាំងអស់ (binary assets) |

**ឯកសារដែលមិនបានពិនិត្យខ្លឹមសារលម្អិត៖** រូបភាព PNG ធំៗ (backgrounds) —
គ្រាន់តែផ្ទៀងផ្ទាត់អត្ថិភាព និងការប្រើប្រាស់តាម `.tscn` references។
ហេតុផល៖ binary assets មិនប៉ះពាល់ការអះអាងបច្ចេកទេសក្នុងឯកសារទេ។

## ៣. ការរកឃើញសំខាន់ៗ (Key Findings)

### ៣.១ ភាពមិនស្របគ្នា README ↔ កូដ (ផ្ទៀងផ្ទាត់)

| # | README ដើមអះអាង | កូដពិត | ភស្តុតាង |
| --- | --- | --- | --- |
| ១ | វេទិកាផ្លាស់ទី "starting from Level 10" | `use_mov = current_level >= 8` — ចាប់ពីកម្រិត **៨** | `main.gd` បន្ទាត់ ១១៥ |
| ២ | "Overlap-Free Spatial Grid... strict minimum safe-distance algorithm" | ប្រព័ន្ធ **ច្រកថេរ** (fixed lanes) — x ដាច់ដោយឡែកពី array ៤ តម្លៃ; មិនមាន distance-checking algorithm ទេ | `main.gd` បន្ទាត់ ៩៤–១១២ |
| ៣ | ដោយនัย: សុខភាពសុតកើនតាមកម្រិត (smart difficulty) | `set_egg_health()` កំណត់ `max_hits` ប៉ុន្តែលក្ខខណ្ឌបំផ្លាញ hard-coded `>= 3` → **សុតបែកនៅព្រួញទី ៣ ជានិច្ច** | `egg.gd` បន្ទាត់ ៩២ — **ផ្ទៀងផ្ទាត់ដោយការដំណើរការ** (មើល ៤.២) |

### ៣.២ Dead code និងឯកសារខូច (ផ្ទៀងផ្ទាត់)

| ឯកសារ | បញ្ហា | ភស្តុតាង |
| --- | --- | --- |
| `Scenes/monster.tscn` | យោងរូបភាព ១១ ក្នុង `Free_Asset_Pack/NPC/` ដែល**មិនមាន**ក្នុង repo; គ្មានអ្វី instance វា | `grep -rn "monster" --include="*.tscn" --include="*.gd"` = ទទេ; `ls Free_Asset_Pack/` គ្មាន NPC |
| `Script/target.gd` | មិនភ្ជាប់នឹង scene ណា; ហៅក្រុម `"level_manager"` + method `check_level_completion()` ដែលមិនមាន; មាន comment ជាភាសា Hindi (បន្ទាត់ ២៦) | `grep -rn "target.gd" --include="*.tscn"` = ទទេ; អានកូដពេញ |
| `Scenes/mai19EC.tmp` | temp file របស់ Godot editor (ច្បាប់ចម្លងចាស់នៃ main.tscn ដែលគ្មាន script) | អាន head ឯកសារ; `.gitignore` មាន `*.tmp` ប៉ុន្តែឯកសារនេះ commit រួចហើយមុន |
| ក្រុម `"Player"` (កង្វះ) | `arrow.gd` ស្វែងរកក្រុមនេះសម្រាប់ raycast exception ប៉ុន្ត់គ្មាន node ណាចូល → dead code path | `grep -rn "groups=" Scenes/` = ទទេ; `player.gd` គ្មាន `add_to_group` |
| `update_trajectory()` | អនុគមន៍ទទេ (`pass`) | `player.gd` បន្ទាត់ ១៤៨–១៤៩ |
| `TrajectoryLine` (Line2D) | node មានក្នុង player.tscn ប៉ុន្តែកូដមិនយោងវាទេ (ការទាយគន្លងប្រើ `_draw()`) | grep player.gd |
| `_on_egg_destroyed()` | `egg.gd` ព្យាយាមហៅ (guarded ដោយ `has_method`) ប៉ុន្តែ `main.gd` មិនមាន method នេះ → មិនកើតឡើង | អាន main.gd ពេញ |

**ការសម្រេចចិត្ត៖** តាមការណែនាំរបស់ម្ចាស់ fork — ឯកសារខូច/dead code ទាំងអស់
ត្រូវបាន **រក្សាទុកដដែល** (មិនលុប) ដើម្បីរក្សា upstream sync; ឯកសារខ្មែរ
កត់ត្រាពួកវាដោយត្រង់។

### ៣.៣ ចំណុចរចនាដែលបានវិភាគ (design observations)

- ព្រួញប្រើ **manual Euler integration** ក្នុង `_process` ជំនួស RigidBody2D —
  សាមញ្ញ និងគ្រប់គ្រងបាន ប៉ុន្តែ frame-rate dependent (delta-based កាត់បន្ថយផលប៉ះពាល់)
- សុតធ្លាក់តាម `_physics_process` (fixed timestep) ខុសពីព្រួញ — ភាពមិនស៊ីសង្វាក់គ្នាតូចមួយ
- សុខភាពសុត `2 + level/3` គណនាហើយប៉ុន្តែមិនមានឥទ្ធិពល (bug ៣)
- seed formula `level*4861 + level*239 + 41` = `level*5100 + 41` គណិតវិទ្យា —
  ការប្រើមេគុណពីរអាចជាជម្រើសសោភ័ណ្ឌរបស់អ្នកបង្កើត (មិនមាន comment ពន្យល់)
- គ្មាន camera, គ្មាន UI/HUD, គ្មាន save — ស្ថានភាពហ្គេម minimal arcade

## ៤. ការផ្ទៀងផ្ទាត់ដោយការដំណើរការ (Execution Verification)

បរិយាកាសសវនកម្មមាន network + Linux ប៉ុន្តែ **គ្មាន display** ដូច្នេះការសាកល្បង
ធ្វើឡើងតាម **Godot 4.3 headless**។

### ៤.១ លទ្ធផលសាកល្បង

| ការសាកល្បង | ពាក្យបញ្ជា | លទ្ធផល |
| --- | --- | --- |
| Godot version | `Godot_v4.3-stable_linux.x86_64 --version` | ✅ `4.3.stable.official.77dcf97d8` |
| Import គម្រោង | `--headless --path . --import` | ✅ exit 0, គ្មាន error |
| Parse check ស្គ្រីបទាំង ៥ | `--headless --check-only --script res://Script/{main,player,arrow,egg,target}.gd` | ✅ ទាំង ៥ exit 0 |
| ដំណើរការហ្គេម ៣០០ frames | `--headless --path . res://Scenes/main.tscn --quit-after 300` | ✅ exit 0, **គ្មាន error/warning** |
| ពិនិត្យ bug សុខភាពសុត | test script (SceneTree) — `set_egg_health(5)` + `take_damage()` ×5 | ✅ **បញ្ជាក់ bug៖** `is_destroyed=true` នៅការវាយទី **៣** (កូដដើម) |
| ពិនិត្យការកែ bug | ដូចខាងលើ ជាមួយ `current_hits >= max_hits` (patch បណ្តោះអាសន្ន → revert) | ✅ សុតបែកនៅការវាយទី **៥** — ការកែដំណើរការ; `git diff` ស្អាតក្រោយ revert |

!!! note "ដែនកំណត់នៃការសាកល្បង"
    - មិនបានសាកល្បង **input កណ្តុរ/ការលេង GUI** (headless គ្មាន display) —
      ឥរិយាបទលេងពិពណ៌នាពីការវិភាគកូដ មិនមែនការសង្កេតផ្ទាល់ទេ
    - មិនបានសាកល្បងសំឡេង (headless audio = dummy)
    - test script បង្ហាញថាពេល node មិនទាន់ចូល tree ពេញលេញ `take_damage()`
      error ត្រង់ `anim_sprite` (Nil) — នេះជា artifact នៃ harness មិនមែន bug ហ្គេម
      (ក្នុងការលេងពិត `_ready()` ដំណើរការមុនជានិច្ច)

### ៤.២ ស្ថានភាពអះអាងសំខាន់ៗក្នុងឯកសារខ្មែរ

| ការអះអាង | ស្ថានភាព |
| --- | --- |
| ឥរិយាបទ level generation (១–៤ hand-made, ៥+ procedural, ៨+ moving) | ✅ verified (អានកូដ + គណនាតារាងដោយដៃ) |
| Egg បែកនៅព្រួញទី ៣ ជានិច្ច (bug) | ✅ verified **by execution** |
| ការកែ `current_hits >= max_hits` ដំណើរការ | ✅ verified **by execution** |
| រូបមន្ត projectile + trajectory prediction | ✅ verified (អានកូដ; ភាពត្រូវគ្នារវាង `_draw()` និង `arrow.gd`) |
| ក្រុម "Player" មិនមាន (dead code) | ✅ verified (grep + អាន scene files) |
| ការលេងជាក់ស្តែង (visual, audio, feel) | ⚠️ វិភាគពីកូដ — មិនបានសង្កេតផ្ទាល់ (headless) |
| Frame ៣ នៃ egg animation "អាចលេចឡើងមួយភ្លែត ឬមិនលេច" | ⚠️ វិភាគ timing — ដាក់សម្គាល់ច្បាស់ក្នុងឯកសារ |

## ៥. កំណត់ត្រាភស្តុតាង (Evidence Ledger)

រាល់ការអះអាង version-sensitive ទាំងអស់ ពិនិត្យថ្ងៃ **2026-10-23**៖

| # | ការអះអាង/ការណែនាំ | ប្រភព | កាលបរិច្ឆេទប្រភព | Version | វិធីផ្ទៀងផ្ទាត់ | ស្ថានភាព |
| --- | --- | --- | --- | --- | --- | --- |
| ១ | Godot stable ថ្មីបំផុត = 4.7.2; 4.8-beta1 | [godotengine.org/download/windows](https://godotengine.org/download/windows/) + [archive](https://godotengine.org/download/archive/) | 18 សីហា 2026 / 15 ตุลា 2026 | 4.7.2 | fetch ទំព័រផ្លូវការ | ✅ verified |
| ២ | គម្រោងបង្កើតដោយ Godot 4.3 | `project.godot` — `config/features` | commit a10b33c | 4.3 | អានឯកសារ | ✅ verified |
| ៣ | `physics/2d/default_gravity` = 980.0 | [ProjectSettings class ref (4.3)](https://docs.godotengine.org/en/4.3/classes/class_projectsettings.html) | docs 4.3 | 4.3 | fetch + អានតារាង property | ✅ verified |
| ៤ | RTD config v2 + MkDocs (`mkdocs.configuration`, `build.os/tools`) | [RTD: Deploying MkDocs](https://docs.readthedocs.com/platform/stable/intro/mkdocs.html), [config v2](https://docs.readthedocs.com/platform/stable/config-file/v2.html) | stable docs (fetch 2026-10-23) | — | fetch ទំព័រផ្លូវការ | ✅ verified |
| ៥ | `site_url: !ENV READTHEDOCS_CANONICAL_URL` ជាអនុសាសន៍ RTD | [RTD: Deploying MkDocs](https://docs.readthedocs.com/platform/stable/intro/mkdocs.html) | stable docs | — | fetch | ✅ verified |
| ៦ | mkdocs-material ថ្មីបំផុត = 9.7.7 (requires_python ≥3.8) | [PyPI JSON API](https://pypi.org/project/mkdocs-material/) | 17 កក្កដា 2026 | 9.7.7 | PyPI API | ✅ verified |
| ៧ | mkdocs stable = 1.6.1 (2.0 នៅ dev — breaking changes តាមការព្រមានរបស់ Material team) | [PyPI](https://pypi.org/project/mkdocs/) + warning ក្នុង build log ផ្ទាល់ | 2026 | 1.6.1 | PyPI API + ការដំណើរការ build | ✅ verified |
| ៨ | Material theme គ្មាន UI ភាសាខ្មែរ (60+ ភាសា គ្មាន `km`) | [Material: Changing the language](https://squidfunk.github.io/mkdocs-material/setup/changing-the-language/) | fetch 2026-10-23 | 9.x | អានបញ្ជីភាសាពេញ (Kannada→Korean គ្មាន Khmer) | ✅ verified |
| ៩ | ពុម្ពខ្មែរ Kantumruy Pro + Noto Sans Khmer មានលើ Google Fonts | fonts.googleapis.com CSS2 API | — | — | HTTP 200 លើ CSS2 URL ទាំងពីរ | ✅ verified |
| ១០ | Material for MkDocs EOL 2026-11-05; successor = Zensical | [squidfunk.github.io/mkdocs-material](https://squidfunk.github.io/mkdocs-material/) + [releases](https://github.com/squidfunk/mkdocs-material/releases) | 2026 | 9.7.7 | search result + ទំព័រផ្លូវការ | ⚠️ partially verified (ឃើញក្នុង search snippet + homepage; គួរពិនិត្យ migration ពេលអនាគត) |
| ១១ | Godot class docs (Area2D, RayCast2D, CharacterBody2D, Tween, PackedScene, AnimatedSprite2D, Marker2D, ParallaxBackground, AnimationPlayer, AudioStreamPlayer2D, @GDScript) | docs.godotengine.org/en/4.3/classes/... | docs 4.3 | 4.3 | HTTP 200 ទាំងអស់ (batch check) | ✅ verified |
| ១២ | Godot tutorials (gdscript_basics, 2d_movement, groups, vector_math, physics_introduction, instancing, exporting_for_web, troubleshooting, cutout_animation, audio_buses, 2d_transforms, mouse coords, static_typing) | docs.godotengine.org/en/4.3/... | docs 4.3 | 4.3 | HTTP 200 ទាំងអស់ | ✅ verified |
| ១៣ | `using_tweens.html` គ្មានក្នុង docs 4.3 | docs.godotengine.org | — | 4.3 | HTTP 404 → **មិនបានយោង** ជំនួសដោយ Tween class ref | ✅ verified (negative) |
| ១៤ | MIT អនុញ្ញាត fork/modify/redistribute ជាមួយ copyright notice | `LICENSE` (អានពេញ) | 2026 | — | អានអត្ថបទ license | ✅ verified |
| ១៥ | Assets license: អប់រមប៉ុណ្ណោះ ហាមពាណិជ្ជកម្ម/redistribution | `ASSETS_LICENSE.md` (អានពេញ) | 2026 | — | អានអត្ថបទ | ✅ verified |
| ១៦ | GitHub rename API (PATCH /repos/{owner}/{repo}) | [GitHub REST docs](https://docs.github.com/en/rest/repos/repos#update-a-repository) | — | — | ការអនុវត្តជោគជ័យ (មើលរបាយការណ៍ចុងក្រោយ) | ✅ verified by execution |

## ៦. ផែនទីប្រភព → ឯកសារ (Source-to-Documentation Mapping)

| ជំពូកឯកសារ | ឯកសារប្រភព | និមិត្តសញ្ញា/បន្ទាត់សំខាន់ៗ | បានសាកល្បង? |
| --- | --- | --- | --- |
| getting-started/* | `project.godot`, `main.tscn` | config keys, គ្មាន main scene | headless run ✅ |
| fundamentals/godot-concepts | ស្គ្រីបទាំង ៥ + scenes ទាំង ៦ | node types, groups, exports | parse checks ✅ |
| fundamentals/project-structure | git tree ពេញលេញ | — | tree API ✅ |
| architecture/overview | `main.tscn`, `player.tscn`, scenes ទាំងអស់ | node hierarchy, audio nodes | headless run ✅ |
| architecture/game-loop | `main.gd` | `_ready`, `spawn_new_round`, `_process` 214–232 | អានកូដ |
| lessons/player | `player.gd`, `player.tscn` | `_input` 108–117, `_draw` 152–187, `release_arrow` 190–242 | អានកូដ |
| lessons/arrow | `arrow.gd`, `arrow.tscn` | `_process` 39–75, `stick_arrow` 78–121, RayCast target 145 | អានកូដ |
| lessons/egg | `egg.gd`, `egg.tscn` | `take_damage` 71–106, SpriteFrames 4 frames | **execution** ✅ |
| lessons/levels | `main.gd` | seed 79–81, lanes 94, heights 99, tween 193–211 | អានកូដ + គណនា |
| tutorials/customize | ទាំងអស់ខាងលើ | ជំហាន ៣ និង ៦ ផ្អែកលើ bug ដែលផ្ទៀងផ្ទាត់ | **execution** ✅ (ជំហាន ៣) |
| reference/scripts | ស្គ្រីបទាំង ៥ | រាល់អថេរ/អនុគមន៍ | parse checks ✅ |
| reference/config | `project.godot`, `.gitattributes`, scenes | រាល់ keys | អានឯកសារ |
| troubleshooting | ការរកឃើញសវនកម្មទាំងអស់ | — | ផ្ទៀងផ្ទាត់តាមករណី |

## ៧. សន្ទស្សន៍ Assets (Asset Index)

| ឯកសារក្នុង docs | ប្រភពដើម | License | ការកែប្រួល | គោលបំណក |
| --- | --- | --- | --- | --- |
| `docs/assets/icon.png` | `Icon.png` (repo, © KernelVoltage) | MIT (code icon) | បង្រួម 1024→128px (PIL, LANCZOS) | logo/favicon នៃគេហទំព័រឯកសារ |
| `docs/assets/screenshot-gameplay-1.jpg` | `Image1.png` (repo — រូបថតអេក្រង់ហ្គេមដើម) | © KernelVoltage — ប្រើអប់រមតាមគោលការណ៍ fair use/educational | បង្រួម 1360→1280px, PNG→JPG q82 | បង្ហាញ gameplay ក្នុង index |
| `docs/assets/screenshot-gameplay-2.jpg` | `Image2.png` (repo) | ដូចខាងលើ | ដូចខាងលើ | ដូចខាងលើ |
| Mermaid diagrams (៨) | — បង្កើតដើមដោយអ្នករៀបចំឯកសារ | MIT (ជាផ្នែកនៃ docs) | បង្កើតពីការអានកូដពិត | architecture/flow/sequence |

**គ្មានរូបភាព stock, គ្មាន AI-generated artwork, គ្មាន hotlinking ភាគីទីបី។**
រូបថតអេក្រង់ទាំងពីរជាទ្រព្យរបស់គម្រោងដើមផ្ទាល់ (មិនមែន asset ក្នុង
`Free_Asset_Pack` ដែល license ហាម redistribution) — ការប្រើប្រាស់ក្នុងឯកសារ
អប់រមមិនមែនពាណិជ្ជកម្មស្របតាមស្មារតីនៃ `ASSETS_LICENSE.md`
(អនុញ្ញាត educational use)។ Attribution រក្សាទុកក្នុង README និងទំព័រនេះ។

## ៨. សវនកម្មសុវត្ថិភាព (Security Audit)

| ការពិនិត្យ | លទ្ធផល |
| --- | --- |
| Token ក្នុងសំណើ chat | ⚠️ អ្នកប្រើបាន paste GitHub PAT ក្នុង chat — **ណែនាំឱ្យ revoke/rotate ភ្លាម** បន្ទាប់ពីការងារចប់។ Token មិនត្រូវបានសរសេរក្នុងឯកសារ repo/commit/log ណាទេ (ប្រើតាម `.git-credentials` ក្រៅ workspace + environment variables) |
| Secrets ក្នុង repo ដើម | ✅ គ្មាន — ពិនិត្យឯកសារ config ទាំងអស់; គ្មាន credential files |
| Secrets ក្នុង diff ដែល commit | ✅ ស្កេនរាល់ pattern credential ដែលស្គាល់ (token prefixes របស់ GitHub/GitLab/Slack/AWS, password, api_key, secret) មុន push — មើលរបាយការណ៍ចុងក្រោយ |
| `.gitignore` | ✅ មានស្រាប់ (Godot) + បន្ថែម `site/` (MkDocs output) |
| ឯកសារឯកជន/confidential | ✅ មិនមាន — repo ដើម public ទាំងស្រុង |
| Git author identity | ✅ `SeyhaLite <202538227+SeyhaLite@users.noreply.github.com>` (noreply ផ្លូវការរបស់ GitHub — មិនលាតត្រដាង email ផ្ទាល់) |

## ៩. ការសាកល្បងឯកសារ (Documentation Build Verification)

| ការសាកល្បង | លទ្ធផល |
| --- | --- |
| `pip install -r docs/requirements.txt` (Python 3.11 venv) | ✅ mkdocs 1.6.1 + mkdocs-material 9.7.7 ដំឡើងជោគជ័យ |
| `mkdocs build --strict` | ✅ ជោគជ័យ 0 warnings (ក្រោយពេលបង្កើតឯកសារគ្រប់គ្រាន់ — build ដំបូងចាប់បាន nav warning ពិតប្រាកដ បញ្ជាក់ថា strict mode ដំណើរការ) |
| Internal link/image check (script ផ្ទាល់ខ្លួន) | ✅ រាល់ relative links និងរូបភាពក្នុង docs/*.md មានឯកសារគោលដៅ |
| External URL check | ✅ URL យោងទាំងអស់ (Godot docs 4.3, RTD, Material, PyPI, GitHub, Google Fonts) = HTTP 200 ពិនិត្យ 2026-10-23 |
| Khmer Unicode purity check | ✅ ស្កេន codepoint រាល់ឯកសារ — រកឃើញ+កែ៖ អក្សរឡាតាំងលាយខ្មែរ «ដetect» ×៣, អក្សរចិន «合» ×១, អក្សរថៃ «ซ้ำ» ×១ និងកំហុសអក្សរសាស្ត្រខ្មែរជាច្រើន (បច្ចេកទេក→បច្ចេកទេស, ជំនួច→ជំនួស, បិដ→បិទ, បន្ថែន→បន្ថែម, ស្លាប→ឆ្លាស់ ×៦) |
| Mermaid diagram validation | ✅ ដ្យាក្រាមទាំង **១១/១១** parse ជោគជ័យដោយ mermaid v11 (node + jsdom harness) — flowchart ×៨, sequence ×២, stateDiagram ×១ |
| YAML validation | ✅ `mkdocs.yml` + `.readthedocs.yaml` parse ជោគជ័យដោយ mkdocs build ផ្ទាល់ |

## ១០. សំណួរនៅសល់ និងហានិភ័យ (Open Questions & Risks)

| # | ធាតុ | ហានិភ័យ/ផលប៉ះពាល់ | ការដោះស្រាយ |
| --- | --- | --- | --- |
| ១ | ឥរិយាបទ GUI ពិត (visual/audio feel) មិនបានសង្កេតផ្ទាល់ | ទាប — កូដច្បាស់លាស់ | អ្នកអានសាកល្បងផ្ទាល់; សម្គាល់ច្បាស់ក្នុងឯកសារ |
| ២ | Material for MkDocs EOL 2026-11-05 | មធ្យម (រយៈពេលវែង) | pinned versions នៅតែដំណើរការលើ RTD; ROADMAP មានគម្រោងពិនិត្យ Zensical |
| ៣ | RTD slug អាចខុសពី fallback `site_url` | ទាប | RTD ជំនួសដោយ `READTHEDOCS_CANONICAL_URL` ពេល build; CONTRIBUTING មានជំហានផ្ទៀងផ្ទាត់ |
| ៤ | ការស្វែងរក (search) ជាអក្សរខ្មែរមានដែនកំណត់ (Khmer គ្មានដកឃ្លា — tokenizer ពិបាក) | មធ្យម | ពាក្យបច្ចេកទេសអង់គ្លេសនៅក្នុងមាតិកាជួយ search; អាចពិចារណា RTD server-side search នៅពេលអនាគត |
| ៥ | upstream អាចផ្លាស់ប្តូរកូដ → លេខបន្ទាត់ក្នុងឯកសារខុស | មធ្យម | វិធីសាស្ត្រ sync ក្នុង CONTRIBUTING + commit SHA យោងក្នុងឯកសារនេះ |
