import { TeamComp } from "@/types/tft";

export const SET18_TEAM_COMPS: TeamComp[] = [
  {
    "id": "set18-lunar-aphelios",
    "name": "Lunar Aphelios Snipers",
    "tier": "S",
    "difficulty": "Medium",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Fast 8",
    "description": "Standard Fast 8 build relying on Aphelios backline physical damage backed by sturdy Lunar frontline.",
    "earlyGame": "Play Varus and Xayah in the backline with Leona or Shen frontline.",
    "midGame": "Field Diana and 2 Lunar units to stabilize at Stage 3 and 4.",
    "lateGame": "Hit level 8, roll down for Aphelios 2-star, Diana 2-star, and add Taric / Alune.",
    "carryChampionIds": [
      "da_18_aphelios"
    ],
    "coreChampionIds": [
      "da_18_aphelios",
      "da_18_diana"
    ],
    "tags": [
      "Fast 8",
      "AD Carry",
      "Snipers"
    ],
    "champions": [
      {
        "championId": "da_18_aphelios",
        "name": "Aphelios",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_aphelios/tft18_aphelios_square.png",
        "starLevel": 2,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_infinityedge",
          "tft_item_lastwhisper",
          "tft_item_guinsoosrageblade"
        ],
        "position": {
          "row": 3,
          "col": 0
        }
      },
      {
        "championId": "da_18_diana",
        "name": "Diana",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_diana/tft18_diana_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_dragonsclaw",
          "tft_item_bramblevest"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_taric18",
        "name": "Taric",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_taric/tft18_taric_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_18_alune",
        "name": "Alune",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_alune/hud/tft18_alune_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 6
        }
      },
      {
        "championId": "da_18_xayah",
        "name": "Xayah",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_xayah/tft18_xayah_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_18_kayle",
        "name": "Kayle",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_kayle/tft18_kayle_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 5
        }
      },
      {
        "championId": "da_18_hecarim",
        "name": "Hecarim",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_hecarim/tft18_hecarim_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      },
      {
        "championId": "da_18_varus",
        "name": "Varus",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_varus/tft18_varus_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 2
        }
      }
    ],
    "traits": [
      {
        "traitId": "lunar",
        "name": "Lunar",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_lunar.png",
        "count": 3,
        "activeBreakpoint": 3,
        "style": "gold"
      },
      {
        "traitId": "rapidfire",
        "name": "Rapidfire",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_rapidfire.png",
        "count": 4,
        "activeBreakpoint": 4,
        "style": "gold"
      },
      {
        "traitId": "vanguard",
        "name": "Vanguard",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_vanguard.png",
        "count": 3,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "emeraldaspect",
        "name": "Emerald Aspect",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_emeraldaspect.png",
        "count": 1,
        "activeBreakpoint": 1,
        "style": "prismatic"
      },
      {
        "traitId": "attuned",
        "name": "Attuned",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_attuned.png",
        "count": 1,
        "activeBreakpoint": 1,
        "style": "prismatic"
      },
      {
        "traitId": "elderwood",
        "name": "Elderwood",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_elderwood.png",
        "count": 2,
        "activeBreakpoint": 0,
        "style": "bronze"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_aphelios",
        "itemId": "tft_item_infinityedge"
      },
      {
        "championId": "da_18_aphelios",
        "itemId": "tft_item_lastwhisper"
      },
      {
        "championId": "da_18_aphelios",
        "itemId": "tft_item_guinsoosrageblade"
      },
      {
        "championId": "da_18_diana",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_18_diana",
        "itemId": "tft_item_dragonsclaw"
      },
      {
        "championId": "da_18_diana",
        "itemId": "tft_item_bramblevest"
      }
    ],
    "augments": [
      "tft_augment_aimforthetop",
      "tft_augment_goldenquest",
      "da_18_lunartraitaugment"
    ]
  },
  {
    "id": "set18-primal-nidalee",
    "name": "Primal Nidalee Apex Brawlers",
    "tier": "S",
    "difficulty": "Hard",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Fast 8",
    "description": "High-sustain hybrid assault board centered on 4 Primal bonuses and resilient Brawlers.",
    "earlyGame": "Open with Kobuko and Akali holding AD/AP bruiser items.",
    "midGame": "Add Vi and Alistar to establish a 4 Brawler front line through mid-game.",
    "lateGame": "Cap board at level 8 with Nidalee carry, Sivir secondary, and Gnar frontline.",
    "carryChampionIds": [
      "da_nidalee18_ap"
    ],
    "coreChampionIds": [
      "da_nidalee18_ap",
      "da_18_sett"
    ],
    "tags": [
      "Fast 8",
      "Hybrid",
      "Bruiser"
    ],
    "champions": [
      {
        "championId": "da_nidalee18_ap",
        "name": "Nidalee",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_nidalee/tft18_nidalee_square.png",
        "starLevel": 2,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_bloodthirster",
          "tft_item_titansresolve",
          "tft_item_unstableconcoction"
        ],
        "position": {
          "row": 1,
          "col": 2
        }
      },
      {
        "championId": "da_18_sett",
        "name": "Sett",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_sett/tft18_sett_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_redbuff",
          "tft_item_nightharvester"
        ],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_vi18",
        "name": "Vi",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_vi/tft18_vi_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      },
      {
        "championId": "da_18_sivir",
        "name": "Sivir",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_sivir/tft18_sivir_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 6
        }
      },
      {
        "championId": "da_18_alistar",
        "name": "Alistar",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_alistar/tft18_alistar_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_18_kobuko",
        "name": "Kobuko",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_kobuko/tft18_kobuko_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 1
        }
      },
      {
        "championId": "da_18_akali_ad",
        "name": "Akali",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_akali/tft18_akali_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 1,
          "col": 4
        }
      },
      {
        "championId": "da_18_gnarsmall",
        "name": "Gnar",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_gnar/tft18_gnar_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 5
        }
      }
    ],
    "traits": [
      {
        "traitId": "primal",
        "name": "Primal",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_primal.png",
        "count": 3,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "adaptor",
        "name": "Adaptor",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_adaptor.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "brawler",
        "name": "Brawler",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_brawler.png",
        "count": 4,
        "activeBreakpoint": 4,
        "style": "gold"
      },
      {
        "traitId": "elderwood",
        "name": "Elderwood",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_elderwood.png",
        "count": 2,
        "activeBreakpoint": 0,
        "style": "bronze"
      },
      {
        "traitId": "sprykin",
        "name": "Sprykin",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_sprykin.png",
        "count": 2,
        "activeBreakpoint": 0,
        "style": "bronze"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_nidalee18_ap",
        "itemId": "tft_item_bloodthirster"
      },
      {
        "championId": "da_nidalee18_ap",
        "itemId": "tft_item_titansresolve"
      },
      {
        "championId": "da_nidalee18_ap",
        "itemId": "tft_item_unstableconcoction"
      },
      {
        "championId": "da_18_sett",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_18_sett",
        "itemId": "tft_item_redbuff"
      },
      {
        "championId": "da_18_sett",
        "itemId": "tft_item_nightharvester"
      }
    ],
    "augments": [
      "tft_augment_titanictitan",
      "da_18_primalaugmentplus_nidalee",
      "da_cyberneticimplants_gold"
    ]
  },
  {
    "id": "set18-coven-morgana",
    "name": "Coven Morgana Hex Invokers",
    "tier": "S",
    "difficulty": "Medium",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Standard",
    "description": "Sustained spell damage machine amplifying Morgana and Cassiopeia while Elise anchors the frontline.",
    "earlyGame": "Camille and Elise frontline with Caitlyn carrying AP/AD items.",
    "midGame": "Assemble 4 Coven with Cassiopeia and Teemo.",
    "lateGame": "Cap with Morgana 2-star with Shojin/Jeweled Gauntlet and Lux Coven.",
    "carryChampionIds": [
      "da_18_morgana"
    ],
    "coreChampionIds": [
      "da_18_morgana",
      "da_18_elise"
    ],
    "tags": [
      "Standard",
      "AP Carry",
      "Invoker"
    ],
    "champions": [
      {
        "championId": "da_18_morgana",
        "name": "Morgana",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_morgana/tft18_morgana_square.png",
        "starLevel": 2,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_bluebuff",
          "tft_item_jeweledgauntlet",
          "tft_item_rabadonsdeathcap"
        ],
        "position": {
          "row": 3,
          "col": 3
        }
      },
      {
        "championId": "da_18_elise",
        "name": "Elise",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_elise/tft18_elise_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_gargoylestoneplate",
          "tft_item_dragonsclaw",
          "tft_item_bramblevest"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_18_cassiopeia",
        "name": "Cassiopeia",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_cassiopeia/tft18_cassiopeia_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_18_caitlyn",
        "name": "Caitlyn",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_caitlyn/tft18_caitlyn_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 6
        }
      },
      {
        "championId": "da_18_camille",
        "name": "Camille",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_camille/tft18_camille_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_18_lux_coven",
        "name": "Lux (Coven)",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_lux/tft18_lux_coven_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 5
        }
      },
      {
        "championId": "da_18_teemo",
        "name": "Teemo",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_teemo/tft18_teemo_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 0
        }
      },
      {
        "championId": "da_18_sentry",
        "name": "Pebbles",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_sentry/tft18_sentry_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      }
    ],
    "traits": [
      {
        "traitId": "coven",
        "name": "Coven",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_coven.png",
        "count": 6,
        "activeBreakpoint": 5,
        "style": "gold"
      },
      {
        "traitId": "invoker",
        "name": "Invoker",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_invoker.png",
        "count": 3,
        "activeBreakpoint": 3,
        "style": "gold"
      },
      {
        "traitId": "avatar",
        "name": "Avatar",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_avatar.png",
        "count": 1,
        "activeBreakpoint": 1,
        "style": "prismatic"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_morgana",
        "itemId": "tft_item_bluebuff"
      },
      {
        "championId": "da_18_morgana",
        "itemId": "tft_item_jeweledgauntlet"
      },
      {
        "championId": "da_18_morgana",
        "itemId": "tft_item_rabadonsdeathcap"
      },
      {
        "championId": "da_18_elise",
        "itemId": "tft_item_gargoylestoneplate"
      },
      {
        "championId": "da_18_elise",
        "itemId": "tft_item_dragonsclaw"
      },
      {
        "championId": "da_18_elise",
        "itemId": "tft_item_bramblevest"
      }
    ],
    "augments": [
      "da_18_coventraitaugment",
      "da_magicroll",
      "da_jeweledlotus_i"
    ]
  },
  {
    "id": "set18-blossom-ahri",
    "name": "Blossom Ahri Spellweavers",
    "tier": "S",
    "difficulty": "Easy",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Standard",
    "description": "Classic AP burst composition stacking Spellweaver ability power with Ahri soul orb barrage.",
    "earlyGame": "Karma and Veigar in backline, Yorick front line holding defense.",
    "midGame": "Hit 4 Blossom and 3 Spellweaver at Stage 3-2.",
    "lateGame": "Roll on 8 for Ahri 2-star and Ashe / Sett 2-star.",
    "carryChampionIds": [
      "da_18_ahri"
    ],
    "coreChampionIds": [
      "da_18_ahri",
      "da_18_sett"
    ],
    "tags": [
      "Standard",
      "AP Burst",
      "Blossom"
    ],
    "champions": [
      {
        "championId": "da_18_ahri",
        "name": "Ahri",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_ahri/tft18_ahri_square.png",
        "starLevel": 2,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_bluebuff",
          "tft_item_jeweledgauntlet",
          "tft_item_rabadonsdeathcap"
        ],
        "position": {
          "row": 3,
          "col": 3
        }
      },
      {
        "championId": "da_18_sett",
        "name": "Sett",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_sett/tft18_sett_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_bramblevest",
          "tft_item_redbuff"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_karma18",
        "name": "Karma",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_karma/tft18_karma_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 0
        }
      },
      {
        "championId": "da_18_veigar",
        "name": "Veigar",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_veigar/tft18_veigar_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_18_leblanc",
        "name": "LeBlanc",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_leblanc/tft18_leblanc_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 5
        }
      },
      {
        "championId": "da_18_yorick",
        "name": "Yorick",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_yorick/tft18_yorick_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_18_yunara",
        "name": "Yunara",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_yunara/tft18_yunara_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 6
        }
      },
      {
        "championId": "da_18_ashe",
        "name": "Ashe",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_ashe/tft18_ashe_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 2,
          "col": 6
        }
      }
    ],
    "traits": [
      {
        "traitId": "blossom",
        "name": "Blossom",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_blossom.png",
        "count": 6,
        "activeBreakpoint": 5,
        "style": "gold"
      },
      {
        "traitId": "spellweaver",
        "name": "Spellweaver",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_spellweaver.png",
        "count": 4,
        "activeBreakpoint": 4,
        "style": "gold"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_ahri",
        "itemId": "tft_item_bluebuff"
      },
      {
        "championId": "da_18_ahri",
        "itemId": "tft_item_jeweledgauntlet"
      },
      {
        "championId": "da_18_ahri",
        "itemId": "tft_item_rabadonsdeathcap"
      },
      {
        "championId": "da_18_sett",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_18_sett",
        "itemId": "tft_item_bramblevest"
      },
      {
        "championId": "da_18_sett",
        "itemId": "tft_item_redbuff"
      }
    ],
    "augments": [
      "da_18_blossomtraitaugment",
      "da_healingorbsii",
      "da_ascension"
    ]
  },
  {
    "id": "set18-elderwood-ezreal",
    "name": "Elderwood Ezreal Executioners",
    "tier": "A",
    "difficulty": "Medium",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Fast 8",
    "description": "Growing stats board featuring Elderwood armor/MR scaling with Ezreal barrage executions.",
    "earlyGame": "Play Ornn and Alistar with Xayah backline.",
    "midGame": "Add Hecarim and LeBlanc to reach 4 Elderwood.",
    "lateGame": "Transition items onto Ezreal and add Gnar and Azir.",
    "carryChampionIds": [
      "da_18_ezreal"
    ],
    "coreChampionIds": [
      "da_18_ezreal",
      "da_18_hecarim"
    ],
    "tags": [
      "Fast 8",
      "AD Physical",
      "Scaling"
    ],
    "champions": [
      {
        "championId": "da_18_ezreal",
        "name": "Ezreal",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_ezreal/tft18_ezreal_square.png",
        "starLevel": 2,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_spearofshojin",
          "tft_item_infinityedge",
          "tft_item_madredsbloodrazor"
        ],
        "position": {
          "row": 3,
          "col": 0
        }
      },
      {
        "championId": "da_18_hecarim",
        "name": "Hecarim",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_hecarim/tft18_hecarim_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_dragonsclaw",
          "tft_item_bramblevest"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_18_ornn",
        "name": "Ornn",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_ornn/tft18_ornn_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_18_alistar",
        "name": "Alistar",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_alistar/tft18_alistar_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      },
      {
        "championId": "da_18_xayah",
        "name": "Xayah",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_xayah/tft18_xayah_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_18_leblanc",
        "name": "LeBlanc",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_leblanc/tft18_leblanc_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 5
        }
      },
      {
        "championId": "da_18_gnarsmall",
        "name": "Gnar",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_gnar/tft18_gnar_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 1
        }
      },
      {
        "championId": "da_18_azir",
        "name": "Azir",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_azir/tft18_azir_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 6
        }
      }
    ],
    "traits": [
      {
        "traitId": "elderwood",
        "name": "Elderwood",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_elderwood.png",
        "count": 7,
        "activeBreakpoint": 7,
        "style": "bronze"
      },
      {
        "traitId": "executioner",
        "name": "Executioner",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_executioner.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "brawler",
        "name": "Brawler",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_brawler.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_ezreal",
        "itemId": "tft_item_spearofshojin"
      },
      {
        "championId": "da_18_ezreal",
        "itemId": "tft_item_infinityedge"
      },
      {
        "championId": "da_18_ezreal",
        "itemId": "tft_item_madredsbloodrazor"
      },
      {
        "championId": "da_18_hecarim",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_18_hecarim",
        "itemId": "tft_item_dragonsclaw"
      },
      {
        "championId": "da_18_hecarim",
        "itemId": "tft_item_bramblevest"
      }
    ],
    "augments": [
      "da_18_elderwoodtraitaugment",
      "da_cyberneticuplink_gold",
      "da_18_biggrabbag"
    ]
  },
  {
    "id": "set18-riftbeast-mamabeak",
    "name": "Riftbeast Swarm Mama Beak",
    "tier": "A",
    "difficulty": "Easy",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Reroll 3-cost",
    "description": "Summon swarm power using 6 Riftbeast units, buffing Mama Beak rapid attack speed.",
    "earlyGame": "Cinderling and Gromp early front-back split.",
    "midGame": "Collect Murkwolf, Scuttlecrab, and slow roll at level 7 for 3-star Mama Beak & Krug.",
    "lateGame": "Push 8 and field Sentinel or Brambleback for 6 Riftbeast synergy.",
    "carryChampionIds": [
      "da_crimsonraptor18"
    ],
    "coreChampionIds": [
      "da_crimsonraptor18",
      "da_krug18"
    ],
    "tags": [
      "Reroll 3-cost",
      "Swarm",
      "Attack Speed"
    ],
    "champions": [
      {
        "championId": "da_crimsonraptor18",
        "name": "Mama Beak",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_raptor/tft18_crimsonraptor_teamplanner_splash.png",
        "starLevel": 3,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_guinsoosrageblade",
          "tft_item_rapidfirecannon",
          "tft_item_madredsbloodrazor"
        ],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_krug18",
        "name": "Krug",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_krug/tft18_krug_square.png",
        "starLevel": 3,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_dragonsclaw",
          "tft_item_redbuff"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_cinderling18",
        "name": "Cinderling",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_cinderling/tft18_cinderling_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 6
        }
      },
      {
        "championId": "da_gromp18_ap",
        "name": "Gromp",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_gromp/tft18_gromp_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_murkwolf18",
        "name": "Murkwolf",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_murkwolf/tft18_murkwolf_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      },
      {
        "championId": "da_scuttlecrab18",
        "name": "Scuttlecrab",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_scuttlecrab/tft18_scuttlecrab_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 1
        }
      },
      {
        "championId": "da_sentinel18",
        "name": "Sentinel",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_sentinel/tft18_sentinel_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 5
        }
      },
      {
        "championId": "da_brambleback18",
        "name": "Brambleback",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_brambleback/tft18_brambleback_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 1,
          "col": 3
        }
      }
    ],
    "traits": [
      {
        "traitId": "riftbeast",
        "name": "Riftbeast",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_riftbeast.png",
        "count": 8,
        "activeBreakpoint": 7,
        "style": "bronze"
      },
      {
        "traitId": "ravager",
        "name": "Ravager",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_ravager.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_crimsonraptor18",
        "itemId": "tft_item_guinsoosrageblade"
      },
      {
        "championId": "da_crimsonraptor18",
        "itemId": "tft_item_rapidfirecannon"
      },
      {
        "championId": "da_crimsonraptor18",
        "itemId": "tft_item_madredsbloodrazor"
      },
      {
        "championId": "da_krug18",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_krug18",
        "itemId": "tft_item_dragonsclaw"
      },
      {
        "championId": "da_krug18",
        "itemId": "tft_item_redbuff"
      }
    ],
    "augments": [
      "da_18_riftbeasttraitaugment",
      "tft_augment_epicrolldown",
      "da_celestialblessingii"
    ]
  },
  {
    "id": "set18-inferno-varus",
    "name": "Inferno Varus Scorched Earth",
    "tier": "A",
    "difficulty": "Easy",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Reroll 1-cost",
    "description": "Burn down enemies with Inferno true damage while Varus pelts arrows from safe distance.",
    "earlyGame": "Do not level early, slow roll at level 5 for 3-star Varus and Akali.",
    "midGame": "Add Shen and Amumu to shore up defense and ignite multiple enemies.",
    "lateGame": "Level to 8, slot in Kennen and Kayle for 4 Rapidfire.",
    "carryChampionIds": [
      "da_18_varus"
    ],
    "coreChampionIds": [
      "da_18_varus",
      "da_18_shen"
    ],
    "tags": [
      "Reroll 1-cost",
      "Burn",
      "Rapidfire"
    ],
    "champions": [
      {
        "championId": "da_18_varus",
        "name": "Varus",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_varus/tft18_varus_square.png",
        "starLevel": 3,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_guinsoosrageblade",
          "tft_item_infinityedge",
          "tft_item_lastwhisper"
        ],
        "position": {
          "row": 3,
          "col": 0
        }
      },
      {
        "championId": "da_18_shen",
        "name": "Shen",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_shen/tft18_shen_square.png",
        "starLevel": 3,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_bramblevest",
          "tft_item_dragonsclaw"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_18_akali_ad",
        "name": "Akali",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_akali/tft18_akali_square.png",
        "starLevel": 3,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 1,
          "col": 2
        }
      },
      {
        "championId": "da_amumu18",
        "name": "Amumu",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_amumu/tft18_amumu_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      },
      {
        "championId": "da_18_kennen",
        "name": "Kennen",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_kennen/tft18_kennen_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 6
        }
      },
      {
        "championId": "da_18_leona",
        "name": "Leona",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_leona/tft18_leona_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_18_kayle",
        "name": "Kayle",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_kayle/tft18_kayle_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_18_rakan",
        "name": "Rakan",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_rakan/tft18_rakan_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 5
        }
      }
    ],
    "traits": [
      {
        "traitId": "inferno",
        "name": "Inferno",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_inferno.png",
        "count": 5,
        "activeBreakpoint": 5,
        "style": "bronze"
      },
      {
        "traitId": "rapidfire",
        "name": "Rapidfire",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_rapidfire.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "defender",
        "name": "Defender",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_defender.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "juggernaut",
        "name": "Juggernaut",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_juggernaut.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "solar",
        "name": "Solar",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_solar.png",
        "count": 2,
        "activeBreakpoint": 0,
        "style": "bronze"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_varus",
        "itemId": "tft_item_guinsoosrageblade"
      },
      {
        "championId": "da_18_varus",
        "itemId": "tft_item_infinityedge"
      },
      {
        "championId": "da_18_varus",
        "itemId": "tft_item_lastwhisper"
      },
      {
        "championId": "da_18_shen",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_18_shen",
        "itemId": "tft_item_bramblevest"
      },
      {
        "championId": "da_18_shen",
        "itemId": "tft_item_dragonsclaw"
      }
    ],
    "augments": [
      "da_18_infernotraitaugment",
      "tft_augment_frontlinefoundation",
      "da_cyberneticimplants_gold"
    ]
  },
  {
    "id": "set18-rivals-khazix-rengar",
    "name": "Rival Predation Assassins",
    "tier": "A",
    "difficulty": "Hard",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Slow Roll 3-cost",
    "description": "Dual carry threat pairing Rival synergy KhaZix and Rengar to dive backlines simultaneously.",
    "earlyGame": "Camille and Warwick with Ravager tempo.",
    "midGame": "Level 6 to 7, collect KhaZix and Rengar, stabilize with Diana.",
    "lateGame": "3-star KhaZix and Rengar, adding Brambleback and Sett frontline.",
    "carryChampionIds": [
      "da_18_khazix"
    ],
    "coreChampionIds": [
      "da_18_khazix",
      "da_18_rengar"
    ],
    "tags": [
      "Slow Roll 3-cost",
      "Assassins",
      "Dual Carry"
    ],
    "champions": [
      {
        "championId": "da_18_khazix",
        "name": "Kha'Zix",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_khazix/tft18_khazix_square.png",
        "starLevel": 3,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_infinityedge",
          "tft_item_bloodthirster",
          "tft_item_guardianangel"
        ],
        "position": {
          "row": 2,
          "col": 0
        }
      },
      {
        "championId": "da_18_rengar",
        "name": "Rengar",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_rengar/tft18_rengar_square.png",
        "starLevel": 3,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_bloodthirster",
          "tft_item_titansresolve",
          "tft_item_unstableconcoction"
        ],
        "position": {
          "row": 2,
          "col": 6
        }
      },
      {
        "championId": "da_18_warwick",
        "name": "Warwick",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_warwick/tft18_warwick_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_murkwolf18",
        "name": "Murkwolf",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_murkwolf/tft18_murkwolf_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_18_camille",
        "name": "Camille",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_camille/tft18_camille_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      },
      {
        "championId": "da_18_diana",
        "name": "Diana",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_diana/tft18_diana_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 1,
          "col": 3
        }
      },
      {
        "championId": "da_brambleback18",
        "name": "Brambleback",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_brambleback/tft18_brambleback_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 1
        }
      },
      {
        "championId": "da_18_sett",
        "name": "Sett",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_sett/tft18_sett_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 5
        }
      }
    ],
    "traits": [
      {
        "traitId": "rival",
        "name": "Rival",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_rival.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "ravager",
        "name": "Ravager",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_ravager.png",
        "count": 5,
        "activeBreakpoint": 4,
        "style": "gold"
      },
      {
        "traitId": "riftbeast",
        "name": "Riftbeast",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_riftbeast.png",
        "count": 2,
        "activeBreakpoint": 0,
        "style": "bronze"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_khazix",
        "itemId": "tft_item_infinityedge"
      },
      {
        "championId": "da_18_khazix",
        "itemId": "tft_item_bloodthirster"
      },
      {
        "championId": "da_18_khazix",
        "itemId": "tft_item_guardianangel"
      },
      {
        "championId": "da_18_rengar",
        "itemId": "tft_item_bloodthirster"
      },
      {
        "championId": "da_18_rengar",
        "itemId": "tft_item_titansresolve"
      },
      {
        "championId": "da_18_rengar",
        "itemId": "tft_item_unstableconcoction"
      }
    ],
    "augments": [
      "da_18_rivalsaugment",
      "da_cyberneticimplants_gold",
      "da_healingorbsi"
    ]
  },
  {
    "id": "set18-blackthorn-azir",
    "name": "Blackthorn Azir Executioners",
    "tier": "A",
    "difficulty": "Medium",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Standard",
    "description": "Serrated thorn summons and rapid soldier strikes backed by Malphite unbreakable shield.",
    "earlyGame": "RekSai and Warwick upfront with Veigar casting in back.",
    "midGame": "Hit 4 Blackthorn at level 6, stabilize with Azir and Malphite.",
    "lateGame": "Reach level 8, roll for Azir 3-star or add Lux Blackthorn and Soraka.",
    "carryChampionIds": [
      "da_18_azir"
    ],
    "coreChampionIds": [
      "da_18_azir",
      "da_18_malphite"
    ],
    "tags": [
      "Standard",
      "Executioner",
      "Summoner"
    ],
    "champions": [
      {
        "championId": "da_18_azir",
        "name": "Azir",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_azir/tft18_azir_square.png",
        "starLevel": 2,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_guinsoosrageblade",
          "tft_item_jeweledgauntlet",
          "tft_item_madredsbloodrazor"
        ],
        "position": {
          "row": 3,
          "col": 3
        }
      },
      {
        "championId": "da_18_malphite",
        "name": "Malphite",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_malphite/tft18_malphite_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_dragonsclaw",
          "tft_item_bramblevest"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_18_reksai",
        "name": "Rek'Sai",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_reksai/tft18_reksai_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_18_veigar",
        "name": "Veigar",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_veigar/tft18_veigar_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_18_warwick",
        "name": "Warwick",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_warwick/tft18_warwick_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      },
      {
        "championId": "da_18_yunara",
        "name": "Yunara",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_yunara/tft18_yunara_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 5
        }
      },
      {
        "championId": "da_18_soraka",
        "name": "Soraka",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_soraka/tft18_soraka_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 0
        }
      },
      {
        "championId": "da_lux18_blackthorn",
        "name": "Lux (Blackthorn)",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_lux/tft18_lux_blackthorn_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 6
        }
      }
    ],
    "traits": [
      {
        "traitId": "blackthorn",
        "name": "Blackthorn",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_oldgod.png",
        "count": 6,
        "activeBreakpoint": 6,
        "style": "bronze"
      },
      {
        "traitId": "executioner",
        "name": "Executioner",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_executioner.png",
        "count": 3,
        "activeBreakpoint": 3,
        "style": "gold"
      },
      {
        "traitId": "monolith",
        "name": "Monolith",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_monolith.png",
        "count": 1,
        "activeBreakpoint": 1,
        "style": "prismatic"
      },
      {
        "traitId": "florafatalis",
        "name": "Flora Fatalis",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_florafatalis.png",
        "count": 1,
        "activeBreakpoint": 1,
        "style": "bronze"
      },
      {
        "traitId": "avatar",
        "name": "Avatar",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_avatar.png",
        "count": 1,
        "activeBreakpoint": 1,
        "style": "prismatic"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_azir",
        "itemId": "tft_item_guinsoosrageblade"
      },
      {
        "championId": "da_18_azir",
        "itemId": "tft_item_jeweledgauntlet"
      },
      {
        "championId": "da_18_azir",
        "itemId": "tft_item_madredsbloodrazor"
      },
      {
        "championId": "da_18_malphite",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_18_malphite",
        "itemId": "tft_item_dragonsclaw"
      },
      {
        "championId": "da_18_malphite",
        "itemId": "tft_item_bramblevest"
      }
    ],
    "augments": [
      "da_18_luxaugmentii",
      "da_jeweledlotus_ii",
      "da_ascension"
    ]
  },
  {
    "id": "set18-solar-kayle",
    "name": "Solar Kayle Dawn Radiance",
    "tier": "B",
    "difficulty": "Medium",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Standard",
    "description": "High durability frontline soaking attention while Kayle ascendant blade heats up.",
    "earlyGame": "Leona and Sejuani defensive wall with Kayle backline.",
    "midGame": "Add Shen and Ornn for maximum Defender armor protection.",
    "lateGame": "Find Lux Solar to cap Solar synergy and provide blinding stuns.",
    "carryChampionIds": [
      "da_18_kayle"
    ],
    "coreChampionIds": [
      "da_18_kayle",
      "da_18_sejuani"
    ],
    "tags": [
      "Standard",
      "Defender",
      "Ascension"
    ],
    "champions": [
      {
        "championId": "da_18_kayle",
        "name": "Kayle",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_kayle/tft18_kayle_square.png",
        "starLevel": 3,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_guinsoosrageblade",
          "tft_item_madredsbloodrazor",
          "tft_item_hextechgunblade"
        ],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_18_sejuani",
        "name": "Sejuani",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_sejuani/tft18_sejuani_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_redbuff",
          "tft_item_dragonsclaw"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_18_leona",
        "name": "Leona",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_leona/tft18_leona_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_18_shen",
        "name": "Shen",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_shen/tft18_shen_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      },
      {
        "championId": "da_18_ornn",
        "name": "Ornn",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_ornn/tft18_ornn_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 1
        }
      },
      {
        "championId": "da_18_rammus",
        "name": "Rammus",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_rammus/tft18_rammus_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 5
        }
      },
      {
        "championId": "da_18_lillia",
        "name": "Lillia",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_lillia/tft18_lillia_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 1,
          "col": 3
        }
      },
      {
        "championId": "da_18_lux_sunbeam",
        "name": "Lux (Solar)",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_lux/tft18_lux_sunbeam_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 5
        }
      }
    ],
    "traits": [
      {
        "traitId": "solar",
        "name": "Solar",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_solar.png",
        "count": 4,
        "activeBreakpoint": 3,
        "style": "bronze"
      },
      {
        "traitId": "defender",
        "name": "Defender",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_defender.png",
        "count": 5,
        "activeBreakpoint": 4,
        "style": "gold"
      },
      {
        "traitId": "avatar",
        "name": "Avatar",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_avatar.png",
        "count": 1,
        "activeBreakpoint": 1,
        "style": "prismatic"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_kayle",
        "itemId": "tft_item_guinsoosrageblade"
      },
      {
        "championId": "da_18_kayle",
        "itemId": "tft_item_madredsbloodrazor"
      },
      {
        "championId": "da_18_kayle",
        "itemId": "tft_item_hextechgunblade"
      },
      {
        "championId": "da_18_sejuani",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_18_sejuani",
        "itemId": "tft_item_redbuff"
      },
      {
        "championId": "da_18_sejuani",
        "itemId": "tft_item_dragonsclaw"
      }
    ],
    "augments": [
      "da_18_solartraitaugment",
      "da_standunited",
      "da_cyberneticuplink_gold"
    ]
  },
  {
    "id": "set18-sprykin-teemo",
    "name": "Sprykin Teemo Mushroom Storm",
    "tier": "B",
    "difficulty": "Easy",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Reroll 2-cost",
    "description": "Nuisance mushroom artillery supported by agile Sprykin dodges and crowd controls.",
    "earlyGame": "Kobuko and Teemo with Pebbles supporting mana generation.",
    "midGame": "Reroll at 6 for Teemo 3-star, Kobuko 3-star, and Tristana 3-star.",
    "lateGame": "Level to 8 and tech in Gnar and Morgana for late Invoker scaling.",
    "carryChampionIds": [
      "da_18_teemo"
    ],
    "coreChampionIds": [
      "da_18_teemo",
      "da_18_kobuko"
    ],
    "tags": [
      "Reroll 2-cost",
      "Invoker",
      "AP DoT"
    ],
    "champions": [
      {
        "championId": "da_18_teemo",
        "name": "Teemo",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_teemo/tft18_teemo_square.png",
        "starLevel": 3,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_bluebuff",
          "tft_item_morellonomicon",
          "tft_item_jeweledgauntlet"
        ],
        "position": {
          "row": 3,
          "col": 3
        }
      },
      {
        "championId": "da_18_kobuko",
        "name": "Kobuko",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_kobuko/tft18_kobuko_square.png",
        "starLevel": 3,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_bramblevest",
          "tft_item_dragonsclaw"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_18_veigar",
        "name": "Veigar",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_veigar/tft18_veigar_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_18_rammus",
        "name": "Rammus",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_rammus/tft18_rammus_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_18_tristana",
        "name": "Tristana",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_tristana/tft18_tristana_square.png",
        "starLevel": 3,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 5
        }
      },
      {
        "championId": "da_18_gnarsmall",
        "name": "Gnar",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_gnar/tft18_gnar_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      },
      {
        "championId": "da_18_sentry",
        "name": "Pebbles",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_sentry/tft18_sentry_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 1,
          "col": 3
        }
      },
      {
        "championId": "da_18_morgana",
        "name": "Morgana",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_morgana/tft18_morgana_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 6
        }
      }
    ],
    "traits": [
      {
        "traitId": "sprykin",
        "name": "Sprykin",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_sprykin.png",
        "count": 6,
        "activeBreakpoint": 5,
        "style": "gold"
      },
      {
        "traitId": "invoker",
        "name": "Invoker",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_invoker.png",
        "count": 3,
        "activeBreakpoint": 3,
        "style": "gold"
      },
      {
        "traitId": "brawler",
        "name": "Brawler",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_brawler.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_teemo",
        "itemId": "tft_item_bluebuff"
      },
      {
        "championId": "da_18_teemo",
        "itemId": "tft_item_morellonomicon"
      },
      {
        "championId": "da_18_teemo",
        "itemId": "tft_item_jeweledgauntlet"
      },
      {
        "championId": "da_18_kobuko",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_18_kobuko",
        "itemId": "tft_item_bramblevest"
      },
      {
        "championId": "da_18_kobuko",
        "itemId": "tft_item_dragonsclaw"
      }
    ],
    "augments": [
      "da_18_sprykinaugment",
      "tft_augment_magicroll",
      "da_18_residualmagicplus"
    ]
  },
  {
    "id": "set18-blossom-masteryi",
    "name": "Blossom Master Yi Wuju Blade",
    "tier": "B",
    "difficulty": "Medium",
    "patch": "18.3",
    "setId": "18",
    "playstyle": "Reroll 3-cost",
    "description": "Melee AD hypercarry comp utilizing Blossom sustain and Adaptor combat versatility.",
    "earlyGame": "Akali and Karma holding initial tempo items.",
    "midGame": "Slow roll at level 7 for Master Yi 3-star and Yunara 3-star.",
    "lateGame": "Cap with Sett and Taric frontline providing shields and armor shred.",
    "carryChampionIds": [
      "da_18_masteryi_ad"
    ],
    "coreChampionIds": [
      "da_18_masteryi_ad",
      "da_18_sett"
    ],
    "tags": [
      "Reroll 3-cost",
      "Melee Carry",
      "Wuju"
    ],
    "champions": [
      {
        "championId": "da_18_masteryi_ad",
        "name": "Master Yi",
        "cost": 3,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_masteryi/tft18_masteryi_square.png",
        "starLevel": 3,
        "isCarry": true,
        "isTank": false,
        "items": [
          "tft_item_bloodthirster",
          "tft_item_guinsoosrageblade",
          "tft_item_titansresolve"
        ],
        "position": {
          "row": 1,
          "col": 3
        }
      },
      {
        "championId": "da_18_sett",
        "name": "Sett",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_sett/tft18_sett_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": true,
        "items": [
          "tft_item_warmogsarmor",
          "tft_item_bramblevest",
          "tft_item_redbuff"
        ],
        "position": {
          "row": 0,
          "col": 3
        }
      },
      {
        "championId": "da_18_ahri",
        "name": "Ahri",
        "cost": 4,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_ahri/tft18_ahri_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 3
        }
      },
      {
        "championId": "da_karma18",
        "name": "Karma",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_karma/tft18_karma_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 1
        }
      },
      {
        "championId": "da_18_yorick",
        "name": "Yorick",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_yorick/tft18_yorick_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 2
        }
      },
      {
        "championId": "da_18_yunara",
        "name": "Yunara",
        "cost": 2,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_yunara/tft18_yunara_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 3,
          "col": 5
        }
      },
      {
        "championId": "da_18_akali_ad",
        "name": "Akali",
        "cost": 1,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_akali/tft18_akali_square.png",
        "starLevel": 2,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 1,
          "col": 2
        }
      },
      {
        "championId": "da_taric18",
        "name": "Taric",
        "cost": 5,
        "imageUrl": "https://raw.communitydragon.org/latest/game/assets/characters/tft18_taric/tft18_taric_square.png",
        "starLevel": 1,
        "isCarry": false,
        "isTank": false,
        "items": [],
        "position": {
          "row": 0,
          "col": 4
        }
      }
    ],
    "traits": [
      {
        "traitId": "blossom",
        "name": "Blossom",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_blossom.png",
        "count": 6,
        "activeBreakpoint": 5,
        "style": "gold"
      },
      {
        "traitId": "adaptor",
        "name": "Adaptor",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_adaptor.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "spellweaver",
        "name": "Spellweaver",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_spellweaver.png",
        "count": 2,
        "activeBreakpoint": 2,
        "style": "bronze"
      },
      {
        "traitId": "emeraldaspect",
        "name": "Emerald Aspect",
        "iconUrl": "https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_emeraldaspect.png",
        "count": 1,
        "activeBreakpoint": 1,
        "style": "prismatic"
      }
    ],
    "recommendedItems": [
      {
        "championId": "da_18_masteryi_ad",
        "itemId": "tft_item_bloodthirster"
      },
      {
        "championId": "da_18_masteryi_ad",
        "itemId": "tft_item_guinsoosrageblade"
      },
      {
        "championId": "da_18_masteryi_ad",
        "itemId": "tft_item_titansresolve"
      },
      {
        "championId": "da_18_sett",
        "itemId": "tft_item_warmogsarmor"
      },
      {
        "championId": "da_18_sett",
        "itemId": "tft_item_bramblevest"
      },
      {
        "championId": "da_18_sett",
        "itemId": "tft_item_redbuff"
      }
    ],
    "augments": [
      "da_18_blossomtraitaugment",
      "tft_augment_titanictitan",
      "da_celestialblessingii"
    ]
  }
];
