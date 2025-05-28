/* tslint:disable */
/* eslint-disable */
export function greet(name: string): void;
export class Promiser {
  free(): void;
  constructor(x: number, y: number, speed: number);
  readonly get_x: number;
  set x(value: number);
  readonly get_y: number;
  set y(value: number);
  readonly get_last_x: number;
  readonly get_last_y: number;
  readonly get_speed: number;
}
export class Simulation {
  free(): void;
  constructor(num_promisers: number, expansion_pixel: number, speed: number, first_ratio: number);
  initialize(): void;
  act(): void;
  get_promiser_x(index: number): number;
  get_promiser_y(index: number): number;
  get_promiser_last_x(index: number): number;
  get_promiser_last_y(index: number): number;
  get_promiser_color(index: number): string;
  get_promiser_is_static(index: number): boolean;
  update_config(num_promisers: number, expansion_pixel: number, speed: number, first_ratio: number): void;
  readonly num_promisers: number;
  paused: boolean;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_promiser_free: (a: number, b: number) => void;
  readonly promiser_new: (a: number, b: number, c: number) => number;
  readonly promiser_get_x: (a: number) => number;
  readonly promiser_set_x: (a: number, b: number) => void;
  readonly promiser_get_y: (a: number) => number;
  readonly promiser_set_y: (a: number, b: number) => void;
  readonly promiser_get_last_x: (a: number) => number;
  readonly promiser_get_last_y: (a: number) => number;
  readonly promiser_get_speed: (a: number) => number;
  readonly greet: (a: number, b: number) => void;
  readonly __wbg_simulation_free: (a: number, b: number) => void;
  readonly simulation_new: (a: number, b: number, c: number, d: number) => number;
  readonly simulation_initialize: (a: number) => void;
  readonly simulation_act: (a: number) => void;
  readonly simulation_num_promisers: (a: number) => number;
  readonly simulation_paused: (a: number) => number;
  readonly simulation_set_paused: (a: number, b: number) => void;
  readonly simulation_get_promiser_x: (a: number, b: number) => number;
  readonly simulation_get_promiser_y: (a: number, b: number) => number;
  readonly simulation_get_promiser_last_x: (a: number, b: number) => number;
  readonly simulation_get_promiser_last_y: (a: number, b: number) => number;
  readonly simulation_get_promiser_color: (a: number, b: number) => [number, number];
  readonly simulation_get_promiser_is_static: (a: number, b: number) => number;
  readonly simulation_update_config: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
