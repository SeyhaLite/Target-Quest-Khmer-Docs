# តួអង្គ និងយន្តការបាញ់ព្រួញ

**ឯកសារ៖** `Script/player.gd` (២៤២ បន្ទាត់) + `Scenes/player.tscn`
**ប្រភេទ៖** `extends CharacterBody2D`

មេរៀននេះបកស្រាយកូដ `player.gd` ទាំងស្រុង — ពីការទាញធ្នូ រហូតដល់ការបាញ់
និងការគូរគន្លងទាយ (trajectory prediction)។

## គោលដៅនៃមេរៀន

- យល់ពីរបៀបបំប្លែង **ការទាញកណ្តុរ** ទៅជា **ទិសដៅ + កម្លាំង**
- យល់ពីរបៀប **seek/pause** animation តាមកម្រិតទាញ (progressive animation)
- យល់ពីរូបមន្ត **គន្លងទាយ** និងហេតុអ្វីវាត្រូវនឹងចលនាព្រួញពិត
- ស្គាល់ចំណុចខ្សោយមួយចំនួនក្នុងកូដ (ផ្ទៀងផ្ទាត់)

## ១. អថេរសមាជិក (Member Variables)

```gdscript
# player.gd បន្ទាត់ ៤–២៨ (សង្ខេប + comment ខ្មែរ)
extends CharacterBody2D

# យោង AnimationPlayer សម្រាប់ animation idle/shoot
@onready var animation_player = $AnimationPlayer

# យោងចំណុចកាន់ធ្នូ — Marker2D ជ្រៅក្នុងដៃស្តាំ (ផ្លូវ node ពេញ)
@onready var bow_hold_position: Marker2D = $Body/Torso/RightUperArm/RightLowerArm/RightHand/BowHoldPosition

# scene ព្រួញ — កំណត់តាម Inspector (player.tscn ភ្ជាប់ arrow.tscn)
@export var arrow_scene: PackedScene

var current_arrow: Node2D = null        # ព្រួញដែលកំពុងកាន់
var is_charging: bool = false            # កំពុងទាញធ្នូឬអត់
var drag_start_pos: Vector2 = Vector2.ZERO  # ទីតាំងកណ្តុរពេលចាប់ផ្តើមចុច
@export var max_drag_distance: float = 200.0  # ចម្ងាយទាញអតិបរមា (កម្លាំង ១០០%)
var gravity: float = ProjectSettings.get_setting("physics/2d/default_gravity")  # = 980
var train_offset: float = 0.0            # offset សម្រាប់ animate ចំណុចគន្លង
```

## ២. Input — ចុច និងលែងកណ្តុរ

```gdscript
# player.gd បន្ទាត់ ១០៨–១១៧
func _input(event: InputEvent) -> void:
    if event is InputEventMouseButton:
        if event.button_index == MOUSE_BUTTON_LEFT:
            if event.pressed:
                # ចុច → ចង់ចាំទីតាំងចាប់ផ្តើម ហើយចាប់ផ្តើមទាញធ្នូ
                drag_start_pos = get_global_mouse_position()
                start_charge()
            else:
                # លែង → បាញ់ព្រួញ
                release_arrow()
```

!!! note "ចំណាំ"
    គម្រោងមិនប្រើ **Input Map** (`project.godot` គ្មានផ្នែក `[input]`) ទេ —
    វាពិនិត្យ raw `InputEventMouseButton` ដោយផ្ទាល់។ មានន្ទៃដូចជា
    **ចុចគ្រប់ទីកន្លែងលើវីនដូ** ក៏ចាប់ផ្តើមទាញធ្នូដែរ (មិនចាំបាច់ចុចលើតួអង្គ)។

## ៣. `start_charge()` — កាន់ព្រួញឡើង

