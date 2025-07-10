import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { YogaPose } from "../data/yoga";

// Extend YogaPose for this file to include extra fields
interface YogaSessionPose extends YogaPose {
  duration?: number;
  calories?: number;
  purpose?: string;
  explanation?: string;
  procedure?: string;
}

interface YogaSessionLog {
  category: string;
  poses: Array<YogaPose & { duration?: number; calories?: number }>;
  completedAt: string;
}

const beginnerYogaPosesByDay: Record<string, any[]> = {
  mon: [
    {
      name: "Easy Pose (Sukhasana)",
      purpose: "Centering the body and mind",
      explanation:
        "A basic cross-legged posture that promotes groundedness and breath focus.",
      procedure:
        "Sit on the floor with legs crossed, spine straight, and hands resting on knees. Close your eyes and breathe deeply.",
      duration: "60",
    },
    {
      name: "Seated Cat-Cow (No Sanskrit Name)",
      purpose: "Spinal mobility",
      explanation:
        "Gently warms and lubricates the spine from a seated position.",
      procedure:
        "Sit cross-legged, hold knees. Inhale to arch the back (cow), exhale to round it forward (cat). Repeat gently.",
      duration: "60",
    },
    {
      name: "Easy Wind Thing (No Sanskrit Name)",
      purpose: "Gentle backbend",
      explanation: "Opens the chest with a soft arch.",
      procedure:
        "From seated, place hands behind hips, fingers facing forward, and gently lift the chest and heart.",
      duration: "30",
    },
    {
      name: "Seated Forward Fold (Paschimottanasana)",
      purpose: "Stretching spine and hamstrings",
      explanation: "Deep forward stretch that calms the nervous system.",
      procedure:
        "Sit with legs extended forward, reach arms up, and fold over legs while keeping spine long.",
      duration: "45",
    },
    {
      name: "Wind-Relieving Pose (Pavanamuktasana)",
      purpose: "Digestive support",
      explanation:
        "Compresses the abdomen to release gas and stimulate organs.",
      procedure:
        "Lie on your back, bring one or both knees to the chest, and hug them in. Hold and breathe.",
      duration: "45",
    },
    {
      name: "Supine Spinal Twist (Supta Matsyendrasana)",
      purpose: "Spinal twist and detoxification",
      explanation: "Rotates the spine while stimulating digestion.",
      procedure:
        "Lie on your back, bring one knee across the body, and twist toward the opposite side with outstretched arms.",
      duration: "45",
    },
    {
      name: "Supported Fish Pose (Matsyasana Variation)",
      purpose: "Heart and chest opening",
      explanation: "Passive chest opener using support.",
      procedure:
        "Lie back on a bolster or block under shoulder blades, arms relaxed out, chest lifted.",
      duration: "60",
    },
    {
      name: "Legs Up the Wall (Viparita Karani)",
      purpose: "Circulation improvement",
      explanation: "Inversion that reduces fatigue and calms the body.",
      procedure:
        "Lie on your back and extend your legs vertically up a wall, arms resting by your sides.",
      duration: "90",
    },
    {
      name: "Child’s Pose (Balasana)",
      purpose: "Full-body relaxation",
      explanation: "A restful pose for surrender and calming.",
      procedure:
        "Kneel on the floor, sit on your heels, fold forward, and rest your forehead and arms on the mat.",
      duration: "60",
    },
  ],
  tue: [
    {
      name: "Mountain Pose (Tadasana)",
      purpose: "Foundation of all standing poses",
      explanation: "Builds posture awareness and balance.",
      procedure:
        "Stand tall with feet together, arms at sides, lift chest, engage thighs, breathe deeply.",
      duration: "30",
    },
    {
      name: "Standing Forward Fold (Uttanasana)",
      purpose: "Stretches hamstrings and spine",
      explanation: "Promotes relaxation and spinal decompression.",
      procedure:
        "Hinge at hips to fold forward, knees soft, hands toward floor or shins.",
      duration: "45",
    },
    {
      name: "Half Forward Fold (Ardha Uttanasana)",
      purpose: "Warms up hamstrings and lengthens spine",
      explanation: "A transition pose that builds awareness of back extension.",
      procedure:
        "From forward fold, lift torso halfway, place hands on shins, flatten the back.",
      duration: "30",
    },
    {
      name: "Chair Pose (Utkatasana)",
      purpose: "Builds lower body and core strength",
      explanation:
        "Simulates sitting in a chair to engage muscles and improve endurance.",
      procedure:
        "Stand with feet together, bend knees, lift arms overhead, and shift weight to heels.",
      duration: "30",
    },
    {
      name: "Standing Side Bend (No Sanskrit Name)",
      purpose: "Lateral spine stretch",
      explanation: "Helps elongate side body and improve mobility.",
      procedure:
        "Stand tall, raise one arm overhead, and gently bend to the opposite side. Switch sides.",
      duration: "30",
    },
    {
      name: "Triangle Pose (Trikonasana)",
      purpose: "Full-body extension",
      explanation: "Builds strength and stretches legs, hips, and torso.",
      procedure:
        "Step feet wide, extend front arm and reach forward to tilt torso over front leg, raise top arm.",
      duration: "45",
    },
    {
      name: "Warrior I (Virabhadrasana I)",
      purpose: "Builds strength and balance",
      explanation: "Strengthens legs and arms while improving focus.",
      procedure:
        "Lunge one foot back, front knee bent, arms raised, hips face forward.",
      duration: "30",
    },
    {
      name: "Warrior II (Virabhadrasana II)",
      purpose: "Stability and leg endurance",
      explanation: "Opens hips and builds stamina.",
      procedure:
        "From Warrior I, open hips to side, stretch arms parallel, gaze over front hand.",
      duration: "30",
    },
    {
      name: "Tree Pose (Vrksasana)",
      purpose: "Enhances balance and mental clarity",
      explanation: "One-legged standing pose to improve concentration.",
      procedure:
        "Shift weight to one leg, place opposite foot on calf or thigh, palms together at chest.",
      duration: "30",
    },
  ],
  wed: [
    {
      name: "Garland Pose (Malasana)",
      purpose: "Hip and groin opening",
      explanation:
        "Deep squat that encourages flexibility and pelvic floor engagement.",
      procedure:
        "Squat with feet slightly wider than hips, hands in prayer at chest, elbows press knees open.",
      duration: "45",
    },
    {
      name: "Hero Pose (Virasana)",
      purpose: "Thigh and knee stretch",
      explanation: "Seated posture improving posture and digestion.",
      procedure:
        "Kneel on the floor with knees together, sit back between heels. Use a block if needed.",
      duration: "45",
    },
    {
      name: "Bound Angle Pose (Baddha Konasana)",
      purpose: "Inner thigh stretch",
      explanation: "Promotes relaxation and hip mobility.",
      procedure:
        "Sit tall, press soles of feet together, let knees drop, hold feet.",
      duration: "60",
    },
    {
      name: "Fire Log Pose (Agnistambhasana)",
      purpose: "Outer hip opener",
      explanation: "Deep hip stretch in stacked-leg seated pose.",
      procedure:
        "Sit cross-legged, stack one shin atop the other, flex feet, lean forward if comfortable.",
      duration: "45",
    },
    {
      name: "Cow Face Pose (Gomukhasana)",
      purpose: "Shoulder and hip opening",
      explanation: "Twisted seated position improving joint flexibility.",
      procedure:
        "Cross one leg over the other, knees stacked. Reach one arm up, the other behind, and try to clasp hands.",
      duration: "30",
    },
    {
      name: "Gate Pose (Parighasana)",
      purpose: "Side body stretch",
      explanation: "Lengthens torso and improves lateral mobility.",
      procedure:
        "Kneel on one knee, extend the other leg to the side, reach over the extended leg.",
      duration: "30",
    },
    {
      name: "Wide-Leg Forward Fold (Prasarita Padottanasana)",
      purpose: "Hamstring and spine release",
      explanation: "Calms the mind while stretching legs.",
      procedure:
        "Stand with feet wide, hinge at hips, fold forward, hands on floor.",
      duration: "45",
    },
    {
      name: "Reclining Bound Angle Pose (Supta Baddha Konasana)",
      purpose: "Gentle hip opening",
      explanation: "Passive reclined stretch for rest and digestion.",
      procedure:
        "Lie on back, bring soles of feet together, knees apart, arms at sides.",
      duration: "60",
    },
    {
      name: "X-Legged Forward Fold (No Sanskrit Name)",
      purpose: "Gentle spine stretch",
      explanation:
        "Seated fold over crossed legs for introspection and flexibility.",
      procedure:
        "Sit cross-legged, reach forward with arms, fold torso gently over legs.",
      duration: "45",
    },
  ],
  thu: [
    {
      name: "Standing Foot Lift (No Sanskrit Name)",
      purpose: "Balance and core activation",
      explanation: "Enhances stability by challenging single-leg standing.",
      procedure:
        "Stand tall, lift one foot a few inches off the floor, hands at hips or in prayer. Keep spine straight and gaze steady.",
      duration: "30",
    },
    {
      name: "Reverse Table Top (Ardha Purvottanasana)",
      purpose: "Opens shoulders and strengthens core",
      explanation:
        "Engages the back and shoulders while stretching the front body.",
      procedure:
        "Sit with knees bent, hands behind hips fingers forward. Press into hands and feet, lift hips to align with knees.",
      duration: "30",
    },
    {
      name: "Locust Pose (Salabhasana)",
      purpose: "Strengthens back, glutes, and hamstrings",
      explanation: "Strengthens posterior muscles and supports spine.",
      procedure:
        "Lie on belly, arms by sides, lift chest, arms, and legs simultaneously. Gaze down.",
      duration: "30",
    },
    {
      name: "Lazy Pigeon (No Sanskrit Name)",
      purpose: "Passive hip opener",
      explanation: "Relaxes deep hip muscles.",
      procedure:
        "From all fours, slide one knee forward between hands, extend opposite leg back, rest torso down.",
      duration: "45",
    },
    {
      name: "Sukhasana Forward Fold (No Sanskrit Name)",
      purpose: "Seated forward fold for calmness",
      explanation: "Encourages spinal release in cross-legged position.",
      procedure:
        "Sit in Easy Pose, reach arms forward and gently fold over legs.",
      duration: "45",
    },
    {
      name: "Standing Wide-Leg Bend with Twist (No Sanskrit Name)",
      purpose: "Spinal twist and hamstring stretch",
      explanation: "Adds rotation to classic forward fold.",
      procedure:
        "Stand with feet wide, fold forward, one hand on mat, twist torso, other hand reaches up. Switch sides.",
      duration: "30",
    },
    {
      name: "Supported Standing Backbend (No Sanskrit Name)",
      purpose: "Opens chest and spine",
      explanation: "Gentle standing backbend to counter sitting posture.",
      procedure:
        "Stand tall, hands on lower back, gently arch spine back, gaze upward.",
      duration: "30",
    },
    {
      name: "Corpse Pose (Savasana)",
      purpose: "Deep rest and integration",
      explanation: "Final relaxation for mind-body reset.",
      procedure:
        "Lie flat, arms relaxed, eyes closed. Let body release all effort.",
      duration: "90",
    },
    {
      name: "Plow Pose (Halasana)",
      purpose: "Deep spinal stretch and calming",
      explanation: "Soothes nerves and lengthens the back body.",
      procedure:
        "From Shoulder Stand, lower feet behind head to floor or blocks, arms extended or supporting back.",
      duration: "30",
    },
  ],
  fri: [
    {
      name: "Cat Pose (Marjaryasana)",
      purpose: "Spinal mobility",
      explanation: "Encourages flexion and relaxation through spinal rounds.",
      procedure:
        "On hands and knees, exhale and round spine upward, tucking chin.",
      duration: "30",
    },
    {
      name: "Cow Pose (Bitilasana)",
      purpose: "Spinal extension",
      explanation: "Counterpart to Cat, promoting backbend mobility.",
      procedure:
        "On hands and knees, inhale and arch spine, lifting chest and tailbone.",
      duration: "30",
    },
    {
      name: "Puppy Pose (Uttana Shishosana)",
      purpose: "Shoulder and upper spine release",
      explanation: "Combines child’s pose and downward dog elements.",
      procedure:
        "From hands and knees, walk arms forward and drop chest to mat, hips over knees.",
      duration: "45",
    },
    {
      name: "Cobra Pose (Bhujangasana)",
      purpose: "Back strength and heart opening",
      explanation: "Mild backbend that strengthens spine and opens chest.",
      procedure:
        "Lie on belly, hands under shoulders, gently lift chest using back muscles.",
      duration: "30",
    },
    {
      name: "Sphinx Pose (Salamba Bhujangasana)",
      purpose: "Gentle spinal curve",
      explanation: "An easy backbend to improve posture.",
      procedure:
        "Lie on belly, elbows under shoulders, lift chest while forearms stay grounded.",
      duration: "45",
    },
    {
      name: "Reclined Twist (Supta Matsyendrasana)",
      purpose: "Spinal decompression",
      explanation: "Lying twist for digestive and spinal relief.",
      procedure:
        "Lie on back, draw one knee across the body, opposite arm extended.",
      duration: "45",
    },
    {
      name: "Seated Twist (Easy) (Bharadvajasana I)",
      purpose: "Gentle torso twist",
      explanation: "Rotates spine while seated with minimal pressure.",
      procedure:
        "Sit cross-legged, twist torso to one side, hand on opposite knee.",
      duration: "30",
    },
    {
      name: "Yoga Squat with Bind (No Sanskrit Name)",
      purpose: "Hip opener and shoulder stretch",
      explanation: "Adds a twist and bind in low squat.",
      procedure:
        "From Malasana, reach one arm inside knee and bind with opposite arm behind back.",
      duration: "30",
    },
    {
      name: "Shoulder Stand (Sarvangasana)",
      purpose: "Inversion for circulation",
      explanation: "Reverses blood flow and activates thyroid.",
      procedure:
        "Lie on back, lift legs, hips and torso, support lower back with hands.",
      duration: "45",
    },
  ],
  sat: [
    {
      name: "Plow Pose (Halasana)",
      purpose: "Deep spinal stretch",
      explanation: "Follows Shoulder Stand for a calming inversion.",
      procedure:
        "From Shoulder Stand, lower feet behind head to floor or blocks.",
      duration: "30",
    },
    {
      name: "Lazy Pigeon (No Sanskrit Name)",
      purpose: "Passive hip opener",
      explanation: "Supports front leg for deep outer hip stretch.",
      procedure:
        "From all fours, bring one knee forward and lower shin to mat, extend back leg.",
      duration: "45",
    },
    {
      name: "Corpse Pose (Savasana)",
      purpose: "Total rest and assimilation",
      explanation: "Final resting posture to integrate practice.",
      procedure:
        "Lie on back, legs extended, arms relaxed, palms up. Let go of tension.",
      duration: "90",
    },
    {
      name: "Supported Standing Backbend (No Sanskrit Name)",
      purpose: "Gentle spinal extension",
      explanation: "Opens front body in a supported upright stance.",
      procedure:
        "Stand tall, place hands on lower back or hips, gently arch upper spine.",
      duration: "30",
    },
    {
      name: "Locust Pose (Salabhasana)",
      purpose: "Strengthens posterior chain",
      explanation: "Lifts chest and legs to strengthen back muscles.",
      procedure:
        "Lie face down, arms alongside body, lift chest, arms, and legs.",
      duration: "30",
    },
    {
      name: "Standing Forward Fold (Uttanasana)",
      purpose: "Spinal release and calm",
      explanation: "Stretches hamstrings and soothes the nervous system.",
      procedure: "Hinge at hips, fold forward with knees soft, let arms hang.",
      duration: "45",
    },
    {
      name: "Sukhasana Forward Fold (No Sanskrit Name)",
      purpose: "Seated release",
      explanation: "Forward fold from cross-legged for inner quiet.",
      procedure: "Sit in Easy Pose, extend arms forward and fold down.",
      duration: "45",
    },
    {
      name: "Standing Wide-Leg Bend with Twist (No Sanskrit Name)",
      purpose: "Full spine rotation",
      explanation: "Adds a twist to wide-leg forward fold.",
      procedure:
        "In wide stance, bend forward, one hand to floor, twist torso, raise other hand.",
      duration: "30",
    },
    {
      name: "Legs Up the Wall (Viparita Karani)",
      purpose: "Relaxation and circulation",
      explanation: "Passive inversion for full-body reset.",
      procedure:
        "Lie down and extend legs vertically against a wall, arms by side.",
      duration: "90",
    },
  ],
};

