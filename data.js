const RANKS = [
  { id: "bronze", name: "Бронза", emoji: "🥉", color: "#cd7f32" },
  { id: "silver", name: "Серебро", emoji: "🥈", color: "#a0a0b0" },
  { id: "gold", name: "Золото", emoji: "🥇", color: "#ffd700" },
  { id: "diamond", name: "Алмаз", emoji: "💠", color: "#00e5ff" },
  { id: "mythic", name: "Мифический", emoji: "💜", color: "#ab47bc" },
  { id: "legendary", name: "Легендарный", emoji: "🔥", color: "#ff5252" },
  { id: "masters", name: "Мастера", emoji: "🏆", color: "#ff7043" },
  { id: "pro", name: "Про", emoji: "👑", color: "#ffc107" }
];

const RANK_TO_TIER = {
  bronze: "low",
  silver: "low",
  gold: "mid",
  diamond: "mid",
  mythic: "high",
  legendary: "high",
  masters: "top",
  pro: "top"
};

const MODES = [
  { id: "bounty", name: "Награда", icon: "⭐", maps: 4 },
  { id: "brawlball", name: "Броулбол", icon: "⚽", maps: 4 },
  { id: "gemgrab", name: "Захват Кристаллов", icon: "💎", maps: 4 },
  { id: "heist", name: "Ограбление", icon: "💰", maps: 5 },
  { id: "hotzone", name: "Горячая Зона", icon: "🎯", maps: 4 },
  { id: "knockout", name: "Нокаут", icon: "👊", maps: 4 }
];

const MAPS = {
  bounty: [
    { name: "Dry Season" },
    { name: "Hideout" },
    { name: "Creme de la Creme" },
    { name: "Shooting Star" }
  ],
  brawlball: [
    { name: "Super Stadium" },
    { name: "Pinball Dreams" },
    { name: "Backyard Bowl" },
    { name: "Triple Dribble" }
  ],
  gemgrab: [
    { name: "Hard Rock Mine" },
    { name: "Crystal Arcade" },
    { name: "Double Swoosh" },
    { name: "Deathcap Trap" }
  ],
  heist: [
    { name: "Safe Zone" },
    { name: "Kaboom Canyon" },
    { name: "Hot Potato" },
    { name: "Scorched Stone" },
    { name: "Bridge Too Far" }
  ],
  hotzone: [
    { name: "Open Business" },
    { name: "Dueling Beetles" },
    { name: "Ring of Fire" },
    { name: "Parallel Plays" }
  ],
  knockout: [
    { name: "Goldarm Gulf" },
    { name: "Toxic Swamp" },
    { name: "Dark Dunes" },
    { name: "Stone Fort" }
  ]
};

const MAP_TRAITS = {
  "dry season": ["open", "lanes"],
  "hideout": ["bushes", "lanes"],
  "creme de la creme": ["open", "lanes"],
  "layer cake": ["open", "lanes"],
  "shooting star": ["open", "sniper"],
  "super stadium": ["brawl", "walls"],
  "center stage": ["brawl", "walls"],
  "pinball dreams": ["walls", "lanes"],
  "backyard bowl": ["brawl", "lanes", "walls"],
  "sneaky fields": ["bushes", "brawl"],
  "triple dribble": ["brawl", "walls"],
  "hard rock mine": ["lanes", "choke"],
  "crystal arcade": ["lanes", "bushes"],
  "double swoosh": ["bushes", "choke"],
  "deathcap trap": ["bushes", "choke"],
  "gem fort": ["bushes", "choke"],
  "safe zone": ["open", "sniper"],
  "kaboom canyon": ["open", "walls"],
  "hot potato": ["lanes", "walls"],
  "scorched stone": ["open", "lanes"],
  "rustic arcade map": ["open", "lanes"],
  "pit stop": ["lanes", "walls"],
  "bridge too far": ["open", "sniper"],
  "open business": ["lanes", "open"],
  "dueling beetles": ["choke", "lanes"],
  "ring of fire": ["choke", "lanes"],
  "parallel plays": ["lanes", "walls"],
  "goldarm gulf": ["open", "lanes"],
  "belle's rock": ["open", "lanes"],
  "toxic swamp": ["bushes", "choke"],
  "flaring phoenix": ["bushes", "choke"],
  "dark dunes": ["lanes", "open"],
  "new horizons": ["lanes", "open"],
  "stone fort": ["lanes", "walls"],
  "undermine": ["lanes", "walls"]
};