```gdscript
# player.gd បន្ទាត់ ១២០–១៤៥ (សង្ខេប)
func start_charge() -> void:
    is_charging = true
    train_offset = 0.0

    # កំណត់ animation "shoot" ទៅ frame ០ ហើយផ្អាក
    animation_player.play("shoot")
    animation_player.seek(0.0, true)
    animation_player.pause()

    # បង្កើតព្រួញថ្មី ភ្ជាប់ទៅចំណុចកាន់ធ្នូ
    if arrow_scene and bow_hold_position:
        if current_arrow and is_instance_valid(current_arrow):
            current_arrow.queue_free()   # លុបព្រួញចាស់បើមាន

        current_arrow = arrow_scene.instantiate()
        bow_hold_position.add_child(current_arrow)

        if current_arrow and is_instance_valid(current_arrow):
            current_arrow.position = Vector2.ZERO     # នៅចំចំណុចកាន់
            current_arrow.rotation = PI / 2           # បង្វិលឱ្យស្របនឹងធ្នូ
            current_arrow.scale = Vector2.ONE
            current_arrow.visible = true

            # បង្កកព្រួញ — កុំឱ្យ arrow.gd ធ្វើចលនាខ្លួនឯងពេលកំពុងកាន់
            if "is_stuck" in current_arrow:
                current_arrow.is_stuck = true
```

ចំណុចឆ្លាត៖ `is_stuck = true` ធ្វើឱ្យ `_process()` របស់ `arrow.gd` ចេញភ្លាមៗ
(`if is_stuck: return`) ដូច្នេះព្រួញ "កក" នៅក្នុងដៃ រហូតដល់ `release_arrow()`
កំណត់ `is_stuck = false`។ ការប្រើ `"is_stuck" in current_arrow` គឺជា
**duck typing** — `player.gd` មិនចាំបាច់ស្គាល់ class របស់ព្រួញទេ។

## ៤. កំឡុងទាញ — `_physics_process()`

```gdscript
# player.gd បន្ទាត់ ៣៦–១០៥ (ផ្នែក charging សង្ខេប)
func _physics_process(delta: float) -> void:
    # ទំនាញសម្រាប់តួអង្គខ្លួនឯង (ធ្លាក់ចុះដីបើនៅលើអាកាស)
    if not is_on_floor():
        velocity.y += gravity * delta
    else:
        velocity.y = 0.0

    var mouse_pos = get_global_mouse_position()

    if is_charging:
        # វ៉ិចទ័រពីចំណុចចាប់ផ្តើមទៅកណ្តុរបច្ចុប្បន្ន
        var drag_vector = mouse_pos - drag_start_pos
        var drag_distance = drag_vector.length()

        # animate ចំណុចគន្លងឱ្យរំកិល (loop ០→១ រៀងរាល់ ~០.២៩ វិនាទី)
        train_offset = fposmod(train_offset + delta * 3.5, 1.0)

        # ទិសដៅបាញ់ = ផ្ទុយនឹងការទាញ (slingshot)
        var aim_dir = Vector2.RIGHT          # លំនាំដើមបើទាញតិចពេក
        if drag_distance > 5.0:              # dead zone ៥ ភីកសែល
            aim_dir = -drag_vector.normalized()

        # ត្រឡប់រាងកាយតាមទិស (flip)
        var is_facing_left = aim_dir.x < 0
        if is_facing_left:
            $Body.scale.x = -1
        else:
            $Body.scale.x = 1

        # បង្វិលដើមទ្រូងតាមមុំបាញ់ (រក្សារាងកាយឱ្យត្រង់ពេលប្រឈមឆ្វេង)
        if has_node("Body/Torso"):
            if is_facing_left:
                $Body/Torso.rotation = PI - aim_angle - global_rotation
            else:
                $Body/Torso.rotation = aim_angle - global_rotation

        # ភាគរយនៃការទាញ (០ ដល់ ១) — កំណត់ដោយ max_drag_distance=200
        var anim_progress = clamp(drag_distance / max_drag_distance, 0.0, 1.0)

        # seek animation "shoot" ទៅភាគរយនោះ ហើយផ្អាក — ធ្នូត្រូវបានទាញតាមកម្លាំង!
        if animation_player.current_animation != "shoot":
            animation_player.play("shoot")
        animation_player.seek(anim_progress * animation_player.current_animation_length, true)
        animation_player.pause()

        # រក្សាព្រួញក្នុងដៃ (តាម BowHoldPosition ដែល animation ផ្លាស់ប្តូរ)
        if current_arrow and is_instance_valid(current_arrow):
            current_arrow.position = Vector2.ZERO
            current_arrow.rotation = PI / 2
            ...
        queue_redraw()   # សុំគូរចំណុចគន្លងឡើងវិញ
    else:
        train_offset = 0.0
        queue_redraw()

    move_and_slide()   # អនុវត្តចលនាតួអង្គ + collision
```

