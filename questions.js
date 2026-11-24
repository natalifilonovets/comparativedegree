const questions = [
  {
    "id": 1,
    "stage": 0,
    "type": "choose",
    "prompt": "This wooden house is ___ than that hut.",
    "correctAnswer": "bigger",
    "feedback": "Double the final consonant.",
    "rewardId": "foundation",
    "options": [
      "more bigger",
      "bigger",
      "biger"
    ]
  },
  {
    "id": 2,
    "stage": 0,
    "type": "choose",
    "prompt": "Playing with friends is ___ than playing alone.",
    "correctAnswer": "more enjoyable",
    "feedback": "Use more with this long adjective.",
    "rewardId": "floor",
    "options": [
      "more enjoyable",
      "enjoyabler",
      "more enjoyabler"
    ]
  },
  {
    "id": 3,
    "stage": 0,
    "type": "choose",
    "prompt": "This joke is ___ than the last one.",
    "correctAnswer": "funnier",
    "feedback": "Change consonant + y to i before adding -er.",
    "rewardId": "left-wall",
    "options": [
      "more funnier",
      "funnyer",
      "funnier"
    ]
  },
  {
    "id": 4,
    "stage": 0,
    "type": "choose",
    "prompt": "This path is ___ than the old one.",
    "correctAnswer": "safer",
    "feedback": "Think of the comparative form of safe.",
    "rewardId": "right-wall",
    "options": [
      "safer",
      "more safer",
      "safest"
    ]
  },
  {
    "id": 5,
    "stage": 0,
    "type": "choose",
    "prompt": "The new challenge is ___ than the first one.",
    "correctAnswer": "more difficult",
    "feedback": "Use more with this long adjective.",
    "rewardId": "back-wall",
    "options": [
      "more difficulter",
      "difficulter",
      "more difficult"
    ]
  },
  {
    "id": 6,
    "stage": 1,
    "type": "fix",
    "prompt": "This task is more easier than the last one.",
    "correctAnswer": "easier",
    "feedback": "Use ONE comparative marker: -er OR more, not both.",
    "rewardId": "front-wall",
    "fragment": "more easier",
    "groups": [
      "This task",
      "is",
      "more easier",
      "than",
      "the last one."
    ],
    "options": [
      "easiest",
      "easier",
      "easyer"
    ]
  },
  {
    "id": 7,
    "stage": 1,
    "type": "fix",
    "prompt": "This cave is dangerouser than our base.",
    "correctAnswer": "more dangerous",
    "feedback": "Use more with this long adjective.",
    "rewardId": "door",
    "fragment": "dangerouser",
    "groups": [
      "This cave",
      "is",
      "dangerouser",
      "than",
      "our base."
    ],
    "options": [
      "more dangerouser",
      "more dangerous",
      "dangerous"
    ]
  },
  {
    "id": 8,
    "stage": 1,
    "type": "fix",
    "prompt": "My new sword is more better than my old sword.",
    "correctAnswer": "better",
    "feedback": "This adjective has an irregular comparative.",
    "rewardId": "windows",
    "fragment": "more better",
    "groups": [
      "My new sword",
      "is",
      "more better",
      "than",
      "my old sword."
    ],
    "options": [
      "gooder",
      "best",
      "better"
    ]
  },
  {
    "id": 9,
    "stage": 1,
    "type": "fix",
    "prompt": "The blue tower is taller that the red tower.",
    "correctAnswer": "than",
    "feedback": "Use than to compare two things.",
    "rewardId": "roof",
    "fragment": "that",
    "groups": [
      "The blue tower",
      "is",
      "taller",
      "that",
      "the red tower."
    ],
    "options": [
      "than",
      "then",
      "to"
    ]
  },
  {
    "id": 10,
    "stage": 1,
    "type": "fix",
    "prompt": "The baby sheep is more smaller than its mother.",
    "correctAnswer": "smaller",
    "feedback": "Use ONE comparative marker: -er OR more, not both.",
    "rewardId": "chimney",
    "fragment": "more smaller",
    "groups": [
      "The baby sheep",
      "is",
      "more smaller",
      "than",
      "its mother."
    ],
    "options": [
      "more small",
      "smaller",
      "small"
    ]
  },
  {
    "id": 11,
    "stage": 2,
    "type": "stats",
    "prompt": "Compare the stats.",
    "correctAnswer": "Tower A is taller than Tower B.",
    "feedback": "Look at the numbers again.",
    "rewardId": "fence",
    "stats": [
      [
        "Tower A",
        "12 blocks high"
      ],
      [
        "Tower B",
        "8 blocks high"
      ]
    ],
    "options": [
      "Tower B is taller than Tower A.",
      "Tower A is more taller than Tower B.",
      "Tower A is taller than Tower B."
    ]
  },
  {
    "id": 12,
    "stage": 2,
    "type": "stats",
    "prompt": "Compare the stats.",
    "correctAnswer": "Chest A is heavier than Chest B.",
    "feedback": "Look at the numbers again.",
    "rewardId": "beds",
    "stats": [
      [
        "Chest A",
        "24 kg"
      ],
      [
        "Chest B",
        "15 kg"
      ]
    ],
    "options": [
      "Chest A is heavier than Chest B.",
      "Chest A is more heavier than Chest B.",
      "Chest B is heavier than Chest A."
    ]
  },
  {
    "id": 13,
    "stage": 2,
    "type": "stats",
    "prompt": "Compare the stats.",
    "correctAnswer": "The brown horse is faster than the red horse.",
    "feedback": "Look at the numbers again.",
    "rewardId": "irrigation",
    "stats": [
      [
        "Red horse",
        "6 blocks/sec"
      ],
      [
        "Brown horse",
        "9 blocks/sec"
      ]
    ],
    "options": [
      "The red horse is faster than the brown horse.",
      "The brown horse is faster than the red horse.",
      "The brown horse is more faster than the red horse."
    ]
  },
  {
    "id": 14,
    "stage": 2,
    "type": "stats",
    "prompt": "Compare the stats.",
    "correctAnswer": "Shield B is more expensive than Shield A.",
    "feedback": "Look at the numbers again.",
    "rewardId": "wheat",
    "stats": [
      [
        "Shield A",
        "15 coins"
      ],
      [
        "Shield B",
        "30 coins"
      ]
    ],
    "options": [
      "Shield B is expensiver than Shield A.",
      "Shield A is more expensive than Shield B.",
      "Shield B is more expensive than Shield A."
    ]
  },
  {
    "id": 15,
    "stage": 2,
    "type": "stats",
    "prompt": "Compare the stats.",
    "correctAnswer": "Path B is more dangerous than Path A.",
    "feedback": "Look at the numbers again.",
    "rewardId": "sheep",
    "stats": [
      [
        "Path A",
        "danger level 2/10"
      ],
      [
        "Path B",
        "danger level 8/10"
      ]
    ],
    "options": [
      "Path B is more dangerous than Path A.",
      "Path A is more dangerous than Path B.",
      "Path B is more dangerouser than Path A."
    ]
  },
  {
    "id": 16,
    "stage": 3,
    "type": "build",
    "prompt": "A mine is dark. A house is bright. Compare the mine with the house.",
    "correctAnswer": "The mine is darker than the house.",
    "feedback": "Start with the mine and use than to introduce the house.",
    "rewardId": "path",
    "tokens": [
      "house",
      "is",
      "more",
      "the",
      "mine",
      "than",
      "darker",
      "the"
    ]
  },
  {
    "id": 17,
    "stage": 3,
    "type": "build",
    "prompt": "A bridge costs 50 coins. A path costs 10 coins. Compare the bridge with the path.",
    "correctAnswer": "The bridge is more expensive than the path.",
    "feedback": "Start with the bridge. Use more with a long adjective.",
    "rewardId": "tree",
    "tokens": [
      "than",
      "more",
      "path",
      "the",
      "is",
      "bridge",
      "the",
      "expensive",
      "expensiver"
    ]
  },
  {
    "id": 18,
    "stage": 3,
    "type": "build",
    "prompt": "You have a good sword. Your friend has an even better one. Compare your friend's sword with yours.",
    "correctAnswer": "My friend's sword is better than mine.",
    "feedback": "Start with your friend’s sword. This adjective has an irregular comparative.",
    "rewardId": "pond",
    "tokens": [
      "my",
      "better",
      "is",
      "friend's",
      "than",
      "more",
      "sword",
      "mine"
    ]
  },
  {
    "id": 19,
    "stage": 3,
    "type": "build",
    "prompt": "The new puzzle has 3 steps. The old puzzle has 10. Compare the new puzzle with the old one.",
    "correctAnswer": "The new puzzle is easier than the old one.",
    "feedback": "Start with the new puzzle. Use than to introduce the old one.",
    "rewardId": "bridge",
    "tokens": [
      "old",
      "easier",
      "is",
      "the",
      "one",
      "puzzle",
      "new",
      "than",
      "more",
      "the"
    ]
  },
  {
    "id": 20,
    "stage": 3,
    "type": "build",
    "prompt": "The first joke made you laugh. The second joke made you laugh even more. Compare the second joke with the first one.",
    "correctAnswer": "The second joke is funnier than the first one.",
    "feedback": "Start with the second joke. Change consonant + y to i before adding -er.",
    "rewardId": "lanterns",
    "tokens": [
      "first",
      "funnier",
      "is",
      "second",
      "than",
      "the",
      "more",
      "joke",
      "one",
      "the"
    ]
  },
  {
    "id": 21,
    "stage": 4,
    "type": "type",
    "prompt": "This room is ___ (comfortable) than the old one.",
    "correctAnswer": "more comfortable",
    "feedback": "Use more with this long adjective.",
    "rewardId": "flowers"
  },
  {
    "id": 22,
    "stage": 4,
    "type": "type",
    "prompt": "The new joke is ___ (funny) than the old joke.",
    "correctAnswer": "funnier",
    "feedback": "Change consonant + y to i before adding -er.",
    "rewardId": "chest"
  },
  {
    "id": 23,
    "stage": 4,
    "type": "type",
    "prompt": "Today's weather is ___ (bad) than yesterday's.",
    "correctAnswer": "worse",
    "feedback": "This adjective has an irregular comparative.",
    "rewardId": "porch-lamp"
  },
  {
    "id": 24,
    "stage": 4,
    "type": "type",
    "prompt": "This bag is ___ (heavy) than that one.",
    "correctAnswer": "heavier",
    "feedback": "Change consonant + y to i before adding -er.",
    "rewardId": "crystal"
  },
  {
    "id": 25,
    "stage": 4,
    "type": "type",
    "prompt": "The final mission is ___ (exciting) than the first one.",
    "correctAnswer": "more exciting",
    "feedback": "Use more with this long adjective.",
    "rewardId": "flag"
  }
];
