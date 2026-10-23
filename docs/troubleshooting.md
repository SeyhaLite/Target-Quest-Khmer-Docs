# ដោះស្រាយបញ្ហា

បញ្ហាទាំងអស់ខាងក្រោមត្រូវបាន **ផ្ទៀងផ្ទាត់ពីកូដពិត** ឬពីការដំណើរការ
Godot 4.3 headless ដោយអ្នករៀបចំឯកសារ (2026-10-23) លើកលែងតែបញ្ជាក់ថាជាការវិភាគ។

## បញ្ហាក្នុងគម្រោង

### ១. ចុច F5 ហើយ Godot សួរអំពី main scene / មិនដំណើរការ

**មូលហេតុ (ផ្ទៀងផ្ទាត់)៖** `project.godot` គ្មាន key `run/main_scene`។

**ដំណោះស្រាយ៖**
- បើក `Scenes/main.tscn` (ចុចពីរដង) ហើយចុច **F6** (Run Current Scene), ឬ
- ចុច F5 → ពេល Godot សួរ → ជ្រើសរើស `main.tscn` ជា main scene (វានឹងថែរក្សាការកំណត់នេះ), ឬ
- Scene menu → **Set as Main Scene** លើ `main.tscn`

### ២. បើក `Scenes/monster.tscn` ហើយឃើញកំហុស missing resources

**មូលហេតុ (ផ្ទៀងផ្ទាត់)៖** scene នេះយោងរូបភាព ១១ ក្នុង `Free_Asset_Pack/NPC/`
ដែល **មិនមានក្នុង repository**។ វាជា scene សំណល់ដែលមិនត្រូវបានប្រើ។

**ដំណោះស្រាយ៖** កុំបើក/ប្រើវា។ វាមិនប៉ះពាល់ដល់ហ្គេមទេ
(ផ្ទៀងផ្ទាត់៖ គ្មានឯកសារណា instance វា; ការដំណើរការ `main.tscn` headless ៣០០ frames
ដោយ Godot 4.3 មិនបង្កើតកំហុសអ្វីទេ)។

### ៣. សុតតែងតែបែកនៅព្រួញទី ៣ ទោះបីកម្រិតខ្ពស់

**មូលហេតុ (ផ្ទៀងផ្ទាត់ដោយការដំណើរការ)៖** `egg.gd` បន្ទាត់ ៩២ ប្រើ
`current_hits >= 3` hard-coded ជំនួស `max_hits`។ ការសាកល្បង headless
ជាមួយ `set_egg_health(5)` បង្ហាញ `is_destroyed=true` នៅការវាយទី ៣។

**ដំណោះស្រាយ៖** មើល [មេរៀនបង្រៀន ជំហានទី ៣](tutorials/customize.md) —
ការកែត្រូវបានសាកល្បងហើយថាដំណើរការ (សុខភាព ៥ → បែកនៅព្រួញទី ៥)។

### ៤. ព្រួញខ្ទប់នឹងតួអង្គខ្លួនឯង (បាញ់ចុះក្រោមជិតៗ)

**មូលហេតុ (ផ្ទៀងផ្ទាត់ពីកូដ; ផលជាក់ស្តែងជាការវិភាគ)៖** `arrow.gd` ព្យាយាម
ដាក់តួអង្គជា raycast exception តាមក្រុម `"Player"` ប៉ុន្តែ **គ្មាន node ណា
ចូលក្រុមនោះទេ** ដូច្នេះ exception មិនកើតឡើង។

**ដំណោះស្រាយ៖** មើល [មេរៀនបង្រៀន ជំហានទី ៦](tutorials/customize.md) —
បន្ថែម `add_to_group("Player")` ក្នុង `player.gd`។

### ៥. បាត់សំឡេងពេលព្រួញប៉ះវត្ថុ

**ការវិភាគពីកូដ (មិនបានសាកល្បងផ្ទាល់)៖** `stick_arrow()` លេងសំឡេងតែពេល
collider **មាន node កូន** ឈ្មោះ `BaseAudio`, `GrassAudio` ឬ `HitAudio`។
បើអ្នកបង្កើតវេទិកាផ្ទាល់ខ្លួនដោយគ្មាន node ទាំងនេះ → គ្មានសំឡេងទេ។
នេះជា convention មិនមែន interface ផ្លូវការ។

