# គោលគំនិត Godot ដែលប្រើក្នុងគម្រោង

មេរៀននេះពន្យល់គោលគំនិត Godot **ដែលគម្រោងនេះប្រើជាក់ស្តែង** ប៉ុណ្ណោះ —
មិនមែនទ្រឹស្តីទាំងអស់របស់ Godot ទេ។ គោលគំនិតនីមួយៗភ្ជាប់ទៅកូដពិតក្នុងគម្រោង។

## ១. Node និង Scene Tree

**Node (ថ្នាំង)** គឺជាឯកតាមូលដ្ឋានរបស់ Godot។ Node នីមួយៗមានតួនាទីមួយ
(បង្ហាញរូបភាព រកការប៉ះទង្គិច (detect) លេងសំឡេង...) ហើយត្រូវបានរៀបជា **ដើមឈើ**
(tree) ដែល node កូន (child) ផ្លាស់ទី/បង្វិលតាម node មេ (parent)។

**Scene (ឆាក)** គឺជាដើមឈើ node ដែលរក្សាទុកក្នុងឯកសារ `.tscn` ហើយអាច
**instantiate** (បង្កើតច្បាប់ចម្លង) បានច្រើនដង។

ក្នុងគម្រោងនេះ៖

| Scene | Root node | ស្គ្រីប | តួនាទី |
| --- | --- | --- | --- |
| `Scenes/main.tscn` | `Node2D` | `main.gd` | កម្រិតទាំងមូល — ផ្ទៃខាងក្រោយ ដី តួអង្គ |
| `Scenes/player.tscn` | `CharacterBody2D` | `player.gd` | តួអង្គដែលកាន់ធ្នូ |
| `Scenes/arrow.tscn` | `Area2D` | `arrow.gd` | ព្រួញមួយដើម |
| `Scenes/egg.tscn` | `CharacterBody2D` | `egg.gd` | សុត (គោលដៅ) |
| `Scenes/wooden_base.tscn` | `StaticBody2D` | — (គ្មាន) | វេទិកាឈើនៅស្ងៀម |

ឧទាហរណ៍ជាក់ស្តែងនៃ **parent-child** ក្នុង `player.tscn`៖

```
Player (CharacterBody2D)
└── Body (Node2D)
    └── Torso (Sprite2D)
        └── RightUperArm (Sprite2D)          ← ដៃលើខាងស្តាំ
            └── RightLowerArm (Sprite2D)     ← ដៃក្រោម
                └── RightHand (Sprite2D)     ← ដៃ
                    └── BowHoldPosition (Marker2D)   ← ចំណុចកាន់ធ្នូ
                        └── Bow (Sprite2D)           ← ធ្នូ
```

ដូច្នេះពេល animation បង្វិល `RightUperArm` ដៃក្រោម ដៃ និងធ្នូ **ទាំងអស់**
ផ្លាស់ទីតាមដោយស្វ័យប្រវត្តិ។ `player.gd` យោងទៅចំណុចកាន់ធ្នូតាម path ពេញ៖

```gdscript
# player.gd បន្ទាត់ ៧ — យោង Marker2D ជ្រៅក្នុងដើមឈើ node
@onready var bow_hold_position: Marker2D = $Body/Torso/RightUperArm/RightLowerArm/RightHand/BowHoldPosition
```

