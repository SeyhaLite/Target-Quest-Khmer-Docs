# សុតគោលដៅ និងប្រព័ន្ធខូចខាត

**ឯកសារ៖** `Script/egg.gd` (១០៦ បន្ទាត់) + `Scenes/egg.tscn`
**ប្រភេទ៖** `extends CharacterBody2D`

សុត (egg) គឺជាគោលដៅរបស់ហ្គេម។ មេរៀននេះពន្យល់ប្រព័ន្ធខូចខាត
(damage system) animation ប្រេះ និង **bug ពិតមួយ** ដែលយើងរកឃើញពីការសវនកម្ម។

## Scene structure (`egg.tscn`)

```
Egg (CharacterBody2D)         ← z_index = 2, ភ្ជាប់ egg.gd
├── AnimatedSprite2D          ← scale 0.3, animation "damage" ៤ frames
│                                (egg_stage_0.png → egg_stage_3.png)
├── CollisionShape2D          ← CapsuleShape2D (radius 46, height 138)
└── HitAudio                  ← AudioStreamPlayer2D (Egg_Hit.wav)
```

Animation `"damage"` មិនមែនជា animation ដែលលេងតាមពេលវេលាទេ —
វាជា **frame library** ដែលកូដជ្រើសរើស frame ដោយផ្ទាល់តាមចំនួនដងនៃការប៉ះ
(frame 0 = សុតល្អ, frame 3 = ប្រេះខ្លាំងបំផុត)។

## ១. ស្ថានភាពដំបូង (`_ready`)

```gdscript
# egg.gd បន្ទាត់ ២២–៣១ (comment ខ្មែរ)
func _ready() -> void:
    # លេង animation "damage" រួចផ្អាកនៅ frame ០ — បង្ហាញសុតដែលមិនទាន់ប្រេះ
    anim_sprite.play("damage")
    anim_sprite.pause()
    anim_sprite.frame = 0

    # reset ស្ថានភាពទាំងអស់
    current_hits = 0
    hit_arrows.clear()
    is_destroyed = false
```

!!! tip "គំរូ play → pause → set frame"
    នេះជាបច្ចេកទេសសាមញ្ញដើម្បីប្រើ `AnimatedSprite2D` ជា "sprite switcher"៖
    ជំនួសឱ្យការបង្កើត `SpriteFrames` ដាច់ដោយឡែក អ្នកលេង animation ហើយផ្អាកវា
    នៅ frame ដែលចង់បាន។

## ២. រូបវិទ្យា — សុតធ្លាក់តាមទំនាញ

```gdscript
# egg.gd បន្ទាត់ ៣៤–៥៦ (comment ខ្មែរ)
func _physics_process(delta: float) -> void:
    if is_destroyed:
        return   # សុតបែកហើយ → ឈប់ដំណើរការ

    # ទំនាញបើមិននៅលើឥដ្ឋ (ដី ឬវេទិកា)
    if not is_on_floor():
        velocity.y += custom_gravity * delta   # 980 px/s²
    else:
        velocity.y = 0.0

    move_and_slide()   # ផ្លាស់ទី + ដោះស្រាយ collision

    # ពិនិត្យ collision ទាំងអស់របស់ frame នេះ
    for i in get_slide_collision_count():
        var collision = get_slide_collision(i)
        var collider = collision.get_collider()

        # បើប៉ះព្រួញ → ទទួលការខូចខាត (ផ្លូវទី ២ ក្រៅពី raycast របស់ព្រួញ)
        if collider and collider.is_in_group("Arrows"):
            take_damage(collider)
```

សុតជា `CharacterBody2D` ដូច្នេះវា **ធ្លាក់ចុះ** រហូតដល់ប៉ះដី ឬវេទិកា។
ពេល `main.gd` ដាក់សុតលើវេទិកា (`egg.position = Vector2(0, -50)` ជាកូនរបស់វេទិកា)
សុតនៅលើវេទិកាដោយសារ `is_on_floor()` ត្រឡប់ `true`។

## ៣. ការកំណត់សុខភាពតាមកម្រិត — និង bug ដែលយើងរកឃើញ

`main.gd` គណនាសុខភាពសុតតាមកម្រិត ហើយហៅ៖