const intermediateYogaPosesByDay: Record<string, any[]> = {
  mon: [
    {
      name: "Revolved Triangle (Parivrtta Trikonasana)",
      purpose: "Strengthens legs, improves balance and twist",
      explanation:
        "Enhances coordination through rotation and hamstring engagement",
      procedure:
        "Start in Triangle Pose, rotate torso toward front leg, lower hand to outside of front foot, top arm extends upward",
      duration: "45",
    },
    {
      name: "Warrior III (Virabhadrasana III)",
      purpose: "Balance, back strength, hamstrings",
      explanation:
        "One-leg balancing pose that strengthens the posterior chain",
      procedure:
        "From standing, hinge forward and lift back leg until torso and leg are parallel to floor, arms reach forward or back",
      duration: "30",
    },
    {
      name: "High Lunge (Alanasana)",
      purpose: "Builds strength, opens hip flexors",
      explanation: "Strengthens quads and opens psoas muscles",
      procedure:
        "Step one foot forward and bend the knee, extend back leg, arms reach up",
      duration: "30",
    },
    {
      name: "Crescent Lunge (Anjaneyasana Variation)",
      purpose: "Boosts balance and coordination",
      explanation: "Elevates lunging posture with deeper focus on control",
      procedure: "From High Lunge, slightly tilt back, arms up, core engaged",
      duration: "30",
    },
    {
      name: "Revolved Chair Pose (Parivrtta Utkatasana)",
      purpose: "Builds leg/core strength, deep spinal twist",
      explanation: "Intense twisting pose engaging inner thighs and core",
      procedure:
        "From Chair Pose, bring palms to prayer at chest and twist elbow outside opposite knee",
      duration: "30",
    },
    {
      name: "Chair Twist with Prayer (Parivrtta Utkatasana Variation)",
      purpose: "Enhances twist, improves digestion",
      explanation: "Deepens the twist with engaged spine and focused breathing",
      procedure:
        "Same as Revolved Chair but hold prayer hands and extend gaze upward",
      duration: "30",
    },
    {
      name: "Twisted Forward Fold (Parivrtta Uttanasana)",
      purpose: "Deepens spinal twist and hamstring stretch",
      explanation: "Enhances flexibility and mobility in hamstrings",
      procedure:
        "From Forward Fold, place one hand on the floor and twist torso upward, other hand reaches to sky",
      duration: "30",
    },
    {
      name: "Standing Backbend",
      purpose: "Opens chest, strengthens lower back",
      explanation: "Encourages spinal flexibility and shoulder opening",
      procedure: "Stand tall, hands on lower back, gently arch spine backward",
      duration: "30",
    },
    {
      name: "High Prayer Variation",
      purpose: "Deepens heart opening",
      explanation: "A variation of the backbend with arms in prayer",
      procedure:
        "From Standing Backbend, bring hands together overhead or at heart while arching back",
      duration: "30",
    },
  ],
  tue: [
    {
      name: "Lizard Pose (Utthan Pristhasana)",
      purpose: "Deep hip opener",
      explanation: "Improves hip flexibility and stretches inner thighs",
      procedure:
        "From Low Lunge, bring both hands inside front foot, drop back knee if needed",
      duration: "45",
    },
    {
      name: "Easy Lizard",
      purpose: "Gentle version for beginners",
      explanation: "Same as Lizard with more support or cushions",
      procedure:
        "Use yoga blocks under hands or forearms for a gentler stretch",
      duration: "45",
    },
    {
      name: "Pigeon Base (Eka Pada Rajakapotasana Prep)",
      purpose: "Prepares hips and spine for backbends",
      explanation: "Loosens hips and stimulates digestion",
      procedure:
        "Bring front shin across mat while extending back leg, keep torso upright or fold forward",
      duration: "45",
    },
    {
      name: "Mermaid Pose (Eka Pada Rajakapotasana II)",
      purpose: "Hip and back flexibility",
      explanation: "Enhances mobility and prepares for deeper backbends",
      procedure:
        "From Pigeon, bend back leg and grab foot with same-side hand, open chest",
      duration: "30",
    },
    {
      name: "Bound Side Angle (Baddha Parsvakonasana)",
      purpose: "Opens shoulders, twists, and legs",
      explanation: "Combines deep side lunge and shoulder bind",
      procedure:
        "From Side Angle Pose, wrap bottom arm under leg, clasp top hand behind back",
      duration: "30",
    },
    {
      name: "Bound Half Moon (Baddha Ardha Chandrasana)",
      purpose: "Advanced balancing hip opener",
      explanation: "Strengthens legs and glutes while improving focus",
      procedure:
        "From Half Moon, reach lower hand toward ground, bind top arm behind back",
      duration: "30",
    },
    {
      name: "Half Moon (Ardha Chandrasana)",
      purpose: "Strength, flexibility, and balance",
      explanation: "Strengthens standing leg, opens chest and hips",
      procedure:
        "From Triangle, place front hand on floor, lift back leg parallel, top arm up",
      duration: "30",
    },
    {
      name: "Standing Foot to Finger (Utthita Hasta Padangusthasana)",
      purpose: "Hamstring opener, improves focus",
      explanation: "Deepens balance and stretches hamstring",
      procedure:
        "Stand on one leg, extend opposite leg forward holding big toe",
      duration: "30",
    },
    {
      name: "Foot to Finger 3 (Variation)",
      purpose: "Balance with lifted leg",
      explanation: "Dynamic version requiring more control",
      procedure: "Same as previous but with arms extended or twisting torso",
      duration: "30",
    },
  ],
  wed: [
    {
      name: "Extended Side Angle (Utthita Parsvakonasana)",
      purpose: "Lengthens side body and spine",
      explanation:
        "Improves alignment, strength, and openness through the side body",
      procedure:
        "From Warrior II, lower front arm to thigh or floor, top arm extends overhead",
      duration: "30",
    },
    {
      name: "Wide Fold with Hands Behind",
      purpose: "Shoulder stretch with deep fold",
      explanation: "Deepens forward fold while stretching shoulders",
      procedure:
        "Interlace fingers behind back, fold forward from wide-legged stance, arms overhead",
      duration: "30",
    },
    {
      name: "Pyramid Pose (Parsvottanasana)",
      purpose: "Hamstring lengthening with balance",
      explanation: "Stretches legs and improves concentration",
      procedure:
        "Step one foot forward, both legs straight, fold over front leg",
      duration: "30",
    },
    {
      name: "Awkward Pose (Utkata Konasana Variation)",
      purpose: "Builds leg and core stamina",
      explanation: "Strengthens lower body through deep squat",
      procedure: "Feet wide, bend knees deeply, arms extended forward or up",
      duration: "30",
    },
    {
      name: "Standing Half-Lotus (Ardha Padmasana Standing)",
      purpose: "Improves balance and hip mobility",
      explanation: "Opens hips and enhances focus",
      procedure:
        "Stand on one foot, place opposite foot on thigh, hold in prayer or forward fold",
      duration: "30",
    },
    {
      name: "Upward Facing Bound Angle (Supta Baddha Konasana)",
      purpose: "Reclined hip opener",
      explanation: "Releases tension from pelvis and groin",
      procedure: "Lie back with soles of feet together, knees drop to sides",
      duration: "60",
    },
    {
      name: "Staff Pose (Dandasana)",
      purpose: "Prepares for forward folds",
      explanation: "Strengthens spine and activates leg muscles",
      procedure:
        "Sit tall with legs extended forward, flex feet, hands by hips",
      duration: "30",
    },
    {
      name: "Seated Hero (Virasana – Seated)",
      purpose: "Aids digestion, stretches thighs",
      explanation: "Promotes calm breathing and posture",
      procedure:
        "Kneel with feet beside hips, sit between heels on floor or block",
      duration: "60",
    },
    {
      name: "Cow Face Forward Fold (Gomukhasana Variation)",
      purpose: "Combines deep shoulder and hip stretch",
      explanation: "Adds a forward fold to classic seated stretch",
      procedure: "Sit in Cow Face Pose and gently fold forward over legs",
      duration: "45",
    },
  ],
  thu: [
    {
      name: "Wild Thing (Camatkarasana)",
      purpose: "Opens chest, strengthens arms and legs",
      explanation: "A playful backbend to energize the body",
      procedure:
        "From Downward Dog, lift one leg, flip it behind as chest opens upward",
      duration: "30",
    },
    {
      name: "Easy Wild Thing (Variation)",
      purpose: "Beginner-friendly version",
      explanation: "Focuses on lifting heart and grounding through the foot",
      procedure:
        "From side plank, drop bottom knee and arch back with lifted arm",
      duration: "30",
    },
    {
      name: "Dancer (Natarajasana)",
      purpose: "Improves grace, balance, back flexibility",
      explanation: "Combines balance and a deep chest opening",
      procedure:
        "Stand tall, grab back foot with hand and extend other arm forward, chest lifts",
      duration: "30",
    },
    {
      name: "Camel (Ustrasana)",
      purpose: "Opens front body, strengthens back",
      explanation: "A strong backbend that stretches chest, abs, and thighs",
      procedure:
        "Kneel upright, hands on heels or lower back, arch back and gaze upward",
      duration: "30",
    },
    {
      name: "Camel Twist (Parivrtta Ustrasana)",
      purpose: "Adds spinal twist to deep heart opener",
      explanation: "Twisting variation of Camel for enhanced mobility",
      procedure:
        "From Camel, reach one arm to opposite heel, other arm extends upward",
      duration: "30",
    },
    {
      name: "Bridge with One Leg Lifted (Setu Bandha Variation)",
      purpose: "Builds unilateral strength",
      explanation: "Strengthens glutes and spine while challenging balance",
      procedure:
        "In Bridge Pose, lift one leg straight up while keeping hips stable",
      duration: "30",
    },
    {
      name: "Single Bridge (Setu Bandha Variation)",
      purpose: "Unilateral bridge hold",
      explanation: "Isolates glutes and hamstrings one side at a time",
      procedure: "Same as standard bridge but one foot on floor, other lifted",
      duration: "30",
    },
    {
      name: "Full Cobra (Bhujangasana – Full)",
      purpose: "Deep spine strengthening",
      explanation: "Expands on regular Cobra with deeper engagement",
      procedure:
        "Lie on belly, hands under shoulders, press fully into arms lifting chest high",
      duration: "30",
    },
    {
      name: "Cobra with Twist (Bhujangasana Variation)",
      purpose: "Combines spinal extension and rotation",
      explanation: "Adds detoxifying twist to backbend",
      procedure: "From Cobra, twist torso and look over one shoulder",
      duration: "30",
    },
  ],
  fri: [
    {
      name: "Marichi's Pose (Marichyasana III)",
      purpose: "Spinal twist with bind",
      explanation: "Deep seated twist to detoxify and elongate spine",
      procedure:
        "Sit with one leg extended, other foot flat near thigh, twist toward bent knee, bind if accessible",
      duration: "30",
    },
    {
      name: "Seated Spinal Twist (Ardha Matsyendrasana)",
      purpose: "Promotes detoxification and spine flexibility",
      explanation: "Improves posture and digestion",
      procedure:
        "Sit cross-legged or one leg over the other, twist torso while using opposite elbow against knee",
      duration: "30",
    },
    {
      name: "Vishnu's Couch (Anantasana)",
      purpose: "Lateral core and leg control",
      explanation:
        "Strengthens obliques and improves balance while lying on side",
      procedure:
        "Lie on side, support head with hand, lift top leg and hold big toe",
      duration: "30",
    },
    {
      name: "Low Lunge with Twist (Parivrtta Anjaneyasana)",
      purpose: "Twisting variation of Low Lunge",
      explanation: "Opens hips, improves digestion, and strengthens legs",
      procedure:
        "From Low Lunge, twist torso toward front leg, opposite elbow outside knee",
      duration: "30",
    },
    {
      name: "Twisted Forward Fold (Parivrtta Uttanasana)",
      purpose: "Deepens spinal twist and hamstring stretch",
      explanation: "Boosts spinal health and calmness",
      procedure:
        "From standing, fold forward and place one hand on the ground while reaching opposite hand up",
      duration: "30",
    },
    {
      name: "Wide Stance Side Stretch",
      purpose: "Opens side body, stretches legs",
      explanation: "Enhances side mobility while stabilizing lower body",
      procedure:
        "From wide-legged stance, reach over to one side while keeping legs grounded",
      duration: "30",
    },
    {
      name: "Wide Stance Twisted Fold",
      purpose: "Combines twist and fold",
      explanation: "Deepens hamstring stretch and adds rotational detox",
      procedure:
        "From wide-leg forward fold, twist torso to one side and reach opposite hand up",
      duration: "30",
    },
    {
      name: "Chapasana (Sugarcane Pose)",
      purpose: "Balance, backbend, and quad stretch",
      explanation: "Integrates standing balance with hip and thigh flexibility",
      procedure:
        "From Half Moon Pose, bend back leg and grab foot with top hand",
      duration: "30",
    },
    {
      name: "Heron's Pose (Krounchasana)",
      purpose: "Hamstring and quad stretch",
      explanation: "Enhances leg flexibility and forward fold depth",
      procedure:
        "Sit, one leg extended forward, lift other foot toward chest and hold",
      duration: "30",
    },
  ],
  sat: [
    {
      name: "Bridge with One Leg Lifted (Setu Bandha Variation)",
      purpose: "Builds unilateral strength",
      explanation: "Strengthens glutes and spine while challenging balance",
      procedure:
        "In Bridge Pose, lift one leg straight up while keeping hips stable",
      duration: "30",
    },
    {
      name: "Crow Pose (Bakasana)",
      purpose: "Arm balance, strengthens wrists and core",
      explanation: "Develops arm and core control with focus and lift",
      procedure:
        "From squat, place hands shoulder-width, lift feet and balance knees on triceps",
      duration: "30",
    },
    {
      name: "Side Crow (Parsva Bakasana)",
      purpose: "Arm balance with twist",
      explanation: "Combines balance with core and shoulder engagement",
      procedure:
        "From a twist in squat, place hands down and shift weight into arms, legs stacked to side",
      duration: "30",
    },
    {
      name: "Bound Half Moon (Baddha Ardha Chandrasana)",
      purpose: "Advanced balancing hip opener",
      explanation: "Strengthens legs and glutes while improving focus",
      procedure:
        "From Half Moon, reach lower hand toward ground, bind top arm behind back",
      duration: "30",
    },
    {
      name: "Dancer’s Pose (Natarajasana)",
      purpose: "Improves grace, balance, back flexibility",
      explanation: "Combines balance and a deep chest opening",
      procedure:
        "Stand tall, grab back foot with hand and extend other arm forward, chest lifts",
      duration: "30",
    },
    {
      name: "Standing Foot to Finger (Utthita Hasta Padangusthasana)",
      purpose: "Hamstring opener, improves focus",
      explanation: "Deepens balance and stretches hamstring",
      procedure:
        "Stand on one leg, extend opposite leg forward holding big toe",
      duration: "30",
    },
    {
      name: "Foot to Finger 3 (Variation)",
      purpose: "Balance with lifted leg",
      explanation: "Dynamic version requiring more control",
      procedure: "Same as previous but with arms extended or twisting torso",
      duration: "30",
    },
    {
      name: "Vishnu’s Couch (Anantasana)",
      purpose: "Lateral core and leg control",
      explanation:
        "Strengthens obliques and improves balance while lying on side",
      procedure:
        "Lie on side, support head with hand, lift top leg and hold big toe",
      duration: "30",
    },
    {
      name: "Upward Facing Bow (Urdhva Dhanurasana)",
      purpose: "Advanced backbend",
      explanation: "Opens chest, shoulders, and spine; energizes body",
      procedure:
        "Lie on back, hands beside ears, press into feet and hands to lift into arch",
      duration: "30",
    },
  ],
};

