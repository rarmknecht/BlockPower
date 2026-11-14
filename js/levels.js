/**
 * Curated puzzle levels for Block Power.
 * Includes 6x6 square grids, 6x7 / 6x8 / 7x6 / 7x8 rectangular yards, and 7x7 master grids.
 * All levels are verified solvable with exact BFS optimal par counts.
 */

/** @type {import("./engine.js").LevelConfig[]} */
export const LEVELS = [
  {
    "id": "starter-1",
    "name": "First Escape",
    "difficulty": "Starter",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 4,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 0
      },
      {
        "id": "v1",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 2,
        "color": "slate"
      },
      {
        "id": "v2",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 4,
        "col": 1,
        "color": "forest"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 3,
        "color": "cobalt"
      },
      {
        "id": "v4",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 3,
        "color": "amber"
      },
      {
        "id": "v5",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 5,
        "color": "teal"
      }
    ]
  },
  {
    "id": "starter-2",
    "name": "Driveway Shuffle",
    "difficulty": "Starter",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 8,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 0
      },
      {
        "id": "v1",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 2,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 4,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "residential",
        "dir": "h",
        "len": 3,
        "row": 4,
        "col": 1,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 0,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 0,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 5,
        "color": "violet"
      }
    ]
  },
  {
    "id": "starter-3",
    "name": "Suburban Block",
    "difficulty": "Starter",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 8,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 0
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 2,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 2,
        "col": 5,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 1,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 1,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 1,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 3,
        "col": 0,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "residential",
        "dir": "h",
        "len": 3,
        "row": 5,
        "col": 3,
        "color": "slate"
      }
    ]
  },
  {
    "id": "starter-4",
    "name": "Cul-de-Sac",
    "difficulty": "Starter",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 9,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 2
      },
      {
        "id": "v1",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 5,
        "color": "violet"
      },
      {
        "id": "v2",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 4,
        "color": "lime"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 2,
        "color": "forest"
      },
      {
        "id": "v4",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "v5",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 4,
        "col": 4,
        "color": "teal"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 3,
        "color": "violet"
      },
      {
        "id": "v7",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 3,
        "color": "lime"
      }
    ]
  },
  {
    "id": "starter-5",
    "name": "Garage Sale",
    "difficulty": "Starter",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 10,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 1
      },
      {
        "id": "v1",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "v2",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 4,
        "color": "forest"
      },
      {
        "id": "v3",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 2,
        "color": "cobalt"
      },
      {
        "id": "v4",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 0,
        "color": "lime"
      },
      {
        "id": "v5",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 1,
        "color": "violet"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 2,
        "color": "indigo"
      },
      {
        "id": "v7",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 5,
        "color": "amber"
      },
      {
        "id": "v8",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 1,
        "col": 3,
        "color": "lime"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 4,
        "color": "teal"
      }
    ]
  },
  {
    "id": "city-1",
    "name": "Crosswalk Crunch",
    "difficulty": "City Grid",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 11,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 0
      },
      {
        "id": "v1",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 4,
        "col": 2,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "residential",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 5,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 2,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 0,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 1,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 4,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 1,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 4,
        "color": "forest"
      }
    ]
  },
  {
    "id": "city-2",
    "name": "Delivery Rush",
    "difficulty": "City Grid",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 12,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 1
      },
      {
        "id": "v1",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 1,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 3,
        "col": 1,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "residential",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 0,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 4,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "residential",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 5,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 2,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 3,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 4,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 3,
        "color": "forest"
      }
    ]
  },
  {
    "id": "city-3",
    "name": "Midtown Gridlock",
    "difficulty": "City Grid",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 15,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 1
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 4,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 0,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 5,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 2,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 4,
        "col": 3,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "residential",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 4,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 3,
        "col": 1,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 0,
        "color": "forest"
      },
      {
        "id": "v10",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 2,
        "color": "cobalt"
      }
    ]
  },
  {
    "id": "city-4",
    "name": "Bus Lane Blues",
    "difficulty": "City Grid",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 14,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 1
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 3,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 5,
        "color": "amber"
      },
      {
        "id": "v3",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "v4",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 4,
        "col": 4,
        "color": "lime"
      },
      {
        "id": "v5",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 1,
        "color": "cobalt"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 2,
        "color": "cobalt"
      },
      {
        "id": "v7",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 3,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 0,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 1,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "v10",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 3,
        "color": "amber"
      }
    ]
  },
  {
    "id": "city-5",
    "name": "Crosstown Traffic",
    "difficulty": "City Grid",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 16,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 0
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 4,
        "color": "violet"
      },
      {
        "id": "v2",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 2,
        "color": "teal"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 4,
        "color": "teal"
      },
      {
        "id": "v4",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 4,
        "col": 2,
        "color": "amber"
      },
      {
        "id": "v5",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 1,
        "color": "teal"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 0,
        "color": "teal"
      },
      {
        "id": "v7",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 1,
        "col": 0,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 0,
        "color": "cobalt"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 3,
        "color": "amber"
      },
      {
        "id": "v10",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 3,
        "color": "cobalt"
      }
    ]
  },
  {
    "id": "freight-1",
    "name": "Loading Dock 7",
    "difficulty": "Freight Yard",
    "rows": 6,
    "cols": 7,
    "exitRow": 2,
    "par": 15,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 0
      },
      {
        "id": "v1",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 3,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 3,
        "col": 1,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 4,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 6,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "residential",
        "dir": "h",
        "len": 3,
        "row": 4,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 5,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 2,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 5,
        "col": 0,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 6,
        "color": "forest"
      },
      {
        "id": "v10",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 1,
        "col": 0,
        "color": "cobalt"
      },
      {
        "id": "v11",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 3,
        "color": "amber"
      }
    ]
  },
  {
    "id": "freight-2",
    "name": "Long Haul Corridor",
    "difficulty": "Freight Yard",
    "rows": 6,
    "cols": 8,
    "exitRow": 2,
    "par": 14,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 0
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 0,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 2,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 2,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 4,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 1,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 1,
        "col": 0,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 4,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 6,
        "color": "forest"
      },
      {
        "id": "v10",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 6,
        "color": "cobalt"
      },
      {
        "id": "v11",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 7,
        "color": "amber"
      },
      {
        "id": "v12",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 5,
        "color": "teal"
      },
      {
        "id": "v13",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 0,
        "color": "indigo"
      }
    ]
  },
  {
    "id": "freight-3",
    "name": "Warehouse Alley",
    "difficulty": "Freight Yard",
    "rows": 7,
    "cols": 6,
    "exitRow": 3,
    "par": 15,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 1
      },
      {
        "id": "v1",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 4,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 4,
        "col": 4,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 1,
        "col": 3,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 2,
        "col": 0,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 0,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 6,
        "col": 3,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 2,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 3,
        "color": "forest"
      },
      {
        "id": "v10",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 1,
        "color": "cobalt"
      },
      {
        "id": "v11",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 4,
        "color": "amber"
      }
    ]
  },
  {
    "id": "freight-4",
    "name": "Container Stack",
    "difficulty": "Freight Yard",
    "rows": 6,
    "cols": 7,
    "exitRow": 2,
    "par": 18,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 0
      },
      {
        "id": "v1",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 1,
        "col": 3,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "residential",
        "dir": "h",
        "len": 3,
        "row": 4,
        "col": 2,
        "color": "indigo"
      },
      {
        "id": "v3",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 3,
        "color": "lime"
      },
      {
        "id": "v4",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 1,
        "col": 5,
        "color": "amber"
      },
      {
        "id": "v5",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 0,
        "color": "forest"
      },
      {
        "id": "v6",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 4,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 2,
        "color": "slate"
      },
      {
        "id": "v8",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 5,
        "color": "cobalt"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 5,
        "color": "forest"
      },
      {
        "id": "v10",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 1,
        "color": "teal"
      }
    ]
  },
  {
    "id": "freight-5",
    "name": "Rail Spur Yard",
    "difficulty": "Freight Yard",
    "rows": 7,
    "cols": 8,
    "exitRow": 3,
    "par": 20,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 0
      },
      {
        "id": "v1",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 5,
        "col": 3,
        "color": "lime"
      },
      {
        "id": "v2",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 4,
        "color": "lime"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 7,
        "color": "slate"
      },
      {
        "id": "v4",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 4,
        "color": "forest"
      },
      {
        "id": "v5",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 5,
        "col": 0,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 6,
        "color": "slate"
      },
      {
        "id": "v7",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 2,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "residential",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 5,
        "color": "amber"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 7,
        "color": "lime"
      },
      {
        "id": "v10",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 0,
        "color": "lime"
      },
      {
        "id": "v11",
        "category": "residential",
        "dir": "h",
        "len": 3,
        "row": 4,
        "col": 1,
        "color": "forest"
      },
      {
        "id": "v12",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 3,
        "color": "cobalt"
      },
      {
        "id": "v13",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 1,
        "color": "teal"
      },
      {
        "id": "v14",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 3,
        "col": 6,
        "color": "cobalt"
      },
      {
        "id": "v15",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 1,
        "color": "slate"
      }
    ]
  },
  {
    "id": "master-1",
    "name": "Cloverleaf Knot",
    "difficulty": "Master Jam",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 17,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 1
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 3,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 5,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 4,
        "col": 3,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 4,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 2,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 0,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 0,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 0,
        "color": "forest"
      },
      {
        "id": "v10",
        "category": "commercial",
        "dir": "h",
        "len": 3,
        "row": 5,
        "col": 3,
        "color": "cobalt"
      }
    ]
  },
  {
    "id": "master-2",
    "name": "Downtown Bottleneck",
    "difficulty": "Master Jam",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 21,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 1
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 4,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 0,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 3,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 1,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 4,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 4,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 5,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 0,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "residential",
        "dir": "h",
        "len": 3,
        "row": 3,
        "col": 1,
        "color": "forest"
      },
      {
        "id": "v10",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 1,
        "col": 3,
        "color": "cobalt"
      },
      {
        "id": "v11",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 2,
        "color": "amber"
      }
    ]
  },
  {
    "id": "master-3",
    "name": "Grand Terminal",
    "difficulty": "Master Jam",
    "rows": 7,
    "cols": 7,
    "exitRow": 3,
    "par": 16,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 0
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 4,
        "color": "forest"
      },
      {
        "id": "v2",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 6,
        "col": 0,
        "color": "cobalt"
      },
      {
        "id": "v3",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 1,
        "color": "amber"
      },
      {
        "id": "v4",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 6,
        "color": "teal"
      },
      {
        "id": "v5",
        "category": "commercial",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "v6",
        "category": "residential",
        "dir": "h",
        "len": 3,
        "row": 5,
        "col": 3,
        "color": "lime"
      },
      {
        "id": "v7",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 6,
        "col": 3,
        "color": "violet"
      },
      {
        "id": "v8",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 4,
        "col": 3,
        "color": "slate"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 4,
        "color": "forest"
      },
      {
        "id": "v10",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 1,
        "color": "cobalt"
      },
      {
        "id": "v11",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 2,
        "color": "amber"
      },
      {
        "id": "v12",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 6,
        "color": "teal"
      },
      {
        "id": "v13",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 6,
        "col": 5,
        "color": "indigo"
      },
      {
        "id": "v14",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 1,
        "col": 5,
        "color": "lime"
      }
    ]
  },
  {
    "id": "master-4",
    "name": "Five-Way Jam",
    "difficulty": "Master Jam",
    "rows": 6,
    "cols": 6,
    "exitRow": 2,
    "par": 29,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 2,
        "col": 0
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 3,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "v2",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 2,
        "color": "slate"
      },
      {
        "id": "v3",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 0,
        "color": "forest"
      },
      {
        "id": "v4",
        "category": "residential",
        "dir": "h",
        "len": 3,
        "row": 0,
        "col": 1,
        "color": "amber"
      },
      {
        "id": "v5",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 4,
        "color": "violet"
      },
      {
        "id": "v6",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 4,
        "color": "cobalt"
      },
      {
        "id": "v7",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 5,
        "color": "slate"
      },
      {
        "id": "v8",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 1,
        "col": 3,
        "color": "lime"
      },
      {
        "id": "v9",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 5,
        "color": "forest"
      },
      {
        "id": "v10",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 4,
        "col": 4,
        "color": "amber"
      }
    ]
  },
  {
    "id": "master-5",
    "name": "Final Interchange",
    "difficulty": "Master Jam",
    "rows": 7,
    "cols": 7,
    "exitRow": 3,
    "par": 29,
    "vehicles": [
      {
        "id": "hero",
        "category": "hero",
        "dir": "h",
        "len": 2,
        "row": 3,
        "col": 1
      },
      {
        "id": "v1",
        "category": "residential",
        "dir": "v",
        "len": 3,
        "row": 3,
        "col": 5,
        "color": "amber"
      },
      {
        "id": "v2",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 5,
        "col": 0,
        "color": "teal"
      },
      {
        "id": "v3",
        "category": "residential",
        "dir": "v",
        "len": 3,
        "row": 0,
        "col": 2,
        "color": "lime"
      },
      {
        "id": "v4",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 0,
        "col": 1,
        "color": "cobalt"
      },
      {
        "id": "v5",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 5,
        "col": 1,
        "color": "slate"
      },
      {
        "id": "v6",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 6,
        "col": 1,
        "color": "indigo"
      },
      {
        "id": "v7",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "v8",
        "category": "residential",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 0,
        "color": "forest"
      },
      {
        "id": "v9",
        "category": "jeep",
        "dir": "v",
        "len": 2,
        "row": 2,
        "col": 3,
        "color": "violet"
      },
      {
        "id": "v10",
        "category": "residential",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 3,
        "color": "cobalt"
      },
      {
        "id": "v11",
        "category": "residential",
        "dir": "v",
        "len": 2,
        "row": 4,
        "col": 3,
        "color": "amber"
      },
      {
        "id": "v12",
        "category": "residential",
        "dir": "h",
        "len": 3,
        "row": 6,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "v13",
        "category": "residential",
        "dir": "v",
        "len": 3,
        "row": 1,
        "col": 4,
        "color": "lime"
      },
      {
        "id": "v14",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 0,
        "col": 5,
        "color": "amber"
      },
      {
        "id": "v15",
        "category": "jeep",
        "dir": "h",
        "len": 2,
        "row": 1,
        "col": 5,
        "color": "violet"
      }
    ]
  }
];
