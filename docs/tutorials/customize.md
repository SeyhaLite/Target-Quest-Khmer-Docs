# កែប្រែហ្គេមដោយខ្លួនឯង

មេរៀនបង្រៀននេះណែនាំការកែប្រែ **ពិតៗ** លើកូដ Target Quest — រៀបចំតាម
លំដាប់ពីងាយទៅពិបាក។ រាល់ជំហានទាំងអស់ផ្អែកលើការវិភាគកូដពិតនៅ commit
`a10b33c`។

!!! warning "មុនពេលចាប់ផ្តើម"
    - ធ្វើការលើ **ច្បាប់ចម្លងរបស់អ្នកផ្ទាល់** (fork ឬ clone) ហើយ commit
      មុនពេលកែ ដើម្បីអាចត្រឡប់វិញបាន (`git commit -am "before tutorial"`)
    - ការផ្លាស់ប្តូរខាងក្រោមត្រូវបាន **វិភាគពីកូដ** — សូមសាកល្បងក្នុង Godot editor
      ដើម្បីផ្ទៀងផ្ទាត់លទ្ធផលដោយផ្ទាល់ (អ្នករៀបចំឯកសារមិនបានដំណើរការហ្គេម GUI
      ក្នុងបរិយាកាសសរសេរឯកសារនេះទេ)

## ជំហានទី ១ — កែកម្លាំងធ្នូដោយ *មិនប៉ះកូដ* (Inspector)

**គោលដៅ៖** យល់ពី `@export` — អថេរដែលកែបានតាម Inspector។

1. បើក `Scenes/main.tscn` ហើយជ្រើសរើស node **`Player`**
2. ក្នុង Inspector រកផ្នែក **`player.gd`** → property **`Max Drag Distance`** (លំនាំដើម 200)
3. ប្តូរទៅ **100** → រក្សាទុក (Ctrl+S) → ដំណើរការ (F6)
4. សាកល្បង៖ ទាញតិចក៏បានកម្លាំងខ្លាំង (ព្រោះចម្ងាយ ១០០ px = ១០០% ឥឡូវនេះ)

**ហេតុអ្វីវាដំណើរការ?** `player.gd` បន្ទាត់ ២២៖
```gdscript
@export var max_drag_distance: float = 200.0
```
`@export` ធ្វើឱ្យអថេរលេចឡើងក្នុង Inspector ហើយតម្លៃដែលកំណត់ក្នុង scene
**ជំនួស** តម្លៃលំនាំដើមក្នុងកូដ។

⚠️ **ចំណាំ៖** ការទាយគន្លង (`_draw()`) និងការបាញ់ពិត (`release_arrow()`) ទាំងពីរ
ប្រើ `max_drag_distance` ដូចគ្នា ដូច្នេះចំណុចសនៅតែត្រូវនឹងគន្លងពិត។

## ជំហានទី ២ — ប្តូរល្បឿនព្រួញ (កែកូដ ២ កន្លែង)

**គោលដៅ៖** យល់ពីទំនាក់ទំនងរវាង `player.gd` និង `arrow.gd`។

ល្បឿនព្រួញត្រូវបានកំណត់នៅ **២ កន្លែង** ដែលត្រូវតែដូចគ្នា៖

```gdscript
# player.gd បន្ទាត់ ១៦៧ (_draw — ការទាយគន្លង)
var sim_speed = 1200.0 * power_factor

# player.gd បន្ទាត់ ២២៣ (release_arrow — ល្បឿនពិត)
var final_speed = 1200.0 * power_factor
```

**លំហាត់៖** ប្តូរ `1200.0` ទៅ `900.0` ក្នុង **ទាំងពីរ** កន្លែង។

- សាកល្បង៖ ព្រួញហោះយឺតជាងមុន គន្លងកោងខ្លាំងជាងមុន (ធ្លាក់មុនទៅដល់)
- ❌ បើប្តូរតែមួយកន្លែង → ចំណុចទាយ **មិនត្រូវ** នឹងគន្លងពិតទេ!
  សាកល្បងប្តូរតែ `sim_speed` ហើយសង្កេត — នេះជាមេរៀនសំខាន់អំពី
  **ទិន្នន័យដែលត្រូវតែ sync** (magic number ១២០០ គួរតែជាថេររួម ឬ @export —
  ឱកាសកែលម្អកូដដែលអ្នកអាចសាកល្បង)

## ជំហានទី ៣ — កែ bug សុខភាពស៊ុត (dynamic difficulty ពិត)

**គោលដៅ៖** ធ្វើឱ្យ `egg_health = 2 + level/3` ដំណើរការពិតប្រាកដ។

**បញ្ហា៖** `egg.gd` បន្ទាត់ ៩២ ប្រើលេខ ៣ hard-coded៖

```gdscript
# មុនកែ (កូដដើម)
if current_hits >= 3 or current_hits >= total_frames - 1:
```

**ការកែ៖**

```gdscript
# ក្រោយកែ — ប្រើ max_hits ដែល set_egg_health() បានកំណត់
if current_hits >= max_hits:
```

