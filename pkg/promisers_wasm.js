let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
 * @param {string} name
 */
export function greet(name) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.greet(ptr0, len0);
}

const PromiserFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_promiser_free(ptr >>> 0, 1));

export class Promiser {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PromiserFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_promiser_free(ptr, 0);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} speed
     */
    constructor(x, y, speed) {
        const ret = wasm.promiser_new(x, y, speed);
        this.__wbg_ptr = ret >>> 0;
        PromiserFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get get_x() {
        const ret = wasm.promiser_get_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} val
     */
    set x(val) {
        wasm.promiser_set_x(this.__wbg_ptr, val);
    }
    /**
     * @returns {number}
     */
    get get_y() {
        const ret = wasm.promiser_get_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} val
     */
    set y(val) {
        wasm.promiser_set_y(this.__wbg_ptr, val);
    }
    /**
     * @returns {number}
     */
    get get_last_x() {
        const ret = wasm.promiser_get_last_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get get_last_y() {
        const ret = wasm.promiser_get_last_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get get_speed() {
        const ret = wasm.promiser_get_speed(this.__wbg_ptr);
        return ret;
    }
}

const SimulationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_simulation_free(ptr >>> 0, 1));

export class Simulation {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SimulationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_simulation_free(ptr, 0);
    }
    /**
     * @param {number} num_promisers
     * @param {number} expansion_pixel
     * @param {number} speed
     * @param {number} first_ratio
     */
    constructor(num_promisers, expansion_pixel, speed, first_ratio) {
        const ret = wasm.simulation_new(num_promisers, expansion_pixel, speed, first_ratio);
        this.__wbg_ptr = ret >>> 0;
        SimulationFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    initialize() {
        wasm.simulation_initialize(this.__wbg_ptr);
    }
    act() {
        wasm.simulation_act(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    get num_promisers() {
        const ret = wasm.simulation_num_promisers(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    get paused() {
        const ret = wasm.simulation_paused(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} paused
     */
    set paused(paused) {
        wasm.simulation_set_paused(this.__wbg_ptr, paused);
    }
    /**
     * @param {number} index
     * @returns {number}
     */
    get_promiser_x(index) {
        const ret = wasm.simulation_get_promiser_x(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * @param {number} index
     * @returns {number}
     */
    get_promiser_y(index) {
        const ret = wasm.simulation_get_promiser_y(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * @param {number} index
     * @returns {number}
     */
    get_promiser_last_x(index) {
        const ret = wasm.simulation_get_promiser_last_x(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * @param {number} index
     * @returns {number}
     */
    get_promiser_last_y(index) {
        const ret = wasm.simulation_get_promiser_last_y(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * @param {number} index
     * @returns {string}
     */
    get_promiser_color(index) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.simulation_get_promiser_color(this.__wbg_ptr, index);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} index
     * @returns {boolean}
     */
    get_promiser_is_static(index) {
        const ret = wasm.simulation_get_promiser_is_static(this.__wbg_ptr, index);
        return ret !== 0;
    }
    /**
     * @param {number} num_promisers
     * @param {number} expansion_pixel
     * @param {number} speed
     * @param {number} first_ratio
     */
    update_config(num_promisers, expansion_pixel, speed, first_ratio) {
        wasm.simulation_update_config(this.__wbg_ptr, num_promisers, expansion_pixel, speed, first_ratio);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_log_a383e2adb0a70abe = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_random_3ad904d98382defe = function() {
        const ret = Math.random();
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_0;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('promisers_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
