use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct Promiser {
    x: f32,
    y: f32,
    last_x: f32,
    last_y: f32,
    speed: f32,
    current_target: i32, // -1 for None, otherwise index
}

#[wasm_bindgen]
impl Promiser {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f32, y: f32, speed: f32) -> Promiser {
        Promiser {
            x,
            y,
            last_x: x,
            last_y: y,
            speed,
            current_target: -1,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn get_x(&self) -> f32 {
        self.x
    }

    #[wasm_bindgen(setter)]
    pub fn set_x(&mut self, val: f32) {
        self.x = val;
    }

    #[wasm_bindgen(getter)]
    pub fn get_y(&self) -> f32 {
        self.y
    }

    #[wasm_bindgen(setter)]
    pub fn set_y(&mut self, val: f32) {
        self.y = val;
    }

    #[wasm_bindgen(getter)]
    pub fn get_last_x(&self) -> f32 {
        self.last_x
    }

    #[wasm_bindgen(getter)]
    pub fn get_last_y(&self) -> f32 {
        self.last_y
    }

    #[wasm_bindgen(getter)]
    pub fn get_speed(&self) -> f32 {
        self.speed
    }
}

// Internal representation that doesn't need to cross WASM boundary
#[derive(Clone, Debug)]
pub struct SecondPromiserInternal {
    pub x: f32,
    pub y: f32,
    pub last_x: f32,
    pub last_y: f32,
    pub speed: f32,
    pub current_target: Option<usize>,
    pub is_static: bool,
    pub hit_distance: f32,
    pub num_promises: usize,
    pub promises: Vec<Option<usize>>,
    pub size: usize,
    pub asking_ratio: f32,
    pub tm: Option<usize>,
}

impl SecondPromiserInternal {
    pub fn new(x: f32, y: f32, speed: f32, is_static: bool) -> Self {
        let hit_distance = speed.floor();
        let num_promises = 100;
        SecondPromiserInternal {
            x,
            y,
            last_x: x,
            last_y: y,
            speed,
            current_target: None,
            is_static,
            hit_distance,
            num_promises,
            promises: vec![None; num_promises],
            size: 0,
            asking_ratio: 0.1,
            tm: None,
        }
    }

    pub fn add_promise(&mut self, target_idx: usize) {
        if self.size >= self.num_promises {
            // Random replacement
            let index = (js_sys::Math::random() * self.num_promises as f64) as usize;
            self.promises[index] = Some(target_idx);
            if self.num_promises > 0 {
                self.current_target = self.promises[self.num_promises - 1];
            }
        } else {
            self.promises[self.size] = Some(target_idx);
            self.current_target = Some(target_idx);
            self.size += 1;
        }
    }

    pub fn get_color(&self) -> String {
        match self.size {
            0 => "lightgray".to_string(),
            1 => "green".to_string(),
            2 => "cyan".to_string(),
            3 => "red".to_string(),
            4 => "orange".to_string(),
            _ => "yellow".to_string(),
        }
    }
}
