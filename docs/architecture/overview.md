# ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ

ទំព័រនេះបង្ហាញ **ស្ថាបត្យកម្មពេញលេញ** របស់ Target Quest — ពី scene tree
រហូតដល់លំហូរទិន្នន័យរវាងស្គ្រីប។ រាល់ធាតុទាំងអស់ផ្ទៀងផ្ទាត់ពីឯកសារពិតនៅ commit `a10b33c`។

## Scene tree ពេលលេង (Runtime)

រូបភាពខាងក្រោមបង្ហាញដើមឈើ node ពេលហ្គេមដំណើរការកម្រិតដែលមានវេទិកា៖

```mermaid
flowchart TD
    MAIN["Main (Node2D) — main.gd"]:::dvroot
    MAIN --> PB["ParallaxBackground"]
    PB --> SKYL["SkyLayer (ParallaxLayer)"]
    SKYL --> SKYS["BackgroundSky (Sprite2D)"]
    PB --> MTNL["MountainLayer (ParallaxLayer)"]
    MTNL --> MTNS["BackgroundMountain (Sprite2D)"]
    MAIN --> GND["StaticBody2D — ដី"]
    GND --> GG["GroundGrass (Sprite2D)"]
    GND --> GC["CollisionShape2D — RectangleShape2D 1899×93"]
    GND --> GA["GrassAudio (AudioStreamPlayer2D)"]
    MAIN --> PL["Player (CharacterBody2D · scale 0.2) — player.gd<br/>instance នៃ player.tscn"]:::dvscene
    PL --> BODY["Body (Node2D)"]
    PL --> PLC["CollisionShape2D — CapsuleShape2D"]
    PL --> ANIM["AnimationPlayer — idle · shoot"]
    PL --> TLINE["TrajectoryLine (Line2D) — មិនប្រើក្នុងកូដ"]:::dvunused
    PL --> SA["ShootAudio (AudioStreamPlayer2D)"]
    BODY --> TORSO["Torso (Sprite2D)"]
    BODY --> LUL["LeftUpperLegs (Sprite2D)"]
    BODY --> RUL["RightUpperLeg (Sprite2D)"]
    TORSO --> HEAD["Head (Sprite2D)"]
    TORSO --> RUA["RightUperArm (Sprite2D)"]
    TORSO --> LARM["LeftArm (Sprite2D)"]
    RUA --> RLA["RightLowerArm (Sprite2D)"]
    RLA --> RHAND["RightHand (Sprite2D)"]
    RHAND --> BHP["BowHoldPosition (Marker2D)"]
    BHP --> BOW["Bow (Sprite2D)"]
    LARM --> LLA["LeftLowerArm (Sprite2D)"]
    LLA --> LHAND["LeftHand (Sprite2D)"]
    LUL --> LLL["LeftLowerLeg (Sprite2D)"]
    LLL --> LSHOE["LeftShoe (Sprite2D)"]
    RUL --> RLL["RightLowerLeg (Sprite2D)"]
    RLL --> RSHOE["RightShoe (Sprite2D)"]
    MAIN -. "spawn ពេល runtime — wooden_base_scene" .-> WB["StaticBody2D — វេទិកាឈើ"]:::dvrt
    WB --> WBS["WoodenBase (Sprite2D)"]
    WB --> WBC["CollisionShape2D — RectangleShape2D 103×42"]
    WB --> WBA["BaseAudio (AudioStreamPlayer2D)"]
    WB --> EGG["Egg (CharacterBody2D · offset 0,-50) — egg.gd"]:::dvrt
    EGG --> EGAS["AnimatedSprite2D — damage 4 frames"]
    EGG --> EGC["CollisionShape2D — CapsuleShape2D radius 46 height 138"]
    EGG --> EHA["HitAudio (AudioStreamPlayer2D)"]
    BHP -. "spawn ពេលទាញ — arrow_scene" .-> ARW["Arrow (Area2D) — arrow.gd<br/>reparent: ដៃ → Main → collider"]:::dvrt
    ARW --> ARS["Sprite2D — រូបព្រួញ"]
    ARW --> ARCP["CollisionPolygon2D"]
    ARW --> ARR["RayCast2D — 145 px"]
    classDef dvroot stroke-width:4px;
    classDef dvscene stroke-width:2.5px;
    classDef dvrt stroke-dasharray:6 4;
    classDef dvunused stroke-dasharray:2 3;
```