const advancedYogaPosesByDay: Record<string, any[]> = {
  mon: [
    {
      name: "Handstand (Adho Mukha Vrksasana)",
      purpose: "Full-body strength, inversion control",
      explanation: "Builds arm, shoulder, and core strength",
      procedure:
        "From Downward Dog, kick up into handstand, align spine, engage core",
      duration: "30",
    },
    {
      name: "Forearm Stand (Pincha Mayurasana)",
      purpose: "Shoulder stability, core strength, balance",
      explanation: "Prepares for inversion stability",
      procedure: "Forearms down, lift hips, kick up or walk feet up wall",
      duration: "30",
    },
    {
      name: "Headstand (Sirsasana)",
      purpose: "Improves circulation, enhances focus",
      explanation: "Strengthens neck, spine, core",
      procedure: "Clasp hands, place crown down, lift hips and legs",
      duration: "45",
    },
    {
      name: "Side Crow (Parsva Bakasana)",
      purpose: "Arm balance with twist",
      explanation: "Strengthens obliques and arms",
      procedure: "From twist, plant hands and shift weight, lift legs",
      duration: "30",
    },
    {
      name: "Eight-Angle Pose (Astavakrasana)",
      purpose: "Arm strength, hip opening, spinal rotation",
      explanation: "Challenges balance and control",
      procedure: "Hook leg over shoulder, cross ankles, press and lift",
      duration: "30",
    },
    {
      name: "Firefly Pose (Tittibhasana)",
      purpose: "Arm balance, hamstring stretch",
      explanation: "Opens inner thighs and builds wrist strength",
      procedure: "Legs over arms, straighten legs, lift body",
      duration: "30",
    },
    {
      name: "Shoulder Pressing Pose (Bhujapidasana)",
      purpose: "Strengthens arms, opens hips",
      explanation: "Engages inner thighs and shoulders",
      procedure: "Arms between legs, cross feet, press and lift",
      duration: "30",
    },
    {
      name: "Flying Pigeon (Eka Pada Galavasana)",
      purpose: "Hip opener with balance",
      explanation: "Combines deep hip stretch and arm balance",
      procedure: "Cross ankle over opposite thigh, fold and lift",
      duration: "30",
    },
    {
      name: "Lolasana (Pendant Pose)",
      purpose: "Core and shoulder strength",
      explanation: "Builds lift-off power",
      procedure: "Cross legs, hands down, lift body off floor",
      duration: "30",
    },
    {
      name: "Crow Pose (Bakasana)",
      purpose: "Arm balance, strengthens wrists and core",
      explanation: "Builds confidence in balance",
      procedure: "Knees to triceps, shift forward, lift feet",
      duration: "30",
    },
  ],
  tue: [
    {
      name: "Bird of Paradise (Svarga Dvijasana)",
      purpose: "Balance, flexibility",
      explanation: "Requires hip, hamstring, and shoulder mobility",
      procedure: "Bind hands, lift leg while standing",
      duration: "30",
    },
    {
      name: "Bound Side Angle (Baddha Parsvakonasana)",
      purpose: "Opens shoulders, twists, and legs",
      explanation: "Intense full-body stretch",
      procedure: "From Side Angle, bind under leg and over back",
      duration: "30",
    },
    {
      name: "Pigeon King (Eka Pada Rajakapotasana III)",
      purpose: "Deep hip and back flexibility",
      explanation: "Advanced pigeon with backbend",
      procedure: "From Pigeon, bend back knee, reach arms overhead",
      duration: "30",
    },
    {
      name: "Mermaid Pose (Eka Pada Rajakapotasana II)",
      purpose: "Hip and back opening",
      explanation: "Transition pose toward King Pigeon",
      procedure: "Bend back leg, hold foot with elbow, link hands",
      duration: "30",
    },
    {
      name: "One-Leg King Pigeon II (Eka Pada Rajakapotasana II)",
      purpose: "Opens spine, shoulders, hips",
      explanation: "Full expression of deep backbend",
      procedure: "Same as above, deeper hold",
      duration: "30",
    },
    {
      name: "Bound Half Moon (Baddha Ardha Chandrasana)",
      purpose: "Advanced balance and hip opening",
      explanation: "Opens shoulders while balancing",
      procedure: "From Half Moon, bind the lifted foot behind",
      duration: "30",
    },
    {
      name: "Dancer Pose (Natarajasana)",
      purpose: "Grace, balance, backbend",
      explanation: "Stretches hip flexors and spine",
      procedure: "Grab ankle, reach forward and up",
      duration: "30",
    },
    {
      name: "King Dancer (Natarajasana Variation)",
      purpose: "Deep hip and spine opening",
      explanation: "More backbend than standard Dancer",
      procedure: "Lift leg higher, use both hands to hold foot",
      duration: "30",
    },
    {
      name: "Reverse Grip Pigeon (Eka Pada Rajakapotasana Variation)",
      purpose: "Opens quads and shoulders",
      explanation: "Deep backbend version of Pigeon",
      procedure: "Reach back for foot with both arms in overhead grip",
      duration: "30",
    },
  ],
  wed: [
    {
      name: "Scorpion Pose (Vrschikasana)",
      purpose: "Deep backbend and arm balance",
      explanation: "Combines flexibility and strength",
      procedure: "From Forearm Stand, arch spine, drop feet toward head",
      duration: "30",
    },
    {
      name: "Chin Stand (Ganda Bherundasana)",
      purpose: "Arm balance with backbend",
      explanation: "Opens spine, strengthens arms",
      procedure: "Lie forward, push into hands, lift legs and chest",
      duration: "30",
    },
    {
      name: "Chin Stand with Twist (Ganda Bherundasana Variation)",
      purpose: "Adds core rotation to backbend",
      explanation: "Twisting variation of chin stand",
      procedure: "Twist torso while legs lift and rotate",
      duration: "30",
    },
    {
      name: "Upward Facing Bow (Urdhva Dhanurasana)",
      purpose: "Opens front body",
      explanation: "Builds chest, back, shoulder strength",
      procedure: "Lie on back, bend knees and elbows, push into hands",
      duration: "30",
    },
    {
      name: "Full King Cobra (Raja Bhujangasana)",
      purpose: "Deep heart opener",
      explanation: "Extends spine and shoulders",
      procedure: "Lie on belly, push into arms, bend knees and reach back",
      duration: "30",
    },
    {
      name: "Camel Pose (Ustrasana)",
      purpose: "Opens chest, throat, and quads",
      explanation: "Improves posture and lung capacity",
      procedure: "Stand on knees, arch back, reach for heels",
      duration: "30",
    },
    {
      name: "Camel Twist (Parivrtta Ustrasana)",
      purpose: "Adds spinal twist",
      explanation: "Enhances mobility and stretch",
      procedure: "Twist while one hand stays on heel",
      duration: "30",
    },
    {
      name: "Tiger with Bow (Vyaghrasana Variation)",
      purpose: "Quad opener with backbend",
      explanation: "Engages glutes, spine",
      procedure: "From tabletop, grab foot with opposite hand",
      duration: "30",
    },
  ],
  thu: [
    {
      name: "Half Moon (Ardha Chandrasana)",
      purpose: "Balance, strength",
      explanation: "Works legs, hips, spine",
      procedure: "From Warrior II, shift forward, lift back leg, open chest",
      duration: "30",
    },
    {
      name: "Standing Splits Twist (Urdhva Prasarita Eka Padasana Var)",
      purpose: "Hamstring flexibility with twist",
      explanation: "Balance and flexibility challenge",
      procedure: "From fold, lift one leg and twist torso",
      duration: "30",
    },
    {
      name: "Toe Stand (Padangusthasana Variation)",
      purpose: "Strengthens feet, ankles, and knees",
      explanation: "Enhances focus and control",
      procedure: "From Tree, lower into squat and balance",
      duration: "30",
    },
    {
      name: "Standing Foot to Finger (Utthita Hasta Padangusthasana)",
      purpose: "Balance and hamstring opener",
      explanation: "Improves coordination",
      procedure: "Lift leg forward, grab toe and extend",
      duration: "30",
    },
    {
      name: "Foot to Finger 3 (Variation)",
      purpose: "Improves lifted-leg balance",
      explanation: "Enhances hip flexor endurance",
      procedure: "Extend leg forward with arm straight",
      duration: "30",
    },
    {
      name: "One-Arm Side Plank (Vasisthasana Variation)",
      purpose: "Core and arm strength",
      explanation: "Advanced stability hold",
      procedure: "From plank, roll to side, lift top arm",
      duration: "30",
    },
  ],
  fri: [
    {
      name: "Twisted Monkey (Anjaneyasana Twist Variation)",
      purpose: "Hamstrings and obliques stretch",
      explanation: "Deep hip opening with spinal rotation",
      procedure:
        "From Low Lunge, twist torso and reach back for foot with opposite hand",
      duration: "30",
    },
    {
      name: "Marichi's Pose (Marichyasana III)",
      purpose: "Spinal twist with bind",
      explanation: "Enhances flexibility and digestion",
      procedure:
        "Seated, bend one knee, twist toward it, wrap arm and clasp hands",
      duration: "30",
    },
    {
      name: "Seated Spinal Twist (Ardha Matsyendrasana)",
      purpose: "Detoxifies and increases spine mobility",
      explanation: "Engages internal organs and spine",
      procedure: "Sit, bend one leg, cross other over and twist",
      duration: "30",
    },
    {
      name: "Compass Pose (Parivrtta Surya Yantrasana)",
      purpose: "Hip, hamstring, and spinal rotation",
      explanation: "Advanced leg-over-shoulder twist",
      procedure: "Bring leg over shoulder, twist torso, and extend",
      duration: "30",
    },
    {
      name: "Revolved Side Angle (Parivrtta Parsvakonasana)",
      purpose: "Deep twisting strength-building lunge",
      explanation: "Detoxifies and energizes spine",
      procedure: "Twist torso in lunge and hook elbow to knee",
      duration: "30",
    },
    {
      name: "Chair Twist with Prayer (Parivrtta Utkatasana Variation)",
      purpose: "Core and leg strength, digestion",
      explanation: "Deep spinal twist from squat",
      procedure: "Twist torso in Chair Pose and press palms",
      duration: "30",
    },
    {
      name: "Twisted Forward Fold (Parivrtta Uttanasana)",
      purpose: "Spinal twist + hamstring lengthening",
      explanation: "Forward fold with rotation",
      procedure: "Fold, place one hand down, raise other arm",
      duration: "30",
    },
    {
      name: "Wide Stance Twisted Fold (Variation)",
      purpose: "Spine stimulation and side stretch",
      explanation: "Deep fold with torso twist",
      procedure: "Wide stance, twist while folding forward",
      duration: "30",
    },
    {
      name: "Boat Pose (Advanced) (Paripurna Navasana)",
      purpose: "Core and hip flexor strength",
      explanation: "Balancing V-shape hold",
      procedure: "Sit, lift legs and arms, balance on sit bones",
      duration: "30",
    },
  ],
  sat: [
    {
      name: "Crocodile Pose (Makarasana)",
      purpose: "Deep shoulder relaxation",
      explanation: "Grounding rest posture",
      procedure: "Lie belly-down, forehead on arms",
      duration: "60",
    },
    {
      name: "Saddle Pose (Supta Virasana Variation)",
      purpose: "Deep quad and front body release",
      explanation: "Passive recline between heels",
      procedure: "Sit between heels, recline back slowly",
      duration: "45",
    },
    {
      name: "Snail Pose (Karna Pidasana)",
      purpose: "Neck and spine stretch",
      explanation: "Deep passive fold from shoulderstand",
      procedure: "From Shoulderstand, bend knees to ears",
      duration: "45",
    },
    {
      name: "Caterpillar Pose (Yin Forward Fold)",
      purpose: "Passive hamstring stretch",
      explanation: "Encourages softening and calm",
      procedure: "Sit and fold forward gently, relax completely",
      duration: "60",
    },
    {
      name: "Dragon Pose (Yin Lizard Variation)",
      purpose: "Passive hip and groin opening",
      explanation: "Use gravity for deep stretch",
      procedure: "Step forward into Lizard, drop hips",
      duration: "30",
    },
    {
      name: "Deer Pose (Yin Reclined Twist Variation)",
      purpose: "Hip and spinal twist release",
      explanation: "Gentle stretch for low back and hips",
      procedure: "Sit with legs bent, twist torso gently",
      duration: "30",
    },
    {
      name: "Supported Shoulderstand (Salamba Sarvangasana)",
      purpose: "Calming inversion for lymph flow",
      explanation: "Balances circulation",
      procedure: "Lift torso/legs, support lower back with hands",
      duration: "45",
    },
    {
      name: "Bound Lotus (Baddha Padmasana)",
      purpose: "Advanced seated hip opener",
      explanation: "Full lotus with bind",
      procedure: "Sit in Lotus, clasp opposite toes behind back",
      duration: "30",
    },
    {
      name: "Lotus in Fish (Padmasana in Matsyasana)",
      purpose: "Chest and throat stretch",
      explanation: "Combines Lotus and Fish poses",
      procedure: "Lie back in Fish pose while in Lotus",
      duration: "30",
    },
    {
      name: "Peacock Feather (Mayurasana Variation)",
      purpose: "Strengthens arms, opens spine",
      explanation: "Backbend in forearm balance",
      procedure: "Enter Peacock, extend legs upward",
      duration: "30",
    },
  ],
};

