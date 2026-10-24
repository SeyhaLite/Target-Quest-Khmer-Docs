# វចនានុក្រម

តារាងនេះកំណត់ពាក្យបច្ចេកទេសដែលប្រើ **ស្របគ្នា** ពេញឯកសារទាំងមូល។
គោលការណ៍៖ ពាក្យខ្មែរមុន អង់គ្លេសក្នុងវង់ក្រចក; ឈ្មោះកូដ (identifiers) មិនបកប្រែទេ។

## គោលគំនិត Godot

| ពាក្យខ្មែរ | អង់គ្លេស | និយមន័យក្នុងបរិបទគម្រោង | ប្រើនៅ |
| --- | --- | --- | --- |
| ថ្នាំង | Node | ឯកតាមូលដ្ឋានក្នុង Godot (រូបភាព រូបវិទ្យា សំឡេង...) | គ្រប់ទីកន្លែង |
| ឆាក | Scene | ដើមឈើ node ដែលរក្សាទុកជា `.tscn` | `Scenes/` |
| ដើមឈើឆាក | Scene tree | រចនាសម្ព័ន្ធ parent-child នៃ node ទាំងអស់ពេលដំណើរការ | architecture |
| ស្គ្រីប | Script | ឯកសារកូដ GDScript (`.gd`) ភ្ជាប់នឹង node | `Script/` |
| អង់ស៊ីន | Engine | កម្មវិធីមូលដ្ឋានដែលដំណើរការហ្គេម (Godot Engine) | ទូទៅ |
| បង្កើតច្បាប់ចម្លង | Instantiate | បង្កើត node ថ្មីពី PackedScene (`.instantiate()`) | main.gd, player.gd |
| ក្រុម | Group | ស្លាកសម្រាប់ node — ស្វែងរកជាបាច់ (`"Arrows"`, `"eggs"`) | គ្រប់ស្គ្រីប |
| សញ្ញា | Signal | យន្តការ event របស់ Godot (គម្រោងនេះប្រើតិចតួចណាស់) | godot-concepts |
| ប្តូរមេ | Reparent | ផ្លាស់ node ពី parent មួយទៅមួយទៀត (`remove_child` + `add_child`) | arrow.gd |
| ការផ្លាស់ប្តូរ | Transform | ទីតាំង + ការបង្វិល + មាត្រដ្ឋាន (`global_transform`) | arrow.gd |
| លំដាប់គូរ (Z) | Z-index | លំដាប់គូរ — លេខធំគូរលើលេខតូច | arrow.gd (−1) |

## រូបវិទ្យា និងគណិតវិទ្យា

| ពាក្យខ្មែរ | អង់គ្លេស | និយមន័យ | ប្រើនៅ |
| --- | --- | --- | --- |
| ទំនាញ (ផែនដី) | Gravity | កម្លាំងទាញចុះក្រោម — ៩៨០ px/s² ក្នុងគម្រោងនេះ | arrow.gd, egg.gd, player.gd |
| វ៉ិចទ័រល្បឿន | Velocity | ល្បឿន + ទិសដៅ (`Vector2`) | arrow.gd |
| ល្បឿន | Speed | តម្លៃស្កាលែនៃល្បឿន (px/s) — `1200×power` | player.gd |
| វ៉ិចទ័រ | Vector | ទំហំ + ទិស (`Vector2(x, y)`) | គ្រប់ទីកន្លែង |
| ធ្វើឱ្យមានប្រវែង ១ | Normalize | បំប្លែងវ៉ិចទ័រឱ្យប្រវែង ១ ដោយរក្សាទិស (`.normalized()`) | player.gd, arrow.gd |
| គន្លងវត្ថុបាញ់ (គន្លងព្រួញ) | Projectile / trajectory | ផ្លូវកោងរបស់វត្ថុក្រោមទំនាញ | arrow.gd, player.gd |
| អាំងតេក្រាលអយលែរ | Euler integration | ការគណនាចលនាតាមជំហាន `v += a·dt; p += v·dt` | arrow.gd |
| ការប៉ះទង្គិច | Collision | ការបុកគ្នារវាងវត្ថុ | រូបវិទ្យាទាំងអស់ |
| រស្មីពិនិត្យ | RayCast | បន្ទាត់ត្រង់ស្វែងរកការប៉ះមុនគេ (`RayCast2D`, ១៤៥ px) | arrow.gd |
| ចន្លោះពេលរវាងហ្វ្រេម | Delta (delta time) | រយៈពេលរវាង frame ពីរ (វិនាទី) | `_process(delta)` |

## ការបង្កើតកម្រិត

| ពាក្យខ្មែរ | អង់គ្លេស | និយមន័យ | ប្រើនៅ |
| --- | --- | --- | --- |
| ការបង្កើតកម្រិតស្វ័យប្រវត្តិ | Procedural level generation | បង្កើត layout តាមក្បួនដោះស្រាយ ជំនួសរចនាដៃ | main.gd (កម្រិត ៥+) |
| គ្រាប់ពូជ (ចៃដន្យ) | Seed | តម្លៃចាប់ផ្តើម RNG — seed ដូចគ្នា = លទ្ធផលដូចគ្នា | main.gd បន្ទាត់ ៧៩–៨១ |
| អាចទាយបាន | Deterministic | លទ្ធផលដូចគ្នាជានិច្ចសម្រាប់ input ដូចគ្នា | កម្រិត procedural |
| ច្រក | Lane | តម្លៃ x ថេរដែលគោលដៅអាចនៅ (`[320,520,720,920]`) | main.gd |
| ច្របល់ | Shuffle | រៀបលំដាប់ដោយចៃដន្យ | main.gd |
| កំណត់ដែន | Clamp | បង្ខំតម្លៃក្នុងចន្លោះ (`clampi(2+n, 2, 4)`) | main.gd, player.gd |
| វេទិកាឈើ | Wooden base/platform | StaticBody2D ដែលស៊ុតនៅលើ | wooden_base.tscn |
| ចលនាបន្តិចម្តងៗ | Tween | animation property តាមពេលវេលា (`TRANS_SINE`) | main.gd |

