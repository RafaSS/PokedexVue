export interface PokemonList {
  count: number;
  next: null;
  previous: null;
  results: Result[];
}

export interface Result {
  name: string;
  url: string;
}

export interface PokemonDetails {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: Ability2[];
    forms: Ability[];
    game_indices: Gameindex[];
    held_items: Helditem[];
    location_area_encounters: string;
    moves: Move[];
    species: Ability;
    sprites: Sprites;
    cries: Cries;
    stats: Stat[];
    types: Type[];
    past_types: Pasttype[];
}
interface Pasttype {
    generation: Ability;
    types: Type[];
}
interface Type {
    slot: number;
    type: Ability;
}
interface Stat {
    base_stat: number;
    effort: number;
    stat: Ability;
}
interface Cries {
    latest: string;
    legacy: string;
}
interface Sprites {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
    other: Other;
    versions: Versions;
}
interface Versions {
    'generation-i': Generationi;
    'generation-ii': Generationii;
    'generation-iii': Generationiii;
    'generation-iv': Generationiv;
    'generation-v': Generationv;
    'generation-vi': Generationvi;
    'generation-vii': Generationvii;
    'generation-viii': Generationviii;
}
interface Generationviii {
    icons: Dreamworld;
}
interface Generationvii {
    icons: Dreamworld;
    'ultra-sun-ultra-moon': Home;
}
interface Generationvi {
    'omegaruby-alphasapphire': Home;
    'x-y': Home;
}
interface Generationv {
    'black-white': Blackwhite;
}
interface Blackwhite {
    animated: Showdown;
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}
interface Generationiv {
    'diamond-pearl': Showdown;
    'heartgold-soulsilver': Showdown;
    platinum: Showdown;
}
interface Generationiii {
    emerald: Officialartwork;
    'firered-leafgreen': Crystal;
    'ruby-sapphire': Crystal;
}
interface Generationii {
    crystal: Crystal;
    gold: Crystal;
    silver: Crystal;
}
interface Crystal {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
}
interface Generationi {
    'red-blue': Redblue;
    yellow: Redblue;
}
interface Redblue {
    back_default: string;
    back_gray: string;
    front_default: string;
    front_gray: string;
}
interface Other {
    dream_world: Dreamworld;
    home: Home;
    'official-artwork': Officialartwork;
    showdown: Showdown;
}
interface Showdown {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}
interface Officialartwork {
    front_default: string;
    front_shiny: string;
}
interface Home {
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}
interface Dreamworld {
    front_default: string;
    front_female?: any;
}
interface Move {
    move: Ability;
    version_group_details: Versiongroupdetail[];
}
interface Versiongroupdetail {
    level_learned_at: number;
    version_group: Ability;
    move_learn_method: Ability;
}
interface Helditem {
    item: Ability;
    version_details: Versiondetail[];
}
interface Versiondetail {
    rarity: number;
    version: Ability;
}
interface Gameindex {
    game_index: number;
    version: Ability;
}
interface Ability2 {
    is_hidden: boolean;
    slot: number;
    ability: Ability;
}
interface Ability {
    name: string;
    url: string;
}

//////////////////////////////////////// Evolution Chain ////////////////////////////////////////

export interface EvolutionChain {
    id: number
    baby_trigger_item: any
    chain: Chain
  }
  
  export interface Chain {
    is_baby: boolean
    species: Species
    evolution_details: any
    evolves_to: EvolvesTo[]
  }
  
  export interface Species {
    name: string
    url: string
  }
  
  export interface EvolvesTo {
    is_baby: boolean
    species: Species2
    evolution_details: EvolutionDetail[]
    evolves_to: any[]
  }
  
  export interface Species2 {
    name: string
    url: string
  }
  
  export interface EvolutionDetail {
    item: any
    trigger: Trigger
    gender: any
    held_item: any
    known_move: any
    known_move_type: any
    location: any
    min_level: number
    min_happiness: any
    min_beauty: any
    min_affection: any
    needs_overworld_rain: boolean
    party_species: any
    party_type: any
    relative_physical_stats: any
    time_of_day: string
    trade_species: any
    turn_upside_down: boolean
  }
  
  export interface Trigger {
    name: string
    url: string
  }
  //////////////////////////////////////// Pokemon Species ////////////////////////////////////////
  export interface PokemonSpecies {
    id: number
    name: string
    order: number
    gender_rate: number
    capture_rate: number
    base_happiness: number
    is_baby: boolean
    is_legendary: boolean
    is_mythical: boolean
    hatch_counter: number
    has_gender_differences: boolean
    forms_switchable: boolean
    growth_rate: GrowthRate
    pokedex_numbers: PokedexNumber[]
    egg_groups: EggGroup[]
    color: Color
    shape: Shape
    evolves_from_species: EvolvesFromSpecies
    evolution_chain: EvolutionChain
    habitat: any
    generation: Generation
    names: Name[]
    flavor_text_entries: FlavorTextEntry[]
    form_descriptions: FormDescription[]
    genera: Genera[]
    varieties: Variety[]
  }
  
  export interface GrowthRate {
    name: string
    url: string
  }
  
  export interface PokedexNumber {
    entry_number: number
    pokedex: Pokedex
  }
  
  export interface Pokedex {
    name: string
    url: string
  }
  
  export interface EggGroup {
    name: string
    url: string
  }
  
  export interface Color {
    name: string
    url: string
  }
  
  export interface Shape {
    name: string
    url: string
  }
  
  export interface EvolvesFromSpecies {
    name: string
    url: string
  }
  
  export interface EvolutionChain {
    url: string
  }
  
  export interface Generation {
    name: string
    url: string
  }
  
  export interface Name {
    name: string
    language: Language
  }
  
  export interface Language {
    name: string
    url: string
  }
  
  export interface FlavorTextEntry {
    flavor_text: string
    language: Language2
    version: Version
  }
  
  export interface Language2 {
    name: string
    url: string
  }
  
  export interface Version {
    name: string
    url: string
  }
  
  export interface FormDescription {
    description: string
    language: Language3
  }
  
  export interface Language3 {
    name: string
    url: string
  }
  
  export interface Genera {
    genus: string
    language: Language4
  }
  
  export interface Language4 {
    name: string
    url: string
  }
  
  export interface Variety {
    is_default: boolean
    pokemon: Pokemon
  }
  
  export interface Pokemon {
    name: string
    url: string
  }
  