const levels = ["Beginner", "Intermediate", "Advanced"];

export const YogaSessionPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { day } = useParams();

  // Pick poses for the current day and level
  let poses: YogaSessionPose[] = [];
  if (selectedLevel === "Beginner") {
    poses = (beginnerYogaPosesByDay[day || "mon"] || []).map((p) => ({
      ...p,
      duration: Number(p.duration) || 30,
      difficulty: p.difficulty || "Beginner",
    }));
  } else if (selectedLevel === "Intermediate") {
    poses = (intermediateYogaPosesByDay[day || "mon"] || []).map((p) => ({
      ...p,
      duration: Number(p.duration) || 30,
      difficulty: p.difficulty || "Intermediate",
    }));
  } else if (selectedLevel === "Advanced") {
    poses = (advancedYogaPosesByDay[day || "mon"] || []).map((p) => ({
      ...p,
      duration: Number(p.duration) || 30,
      difficulty: p.difficulty || "Advanced",
    }));
  } else {
    poses = [];
  }

  const handleBack = () => {
    // Try to go back in history, fallback to day selection page
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(`/day/${day || "mon"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-blue-200 pt-32 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center text-blue-700 hover:text-blue-900 font-semibold transition-colors duration-300"
        >
          ← Back
        </button>
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setExpandedIndex(null);
              }}
              className={`px-6 py-2 rounded-full font-bold text-lg shadow-md transition-all duration-200 border-2 focus:outline-none
                ${
                  selectedLevel === level
                    ? "bg-gradient-to-r from-green-400 to-blue-400 text-white border-blue-400 scale-105"
                    : "bg-white/70 text-blue-700 border-blue-200 hover:bg-blue-100"
                }
              `}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Poses List */}
        <div className="space-y-4 mb-10">
          {poses.length === 0 ? (
            <div className="text-center text-gray-500 text-xl py-12">
              No poses for this level yet.
            </div>
          ) : (
            poses.map((pose, idx) => (
              <div key={pose.name + idx}>
                <button
                  className={`w-full flex justify-between items-center bg-white/90 rounded-xl px-5 py-4 shadow-md text-left font-semibold text-blue-900 text-lg hover:bg-blue-50 transition-all duration-200 ${
                    expandedIndex === idx ? "ring-2 ring-blue-300" : ""
                  }`}
                  onClick={() =>
                    setExpandedIndex(expandedIndex === idx ? null : idx)
                  }
                >
                  <span>
                    {pose.name.replace(/\s*\(No Sanskrit Name\)/, "")}
                  </span>
                  <span className="ml-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-base border border-blue-200">
                    {pose.duration}s
                  </span>
                </button>
                {expandedIndex === idx && (
                  <div className="bg-white/95 rounded-b-xl shadow-inner px-5 py-4 border-t border-blue-100 animate-fadeIn">
                    <div className="mb-2 text-gray-700">
                      <span className="font-semibold">Purpose:</span>{" "}
                      {pose.purpose}
                    </div>
                    <div className="mb-2 text-gray-700">
                      <span className="font-semibold">Explanation:</span>{" "}
                      {pose.explanation}
                    </div>
                    <div className="mb-2 text-gray-700">
                      <span className="font-semibold">Procedure:</span>{" "}
                      {pose.procedure}
                    </div>
                    <div className="mb-4 text-green-700 font-semibold">
                      Suggested Duration: {pose.duration} seconds
                    </div>
                    {/* Empty video placeholder */}
                    <div className="w-full h-48 bg-blue-100 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center text-blue-400 text-xl">
                      Video Placeholder
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            className="px-10 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl font-bold rounded-full shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => {
              // Map day to a categoryId (for demo, use 'standing' for mon, 'seated' for tue, etc.)
              const dayToCategory: Record<string, string> = {
                mon: "standing",
                tue: "seated",
                wed: "twists",
                thu: "balancing",
                fri: "core-arm",
                sat: "backbends",
              };
              const categoryId = dayToCategory[day || "mon"] || "standing";
              navigate(`/yoga-tracker/${categoryId}`, {
                state: { poses, level: selectedLevel, day },
              });
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};