```gdscript
# main.gd បន្ទាត់ ១៨៦–១៩០
var egg_health = 2 + int(current_level / 3)   # កម្រិត ១–២: ២, កម្រិត ៣–៥: ៣, កម្រិត ៦–៨: ៤, ...
if egg.has_method("set_egg_health"):
    egg.set_egg_health(egg_health)
```

```gdscript
# egg.gd បន្ទាត់ ៥៩–៦៨
func set_egg_health(health: int) -> void:
    max_hits = health      # ← កំណត់ max_hits តាមកម្រិត
    current_hits = 0
    hit_arrows.clear()
    velocity = Vector2.ZERO
    is_destroyed = false
    if anim_sprite:
        anim_sprite.frame = 0
```

ប៉ុន្តែមើលលក្ខខណ្ឌបំផ្លាញក្នុង `take_damage()`៖

```gdscript
# egg.gd បន្ទាត់ ៩២ — លក្ខខណ្ឌពិតក្នុងកូដដើម
if current_hits >= 3 or current_hits >= total_frames - 1:
    is_destroyed = true
```

!!! bug "Bug ដែលបានផ្ទៀងផ្ទាត់៖ `max_hits` មិនត្រូវបានប្រើទេ!"
    លក្ខខណ្ឌបំផ្លាញប្រើលេខ **៣ hard-coded** (និង `total_frames - 1` = ៤−១ = ៣)
    ជំនួសឱ្យ `max_hits`។ ដូច្នេះទោះបី `main.gd` កំណត់
    `set_egg_health(5)` នៅកម្រិតខ្ពស់ក៏ដោយ **សុតនៅតែបែកនៅព្រួញទី ៣**។
    ប្រព័ន្ធ "dynamic difficulty" ដែល README ដើមលើកឡើង មិនដំណើរការជាក់ស្តែងទេ។

    **ផ្ទៀងផ្ទាត់ដោយការដំណើរការពិត (Godot 4.3 headless, 2026-10-23)៖**
    សាកល្បងហៅ `set_egg_health(5)` រួច `take_damage()` ម្តងមួយៗ —
    លទ្ធផល៖ `is_destroyed=true` នៅការវាយទី **៣** មិនមែនទី ៥ ទេ។ ✔

    **ការកែត្រឹមត្រូវ** (បានសាកល្បងហើយថាដំណើរការ — មើល
    [មេរៀនបង្រៀន ជំហានទី ៣](../tutorials/customize.md))៖
    ```gdscript
    if current_hits >= max_hits:
    ```

    ចំណាំបន្ថែម៖ ការជួសជុលនេះនៅតែមានដែនកំណត់មួយទៀត — animation មានតែ ៤ frames
    ដូច្នេះសុខភាពលើសពី ៣ នឹងមិនមានរូបភាពប្រេះបន្ថែមទេ (frame ឈប់ត្រឹម
    `total_frames - 1` ដោយសារលក្ខខណ្ឌ `current_hits < total_frames` នៅបន្ទាត់ ៨៨)។

## ៤. ការទទួលការខូចខាត (`take_damage`)

```gdscript
# egg.gd បន្ទាត់ ៧១–១០៦ (comment ខ្មែរ)
func take_damage(damager: Node2D) -> void:
    # រំលងបើសុតបែកហើយ ឬព្រួញនេះបានវាយរួចហើយ (deduplication!)
    if is_destroyed or damager in hit_arrows:
        return

    hit_arrows.append(damager)   # ចងចាំព្រួញដែលបានវាយ
    current_hits += 1

    # លេងសំឡេងប្រេះ (Egg_Hit.wav)
    if has_node("HitAudio"):
        $HitAudio.play()

    # ប្តូររូបភាពទៅ frame ប្រេះបន្ទាប់ (០→១→២)
    var total_frames = anim_sprite.sprite_frames.get_frame_count("damage")  # = ៤
    if current_hits < total_frames:
        anim_sprite.frame = current_hits

    # លក្ខខណ្ឌបំផ្លាញ (⚠️ hard-coded ៣ — មើល box ខាងលើ)
    if current_hits >= 3 or current_hits >= total_frames - 1:
        is_destroyed = true

        # លុបព្រួញទាំងអស់ដែលជាប់ក្នុងសុត — ព្រួញធ្លាក់ចេញជាមួយសុតមិនបានទេ!
        for arrow in hit_arrows:
            if is_instance_valid(arrow):
                arrow.queue_free()

        # ព្យាយាមជូនដំណឹងដល់ scene មេ (guarded — main.gd គ្មាន method នេះទេ)
        var main_node = get_tree().current_scene
        if main_node and main_node.has_method("_on_egg_destroyed"):
            main_node._on_egg_destroyed()

        queue_free()   # លុបសុតចេញពី scene tree (និងក្រុម "eggs")
```