**ការអានដ្យាក្រាម៖** បន្ទាត់ស្តារក្បាស់ = ថ្នាំងជាប់គ្នាក្នុង scene ពិត ·
បន្ទាត់ដាច់ៗ = ថ្នាំងដែលបង្កើត/spawn ពេល runtime · បន្ទាត់ដាច់ស្តើង = ថ្នាំងមានក្នុង scene
ប៉ុន្តែកូដមិនប្រើ។ ដ្យាករាមនេះមាន toolbar ពង្រីក/បង្រួម/សម្រប/ពេញអេក្រង់ —
ចុច «ពេញអេក្រង់» ដើម្បីពិនិត្យរចនាសម្ព័ន្ធទាំងមូល។

<details>
<summary>ការពិពណ៌នាជាអត្ថបទ (សម្រាប់ screen reader ឬការអានដោយគ្មានដ្យាក្រាម)</summary>

```text
Main (Node2D) — main.gd [main.tscn]
├─ ParallaxBackground
│  ├─ SkyLayer (ParallaxLayer) → BackgroundSky (Sprite2D)
│  └─ MountainLayer (ParallaxLayer) → BackgroundMountain (Sprite2D)
├─ StaticBody2D (ដី)
│  ├─ GroundGrass (Sprite2D)
│  ├─ CollisionShape2D (RectangleShape2D 1899×93)
│  └─ GrassAudio (AudioStreamPlayer2D)
├─ Player (CharacterBody2D, scale 0.2) — player.gd [instance player.tscn]
│  ├─ Body (Node2D)
│  │  ├─ Torso (Sprite2D)
│  │  │  ├─ Head (Sprite2D)
│  │  │  ├─ RightUperArm → RightLowerArm → RightHand
│  │  │  │   └─ BowHoldPosition (Marker2D) → Bow (Sprite2D)
│  │  │  └─ LeftArm → LeftLowerArm → LeftHand (Sprite2D)
│  │  ├─ LeftUpperLegs → LeftLowerLeg → LeftShoe (Sprite2D)
│  │  └─ RightUpperLeg → RightLowerLeg → RightShoe (Sprite2D)
│  ├─ CollisionShape2D (CapsuleShape2D)
│  ├─ AnimationPlayer (idle, shoot)
│  ├─ TrajectoryLine (Line2D — មិនប្រើក្នុងកូដ)
│  └─ ShootAudio (AudioStreamPlayer2D)
├─ [runtime] StaticBody2D — វេទិកាឈើ (wooden_base_scene)
│  ├─ WoodenBase (Sprite2D)
│  ├─ CollisionShape2D (RectangleShape2D 103×42)
│  ├─ BaseAudio (AudioStreamPlayer2D)
│  └─ Egg (CharacterBody2D, offset 0,-50) — egg.gd
│     ├─ AnimatedSprite2D (damage: 4 frames)
│     ├─ CollisionShape2D (CapsuleShape2D radius 46, height 138)
│     └─ HitAudio (AudioStreamPlayer2D)
└─ [runtime] Arrow (Area2D) — arrow.gd
   (កាន់នៅ BowHoldPosition ពេលទាញ → reparent ទៅ Main ពេលបាញ់
    → ទៅ collider ពេលខ្ទប់)
   ├─ Sprite2D (រូបព្រួញ)
   ├─ CollisionPolygon2D
   └─ RayCast2D (target_position 145,0)
```

</details>

