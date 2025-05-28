use wasm_bindgen::prelude::*;
use crate::promiser::SecondPromiserInternal;

#[wasm_bindgen]
pub struct Simulation {
    promisers: Vec<SecondPromiserInternal>,
    num_promisers: usize,
    expansion_pixel: f32,
    speed: f32,
    first_ratio: f32,
    paused: bool,
}

#[wasm_bindgen]
impl Simulation {
    #[wasm_bindgen(constructor)]
    pub fn new(
        num_promisers: usize,
        expansion_pixel: f32,
        speed: f32,
        first_ratio: f32,
    ) -> Simulation {
        let mut sim = Simulation {
            promisers: Vec::new(),
            num_promisers,
            expansion_pixel,
            speed,
            first_ratio,
            paused: false,
        };
        sim.initialize();
        sim
    }

    pub fn initialize(&mut self) {
        self.promisers.clear();
        
        // Create promisers
        for _ in 0..self.num_promisers {
            let is_static = js_sys::Math::random() >= self.first_ratio as f64;
            let x = (js_sys::Math::random() * self.expansion_pixel as f64) as f32;
            let y = (js_sys::Math::random() * self.expansion_pixel as f64) as f32;
            let promiser = SecondPromiserInternal::new(x, y, self.speed, is_static);
            self.promisers.push(promiser);
        }

        // Add promises to each promiser
        let num_promises = 5;
        for i in 0..self.num_promisers {
            for _ in 0..num_promises {
                let random_index = (js_sys::Math::random() * self.num_promisers as f64) as usize;
                if random_index < self.promisers.len() {
                    self.promisers[i].add_promise(random_index);
                }
            }
        }
    }

    pub fn act(&mut self) {
        if self.paused {
            return;
        }

        // Process each promiser's movement
        for i in 0..self.promisers.len() {
            if !self.promisers[i].is_static {
                // Get target information if available
                if let Some(target_idx) = self.promisers[i].current_target {
                    if target_idx < self.promisers.len() && target_idx != i {
                        let target_x = self.promisers[target_idx].x;
                        let target_y = self.promisers[target_idx].y;
                        let dx = target_x - self.promisers[i].x;
                        let dy = target_y - self.promisers[i].y;
                        let distance = (dx * dx + dy * dy).sqrt();

                        // Check if hit target
                        if distance < self.promisers[i].hit_distance {
                            self.promisers[i].size = self.promisers[i].size.saturating_sub(1);

                            // Ask for new promise with some probability
                            if js_sys::Math::random() < self.promisers[i].asking_ratio as f64 {
                                // Find a random promise that's not the current target
                                let mut attempts = 0;
                                while attempts < 10 {
                                    let random_idx = (js_sys::Math::random() * self.promisers[i].num_promises as f64) as usize;
                                    if let Some(promise_idx) = self.promisers[i].promises.get(random_idx).and_then(|&p| p) {
                                        if promise_idx != target_idx && promise_idx < self.promisers.len() {
                                            self.promisers[i].tm = Some(promise_idx);
                                            // Add the promise to the target (will be done in next frame)
                                            break;
                                        }
                                    }
                                    attempts += 1;
                                }
                            }

                            // Update current target
                            self.promisers[i].current_target = if self.promisers[i].size > 0 {
                                self.promisers[i].promises[self.promisers[i].size - 1]
                            } else {
                                None
                            };
                        }

                        // Move towards target
                        if distance != 0.0 {
                            let ratio = self.promisers[i].speed / distance;
                            self.promisers[i].last_x = self.promisers[i].x;
                            self.promisers[i].last_y = self.promisers[i].y;
                            self.promisers[i].x += dx * ratio;
                            self.promisers[i].y += dy * ratio;
                        }
                    }
                }
            }
        }
    }

    #[wasm_bindgen(getter)]
    pub fn num_promisers(&self) -> usize {
        self.num_promisers
    }

    #[wasm_bindgen(getter)]
    pub fn paused(&self) -> bool {
        self.paused
    }

    #[wasm_bindgen(setter)]
    pub fn set_paused(&mut self, paused: bool) {
        self.paused = paused;
    }

    // Get promiser data for rendering
    pub fn get_promiser_x(&self, index: usize) -> f32 {
        self.promisers.get(index).map_or(0.0, |p| p.x)
    }

    pub fn get_promiser_y(&self, index: usize) -> f32 {
        self.promisers.get(index).map_or(0.0, |p| p.y)
    }

    pub fn get_promiser_last_x(&self, index: usize) -> f32 {
        self.promisers.get(index).map_or(0.0, |p| p.last_x)
    }

    pub fn get_promiser_last_y(&self, index: usize) -> f32 {
        self.promisers.get(index).map_or(0.0, |p| p.last_y)
    }

    pub fn get_promiser_color(&self, index: usize) -> String {
        self.promisers.get(index).map_or("yellow".to_string(), |p| p.get_color())
    }

    pub fn get_promiser_is_static(&self, index: usize) -> bool {
        self.promisers.get(index).map_or(false, |p| p.is_static)
    }

    // Update simulation parameters
    pub fn update_config(
        &mut self,
        num_promisers: usize,
        expansion_pixel: f32,
        speed: f32,
        first_ratio: f32,
    ) {
        let needs_reinit = num_promisers != self.num_promisers 
            || expansion_pixel != self.expansion_pixel
            || speed != self.speed 
            || first_ratio != self.first_ratio;

        self.num_promisers = num_promisers;
        self.expansion_pixel = expansion_pixel;
        self.speed = speed;
        self.first_ratio = first_ratio;

        if needs_reinit {
            self.initialize();
        }
    }
}
