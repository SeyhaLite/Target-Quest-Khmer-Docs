<p align="center">
  <img src="Icon.png" width="120" alt="Target Quest Icon">
</p>

# Target Quest — ឯកសារសិក្សាភាសាខ្មែរ (Khmer Learning Documentation)

**Target Quest** គឺជាហ្គេមបាញ់ព្រួញ 2D បែបរូបវិទ្យា សាងសង់ដោយ **Godot Engine 4.3**
ជាភាសា **GDScript** ដោយ [KernelVoltage](https://github.com/KernelVoltage/Target-Quest)។

Repository នេះគឺជា **fork មិនផ្លូវការ** ដែលរក្សាកូដដើមទាំងស្រុង ហើយបន្ថែម
**ឯកសារសិក្សាភាសាខ្មែរ** ពេញលេញ — ការពន្យល់កូដម៉ាស៊ីនបង្កើតកម្រិតស្វ័យប្រវត្តិ
រូបវិទ្យាព្រួញ និងមេរៀនបង្រៀនជាក់ស្តែង។

> **Unofficial notice:** គម្រោងឯកសារខ្មែរនេះរៀបចំឡើងដោយ
> [SeyhaLite](https://github.com/SeyhaLite) សម្រាប់គោលបំណងអប់រម។
> វាមិនមែនជាគម្រោងផ្លូវការរបស់ KernelVoltage ទេ។
> This repository is an independent, unofficial Khmer-language learning
> resource. It is not endorsed by or affiliated with the original author.

## គេហទំព័រឯកសារ (Documentation Website)

📖 **អានឯកសារអនឡាញ៖ <https://target-quest-khmer-docs.readthedocs.io/>**

បង្ហោះលើ [Read the Docs](https://app.readthedocs.org/) — ផ្ទៀងផ្ទាត់ដំណើរការជាក់ស្តែងថ្ងៃ 2026-10-23 (HTTP 200, build ស្វ័យប្រវត្តិរាល់ push ទៅ `main`)។

## មាតិកាសិក្សា (Learning Topics)

- **ចាប់ផ្តើម** — ដំឡើង Godot, ដំណើរការហ្គេម, របៀបលេង
- **មូលដ្ឋានគ្រឹះ** — គោលគំនិត Godot (Node, Scene, Groups, Tween...) និងរចនាសម្ព័ន្ធគម្រោង
- **ស្ថាបត្យកម្ម** — scene tree ពេញលេញ, លំហូរទិន្នន័យ, វដ្តកម្រិត
- **មេរៀនកូដ** — `player.gd` (ធ្នូ), `arrow.gd` (រូបវិទ្យាព្រួញ), `egg.gd` (ប្រព័ន្ធខូចខាត), `main.gd` (procedural generation)
- **អនុវត្ត** — ៧ លំហាត់កែប្រែហ្គេម (រួមទាំងការកែ bug ពិតដែលរកឃើញពីសវនកម្ម)
- **ឯកសារយោង** — API ស្គ្រីបទាំងអស់, configuration, glossary ខ្មែរ⇄អង់គ្លេស

ឯកសារទាំងអស់ផ្ទៀងផ្ទាត់ពីកូដពិតនៅ commit `a10b33c` (មើល
[research/repository-audit.md](research/repository-audit.md))។

## ដំណើរការឯកសារក្នុងម៉ាស៊ីន (Local Docs Build)

```bash
# ត្រូវការ Python 3.8+
pip install -r docs/requirements.txt

# មើលឯកសារនៅ http://127.0.0.1:8000 (auto-reload)
mkdocs serve

# ឬ build ជា HTML ស្ថិតិក្នុង folder site/
mkdocs build
```

## ដំណើរការហ្គេម (Run the Game)

1. ទាញយក [Godot Engine 4.3](https://godotengine.org/download/archive/) (Standard — មិនមែន .NET)
2. Import `project.godot` ក្នុង Godot Project Manager
3. បើក `Scenes/main.tscn` ហើយចុច **F6**

លម្អិត៖ [docs/getting-started/install-godot.md](docs/getting-started/install-godot.md)

## រចនាសម្ព័ន្ធ Repository

```
├── Script/, Scenes/, Free_Asset_Pack/   ← កូដ+assets ហ្គេមដើម (មិនបានកែប្រែ)
├── project.godot, LICENSE, ASSETS_LICENSE.md
├── docs/                                ← ★ ឯកសារសិក្សាភាសាខ្មែរ
├── mkdocs.yml                           ← កំណត់រចនាសម្ព័ន្ធ MkDocs Material
├── .readthedocs.yaml                    ← កំណត់រចនាសម្ព័ន្ធ Read the Docs
└── CONTRIBUTING.md                      ← ការចូលរួម + ការដាក់ពង្រាយ + upstream sync
```

## ការចូលរួម (Contributing)

ការកែសម្រួលឯកសារខ្មែរ សូមអាន [CONTRIBUTING.md](CONTRIBUTING.md) —
រួមមានក្បួនពាក្យបច្ចេកទេស (ប្រើ [docs/glossary.md](docs/glossary.md))
របៀប build និងរបៀប sync ជាមួយ upstream។

## License និងការ attribution

- **កូដហ្គេម (Script/, Scenes/, project.godot):** [MIT License](LICENSE) © 2026 KernelVoltage
- **រូបភាព/សំឡេង (Free_Asset_Pack/, Icon.png, Image1.png, Image2.png):**
  អប់រម និងមិនមែនពាណិជ្ជកម្មប៉ុណ្ណោះ — [ASSETS_LICENSE.md](ASSETS_LICENSE.md)
- **ឯកសារខ្មែរ (docs/):** រៀបចំដោយ SeyhaLite ក្រោម MIT License
  (រក្សាការ attribution ទៅគម្រោងដើម)។ រូបថតអេក្រង់ក្នុង `docs/assets/`
  ដកស្រង់ពីគម្រោងដើមសម្រាប់គោលបំណងអប់រម។

**ហ្គេមដើម៖** [KernelVoltage/Target-Quest](https://github.com/KernelVoltage/Target-Quest)
— Developed by **KernelVoltage**

## របាយការណ៍បញ្ហា (Issues)

- បញ្ហាអំពីឯកសារខ្មែរ → [Issues នៃ repo នេះ](https://github.com/SeyhaLite/Target-Quest-Khmer-Docs/issues)
- បញ្ហាអំពីកូដហ្គេម → fork ហើយកែ ឬទាក់ទងអ្នកបង្កើតដើម