!!! note "អ្វីដែលមានតែពេល runtime"
    - **វេទិកាឈើ និងស៊ុត** — `main.gd` instantiate ពួកវាតាមកម្រិត (`spawn_level_entities()`)
    - **ព្រួញ** — `player.gd` instantiate ពេលចាប់ផ្តើមទាញ (`start_charge()`) ម្តងមួយដើម
    - **ព្រួញដែលខ្ទប់** — reparent ខ្លួនឯងពី `Main` ទៅវត្ថុដែលវាបុក (`stick_arrow()`)

## តារាងទំនាក់ទំនងឯកសារ

| ឯកសារ scene | Script | ប្រភេទ root | ត្រូវបានប្រើដោយ |
| --- | --- | --- | --- |
| `main.tscn` | `main.gd` | `Node2D` | ជា scene ដែលអ្នកដំណើរការ (មិនមាន auto main scene) |
| `player.tscn` | `player.gd` | `CharacterBody2D` | instance នៅក្នុង `main.tscn` (តំណែង editor (168, 509) — ត្រូវបានកំណត់ឡើងវិញដោយ `main.gd`) |
| `arrow.tscn` | `arrow.gd` | `Area2D` | `player.gd` (តាម `@export arrow_scene` — កំណត់ក្នុង `player.tscn`) |
| `egg.tscn` | `egg.gd` | `CharacterBody2D` | `main.gd` (តាម `@export egg_scene` — កំណត់ក្នុង `main.tscn`) |
| `wooden_base.tscn` | — | `StaticBody2D` | `main.gd` (តាម `@export wooden_base_scene`) |
| `monster.tscn` | — | `CharacterBody2D` | ⚠️ គ្មានអ្វីប្រើ + ខូច (missing textures) |

## លំហូរទិន្នន័យ — ពីកណ្តុរដល់កម្រិតថ្មី

```mermaid
flowchart LR
    A["🖱️ Mouse drag"] --> B["player.gd<br/>aim_dir, power_factor"]
    B --> C["arrow.gd<br/>direction, speed=1200×power"]
    C --> D["ចលនា projectile<br/>velocity.y += 980×delta"]
    D --> E{"RayCast2D<br/>ប៉ះអ្វី?"}
    E -- "ព្រួញផ្សេង" --> D
    E -- "Egg" --> F["egg.gd take_damage()<br/>+1 hit, ប្តូរ frame ប្រេះ"]
    E -- "វេទិកា/ដី" --> G["stick_arrow()<br/>reparent + សំឡេង"]
    F --> H{"hits ≥ 3?"}
    H -- "បាទ/ចាស" --> I["queue_free ស៊ុត<br/>+ លុបព្រួញជាប់ទាំងអស់"]
    H -- "ទេ" --> J["ស៊ុតនៅសល់"]
    I --> K["main.gd _process()<br/>រាប់ក្រុម 'eggs'"]
    K -- "= 0" --> L["current_level += 1<br/>spawn_new_round()"]
    L --> M["សម្អាតព្រួញ+វេទិកា<br/>បង្កើត layout ថ្មី"]
```

## គោលការណ៍រចនាសំខាន់ៗ (Design Patterns)

### ១. Group-based communication ជំនួសឱ្យ direct references

ស្គ្រីបមិនយោងគ្នាតាម node path ទេ — ពួកវាប្រើ **groups**៖

- `main.gd` សម្អាតព្រួញទាំងអស់តាម `get_nodes_in_group("Arrows")`
- `main.gd` រាប់ស៊ុតតាម `get_nodes_in_group("eggs")`
- `egg.gd` ស្គាល់ព្រួញតាម `collider.is_in_group("Arrows")`

អត្ថប្រយោជន៍៖ អាចបង្កើត/លុប node ច្រើនដោយសេរី ដោយមិនខូច reference។

### ២. Duck typing តាម `has_method()`

ជំនួសឱ្យការកំណត់ interface/base class ព្រួញហៅ៖

```gdscript
# arrow.gd បន្ទាត់ ៧១–៧២ — បើ collider មាន take_damage ហៅវា
if collider and collider.has_method("take_damage"):
    collider.take_damage(self)
```

វត្ថុណាដែលមាន `take_damage()` អាចទទួលការខូចខាត — ដោយមិនចាំបាច់ inherit ពី class រួម។