### ៦. ចំណុចទាយគន្លងមិនត្រូវនឹងគន្លងព្រួញ

**មូលហេតុដែលអាចកើតមាន (ផ្ទៀងផ្ទាត់ពីកូដ)៖** អ្នកបានកែតម្លៃ `1200.0` តែ
**មួយ** ក្នុងចំណោមពីរកន្លែងក្នុង `player.gd` (បន្ទាត់ ១៦៧ សម្រាប់ការទាយ,
បន្ទាត់ ២២៣ សម្រាប់ការបាញ់ពិត)។ ត្រូវកែទាំងពីរឱ្យដូចគ្នា។

## បញ្ហាបរិយាកាស/ឧបករណ៍

### ៧. "Cannot open project" ឬ warning អំពី version ពេលបើកដោយ Godot ថ្មី

គម្រោងបង្កើតដោយ Godot **4.3**។ Godot 4.7.x អាចបើកបាន ប៉ុន្តែអាចធ្វើ
conversion ឯកសារមួយចំនួន។ ដំណោះស្រាយ៖ ប្រើ Godot 4.3-stable ពី
[Download Archive](https://godotengine.org/download/archive/) សម្រាប់ភាពជាក់លាក់
ឬ commit ការផ្លាស់ប្តូរដែល editor ធ្វើដោយចេតនា (ក្នុង branch ផ្ទាល់ខ្លួន)។
**កុំ** ប្រើ Godot 3.x។

### ៨. អក្សរខ្មែរមិនបង្ហាញត្រឹមត្រូវក្នុងគេហទំព័រឯកសារ

គេហទំព័រនេះផ្ទុកពុម្ពអក្សរខ្មែរ (Kantumruy Pro, Noto Sans Khmer) ពី Google Fonts
តាម `docs/stylesheets/extra.css`។ បើអ្នកឃើញការ៉េទទេ (□)៖
- ពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត (fonts ផ្ទុកពី CDN)
- សម្រាប់ការ build ក្នុងម៉ាស៊ីន៖ បើក `mkdocs serve` រួច hard-refresh (Ctrl+Shift+R)

### ៩. `mkdocs serve` បរាជ័យ / រក mkdocs មិនឃើញ

```bash
# ត្រូវការ Python 3.8+ (mkdocs-material 9.7.7 requires_python >=3.8)
python3 --version
pip install -r docs/requirements.txt
mkdocs serve   # ឬ: python3 -m mkdocs serve
```

### ១០. ការ export ហ្គេមទៅ Web/Windows

គម្រោងប្រើ `gl_compatibility` ដូច្នេះ web export អាចធ្វើបាន ប៉ុន្តែ
**មិនមាន** export preset ក្នុង repository ទេ (ផ្ទៀងផ្ទាត់ — គ្មាន `export_presets.cfg`;
ឯកសារនេះត្រូវបាន ignore ក្នុង `.gitignore` ជាស្តង់ដារ)។ អ្នកត្រូវបង្កើត preset
ផ្ទាល់ខ្លួនតាម [ឯកសារ export ផ្លូវការ](https://docs.godotengine.org/en/4.3/tutorials/export/exporting_for_web.html)
ហើយទាញយក Export Templates ពី Godot។

## កន្លែងសុំជំនួយបន្ថែម

- បញ្ហាអំពី **ឯកសារខ្មែរនេះ** → បើក issue ក្នុង
  [SeyhaLite/Target-Quest-Khmer-Docs](https://github.com/SeyhaLite/Target-Quest-Khmer-Docs/issues)
- បញ្ហាអំពី **ហ្គេមដើម** → គម្រោងដើមមិនមាន issue tracker សកម្មទេ (0 open issues
  ពេលសវនកម្ម); អ្នកអាច fork ហើយកែដូច [មេរៀនបង្រៀន](tutorials/customize.md) ណែនាំ
- បញ្ហា Godot ទូទៅ → [Troubleshooting ផ្លូវការ](https://docs.godotengine.org/en/stable/tutorials/troubleshooting.html)
  និង [Godot Forum](https://forum.godotengine.org/)
