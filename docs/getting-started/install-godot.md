# ដំឡើង Godot Engine

មេរៀននេះបង្ហាញរបៀបដំឡើង Godot Engine និងទាញយកគម្រោង Target Quest
ដើម្បីបើកវានៅលើកុំព្យូទ័ររបស់អ្នក។

## តម្រូវការប្រព័ន្ធ

| ធាតុ | តម្រូវការ |
| --- | --- |
| ប្រព័ន្ធប្រតិបត្តិការ | Windows, macOS ឬ Linux (Godot គាំទ្រទាំងបី) |
| ក្រាហ្វិក | OpenGL 3.3 / OpenGL ES 3.0 ឡើងទៅ (គម្រោងប្រើ renderer `gl_compatibility`) |
| អង្គចងចាំ | ២ GB គឺគ្រប់គ្រាន់ (Godot មិនធ្ងន់) |
| Python | **មិនត្រូវការ** សម្រាប់ហ្គេម (ត្រូវការតែពេល build ឯកសារ MkDocs ប៉ុណ្ណោះ) |

!!! info "ហេតុអ្វីមិនត្រូវការ Vulkan?"
    គម្រោងនេះកំណត់ `renderer/rendering_method="gl_compatibility"` ក្នុង `project.godot`
    ដូច្នេះវាដំណើរការលើម៉ាស៊ីនចាស់ ឬកុំព្យូទ័រគ្មានក្រាហ្វិកខ្ពស់បាន។
    តម្រូវការ OpenGL 3.3 ជាតម្រូវការអប្បបរមាផ្លូវការរបស់ Godot 4
    (ប្រភព៖ [godotengine.org/download](https://godotengine.org/download/windows/))។

## ជំហានទី ១ — ទាញយក Godot

!!! important "ជ្រើសរើស version"
    គម្រោងនេះបង្កើតឡើងដោយ **Godot 4.3** (`config/features=PackedStringArray("4.3", "GL Compatibility")`
    ក្នុង `project.godot`)។

    - **ល្អបំផុតសម្រាប់ការសិក្សា៖** ប្រើ Godot **4.3** ដើម្បីឱ្យដូចគ្នាទាំងស្រុងនឹងឯកសារនេះ។
      ទាញយកពី [Download Archive](https://godotengine.org/download/archive/) → រក `4.3-stable`។
    - Version stable ថ្មីបំផុត (ពេលសរសេរឯកសារនេះ ថ្ងៃ 2026-10-23) គឺ **4.7.2**។
      Godot 4.x អាចបើកគម្រោង 4.3 បាន ប៉ុន្តែ editor នឹងធ្វើ **upgrade/convert** ឯកសារគម្រោង
      (ជាពិសេស `.godot/` cache និង format មួយចំនួន)។ បើអ្នកប្រើ version ថ្មីជាង
      សូម **កុំ commit** ការផ្លាស់ប្តូរដែល editor ធ្វើដោយស្វ័យប្រវត្តិ ប្រសិនបើអ្នកចង់រក្សា
      compatibility ជាមួយ 4.3។
    - **កុំ** ប្រើ Godot 3.x — គម្រោងនេះមិនដំណើរការទេ។
    - ជ្រើសរើស version **ស្តង់ដារ** (មិនមែន ".NET") ព្រោះគម្រោងប្រើ GDScript សុទ្ធ។

Godot មិនត្រូវការការដំឡើង (installer) ទេ — វាជាឯកសារតែមួយ៖

1. ទៅ [godotengine.org/download/archive](https://godotengine.org/download/archive/)
2. ជ្រើសរើស `4.3-stable` (ឬ version 4.x ដែលអ្នកចង់ប្រើ)
3. ទាញយកឯកសារសម្រាប់ប្រព័ន្ធរបស់អ្នក (ឧទាហរណ៍ `Godot_v4.3-stable_win64.exe.zip` សម្រាប់ Windows)
4. **ពន្លា (extract)** ឯកសារ zip ហើយដំណើរការ executable — បញ្ចប់!

## ជំហានទី ២ — ទាញយកគម្រោង Target Quest

មានពីររបៀប៖

=== "Git (ណែនាំ)"

    ```bash
    # ទាញយក fork ដែលមានឯកសារខ្មែរ
    git clone https://github.com/SeyhaLite/Target-Quest-Khmer-Docs.git

    # ឬទាញយកពីគម្រោងដើម (upstream)
    git clone https://github.com/KernelVoltage/Target-Quest.git
    ```

    របៀបនេះងាយស្រួលសម្រាប់ការ update ពេលក្រោយ (`git pull`)។

=== "ZIP"

    1. ទៅ <https://github.com/SeyhaLite/Target-Quest-Khmer-Docs>
    2. ចុចប៊ូតុង **Code** (ពណ៌បៃតង) → **Download ZIP**
    3. ពន្លាឯកសារ zip នៅកន្លែងដែលអ្នកចង់ទុក

## ជំហានទី ៣ — បើកគម្រោងក្នុង Godot

1. ដំណើរការ Godot → ផ្ទាំង **Project Manager** នឹងលេចឡើង
2. ចុច **Import** (នាំចូល)
3. រកឯកសារ **`project.godot`** នៅក្នុង folder គម្រោង ហើយជ្រើសរើសវា
4. ចុច **Import & Edit**

ពេលបើកលើកដំបូង Godot នឹង import assets (រូបភាព សំឡេង) ដោយស្វ្យប្រវត្តិ —
វាបង្កើត folder `.godot/` (cache) ដែលមានក្នុង `.gitignore` រួចហើយ ដូច្នេះកុំ commit វា។

!!! warning "បើមាន warning អំពី version"
    បើអ្នកបើកដោយ Godot 4.7+ អ្នកអាចឃើញសារអំពីការ upgrade គម្រោងពី 4.3។
    នេះជាធម្មតា។ សម្រាប់ការសិក្សាតាមឯកសារនេះ យើងណែនាំ Godot 4.3 ដើម្បីភាពជាក់លាក់។

## ការផ្ទៀងផ្ទាត់

បើអ្នកឃើញផ្ទាំង editor របស់ Godot ជាមួយ៖

- ឈ្មោះគម្រោង **"Target Quest"** នៅខាងលើ
- Scene dock បង្ហាញឯកសារក្នុង `Scenes/` (`main.tscn`, `player.tscn`, `arrow.tscn`, `egg.tscn`, `wooden_base.tscn`)
- FileSystem dock បង្ហាញ `Script/`, `Scenes/`, `Free_Asset_Pack/`

នោះមានន័យថាការដំឡើងជោគជ័យ! 🎉

---

**បន្ទាប់៖** [ដំណើរការ និងលេងហ្គេម →](run-and-play.md)
