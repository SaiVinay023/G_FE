export interface ModelsQueryParams {
  make: string;
}

export interface GenerationsQueryParams {
  make: string;
  model: string;
}

export interface ModificationsQueryParams {
  make: string;
  model: string;
  generation: string;
}

export interface WheelOptionsQueryParams {
  make: string;
  model: string;
  generation: string;
  modification: string;
}

export interface MakesData {
  data: {
    slug: string;
    name: string;
    name_en: string;
    regions: string[];
    logo: string;
  }[];
  meta: {
    count: number;
  };
}

export interface ModelsData {
  data: {
    slug: string;
    name: string;
    name_en: string;
    regions: string[];
    year_ranges: string;
  }[];
  meta: {
    count: number;
  };
}

export interface GenerationData {
  data: {
    slug: string;
    name: string;
    platform: string;
    start: number;
    end: number;
    bodies: { slug: string; name: string; image: string }[];
    regions: string[];
    years: string;
    year_ranges: string;
  }[];
  meta: {
    count: number;
  };
}

export interface ModificationData {
  data: {
    slug: string;
    name: string;
    body: string;
    trim: string;
    trim_attributes: string[];
    trime_body_types: string[];
    trim_levels: string[];
    make: MakesData['data'];
    model: ModelsData['data'];
    generation: GenerationData['data'];
    start_year: number;
    end_year: number;
    engine: {
      fuel: string;
      capacity: number;
      type: string;
      power: {
        kW: number;
        PS: number;
        hp: number;
      };
      code: string;
    };
    regions: string[];
  }[];
  meta: {
    count: number;
  };
}

export interface WheelOptionsData {
  data: {
    slug: string;
    name: string;
    body: string | null;
    trim: string;
    trim_scoring: number[];
    trim_attributes: string[];
    trim_body_types: string[];
    trim_levels: string[];
    make: {
      slug: string;
      name: string;
      name_en: string;
    };
    model: {
      slug: string;
      name: string;
      name_en: string;
    };
    generation: {
      slug: string;
      name: string;
      platform: string;
      start: number;
      end: number;
      bodies: { slug: string; name: string; image: string }[];
    };
    start_year: number;
    end_year: number;
    engine: {
      fuel: string;
      capacity: number;
      type: string;
      power: {
        kW: number;
        PS: number;
        hp: number;
      };
      code: string;
    };
    regions: string[];
    techninal: {
      wheel_fasteners: {
        type: string;
        thread_size: string;
      };
      wheel_tightening_torque: string | null;
      stud_holes: number;
      pcd: number;
      centre_bore: string;
      bolt_pattern: string;
      rear_axis_stud_holes: string | null;
      rear_axis_pcd: string | null;
      rear_axis_centre_bore: string | null;
      rear_axis_bolt_pattern: string | null;
    };
    tire_type: string;
    wheels: {
      is_stock: boolean;
      showing_fp_only: boolean;
      is_extra_load_tires: boolean;
      is_recommended_for_winter: boolean;
      is_runflat_tires: boolean;
      is_pressed_steel_rims: boolean;
      front: {
        rim: string;
        rim_diameter: number;
        rim_width: number;
        rim_offset: number;
        tire_full: string;
        tire: string;
        load_index: number;
        speed_index: string;
        tire_pressure: {
          bar: number;
          psi: number;
          kPa: number;
        };
        tire_sizing_system: string;
        tire_construction: string;
        tire_width: number;
        tire_aspect_ratio: number;
        tire_diameter: number | null;
        tire_section_width: number | null;
        tire_is_82series: boolean;
        tire_alpha_numeric: number | null;
        tire_width_mm: number;
        tire_diameter_mm: number;
        tire_weight_kg: number;
      };
      rear: {
        rim: string;
        rim_diameter: number | null;
        rim_width: number | null;
        rim_offset: number | null;
        tire_full: string;
        tire: string;
        load_index: number | null;
        speed_index: number | null;
        tire_pressure: number | null;
        tire_sizing_system: string;
        tire_construction: string;
        tire_width: number | null;
        tire_aspect_ratio: number | null;
        tire_diameter: number | null;
        tire_section_width: number | null;
        tire_is_82series: boolean;
        tire_alpha_numeric: number | null;
        tire_width_mm: number | null;
        tire_diameter_mm: number | null;
        tire_weight_kg: number | null;
      };
    }[];
  }[];
  meta: {
    count: number;
    regions: Record<string, number>;
  };
}

export interface TiresData {
  data: {
    slug: string;
    display: string;
    brand: {
      slug: string;
      display: string;
      price_segment: string;
    };
    canonical_link: string;
    season: {
      slug: string;
      display: string;
    };
    automobile_type: {
      slug: string;
      display: string;
    };
    year: number;
    discontinued: boolean;
    almost_discontinued: boolean;
    coming_soon: boolean;
    is_runflat: boolean;
    thumbnail: string;
    counters: {
      modes: number;
      videos: number;
      benchmarks: number;
    };
    regions: { slug: string; display: string }[];
    has_modes: Record<string, string[]>;
    rating: {
      score: number;
      popularity: number;
      tags: { slug: string; display: string; connotation: string }[];
    };
  }[];
}