### ៣. Reparenting ដើម្បី "ខ្ទប់" ព្រួញ

ព្រួញមិនប្រើ physics joint ទេ។ វា **ប្តូរ parent** ទៅវត្ថុដែលវាបុក
ដោយរក្សា `global_transform` (ទីតាំង/ការបង្វិលក្នុងពិភពលោកមិនប្រែ)៖

```gdscript
# arrow.gd បន្ទាត់ ១០៩–១១៨
var global_trans = global_transform  # រក្សាទុកមុន
get_parent().remove_child(self)      # ដកចេញពី parent ចាស់
collider.add_child(self)             # ភ្ជាប់ទៅ collider
global_transform = global_trans      # ស្តារទីតាំង — មិនលោត!
```

លទ្ធផល៖ ព្រួញផ្លាស់ទីតាមវេទិកាដែលរំកិល ដោយស្វ័យប្រវត្តិ។

### ៤. Polling ជំនួសឱ្យ event ដើម្បីដឹងកម្រិតចប់

`main.gd` មិនរង់ចាំ signal ពីស៊ុតទេ — វា **រាប់ស៊ុតរាល់ frame**៖

```gdscript
# main.gd បន្ទាត់ ២១៤–២៣២
func _process(_delta: float) -> void:
    var remaining_eggs = get_tree().get_nodes_in_group("eggs")
    var active_egg_count = 0
    for egg in remaining_eggs:
        if is_instance_valid(egg) and not egg.is_queued_for_deletion():
            active_egg_count += 1
    if active_egg_count == 0:
        current_level += 1
        spawn_new_round()
```

!!! info "ចំណាំពីសវនកម្ម"
    `egg.gd` (បន្ទាត់ ១០០–១០៣) ព្យាយាមហៅ `_on_egg_destroyed()` លើ current scene
    ប៉ុន្តែ `main.gd` **មិនមាន** method នោះទេ — ដូច្នេះការហៅនោះមិនកើតឡើងទេ
    (ការពារដោយ `has_method()`)។ យន្តការពិតដែលធ្វើឱ្យកម្រិតបន្ទាប់លេចឡើង
    គឺ **polling** ខាងលើ។ ឯកសារនេះពន្យល់តាមយន្តការពិត។

## ប្រព័ន្ធសំឡេង

គ្មាន audio bus ផ្ទាល់ខ្លួន ឬ music ទេ — មានតែ `AudioStreamPlayer2D` ៤ តួ
ដែលលេងតាមព្រឹត្តិការណ៍៖

| Node | ឯកសារសំឡេង | ស្ថិតនៅ | លេងពេល |
| --- | --- | --- | --- |
| `ShootAudio` | `Bow_Shoot.wav` | `player.tscn` | បាញ់ព្រួញ (`release_arrow()`) |
| `HitAudio` | `Egg_Hit.wav` | `egg.tscn` | ស៊ុតត្រូវព្រួញ (`take_damage()`) |
| `BaseAudio` | `Base.wav` | `wooden_base.tscn` | ព្រួញខ្ទប់វេទិកាឈើ |
| `GrassAudio` | `Grass.wav` | `main.tscn` (ដី) | ព្រួញខ្ទប់ដីស្មៅ |

ចំណុចឆ្លាត៖ `arrow.gd` មិនចាំបាច់ស្គាល់ប្រភេទវត្ថុទេ — វាគ្រាន់តែពិនិត្យ
`collider.has_node("BaseAudio")` → `"GrassAudio"` → `"HitAudio"` (បន្ទាត់ ៩៨–១០៦)។
នេះជា **convention-based** audio ជំនួសឱ្យ type-based។

📖 [AudioStreamPlayer2D](https://docs.godotengine.org/en/4.3/classes/class_audiostreamplayer2d.html) · [Audio buses](https://docs.godotengine.org/en/4.3/tutorials/audio/audio_buses.html)

---

**បន្ទាប់៖** [លំហូរហ្គេម និងវដ្តកម្រិត →](game-loop.md)