### គណិតវិទ្យានៃការបាញ់

```
ទិសដៅ (direction):   aim_dir = -(mouse_pos - drag_start_pos)  normalized
កម្លាំង (power):       power_factor = clamp(drag_distance / 200, 0.1, 1.0)
ល្បឿនដំបូង (speed):   final_speed = 1200 × power_factor   → ១២០ ដល់ ១២០០ px/s
```

- ទាញតិចជាង ៥ px → បាញ់ទៅស្តាំ (`Vector2.RIGHT`) ដោយកម្លាំងអប្បបរមា ១០%
- ទាញ ២០ px → power = ១០% (clamp ក្រោម)
- ទាញ ១០០ px → power = ៥០%
- ទាញ ២០០ px ឬច្រើនជាង → power = ១០០%

## ៥. គន្លងទាយ — `_draw()`

```gdscript
# player.gd បន្ទាត់ ១៥២–១៨៧ (សង្ខេប)
func _draw() -> void:
    if not is_charging or not bow_hold_position:
        return
    ...
    if drag_distance < 5.0:
        return   # មិនគូរបើទាញតិចពេក

    var shoot_dir = -drag_vector.normalized()
    var power_factor = clamp(drag_distance / max_drag_distance, 0.1, 1.0)
    var sim_speed = 1200.0 * power_factor     # ← ដូចល្បឿនពិតពេលបាញ់!
    var sim_gravity = ProjectSettings.get_setting("physics/2d/default_gravity")  # 980

    var dt = 0.08         # គន្លងនីមួយៗឃ្លាតគ្នា ០.០៨ វិនាទី
    var total_dots = 5    # ចំណុចសរុប ៥

    for i in range(total_dots):
        var current_t = (float(i) + train_offset) * dt

        # រូបមន្តចលនា projectile: p(t) = p₀ + v·t + ½·g·t²
        var sim_pos = bow_hold_position.global_position \
            + (shoot_dir * sim_speed * current_t) \
            + Vector2(0, 0.5 * sim_gravity * current_t * current_t)
        var local_pos = to_local(sim_pos)   # _draw() គូរជា local coordinates

        # ទំហំចំណុចប្រែប្រួលតាម sin — ធំនៅកណ្តាល តូចនៅសងខាង
        var progress = float(i) / float(total_dots - 1)
        var current_radius = lerp(14.0, 26.0, sin(progress * PI))

        draw_circle(local_pos, current_radius, Color.WHITE)
```

!!! info "ហេតុអ្វីគន្លងទាយត្រូវនឹងការពិត?"
    ព្រោះវាប្រើ **រូបមន្តដូចគ្នា** នឹង `arrow.gd`៖
    `velocity.y += 980×delta` និង `position += velocity×delta` គឺជាការដោះស្រាយ
    (integrate) សមីការ `p(t) = p₀ + v₀t + ½gt²` តាមវិធី Euler។ ល្បឿនដំបូង
    `1200×power` ក៏ដូចគ្នាដែរ។ ភាពខុសគ្នាតែមួយគត់៖ Euler integration មាន
    កំហុសបន្តិចបន្តួចធៀបនឹងរូបមន្ត analytical ដូច្នេះចំណុចទី ៥ អាចខុសពី
    ព្រួញពិតបន្តិច — មិនគួរឱ្យកត់សម្គាល់ក្នុងការលេងជាក់ស្តែងទេ។

## ៦. `release_arrow()` — បាញ់!

