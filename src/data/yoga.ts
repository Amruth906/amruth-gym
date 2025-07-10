export interface YogaPose {
  name: string;
  difficulty:
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Beginner / Intermediate";
}

export interface YogaCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  poses: YogaPose[];
}

export const yogaCategories: YogaCategory[] = [
  {
    id: "standing",
    name: "Standing Poses",
    description:
      "Build strength, balance, and focus with foundational standing asanas.",
    icon: "🧍‍♂️",
    color: "bg-gradient-to-br from-green-200 to-blue-200",
    poses: [
      { name: "Tadasana", difficulty: "Beginner" },
      { name: "Uttanasana", difficulty: "Beginner" },
      { name: "Ardha Uttanasana", difficulty: "Beginner" },
      { name: "Adho Mukha Svanasana", difficulty: "Beginner" },
      { name: "Virabhadrasana I", difficulty: "Beginner" },
      { name: "Virabhadrasana II", difficulty: "Beginner" },
      { name: "Virabhadrasana III", difficulty: "Intermediate" },
      { name: "Utkatasana", difficulty: "Beginner" },
      { name: "Parsvottanasana (Pyramid Pose)", difficulty: "Intermediate" },
      { name: "Utthita Parsvakonasana", difficulty: "Intermediate" },
      { name: "Parivrtta Parsvakonasana", difficulty: "Intermediate" },
      { name: "Trikonasana", difficulty: "Beginner" },
      { name: "Parivrtta Trikonasana", difficulty: "Intermediate" },
      { name: "Ardha Chandrasana (Half Moon)", difficulty: "Intermediate" },
      {
        name: "Baddha Virabhadrasana (Humble Warrior)",
        difficulty: "Intermediate",
      },
      { name: "Urdhva Prasarita Eka Padasana", difficulty: "Beginner" },
      { name: "Vrksasana (Tree Pose)", difficulty: "Beginner / Intermediate" },
      { name: "Parivrtta Hasta Padangusthasana", difficulty: "Advanced" },
      { name: "Utthita Hasta Padangusthasana", difficulty: "Intermediate" },
      {
        name: "Ardha Padmasana Standing (Standing Half-Lotus)",
        difficulty: "Intermediate",
      },
    ],
  },
  {
    id: "seated",
    name: "Seated & Forward Bends",
    description:
      "Stretch and relax with classic seated and forward bending poses.",
    icon: "🪷",
    color: "bg-gradient-to-br from-pink-100 to-yellow-100",
    poses: [
      { name: "Sukhasana", difficulty: "Beginner" },
      { name: "Virasana", difficulty: "Beginner" },
      { name: "Dandasana", difficulty: "Intermediate" },
      { name: "Paschimottanasana", difficulty: "Beginner" },
      { name: "Baddha Konasana", difficulty: "Beginner" },
      { name: "Agnistambhasana (Fire Log)", difficulty: "Beginner" },
      {
        name: "Upavistha Konasana (Wide Angle Seated Fold)",
        difficulty: "Intermediate",
      },
      { name: "Gomukhasana", difficulty: "Beginner" },
      { name: "Krounchasana (Heron's Pose)", difficulty: "Intermediate" },
      { name: "Marichyasana A", difficulty: "Beginner" },
      { name: "Marichyasana III", difficulty: "Intermediate" },
      { name: "Ardha Matsyendrasana", difficulty: "Intermediate" },
      {
        name: "Parivrtta Upavistha Konasana (Seated Side Bend Twist)",
        difficulty: "Intermediate",
      },
      { name: "Padmasana", difficulty: "Advanced" },
      { name: "Baddha Padmasana (Bound Lotus)", difficulty: "Advanced" },
    ],
  },
  {
    id: "twists",
    name: "Twists",
    description: "Detoxify and increase spinal mobility with twisting asanas.",
    icon: "🌀",
    color: "bg-gradient-to-br from-blue-100 to-purple-100",
    poses: [
      { name: "Supta Matsyendrasana (Supine Twist)", difficulty: "Beginner" },
      {
        name: "Ardha Matsyendrasana (Seated Spinal Twist)",
        difficulty: "Intermediate",
      },
      {
        name: "Parivrtta Utkatasana (Revolved Chair)",
        difficulty: "Intermediate",
      },
      {
        name: "Parivrtta Parsvakonasana (Revolved Side Angle)",
        difficulty: "Intermediate",
      },
      {
        name: "Parivrtta Trikonasana (Revolved Triangle)",
        difficulty: "Intermediate",
      },
      {
        name: "Parivrtta Anjaneyasana (Low Lunge Twist)",
        difficulty: "Intermediate",
      },
    ],
  },
  {
    id: "balancing",
    name: "Balancing Poses",
    description: "Challenge your stability and focus with balancing postures.",
    icon: "🌳",
    color: "bg-gradient-to-br from-green-100 to-lime-100",
    poses: [
      { name: "Vrksasana (Tree Pose)", difficulty: "Beginner / Intermediate" },
      { name: "Ardha Chandrasana (Half Moon)", difficulty: "Intermediate" },
      { name: "Eka Pada Galavasana (Flying Pigeon)", difficulty: "Advanced" },
      {
        name: "Baddha Ardha Chandrasana (Bound Half Moon)",
        difficulty: "Intermediate",
      },
      { name: "Utthita Hasta Padangusthasana", difficulty: "Intermediate" },
      { name: "Svarga Dvijasana (Bird of Paradise)", difficulty: "Advanced" },
      { name: "Eka Pada Bakasana (One-Leg Crow)", difficulty: "Advanced" },
      { name: "Toe Stand (Padangusthasana Variation)", difficulty: "Advanced" },
    ],
  },
  {
    id: "core-arm",
    name: "Core & Arm Strength",
    description: "Build core and arm power with challenging strength poses.",
    icon: "💪",
    color: "bg-gradient-to-br from-yellow-100 to-orange-100",
    poses: [
      { name: "Bakasana (Crow Pose)", difficulty: "Intermediate" },
      { name: "Parsva Bakasana (Side Crow)", difficulty: "Intermediate" },
      { name: "Chaturanga Dandasana", difficulty: "Intermediate" },
      { name: "Navasana (Boat Pose)", difficulty: "Intermediate" },
      { name: "Paripurna Navasana (Full Boat)", difficulty: "Advanced" },
      { name: "Lolasana (Pendant Pose)", difficulty: "Advanced" },
      { name: "Forearm Plank", difficulty: "Advanced" },
      { name: "Vasisthasana (Side Plank)", difficulty: "Intermediate" },
      {
        name: "Bhujapidasana (Shoulder Pressing Pose)",
        difficulty: "Advanced",
      },
      { name: "Astavakrasana (Eight Angle Pose)", difficulty: "Advanced" },
      { name: "Mayurasana (Peacock Pose)", difficulty: "Advanced" },
      { name: "Eka Pada Koundinyasana I & II", difficulty: "Advanced" },
      { name: "Maksikanagasana (Dragonfly)", difficulty: "Advanced" },
      { name: "Devaduuta Panna Asana (Fallen Angel)", difficulty: "Advanced" },
      { name: "Dwi Pada Koundinyasana", difficulty: "Advanced" },
      { name: "Hollow Body Hold", difficulty: "Advanced" },
      { name: "V-Up", difficulty: "Advanced" },
    ],
  },
  {
    id: "backbends",
    name: "Backbends",
    description: "Open your heart and spine with energizing backbends.",
    icon: "🧘‍♀️",
    color: "bg-gradient-to-br from-purple-100 to-pink-100",
    poses: [
      { name: "Bhujangasana (Cobra)", difficulty: "Beginner" },
      { name: "Ustrasana (Camel Pose)", difficulty: "Intermediate" },
      { name: "Chakrasana (Wheel)", difficulty: "Advanced" },
      { name: "Setu Bandhasana (Bridge)", difficulty: "Beginner" },
      { name: "Salabhasana (Locust)", difficulty: "Beginner" },
      { name: "Raja Bhujangasana (King Cobra)", difficulty: "Advanced" },
      { name: "Urdhva Dhanurasana (Upward Bow)", difficulty: "Intermediate" },
      { name: "Sugarcane Pose (Chapasana)", difficulty: "Intermediate" },
      { name: "Natarajasana (Dancer Pose)", difficulty: "Intermediate" },
      { name: "Camatkarasana (Wild Thing)", difficulty: "Intermediate" },
      {
        name: "King Pigeon (Eka Pada Rajakapotasana III)",
        difficulty: "Advanced",
      },
      { name: "One-Leg King Pigeon II", difficulty: "Advanced" },
      { name: "Ganda Bherundasana (Chinstand)", difficulty: "Advanced" },
      { name: "Tiger with Bow", difficulty: "Advanced" },
      { name: "Raja Kapotasana (Pigeon King)", difficulty: "Advanced" },
    ],
  },
  {
    id: "inversions",
    name: "Inversions",
    description: "Flip your perspective and build confidence with inversions.",
    icon: "🤸‍♂️",
    color: "bg-gradient-to-br from-blue-200 to-indigo-200",
    poses: [
      { name: "Sarvangasana (Shoulder Stand)", difficulty: "Beginner" },
      { name: "Halasana (Plow Pose)", difficulty: "Beginner" },
      { name: "Sirsasana (Headstand)", difficulty: "Advanced" },
      { name: "Pincha Mayurasana (Forearm Stand)", difficulty: "Advanced" },
      { name: "Adho Mukha Vrksasana (Handstand)", difficulty: "Advanced" },
      {
        name: "Salamba Sarvangasana (Supported Shoulderstand)",
        difficulty: "Advanced",
      },
      { name: "Padmasana in Sirsasana", difficulty: "Advanced" },
      { name: "Mayurasana in Sirsasana", difficulty: "Advanced" },
    ],
  },
  {
    id: "restorative",
    name: "Restorative & Yin Poses",
    description: "Relax, restore, and rejuvenate with gentle and yin postures.",
    icon: "🌬️",
    color: "bg-gradient-to-br from-gray-100 to-blue-100",
    poses: [
      { name: "Viparita Karani (Legs-Up-the-Wall)", difficulty: "Beginner" },
      { name: "Balasana (Child’s Pose)", difficulty: "Beginner" },
      { name: "Savasana (Corpse Pose)", difficulty: "Beginner" },
      {
        name: "Supta Baddha Konasana (Reclining Bound Angle)",
        difficulty: "Beginner",
      },
      { name: "Makarasana (Crocodile)", difficulty: "Advanced" },
      { name: "Karuna Pidasana (Snail Pose)", difficulty: "Advanced" },
      { name: "Supta Virasana (Saddle Pose)", difficulty: "Advanced" },
      { name: "Dragon Pose (Yin)", difficulty: "Advanced" },
      { name: "Caterpillar Pose (Yin Forward Fold)", difficulty: "Advanced" },
      { name: "Deer Pose", difficulty: "Advanced" },
      { name: "Supported Fish Pose", difficulty: "Intermediate" },
      { name: "Reclined Butterfly", difficulty: "Beginner" },
    ],
  },
];