### ហេតុអ្វី deduplication សំខាន់?

ចំនុចខូចខាតមាន **ពីរផ្លូវ** (មើល [មេរៀនព្រួញ](arrow.md) ផ្នែក ៤)៖

1. RayCast របស់ព្រួញ → `collider.take_damage(self)`
2. Slide collision របស់សុត → `take_damage(collider)`

បើគ្មាន `hit_arrows` dedup ទេ ព្រួញមួយដើមអាចបង្កើន `current_hits` ពីរដង
ក្នុង frame តែមួយ! `damager in hit_arrows` ធានាថា **ព្រួញមួយដើម = ការខូចខាតមួយដង**។

### ហេតុអ្វីលុបព្រួញជាប់ពេលសុតបែក?

ព្រួញខ្ទប់គឺជា **កូន** របស់សុត (reparenting ពី `arrow.gd`)។
បើមិនលុបវាទេ ពេល `queue_free()` សុត ព្រួញក៏ត្រូវបានលុបតាមដែរ (កូនស្លាប់តាមមេ) —
ការលុបដោយចេតនា (`arrow.queue_free()`) គ្រាន់តែធ្វើឱ្យច្បាស់លាស់ និងការពារ
edge case បើ reparenting មិនកើតឡើង។

## ៥. ដំណាក់កាលរូបភាព

| Frame | ឯកសារ | ស្ថានភាព | បង្ហាញពេល |
| --- | --- | --- | --- |
| ០ | `egg_stage_0.png` | សុតល្អ | `_ready()` |
| ១ | `egg_stage_1.png` | ប្រេះតិច | ព្រួញទី ១ |
| ២ | `egg_stage_2.png` | ប្រេះខ្លាំង | ព្រួញទី ២ |
| ៣ | `egg_stage_3.png` | ប្រេះធ្ងន់ | — (មិនដែលបង្ហាញជាក់ស្តែង* ) |

\* ព្រួញទី ៣ បំផ្លាញសុតភ្លាមៗ (`is_destroyed = true` → `queue_free()`)។
ការកំណត់ `anim_sprite.frame = current_hits` កើតឡើង **មុន** ការពិនិត្យបំផ្លាញ
ដូច្នេះ frame ៣ អាចលេចឡើងមួយភ្លែតខ្លីមុនសុតត្រូវលុប — ឬមិនលេចឡើងទាល់តែសោះ
អាស្រ័យលើ frame timing។ នេះជាការវិភាគពីកូដ មិនមែនការសង្កេតពីការលេងផ្ទាល់ទេ។

📖 [AnimatedSprite2D](https://docs.godotengine.org/en/4.3/classes/class_animatedsprite2d.html) ·
[CharacterBody2D.move_and_slide](https://docs.godotengine.org/en/4.3/classes/class_characterbody2d.html#class-characterbody2d-method-move-and-slide)

## លំហាត់

1. **សង្កេត dedup៖** បាញ់សុតម្តង រួចរង់ចាំ — តើ `current_hits` កើនពីរដងទេ?
   (អត់ទេ ព្រោះ `hit_arrows` ការពារហើយ)
2. **គណនា៖** តាមរូបមន្ត `2 + level/3` តើកម្រិត ៧ និង ១០ មាន egg_health ប៉ុន្មាន?
   (កម្រិត ៧ → ២+២=៤; កម្រិត ១០ → ២+៣=៥ — ប៉ុន្តែជាក់ស្តែងបែកនៅ ៣ ដងដដែល ព្រោះ bug)
3. **កែ bug៖** អនុវត្តតាម [មេរៀនបង្រៀន ជំហានទី ៣](../tutorials/customize.md)
   ដើម្បីធ្វើឱ្យសុខភាពសុតដំណើរការពិតប្រាកដ។

---

**បន្ទាប់៖** [ការបង្កើតកម្រិតស្វ័យប្រវត្តិ →](levels.md)