const BUFFED = new Set(["Shelly", "Colt", "Spike", "Emz", "Frank", "Mortis"]);

// Глобальный тир-лист (февраль 2026, с учётом баффи) для доп. веса при сортах
const GLOBAL_META = {
  low: [
    "Shelly",
    "Colt",
    "Spike",
    "Crow",
    "Max",
    "Frank",
    "Sam",
    "Colette",
    "Mortis",
    "Belle",
    "Brock",
    "Ruffs",
    "Bibi",
    "Poco"
  ],
  mid: [
    "Spike",
    "Colt",
    "Shelly",
    "Crow",
    "Max",
    "Belle",
    "Piper",
    "Mortis",
    "Frank",
    "Sam",
    "Bonnie",
    "Ruffs",
    "Colette",
    "Buster",
    "Gus"
  ],
  high: [
    "Kit",
    "Cordelius",
    "Spike",
    "Crow",
    "Belle",
    "Piper",
    "Max",
    "Mandy",
    "Janet",
    "Leon",
    "Gus",
    "Bonnie",
    "Lola",
    "Ruffs",
    "Gray"
  ],
  top: [
    "Kit",
    "Cordelius",
    "Piper",
    "Belle",
    "Spike",
    "Max",
    "Mandy",
    "Janet",
    "Crow",
    "Leon",
    "Gus",
    "Byron",
    "Ruffs",
    "Gray",
    "Bonnie"
  ]
};