```gdscript
# player.gd បន្ទាត់ ១៩០–២៤២ (សង្ខេប)
func release_arrow() -> void:
    if not is_charging:
        return
    is_charging = false
    train_offset = 0.0
    queue_redraw()               # លុបចំណុចគន្លង

    animation_player.play("shoot")   # លេង animation បាញ់ពេញលេញ
    if has_node("ShootAudio"):
        $ShootAudio.play()           # សំឡេងធ្នូ (Bow_Shoot.wav)

    if current_arrow and is_instance_valid(current_arrow):
        var spawn_pos = bow_hold_position.global_position  # ចង់ចាំទីតាំង

        # ប្តូរ parent: ពីដៃ → ទៅ scene មេ (ដើម្បីហោះដោយសេរី)
        current_arrow.get_parent().remove_child(current_arrow)
        get_tree().current_scene.add_child(current_arrow)

        current_arrow.global_position = spawn_pos  # ស្តារទីតាំងពិភពលោក
        current_arrow.scale = Vector2(0.2, 0.2)    # បង្រួមព្រួញពេលបាញ់
        current_arrow.visible = true

        # គណនាទិសដៅ + កម្លាំងដូចពេលទាញ
        var power_factor = clamp(drag_distance / max_drag_distance, 0.1, 1.0)
        var final_speed = 1200.0 * power_factor
        var shoot_dir = Vector2.RIGHT
        if drag_distance > 5.0:
            shoot_dir = -drag_vector.normalized()

        # ផ្ទេរទិន្នន័យទៅព្រួញ (duck typing ដូចគ្នា)
        if "direction" in current_arrow:
            current_arrow.direction = shoot_dir
        if "speed" in current_arrow:
            current_arrow.speed = final_speed
        if "is_stuck" in current_arrow:
            current_arrow.is_stuck = false    # ← ដោះកក! arrow.gd ចាប់ផ្តើមធ្វើចលនា

        current_arrow.rotation = shoot_dir.angle()
        current_arrow = null                  # លែងកាន់ reference

    # រង់ចាំ animation បញ្ចប់ រួចត្រឡប់ទៅ idle
    await animation_player.animation_finished
    animation_player.play("idle")
```

ចំណុចសំខាន់៖

1. **Reparenting ម្តងទៀត** — ព្រួញចេញពីដៃទៅ scene មេ ព្រោះដៃនៅតែ
   ផ្លាស់ទីតាម animation ប៉ុន្តែព្រួញត្រូវហោះដោយសេរី
2. **`scale = Vector2(0.2, 0.2)`** — ព្រួញត្រូវបានគូរធំក្នុងដៃ (ដើម្បីស្របនឹង
   animation) ហើយបង្រួមពេលបាញ់ចេញ
3. **`await animation_player.animation_finished`** — GDScript async/await;
   កូដរង់ចាំ animation "shoot" ចប់មុនលេង "idle" វិញ

## ចំណុចគួរកត់សម្គាល់ពីសវនកម្ម

| ចំណុច | ស្ថានភាព | ព័ត៌មានលម្អិត |
| --- | --- | --- |
| node `TrajectoryLine` (Line2D) ក្នុង `player.tscn` | ⚠️ មិនប្រើ | `player.gd` គូរចំណុចដោយ `_draw()` ជំនួសវិញ; Line2D នៅសល់ពីការពិសោធន៍ |
| ក្រុម `"Player"` | ⚠️ មិនដែលត្រូវបានកំណត់ | `arrow.gd` ស្វែងរកវាដើម្បី raycast exception — សូមមើល [គោលគំនិត Godot ផ្នែក ៥](../fundamentals/godot-concepts.md) |
| `update_trajectory()` (បន្ទាត់ ១៤៨–១៤៩) | ⚠️ អនុគមន៍ទទេ | `pass` ប៉ុណ្ណោះ — សំណល់ placeholder |
| ការបាញ់លើកទីពីរដោយមិនលែងកណ្តុរ | ✅ មានការពារ | `start_charge()` លុប `current_arrow` ចាស់មុនបង្កើតថ្មី |

## លំហាត់

1. **សាកល្បង dead zone៖** ចុចកណ្តុរដោយមិនទាញ រួចលែង — អ្វីកើតឡើង?
   (ចម្លើយ៖ ព្រួញបាញ់ទៅស្តាំដោយល្បឿន ១២០ px/s ព្រោះ power ត្រូវបាន clamp ទៅ ០.១)
2. **គណនា៖** តើទាញចម្ងាយប៉ុន្មានភីកសែល ទើបបានល្បឿនព្រួញ ៦០០ px/s?
   (ចម្លើយ៖ ១០០ px ព្រោះ ៦០០/១២០០ = ០.៥ → ០.៥ × ២០០ = ១០០)
3. **កែកូដ៖** ផ្លាស់ប្តូរ `max_drag_distance` តាម Inspector (មិនបាច់កែកូដ!) —
   ជ្រើសរើស node `Player` → Inspector → `Player.gd` → `Max Drag Distance`។
   សាក ១០០ និង ៤០០ ហើយសង្កេតភាពខុសគ្នា។

---

**បន្ទាប់៖** [ព្រួញ និងរូបវិទ្យា →](arrow.md)