## តួអង្គ និងការលេង

| ពាក្យខ្មែរ | អង់គ្លេស | និយមន័យ | ប្រើនៅ |
| --- | --- | --- | --- |
| តួអង្គ | Player (character) | CharacterBody2D ដែលកាន់ធ្នូ | player.tscn |
| ធ្នូ | Bow | អាវុធរបស់តួអង្គ | Bow.png, player.tscn |
| ព្រួញ | Arrow | គ្រាប់ដែលបាញ់ចេញ (Area2D) | arrow.tscn |
| ស៊ុត | Egg | គោលដៅដែលត្រូវកម្ទេច (CharacterBody2D) — សរសេរ «ស៊ុត» ស្របតាមអក្ខរាវិរុទ្ធខ្មែរ | egg.tscn |
| គោលដៅ | Target | វត្ថុដែលត្រូវបាញ់ | ទូទៅ |
| ការទាញ | Drag / charge | ការទាញកណ្តុរដើម្បីផ្ទុកកម្លាំង | player.gd |
| កម្លាំង | Power (power factor) | ភាគរយកម្លាំងបាញ់ ០.១–១.០ | player.gd |
| ការខ្ទប់ | Stick / embed | ព្រួញជាប់ក្នុងវត្ថុដែលបុក | arrow.gd `stick_arrow()` |
| ការខូចខាត | Damage | ការបាត់បង់សុខភាព (`take_damage()`) | egg.gd |
| កម្រិត | Level | ដំណាក់កាលនៃហ្គេម (`current_level`) | main.gd |
| យន្តការទាញបាញ់ | Slingshot | យន្តការបាញ់ផ្ទុយទិសទាញ | player.gd |

## ការអភិវឌ្ឍ និង Git/GitHub

| ពាក្យខ្មែរ | អង់គ្លេស | និយមន័យ |
| --- | --- | --- |
| ឃ្លាំងកូដ | Repository | កន្លែងរក្សាទុកគម្រោងក្នុង Git |
| ការចម្លង fork | Fork | ច្បាប់ចម្លង repository របស់អ្នកផ្សេងក្នុងគណនីយើង |
| គម្រោងដើម | Upstream | repository ដើមដែល fork ចេញមក |
| សាខា | Branch | ខ្សែការងារដាច់ដោយឡែកក្នុង Git (`main`, `docs/khmer`...) |
| commit | Commit | ការរក្សាទុកការផ្លាស់ប្តូរជាមួយសារពិពណ៌នា |
| សំណើបញ្ចូល | Pull Request (PR) | សំណើបញ្ចូលការផ្លាស់ប្តូរពី branch/fork |
| ការធ្វើសមកាលកម្ម | Sync | ការទាញយកបច្ចុប្បន្នភាពពី upstream |
| ឯកសារ | Documentation | ការណែនាំ/ការពន្យល់អំពីគម្រោង |
| ការសាងសង់ | Build | ការបំប្លែងឯកសារ Markdown ទៅជាគេហទំព័រ HTML |
| ការដាក់ពង្រាយ | Deploy | ការបោះពុម្ពគេហទំព័រទៅម៉ាស៊ីនមេ (Read the Docs) |
| អាជ្ញាប័ណ្ណ | License | លក្ខខណ្ឌការប្រើប្រាស់/ចែកចាយកូដ |
| អថេរ export | @export variable | អថេរ GDScript ដែលកែបានតាម Inspector |

## អក្សរកាត់

| អក្សរកាត់ | ពេញ | ខ្មែរ |
| --- | --- | --- |
| RNG | Random Number Generator | អ្នកបង្កើតលេខចៃដន្យ |
| HUD | Heads-Up Display | ផ្ទាំងព័ត៌មានលើអេក្រង់ហ្គេម |
| SFX | Sound Effects | សំឡេងឥទ្ធិពល |
| UI | User Interface | ចំណុចប្រទាក់អ្នកប្រើ |
| RTD | Read the Docs | សេវាកម្មបង្ហោះឯកសារ |
| FOSS | Free and Open Source Software | កម្មវិធីកូដបើកទូលាយ |
| PR | Pull Request | សំណើបញ្ចូល |

!!! tip "ចំណាំអំពីការបកប្រែ"
    ឈ្មោះកូដទាំងអស់ (`spawn_new_round`, `take_damage`, `max_hits`...) ប្រភេទ node
    (`CharacterBody2D`...) និងឈ្មោះឯកសារ (`main.gd`...) **មិនត្រូវបានបកប្រែទេ** —
    ពួកវាត្រូវតែរក្សាជាអក្សរអង់គ្លេសដើម ព្រោះកូដត្រូវតែដូចគ្នាទាំងស្រុងនៅគ្រប់ភាសា។