!!! success "ការកែនេះបានផ្ទៀងផ្ទាត់ដោយការដំណើរការពិត"
    អ្នករៀបចំឯកសារបានសាកល្បងកូដដើម និងកូដដែលកែរួច ដោយ **Godot 4.3 headless**
    (ថ្ងៃ 2026-10-23)៖

    - **កូដដើម៖** `set_egg_health(5)` → ស៊ុតបែកនៅព្រួញទី **៣** (`is_destroyed=true`) ✔ បញ្ជាក់ bug
    - **កូដដែលកែ៖** `set_egg_health(5)` → ស៊ុតបែកនៅព្រួញទី **៥** ✔ bug ត្រូវបានជួសជុល

!!! note "ហេតុអ្វីយើងដក `total_frames - 1` ចេញ?"
    លក្ខខណ្ឌដើមមានពីរផ្នែក៖ `>= 3` (hard-coded) និង `>= total_frames - 1`
    (= ៣ ដែរ ព្រោះ animation មាន ៤ frames)។ ផ្នែកទីពីរការពារកុំឱ្យ
    សុខភាពលើសចំនួនរូបភាពប្រេះ។ បើអ្នកចង់រក្សាឥទ្ធិពលនេះ
    (កុំឱ្យ max_hits ធំជាង frames ដែលមាន) ប្រើ៖
    ```gdscript
    if current_hits >= mini(max_hits, total_frames - 1):
    ```
    ប៉ុន្តែចំណាំ៖ វានៅតែកំណត់ការខូចខាតអតិបរមាត្រឹម ៣ ដោយសារ frames មានតែ ៤។
    ដើម្បីឱ្យសុខភាពធំជាង ៣ ដំណើរការពិត ត្រូវការរូបភាពប្រេះបន្ថែម
    (frame ៥, ៦...) ក្នុង animation "damage" — ឬកែ logic បង្ហាញ frame៖
    ```gdscript
    # បង្ហាញ frame តាមសមាមាត្រនៃសុខភាព (ជំនួស ១:១)
    var frame_index = int(float(current_hits) / max_hits * (total_frames - 1))
    anim_sprite.frame = clampi(frame_index, 0, total_frames - 1)
    ```

**ការផ្ទៀងផ្ទាត់ក្រោយកែ៖**
- កម្រិត ១–២៖ ស៊ុតត្រូវការ **២** ព្រួញ (egg_health = 2)
- កម្រិត ៣–៥៖ **៣** ព្រួញ
- កម្រិត ៦–៨៖ **៤** ព្រួញ (ដោយប្រើវិធី `mini` ខាងលើ → នៅតែ ៣)

## ជំហានទី ៤ — បន្ថែមស៊ុតទី ៣ ក្នុងកម្រិត ៤

**គោលដៅ៖** យល់ពី hand-made levels។

`main.gd` បន្ទាត់ ៧១–៧៥៖

```gdscript
# មុនកែ
elif current_level == 4:
    player_pos = Vector2(575.0, 520.0)
    spawn_level_entities([Vector2(300.0, 380.0), Vector2(850.0, 380.0)], true, false)

# ក្រោយកែ — បន្ថែមស៊ុតកណ្តាលនៅកម្ពស់ខ្ពស់ជាង
elif current_level == 4:
    player_pos = Vector2(575.0, 520.0)
    spawn_level_entities([Vector2(300.0, 380.0), Vector2(575.0, 250.0), Vector2(850.0, 380.0)], true, false)
```

**ផ្ទៀងផ្ទាត់៖** លេងដល់កម្រិត ៤ — ឥឡូវមានស៊ុត ៣ និងវេទិកា ៣។
ស៊ុតកណ្តាលនៅខ្ពស់ជាង ត្រូវការការគណនាគន្លងកោងច្បាស់លាស់ជាងមុន។

!!! tip "ច្បាប់នៃប្រព័ន្ធកូអរដោនេ"
    ក្នុង Godot 2D៖ x កើនទៅ **ស្តាំ**, y កើនទៅ **ក្រោម**។
    ដីស្ថិតនៅ y ≈ ៦៨០–៧៣០ ដូច្នេះ y=២៥០ គឺ "ខ្ពស់" ជាង y=៣៨០។
    ដែនកម្ពស់ដែល generator ប្រើគឺ ២០០–៤២០ — ជ្រើសរើសតម្លៃក្នុងដែននេះ
    ដើម្បីភាពស្របគ្នា។

## ជំហានទី ៥ — ឱ្យវេទិកាផ្លាស់ទីពីកម្រិត ៥

**គោលដៅ៖** កែ threshold នៃមុខងារ។

```gdscript
# main.gd បន្ទាត់ ១១៥
# មុនកែ
var use_mov = current_level >= 8
# ក្រោយកែ
var use_mov = current_level >= 5
```

**ផ្ទៀងផ្ទាត់៖** លេងដល់កម្រិត ៥ — វេទិកា ១ ក្នុងចំណោម ៣ ផ្លាស់ទីឡើង-ចុះ។
ស៊ុតលើវេទិកានោះផ្លាស់ទីតាម (parent-child)។