📖 ឯកសារផ្លូវការ៖ [Nodes and scene instances](https://docs.godotengine.org/en/4.3/tutorials/scripting/gdscript/gdscript_basics.html) · [Groups](https://docs.godotengine.org/en/4.3/tutorials/scripting/groups.html)

## ២. ប្រភេទ Node រូបវិទ្យា (Physics Bodies) ទាំង ៤

Godot 2D មានប្រភេទ physics body សំខាន់ៗ ហើយគម្រោងនេះប្រើ ៣ ក្នុងចំណោមវា៖

| ប្រភេទ | លក្ខណៈ | ប្រើសម្រាប់ | ក្នុងគម្រោង |
| --- | --- | --- | --- |
| `StaticBody2D` | មិនផ្លាស់ទី (ដោយរូបវិទ្យា) | ដី ជញ្ជាំង វេទិកា | ដី (`main.tscn`), វេទិកាឈើ |

| `CharacterBody2D` | ផ្លាស់ទីតាមកូដ (`move_and_slide()`) | តួអង្គ វត្ថុដែលធ្លាក់ | តួអង្គ, សុត |
| `Area2D` | មិនមានរូបវិទ្យាខ្លួនឯង — រកវត្ថុដែលចូល/ប៉ះ (detect) | របស់ប្រមូល គ្រាប់កាំភ្លើង | ព្រួញ |
| `RigidBody2D` | រូបវិទ្យាពេញលេញស្វ័យប្រវត្តិ | វត្ថុដែលលោត/រមៀល | **មិនប្រើ** |

!!! note "ចំណុចគួរឱ្យចាប់អារម្មណ៍"
    ព្រួញ (`Area2D`) **មិនប្រើ physics engine** ដើម្បីហោះទេ!
    `arrow.gd` គណនាចលនាដោយខ្លួនឯងក្នុង `_process()` (មើលមេរៀន
    [ព្រួញ និងរូបវិទ្យា](../lessons/arrow.md)) ហើយប្រើ `RayCast2D`
    ដើម្បីរកការប៉ះទង្គិច។ នេះជាគំរូ projectile motion សាមញ្យដែលងាយយល់។

📖 [Physics introduction](https://docs.godotengine.org/en/4.3/tutorials/physics/physics_introduction.html)

## ៣. GDScript និងគន្លឺះ keyword

**GDScript** គឺជាភាសារបស់ Godot — ស្រដៀង Python។ គន្លឺះដែលប្រើក្នុងគម្រោង៖

```gdscript
# extends — ស្គ្រីបនេះពង្រីក (inherit) ពីប្រភេទ node ណាមួយ
extends Area2D   # arrow.gd បន្ទាត់ ១ — ព្រួញគឺជា Area2D

# @export — អថេរដែលលេចឡើងក្នុង Inspector អាចកែដោយមិនប៉ះកូដ
@export var speed: float = 800.0   # arrow.gd បន្ទាត់ ៤

# @onready — រង់ចាំឱ្យ node ចូល scene tree មុនយកតម្លៃ
@onready var ray_cast: RayCast2D = $RayCast2D   # arrow.gd បន្ទាត់ ១៩
# $RayCast2D = get_node("RayCast2D") — រកកូន node តាមឈ្មោះ

# ប្រភេទទិន្នន័យដែលប្រើ — Vector2 (កូអរដោនេ/ទិសដៅ 2D), float, int, bool, Array
var direction: Vector2 = Vector2.RIGHT   # arrow.gd បន្ទាត់ ៧
```

📖 [GDScript basics](https://docs.godotengine.org/en/4.3/tutorials/scripting/gdscript/gdscript_basics.html) · [@GDScript reference](https://docs.godotengine.org/en/4.3/classes/class_%40gdscript.html)

## ៤. Callback functions របស់ Godot

Godot ហៅអនុគមន៍ពិសេសដោយស្វ័យប្រវត្តិតាមវដ្តជីវិត៖

| អនុគមន៍ | ពេលណាត្រូវបានហៅ | ប្រើក្នុងគម្រោង |
| --- | --- | --- |
| `_ready()` | node ចូល scene tree ម្តងគត់ | ទាំង ៥ ស្គ្រីប |
| `_process(delta)` | រាល់ frame (មិនទៀងទាត់) | `arrow.gd` (ចលនា), `main.gd` (ពិនិត្យកម្រិត) |
| `_physics_process(delta)` | រាល់ physics tick (៦០ ដង/វិនាទី ទៀងទាត់) | `player.gd`, `egg.gd` (ទំនាញ + `move_and_slide`) |
| `_input(event)` | រាល់ព្រឹត្តិការណ៍ input | `player.gd` (កណ្តុរ) |
| `_draw()` | ពេល `queue_redraw()` ត្រូវបានហៅ | `player.gd` (ចំណុចគន្លង) |

`delta` គឺជាចន្លោះពេល (វិនាទី) រវាង frame ពីរ — គុណវាជាមួយល្បឿន
ដើម្បីឱ្យចលនាដូចគ្នាគ្រប់ម៉ាស៊ីន (frame-rate independent)។

## ៥. Groups (ក្រុម)

**Group** គឺជា "ស្លាក" សម្រាប់ node — អនុញ្ញាតឱ្យស្គ្រីបរក node ទាំងអស់
នៃប្រភេទមួយបានងាយ ដោយមិនចាំបាច់ស្គាល់ path។ គម្រោងនេះប្រើ ៣ ក្រុម៖

| ក្រុម | អ្នកចូលក្រុម | អ្នកប្រើ | គោលបំណង |
| --- | --- | --- | --- |
| `"Arrows"` | ព្រួញរាល់ដើម (`arrow.gd` `_ready()`) | `main.gd` សម្អាតពេលចប់កម្រិត; `egg.gd` ពិនិត្យ collision; `arrow.gd` រំលងព្រួញផ្សេង | កំណត់អត្តសញ្ញាណព្រួញ |
| `"eggs"` | សុតរាល់គ្រាប់ (`main.gd` `spawn_level_entities()`) | `main.gd` `_process()` រាប់សុតនៅសល់ | ដឹងពេលកម្រិតចប់ |
| `"Player"` | ⚠️ **គ្មាន!** — មិនមាន scene/script ណា `add_to_group("Player")` ទេ | `arrow.gd` ព្យាយាមរក (បន្ទាត់ ២៧) ប៉ុន្តែទទួល `null` | ការពារព្រួញខ្ទប់តួអង្គ — **មិនដំណើរការជាក់ស្តែង** |

!!! bug "ការរកឃើញពីការសវនកម្ម"
    `arrow.gd` បន្ទាត់ ២៦–៣១ ស្វែងរក node ក្នុងក្រុម `"Player"` ដើម្បីដាក់ជា
    raycast exception ប៉ុន្តែ **តួអង្គមិនដែលត្រូវបានដាក់ក្នុងក្រុមនោះទេ**
    (ផ្ទៀងផ្ទាត់៖ `grep "groups=" Scenes/` គ្មានលទ្ធផល ហើយ `player.gd` គ្មាន
    `add_to_group`)។ កូដនេះជា **dead code**។ របៀបកែ សូមមើល
    [មេរៀនបង្រៀន ជំហានទី ៦](../tutorials/customize.md)។

📖 [Groups](https://docs.godotengine.org/en/4.3/tutorials/scripting/groups.html)

## ៦. Instantiate និង PackedScene

**PackedScene** គឺជា scene ដែលបានវេចខ្ចប់ជាធនធាន — អ្នកបង្កើតច្បាប់ចម្លង
(instance) ពីវាដោយ `.instantiate()`។ គម្រោងនេះប្រើវា ៣ កន្លែង៖

```gdscript
# main.gd បន្ទាត់ ៨ និង ១១ — scene ត្រូវបានភ្ជាប់តាម Inspector (@export)
@export var egg_scene: PackedScene
@export var wooden_base_scene: PackedScene

# main.gd បន្ទាត់ ១៥០ និង ១៦៦ — បង្កើតច្បាប់ចម្លង ហើយបញ្ចូល scene tree
base = wooden_base_scene.instantiate()
add_child(base)          # ត្រូវតែ add_child មុន ទើប node ដំណើរការ

var egg = egg_scene.instantiate()
base.add_child(egg)      # សុតក្លាយជាកូនរបស់វេទិកា → ផ្លាស់ទីតាមវេទិកា
```

```gdscript
# player.gd បន្ទាត់ ១៣៤ — បង្កើតព្រួញកាន់ក្នុងដៃពេលចាប់ផ្តើមទាញ
current_arrow = arrow_scene.instantiate()
bow_hold_position.add_child(current_arrow)
```

!!! tip "ចំណុចសំខាន់"
    ក្នុង `main.tscn` អថេរ `egg_scene` និង `wooden_base_scene` ត្រូវបានកំណត់
    តាម Inspector (ឃើញក្នុងឯកសារ `.tscn` ជា `egg_scene = ExtResource("5_hb5oc")`)។
    បើអ្នកភ្លេចកំណត់វា `spawn_level_entities()` នឹងមិនបង្កើតអ្វីទាំងអស់
    (កូដពិនិត្យ `if egg_scene:` មុន instantiate)។

📖 [PackedScene](https://docs.godotengine.org/en/4.3/classes/class_packedscene.html) · [Instancing (creating instances)](https://docs.godotengine.org/en/4.3/getting_started/step_by_step/instancing.html)

## ៧. Vector2 និងគណិតវិទ្យា 2D

`Vector2(x, y)` តំណាង **ទីតាំង** ឬ **ទិសដៅ+ប្រវែង**។ ប្រតិបត្តិការសំខាន់ៗក្នុងគម្រោង៖

```gdscript
# arrow.gd បន្ទាត់ ៤៦ — normalized() ធ្វើឱ្យប្រវែងវ៉ិចទ័រ = ១ រួចគុណល្បឿន
velocity = direction.normalized() * speed

# arrow.gd បន្ទាត់ ៥៥ — angle() បំប្លែងវ៉ិចទ័រទៅជារ៉ាដ្យង់ សម្រាប់បង្វិលព្រួញ
rotation = velocity.angle()

# player.gd បន្ទាត់ ៥០–៥១ — វ៉ិចទ័រទាញ និងប្រវែងរបស់វា
var drag_vector = mouse_pos - drag_start_pos
var drag_distance = drag_vector.length()

# main.gd — clamp/clampi កំណត់តម្លៃក្នុងដែនកំណត់
var target_count = clampi(2 + int(current_level / 4), 2, 4)   # បន្ទាត់ ៩១
var power_factor = clamp(drag_distance / max_drag_distance, 0.1, 1.0)  # player.gd បន្ទាត់ ៨០
```

📖 [Vector math](https://docs.godotengine.org/en/4.3/tutorials/math/vector_math.html) · [2D movement](https://docs.godotengine.org/en/4.3/tutorials/2d/2d_movement.html)

## ៨. Tween — ចលនាស្វ័យប្រវត្តិរលូន

**Tween** ប្រែប្រួលតម្លៃ property តាមពេលវេលាដោយស្វ័យប្រវត្តិ។ `main.gd` ប្រើវា
ធ្វើឱ្យវេទិកាឈើផ្លាស់ទីឡើង-ចុះ (កម្រិត ៨+)៖

```gdscript
# main.gd បន្ទាត់ ២០២–២១១ — tween រង្វិលជុំមិនឈប់ (loop)
var tween = node.create_tween().set_loops()
tween.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)  # រលូនដូចរលក sine

tween.tween_property(node, "position:y", initial_y - move_dist, speed)      # ឡើងលើ
tween.tween_property(node, "position:y", initial_y + move_dist, speed * 2.0) # ចុះក្រោម
tween.tween_property(node, "position:y", initial_y, speed)                  # ត្រឡប់កណ្តាល
```

`TRANS_SINE` + `EASE_IN_OUT` ធ្វើឱ្យចលនាចាប់ផ្តើម/បញ្ចប់យឺតៗ កណ្តាលលឿន —
ដូចជា README ដើមហៅថា "jerk-free sine-wave"។

📖 [Tween](https://docs.godotengine.org/en/4.3/classes/class_tween.html)

## ៩. ProjectSettings

**ProjectSettings** គឺជាការកំណត់ទូទៅរបស់គម្រោង (ក្នុង `project.godot`)។
ស្គ្រីបទាំង ៣ អានតម្លៃទំនាញពីទីនេះ៖

```gdscript
# arrow.gd បន្ទាត់ ១៣, egg.gd បន្ទាត់ ១៩, player.gd បន្ទាត់ ២៤
var custom_gravity: float = ProjectSettings.get_setting("physics/2d/default_gravity")
```

តម្លៃលំនាំដើមគឺ **980.0** (px/s²) — ផ្ទៀងផ្ទាត់ពី
[ProjectSettings docs](https://docs.godotengine.org/en/4.3/classes/class_projectsettings.html)។
គម្រោងនេះ **មិន** កំណត់តម្លៃផ្ទាល់ខ្លួនទេ ដូច្នេះវាប្រើ 980។

---

**បន្ទាប់៖** [រចនាសម្ព័ន្ធគម្រោង →](project-structure.md)