const META = {
  bounty: {
    bans: {
      low: ["Piper", "Belle", "Brock"],
      mid: ["Piper", "Belle", "Mandy"],
      high: ["Piper", "Kit", "Belle"],
      top: ["Kit", "Piper", "Belle"]
    },
    picks: {
      low: [
        { name: "Colt", role: "Снайпер / стенолом", counters: ["Bull", "El Primo", "Frank"], counteredBy: ["Crow", "Max", "Kit"], buffed: true },
        { name: "Brock", role: "Снайпер", counters: ["Frank", "Sam", "Edgar"], counteredBy: ["Crow", "Gale", "Max"] },
        { name: "Piper", role: "Снайпер", counters: ["Gene", "Sandy", "Gus"], counteredBy: ["Leon", "Crow", "Kit"] },
        { name: "Belle", role: "Контроль", counters: ["Bull", "Sam", "Shelly"], counteredBy: ["Mortis", "Leon", "Crow"] },
        { name: "Crow", role: "Антихил", counters: ["Pam", "Byron", "Poco"], counteredBy: ["Gale", "Belle", "Colt"] },
        { name: "Mandy", role: "Снайпер", counters: ["Sandy", "Ruffs", "Pam"], counteredBy: ["Crow", "Leon", "Mortis"] }
      ],
      mid: [
        { name: "Colt", role: "Снайпер / стенолом", counters: ["Frank", "Bull", "Jacky"], counteredBy: ["Crow", "Kit", "Max"], buffed: true },
        { name: "Piper", role: "Снайпер", counters: ["Gene", "Ruffs", "Squeak"], counteredBy: ["Kit", "Leon", "Mortis"] },
        { name: "Belle", role: "Контроль", counters: ["Sam", "Buster", "Shelly"], counteredBy: ["Mortis", "Crow", "Leon"] },
        { name: "Kit", role: "Ассасин", counters: ["Piper", "Belle", "Mandy"], counteredBy: ["Gale", "Crow", "Ruffs"] },
        { name: "Brock", role: "Дальняя зона", counters: ["Frank", "Sam", "Otis"], counteredBy: ["Crow", "Max", "Leon"] },
        { name: "Janet", role: "Флекс", counters: ["Crow", "Leon", "Spike"], counteredBy: ["Belle", "Piper", "Kit"] }
      ],
      high: [
        { name: "Kit", role: "Ассасин", counters: ["Piper", "Belle", "Brock"], counteredBy: ["Gale", "Crow", "Max"] },
        { name: "Piper", role: "Снайпер", counters: ["Gene", "Squeak", "Ruffs"], counteredBy: ["Kit", "Mortis", "Crow"] },
        { name: "Belle", role: "Контроль", counters: ["Sam", "Buster", "Jacky"], counteredBy: ["Mortis", "Leon", "Kit"] },
        { name: "Colt", role: "Снайпер / стенолом", counters: ["Frank", "Bull", "Bibi"], counteredBy: ["Crow", "Max", "Kit"], buffed: true },
        { name: "Crow", role: "Антихил", counters: ["Pam", "Byron", "Poco"], counteredBy: ["Gale", "Colt", "Mandy"] },
        { name: "Mandy", role: "Снайпер", counters: ["Spike", "Sandy", "Gus"], counteredBy: ["Kit", "Mortis", "Crow"] }
      ],
      top: [
        { name: "Kit", role: "Ассасин", counters: ["Piper", "Belle", "Mandy"], counteredBy: ["Gale", "Crow", "Max"] },
        { name: "Piper", role: "Снайпер", counters: ["Gene", "Ruffs", "Squeak"], counteredBy: ["Kit", "Mortis", "Crow"] },
        { name: "Belle", role: "Контроль", counters: ["Sam", "Buster", "Jacky"], counteredBy: ["Mortis", "Leon", "Kit"] },
        { name: "Colt", role: "Снайпер / стенолом", counters: ["Frank", "Bull", "Bibi"], counteredBy: ["Crow", "Max", "Kit"], buffed: true },
        { name: "Janet", role: "Флекс", counters: ["Crow", "Leon", "Max"], counteredBy: ["Belle", "Piper", "Kit"] },
        { name: "Crow", role: "Антихил", counters: ["Pam", "Byron", "Poco"], counteredBy: ["Gale", "Colt", "Ruffs"] }
      ]
    },
    alsoTry: {
      low: ["Nani", "Rico", "Bo"],
      mid: ["Rico", "Sprout", "Bo"],
      high: ["Rico", "Janet", "Nani"],
      top: ["Rico", "Janet", "Sprout"]
    }
  },
  brawlball: {
    bans: {
      low: ["Buster", "Max", "Sam"],
      mid: ["Buster", "Cordelius", "Sam"],
      high: ["Buster", "Surge", "Cordelius"],
      top: ["Buster", "Surge", "Cordelius"]
    },
    picks: {
      low: [
        { name: "Shelly", role: "Анти-танк / гол-брейк", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Gene", "Max", "Poco"], buffed: true },
        { name: "Mortis", role: "Ассасин", counters: ["Gene", "Sandy", "Poco"], counteredBy: ["Bo", "Jacky", "Surge"], buffed: true },
        { name: "Frank", role: "Танк / контроль", counters: ["Sam", "Jacky", "Bull"], counteredBy: ["Belle", "Colette", "Otis"], buffed: true },
        { name: "Max", role: "Скорость / флекс", counters: ["Gale", "Poco", "Pam"], counteredBy: ["Spike", "Crow", "Belle"] },
        { name: "Sam", role: "Брузер", counters: ["Belle", "Brock", "Crow"], counteredBy: ["Shelly", "Frank", "Gale"] },
        { name: "Otis", role: "Сайлент", counters: ["Frank", "Bull", "Mortis"], counteredBy: ["Gene", "Poco", "Max"] }
      ],
      mid: [
        { name: "Shelly", role: "Анти-танк / гол-брейк", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Gene", "Max", "Poco"], buffed: true },
        { name: "Mortis", role: "Ассасин", counters: ["Gene", "Sandy", "Bonnie"], counteredBy: ["Gale", "Bo", "Surge"], buffed: true },
        { name: "Frank", role: "Танк / контроль", counters: ["Sam", "Jacky", "Bull"], counteredBy: ["Belle", "Colette", "Otis"], buffed: true },
        { name: "Max", role: "Скорость / флекс", counters: ["Poco", "Pam", "Gale"], counteredBy: ["Spike", "Crow", "Belle"] },
        { name: "Buster", role: "Анти-снайпер", counters: ["Piper", "Belle", "Brock"], counteredBy: ["Colette", "Spike", "Crow"] },
        { name: "Otis", role: "Сайлент", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Gene", "Poco", "Max"] }
      ],
      high: [
        { name: "Shelly", role: "Анти-танк / гол-брейк", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Gene", "Max", "Poco"], buffed: true },
        { name: "Mortis", role: "Ассасин", counters: ["Gene", "Bonnie", "Ruffs"], counteredBy: ["Gale", "Bo", "Surge"], buffed: true },
        { name: "Frank", role: "Танк / контроль", counters: ["Sam", "Jacky", "Buzz"], counteredBy: ["Belle", "Colette", "Otis"], buffed: true },
        { name: "Max", role: "Скорость / флекс", counters: ["Poco", "Pam", "Gale"], counteredBy: ["Spike", "Crow", "Belle"] },
        { name: "Buster", role: "Анти-снайпер", counters: ["Piper", "Belle", "Brock"], counteredBy: ["Colette", "Spike", "Crow"] },
        { name: "Otis", role: "Сайлент", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Gene", "Poco", "Max"] }
      ],
      top: [
        { name: "Shelly", role: "Анти-танк / гол-брейк", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Gene", "Max", "Poco"], buffed: true },
        { name: "Mortis", role: "Ассасин", counters: ["Gene", "Bonnie", "Ruffs"], counteredBy: ["Gale", "Bo", "Surge"], buffed: true },
        { name: "Frank", role: "Танк / контроль", counters: ["Sam", "Jacky", "Buzz"], counteredBy: ["Belle", "Colette", "Otis"], buffed: true },
        { name: "Max", role: "Скорость / флекс", counters: ["Poco", "Pam", "Gale"], counteredBy: ["Spike", "Crow", "Belle"] },
        { name: "Buster", role: "Анти-снайпер", counters: ["Piper", "Belle", "Brock"], counteredBy: ["Colette", "Spike", "Crow"] },
        { name: "Otis", role: "Сайлент", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Gene", "Poco", "Max"] }
      ]
    },
    alsoTry: {
      low: ["Poco", "Bibi", "Gale"],
      mid: ["Poco", "Tara", "Griff"],
      high: ["Poco", "Griff", "Bonnie"],
      top: ["Poco", "Griff", "Cordelius"]
    }
  },
  gemgrab: {
    bans: {
      low: ["Gene", "Spike", "Crow"],
      mid: ["Gene", "Cordelius", "Crow"],
      high: ["Cordelius", "Gene", "Crow"],
      top: ["Cordelius", "Gene", "Crow"]
    },
    picks: {
      low: [
        { name: "Spike", role: "Контроль кустов", counters: ["Bull", "Frank", "Sam"], counteredBy: ["Leon", "Crow", "Ruffs"], buffed: true },
        { name: "Emz", role: "Зонинг", counters: ["Bull", "Ash", "Surge"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true },
        { name: "Gene", role: "Хук / контроль", counters: ["Tara", "Max", "Crow"], counteredBy: ["Mortis", "Leon", "Kit"] },
        { name: "Max", role: "Скорость", counters: ["Poco", "Pam", "Sandy"], counteredBy: ["Spike", "Crow", "Otis"] },
        { name: "Sandy", role: "Визор", counters: ["Leon", "Crow", "Mortis"], counteredBy: ["Spike", "Otis", "Mandy"] },
        { name: "Otis", role: "Сайлент", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Crow", "Max", "Tara"] }
      ],
      mid: [
        { name: "Spike", role: "Контроль кустов", counters: ["Bull", "Frank", "Sam"], counteredBy: ["Leon", "Crow", "Ruffs"], buffed: true },
        { name: "Emz", role: "Зонинг", counters: ["Bull", "Ash", "Surge"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true },
        { name: "Gene", role: "Хук / контроль", counters: ["Tara", "Max", "Crow"], counteredBy: ["Mortis", "Leon", "Kit"] },
        { name: "Max", role: "Скорость", counters: ["Poco", "Pam", "Sandy"], counteredBy: ["Spike", "Crow", "Otis"] },
        { name: "Squeak", role: "Спам", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Crow", "Leon", "Ruffs"] },
        { name: "Sandy", role: "Визор", counters: ["Leon", "Crow", "Mortis"], counteredBy: ["Spike", "Otis", "Mandy"] }
      ],
      high: [
        { name: "Spike", role: "Контроль кустов", counters: ["Bull", "Frank", "Sam"], counteredBy: ["Leon", "Crow", "Ruffs"], buffed: true },
        { name: "Emz", role: "Зонинг", counters: ["Bull", "Ash", "Surge"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true },
        { name: "Gene", role: "Хук / контроль", counters: ["Tara", "Max", "Crow"], counteredBy: ["Mortis", "Leon", "Kit"] },
        { name: "Max", role: "Скорость", counters: ["Poco", "Pam", "Sandy"], counteredBy: ["Spike", "Crow", "Otis"] },
        { name: "Squeak", role: "Спам", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Crow", "Leon", "Ruffs"] },
        { name: "Sandy", role: "Визор", counters: ["Leon", "Crow", "Mortis"], counteredBy: ["Spike", "Otis", "Mandy"] }
      ],
      top: [
        { name: "Spike", role: "Контроль кустов", counters: ["Bull", "Frank", "Sam"], counteredBy: ["Leon", "Crow", "Ruffs"], buffed: true },
        { name: "Emz", role: "Зонинг", counters: ["Bull", "Ash", "Surge"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true },
        { name: "Gene", role: "Хук / контроль", counters: ["Tara", "Max", "Crow"], counteredBy: ["Mortis", "Leon", "Kit"] },
        { name: "Max", role: "Скорость", counters: ["Poco", "Pam", "Sandy"], counteredBy: ["Spike", "Crow", "Otis"] },
        { name: "Squeak", role: "Спам", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Crow", "Leon", "Ruffs"] },
        { name: "Sandy", role: "Визор", counters: ["Leon", "Crow", "Mortis"], counteredBy: ["Spike", "Otis", "Mandy"] }
      ]
    },
    alsoTry: {
      low: ["Bo", "Poco", "Belle"],
      mid: ["Bo", "Belle", "Gray"],
      high: ["Bo", "Belle", "Cordelius"],
      top: ["Bo", "Belle", "Cordelius"]
    }
  },
  heist: {
    bans: {
      low: ["Colt", "Belle", "Brock"],
      mid: ["Colt", "Belle", "Spike"],
      high: ["Colt", "Kit", "Belle"],
      top: ["Colt", "Kit", "Belle"]
    },
    picks: {
      low: [
        { name: "Colt", role: "Бурст по сейфу", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Crow", "Gale", "Surge"], buffed: true },
        { name: "Spike", role: "Урон / контроль", counters: ["Frank", "Bull", "Buster"], counteredBy: ["Belle", "Piper", "Sprout"], buffed: true },
        { name: "Belle", role: "Контроль линии", counters: ["Sam", "Frank", "Bull"], counteredBy: ["Colette", "Crow", "Surge"] },
        { name: "Colette", role: "Анти-танк", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Spike", "Crow", "Carl"] },
        { name: "Griff", role: "Снос стен", counters: ["Pam", "Spike", "Sandy"], counteredBy: ["Crow", "Max", "Stu"] },
        { name: "Bull", role: "Бурст / ближний бой", counters: ["Belle", "Piper", "Colette"], counteredBy: ["Spike", "Crow", "Gale"] }
      ],
      mid: [
        { name: "Colt", role: "Бурст по сейфу", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Crow", "Gale", "Surge"], buffed: true },
        { name: "Spike", role: "Урон / контроль", counters: ["Frank", "Bull", "Buster"], counteredBy: ["Belle", "Piper", "Sprout"], buffed: true },
        { name: "Belle", role: "Контроль линии", counters: ["Sam", "Frank", "Bull"], counteredBy: ["Colette", "Crow", "Surge"] },
        { name: "Colette", role: "Анти-танк", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Spike", "Crow", "Carl"] },
        { name: "Bonnie", role: "Гибрид", counters: ["Piper", "Belle", "Max"], counteredBy: ["Crow", "Ruffs", "Gale"] },
        { name: "Griff", role: "Снос стен", counters: ["Pam", "Spike", "Sandy"], counteredBy: ["Crow", "Max", "Stu"] }
      ],
      high: [
        { name: "Colt", role: "Бурст по сейфу", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Crow", "Gale", "Surge"], buffed: true },
        { name: "Spike", role: "Урон / контроль", counters: ["Frank", "Bull", "Buster"], counteredBy: ["Belle", "Piper", "Sprout"], buffed: true },
        { name: "Belle", role: "Контроль линии", counters: ["Sam", "Frank", "Bull"], counteredBy: ["Colette", "Crow", "Surge"] },
        { name: "Colette", role: "Анти-танк", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Spike", "Crow", "Carl"] },
        { name: "Bonnie", role: "Гибрид", counters: ["Piper", "Belle", "Max"], counteredBy: ["Crow", "Ruffs", "Gale"] },
        { name: "Buzz", role: "Дайв", counters: ["Belle", "Piper", "Colt"], counteredBy: ["Crow", "Gale", "Otis"] }
      ],
      top: [
        { name: "Colt", role: "Бурст по сейфу", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Crow", "Gale", "Surge"], buffed: true },
        { name: "Spike", role: "Урон / контроль", counters: ["Frank", "Bull", "Buster"], counteredBy: ["Belle", "Piper", "Sprout"], buffed: true },
        { name: "Belle", role: "Контроль линии", counters: ["Sam", "Frank", "Bull"], counteredBy: ["Colette", "Crow", "Surge"] },
        { name: "Colette", role: "Анти-танк", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Spike", "Crow", "Carl"] },
        { name: "Bonnie", role: "Гибрид", counters: ["Piper", "Belle", "Max"], counteredBy: ["Crow", "Ruffs", "Gale"] },
        { name: "Buzz", role: "Дайв", counters: ["Belle", "Piper", "Colt"], counteredBy: ["Crow", "Gale", "Otis"] }
      ]
    },
    alsoTry: {
      low: ["Darryl", "8-Bit", "Rico"],
      mid: ["Ruffs", "8-Bit", "Darryl"],
      high: ["Ruffs", "Kit", "Carl"],
      top: ["Ruffs", "Kit", "Carl"]
    }
  },
  hotzone: {
    bans: {
      low: ["Spike", "Belle", "Otis"],
      mid: ["Spike", "Emz", "Otis"],
      high: ["Spike", "Emz", "Otis"],
      top: ["Spike", "Emz", "Otis"]
    },
    picks: {
      low: [
        { name: "Spike", role: "Контроль зоны", counters: ["Bull", "Frank", "Jacky"], counteredBy: ["Belle", "Piper", "Crow"], buffed: true },
        { name: "Emz", role: "Зонинг", counters: ["Bull", "Frank", "Ash"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true },
        { name: "Pam", role: "Удержание", counters: ["Crow", "Otis", "Gale"], counteredBy: ["Spike", "Belle", "Colette"] },
        { name: "Sandy", role: "Визор", counters: ["Leon", "Crow", "Max"], counteredBy: ["Spike", "Otis", "Mandy"] },
        { name: "Ruffs", role: "Баф команды", counters: ["Crow", "Colt", "Belle"], counteredBy: ["Spike", "Max", "Sam"] },
        { name: "Otis", role: "Сайлент", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Crow", "Max", "Tara"] }
      ],
      mid: [
        { name: "Spike", role: "Контроль зоны", counters: ["Bull", "Frank", "Jacky"], counteredBy: ["Belle", "Piper", "Crow"], buffed: true },
        { name: "Emz", role: "Зонинг", counters: ["Bull", "Frank", "Ash"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true },
        { name: "Pam", role: "Удержание", counters: ["Crow", "Otis", "Gale"], counteredBy: ["Spike", "Belle", "Colette"] },
        { name: "Sandy", role: "Визор", counters: ["Leon", "Crow", "Max"], counteredBy: ["Spike", "Otis", "Mandy"] },
        { name: "Ruffs", role: "Баф команды", counters: ["Crow", "Colt", "Belle"], counteredBy: ["Spike", "Max", "Sam"] },
        { name: "Belle", role: "Дистанция", counters: ["Sam", "Frank", "Bull"], counteredBy: ["Mortis", "Leon", "Crow"] }
      ],
      high: [
        { name: "Spike", role: "Контроль зоны", counters: ["Bull", "Frank", "Jacky"], counteredBy: ["Belle", "Piper", "Crow"], buffed: true },
        { name: "Emz", role: "Зонинг", counters: ["Bull", "Frank", "Ash"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true },
        { name: "Pam", role: "Удержание", counters: ["Crow", "Otis", "Gale"], counteredBy: ["Spike", "Belle", "Colette"] },
        { name: "Sandy", role: "Визор", counters: ["Leon", "Crow", "Max"], counteredBy: ["Spike", "Otis", "Mandy"] },
        { name: "Ruffs", role: "Баф команды", counters: ["Crow", "Colt", "Belle"], counteredBy: ["Spike", "Max", "Sam"] },
        { name: "Otis", role: "Сайлент", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Crow", "Max", "Tara"] }
      ],
      top: [
        { name: "Spike", role: "Контроль зоны", counters: ["Bull", "Frank", "Jacky"], counteredBy: ["Belle", "Piper", "Crow"], buffed: true },
        { name: "Emz", role: "Зонинг", counters: ["Bull", "Frank", "Ash"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true },
        { name: "Pam", role: "Удержание", counters: ["Crow", "Otis", "Gale"], counteredBy: ["Spike", "Belle", "Colette"] },
        { name: "Sandy", role: "Визор", counters: ["Leon", "Crow", "Max"], counteredBy: ["Spike", "Otis", "Mandy"] },
        { name: "Ruffs", role: "Баф команды", counters: ["Crow", "Colt", "Belle"], counteredBy: ["Spike", "Max", "Sam"] },
        { name: "Otis", role: "Сайлент", counters: ["Frank", "Sam", "Buzz"], counteredBy: ["Crow", "Max", "Tara"] }
      ]
    },
    alsoTry: {
      low: ["Bo", "Poco", "Gale"],
      mid: ["Bo", "Gray", "Poco"],
      high: ["Bo", "Gray", "Belle"],
      top: ["Bo", "Gray", "Belle"]
    }
  },
  knockout: {
    bans: {
      low: ["Piper", "Crow", "Shelly"],
      mid: ["Kit", "Piper", "Colt"],
      high: ["Kit", "Piper", "Belle"],
      top: ["Kit", "Piper", "Colt"]
    },
    picks: {
      low: [
        { name: "Shelly", role: "Анти-танк ближний бой", counters: ["Bull", "Buster", "Frank"], counteredBy: ["Piper", "Belle", "Crow"], buffed: true },
        { name: "Colt", role: "Снайпер / стенолом", counters: ["Frank", "Buster", "Jacky"], counteredBy: ["Crow", "Leon", "Kit"], buffed: true },
        { name: "Mortis", role: "Ассасин", counters: ["Piper", "Belle", "Gene"], counteredBy: ["Gale", "Bo", "Surge"], buffed: true },
        { name: "Piper", role: "Снайпер", counters: ["Crow", "Spike", "Belle"], counteredBy: ["Leon", "Mortis", "Kit"] },
        { name: "Belle", role: "Контроль", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Mortis", "Leon", "Crow"] },
        { name: "Spike", role: "Контроль кустов", counters: ["Bull", "Frank", "Jacky"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true }
      ],
      mid: [
        { name: "Shelly", role: "Анти-танк ближний бой", counters: ["Bull", "Buster", "Frank"], counteredBy: ["Piper", "Belle", "Crow"], buffed: true },
        { name: "Colt", role: "Снайпер / стенолом", counters: ["Frank", "Buster", "Jacky"], counteredBy: ["Crow", "Leon", "Kit"], buffed: true },
        { name: "Mortis", role: "Ассасин", counters: ["Piper", "Belle", "Gene"], counteredBy: ["Gale", "Bo", "Surge"], buffed: true },
        { name: "Piper", role: "Снайпер", counters: ["Crow", "Spike", "Belle"], counteredBy: ["Leon", "Mortis", "Kit"] },
        { name: "Belle", role: "Контроль", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Mortis", "Leon", "Crow"] },
        { name: "Spike", role: "Контроль кустов", counters: ["Bull", "Frank", "Jacky"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true }
      ],
      high: [
        { name: "Shelly", role: "Анти-танк ближний бой", counters: ["Bull", "Buster", "Frank"], counteredBy: ["Piper", "Belle", "Crow"], buffed: true },
        { name: "Colt", role: "Снайпер / стенолом", counters: ["Frank", "Buster", "Jacky"], counteredBy: ["Crow", "Leon", "Kit"], buffed: true },
        { name: "Mortis", role: "Ассасин", counters: ["Piper", "Belle", "Gene"], counteredBy: ["Gale", "Bo", "Surge"], buffed: true },
        { name: "Piper", role: "Снайпер", counters: ["Crow", "Spike", "Belle"], counteredBy: ["Leon", "Mortis", "Kit"] },
        { name: "Belle", role: "Контроль", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Mortis", "Leon", "Crow"] },
        { name: "Spike", role: "Контроль кустов", counters: ["Bull", "Frank", "Jacky"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true }
      ],
      top: [
        { name: "Shelly", role: "Анти-танк ближний бой", counters: ["Bull", "Buster", "Frank"], counteredBy: ["Piper", "Belle", "Crow"], buffed: true },
        { name: "Colt", role: "Снайпер / стенолом", counters: ["Frank", "Buster", "Jacky"], counteredBy: ["Crow", "Leon", "Kit"], buffed: true },
        { name: "Mortis", role: "Ассасин", counters: ["Piper", "Belle", "Gene"], counteredBy: ["Gale", "Bo", "Surge"], buffed: true },
        { name: "Piper", role: "Снайпер", counters: ["Crow", "Spike", "Belle"], counteredBy: ["Leon", "Mortis", "Kit"] },
        { name: "Belle", role: "Контроль", counters: ["Bull", "Frank", "Buster"], counteredBy: ["Mortis", "Leon", "Crow"] },
        { name: "Spike", role: "Контроль кустов", counters: ["Bull", "Frank", "Jacky"], counteredBy: ["Piper", "Belle", "Gale"], buffed: true }
      ]
    },
    alsoTry: {
      low: ["Bo", "Gale", "Crow"],
      mid: ["Bo", "Gale", "Crow"],
      high: ["Bo", "Gale", "Janet"],
      top: ["Bo", "Gale", "Janet"]
    }
  }
};