## ជំហានទី ៦ — ដាក់តួអង្គក្នុងក្រុម `"Player"` (កែ dead code)

**គោលដៅ៖** ធ្វើឱ្យ raycast exception ក្នុង `arrow.gd` ដំណើរការពិត។

`arrow.gd` បន្ទាត់ ២៧ ស្វែងរកក្រុម `"Player"` ប៉ុន្តែគ្មាន node ណាចូលក្រុមនោះទេ។

**ការកែ៖** បន្ថែមមួយបន្ទាត់ក្នុង `player.gd`៖

```gdscript
# player.gd — បន្ថែមអនុគមន៍ _ready() (មិនមានក្នុងកូដដើមទេ)
func _ready() -> void:
    # ចូលក្រុម "Player" ដើម្បីឱ្យ arrow.gd អាចរកឃើញ
    # ហើយដាក់ជា raycast exception (ព្រួញមិនខ្ទប់តួអង្គខ្លួនឯង)
    add_to_group("Player")
```

**ផ្ទៀងផ្ទាត់៖** បាញ់ចុះក្រោមស្ទើរត្រង់ជិតតួអង្គ — មុនកែ ព្រួញអាចខ្ទប់
នឹង capsule របស់តួអង្គ; ក្រោយកែ ព្រួញហោះកាត់តួអង្គ។

(វិធីជំនួសដោយមិនកែកូដ៖ ជ្រើសរើស node `Player` ក្នុង `player.tscn` →
Node dock → tab **Groups** → បន្ថែម `"Player"` → Assign)

## ជំហានទី ៧ — បន្ថែម HUD បង្ហាញលេខកម្រិត (គម្រោងតូចពេញលេញ)

**គោលដៅ៖** រៀន CanvasLayer + Label + ការភ្ជាប់ទៅ level manager។

ហ្គេមមិនមាន UI ទេ — អ្នកលេងមិនដឹងថានៅកម្រិតណា។ សូមបន្ថែម៖

**១. ក្នុង Godot editor:** បើក `main.tscn` → បន្ថែមកូន node ថ្មី៖
`CanvasLayer` (ឈ្មោះ `HUD`) → កូនរបស់វា `Label` (ឈ្មោះ `LevelLabel`)។
កំណត់ position ≈ (20, 15) ហើយបង្កើន font size ក្នុង theme override។

**២. ក្នុង `main.gd`:** បន្ថែម reference និងអាប់ដេត៖

```gdscript
# បន្ថែមនៅផ្នែក @onready ខាងលើឯកសារ
@onready var level_label = $HUD/LevelLabel

# បន្ថែមនៅចុង spawn_new_round() — ក្រោយបន្ទាត់ "player.global_position = player_pos"
if level_label:
    level_label.text = "កម្រិត: %d" % current_level   # Level: N
```

**៣. ផ្ទៀងផ្ទាត់៖** ដំណើរការហ្គេម → ឃើញ "កម្រិត: ១"... លេខកើនឡើង
ពេលកម្ទេចស៊ុតអស់។

!!! info "ហេតុអ្វី CanvasLayer?"
    `CanvasLayer` ធ្វើឱ្យកូនរបស់វាគូរលើ "layer" ដាច់ដោយឡែកដែល
    **មិនផ្លាស់ទីតាមកាមេរ៉ា** — ស្តង់ដារសម្រាប់ HUD។ បើដាក់ Label ជាកូន
    របស់ `Main` (Node2D) ផ្ទាល់ ក៏ដំណើរការដែរក្នុងគម្រោងនេះ (គ្មានកាមេរ៉ារំកិល)
    ប៉ុន្តែ CanvasLayer ជាទម្លាប់ល្អ។

## អ្វីបន្ទាប់?

គំនិតគម្រោងដែលអ្នកអាចអភិវឌ្ឍបន្ត (មិនទាន់មានក្នុងកូដ — ជាលំហាត់)៖

- បន្ថែម **ប៊ូតុង Restart** និងការរក្សាទុកកម្រិតខ្ពស់បំផុត (`ConfigFile` ឬ `FileAccess`)
- បន្ថែម **កំណត់ពេល** (timer) ក្នុងមួយកម្រិត
- ប្តូរពី polling ទៅ **signal**៖ ឱ្យ `egg.gd` បញ្ចេញ signal ពេលបែក
  ហើយ `main.gd` ភ្ជាប់វា (`egg.destroyed.connect(...)`)
- បន្ថែម **កម្រិត boss** ដែលមានស៊ុតធ្វើចលនាទៅឆ្វេង-ស្តាំ

📖 ឯកសារយោង៖ [GDScript style guide](https://docs.godotengine.org/en/4.3/tutorials/scripting/gdscript/gdscript_styleguide.html) ·
[Signals](https://docs.godotengine.org/en/4.3/getting_started/step_by_step/signals.html) ·
[CanvasLayer](https://docs.godotengine.org/en/4.3/classes/class_canvaslayer.html)

---

**បន្ទាប់៖** [ឯកសារយោង — ស្គ្រីប និងអនុគមន៍ →](../reference/scripts.md)
