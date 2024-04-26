import { get, readable, writable } from 'svelte/store';

export interface Save {
    /**
     * The save slot occupied.
     * Slots start at 0, -1 is reserved for the autosave.
     */
    slot: number,
    /**
     * The save name.
     */
    name: string,
    /**
     * The save date.
     */
    date: Date,
    /**
     * The save data, a JSON string.
     */
    data: string,
    /**
     * The save version of your game, you should increment this when you change the shape of the data that is included in saves,
     * e.g. add {@link SaveCallbacks} or change the type of global or local variables.
     */
    version: number,
}


/**
 * Callbacks to manage custom state in saves.
 */
export interface SaveCallbacks {
    /**
     * The key of the callback data in the saved JSON. Must be unique among all SaveCallbacks registered.
     */
    tag: string,
    /**
     * Called when a save is loaded to restore user-defined state. Data is run through {@link deserialize} febore this.
     */
    onLoad: (data: object) => undefined,
    /**
     * Called when a save is loaded to save user-defined state. Data is run through {@link serialize} after this.
     */
    onSave: () => any,
}


type serializedType = "r" | "w" | "m" | "o" | "b";
/**
 * Serializes a value, with correct handling for nesting, Maps, BigInts and Svelte-style stores.
 * hooks maps from a prototype object to a type tag and a custom serialization function.
 * ignorePrototype is an internally used parameter used to ignore a specific prototype when serializing an object.
 */
export function serialize(v: any, hooks: Map<any, [string, (data: any) => object]> = saveManager.serializeHooks, ignorePrototype: any | undefined = undefined): any {
    switch (typeof v) {
        case 'string':
            return v;
        case 'number':
            return v;
        case 'bigint':
            return { $: "b", v: "0x"+v.toString(16) };
        case 'boolean':
            return v;
        case 'symbol':
            return undefined;
        case 'undefined':
            return undefined;
        case 'object':
            if (v === null) {
                return null;
            }
            if (v instanceof Array) {
                return v.map((v): any => serialize(v, hooks));
            } else if (v instanceof Map) {
                return {$: "m", v: Array.of(v.entries()).map(([k, v]): any[] => [serialize(k, hooks), serialize(v, hooks)])};
            } else {
                if (Object.hasOwn(v, "subscribe")) {
                    let type = "r";
                    if (Object.hasOwn(v, "set")) {
                        type = "w";
                    }
                    return {$: type, v: serialize(get(v), hooks)};
                } else {
                    let p = Object.getPrototypeOf(v);
                    let s = hooks.get(p);
                    if (s && p !== ignorePrototype) {
                        let [type, ser] = s;
                        return {$: type, v: serialize(ser(v), hooks, p)};
                    }
                    return {$: "o", v: Object.fromEntries(Object.entries(v).map(([k, v]) => [k, serialize(v, hooks)]))};
                }
            }
        case 'function':
            return undefined;
    }
}

/**
 * Deserializes a value, with correct handling for nesting, Maps, BigInts and Svelte-style stores.
 * hooks maps from a type tag to a custom deserialization function.
 */
export function deserialize(v: any, hooks: Map<string, (data: any) => any> = saveManager.deserializeHooks): any {
    switch (typeof v) {
        case 'string':
            return v;
        case 'number':
            return v;
        case 'boolean':
            return v;
        case 'object':
            if (v === null) {
                return null;
            }
            if (v instanceof Array) {
                return v.map((v) => deserialize(v, hooks));
            }
            let type: serializedType | string = v.$;
            switch (type) {
                case 'r':
                    return readable(v.v);
                case 'w':
                    return writable(v.v);
                case 'm':
                    return new Map(v.v.map(([k, v]: [any, any]) => [deserialize(k, hooks), deserialize(v, hooks)]));
                case 'o':
                    return Object.fromEntries(Object.entries(v.v).map(([k, v]: [string, any]) => [k, deserialize(v, hooks)]));
                case 'b':
                    return BigInt(v.v);
            }
            let de = hooks.get(type);
            if (de) {
                return de(deserialize(v.v, hooks));
            }
            return undefined;
    }
}


export class SaveManager {
    static saveManager = new SaveManager();
    
    /**
     * Save & load callback list.
     */
    public callbacks: SaveCallbacks[] = [];
    /**
     * Hooks used while serializing.
     */
    public serializeHooks: Map<any, [string, (data: object) => any]> = new Map();
    /**
     * Hooks used while deserializing.
     */
    public deserializeHooks: Map<string, (data: any) => any> = new Map();
    
    private constructor() {}
    
    /**
     * Gathers save data from the save callbacks and serializes it.
     */
    public serializeData(): string {
        let entries = [];
        for (let c of this.callbacks) {
            entries.push([c.tag, serialize(c.onSave(), this.serializeHooks)]);
        }
        return JSON.stringify(Object.fromEntries(entries));
    }
    
    /**
     * Deserializes the data and distributes it to the save callbacks.
     */
    public loadData(data: string) {
        let o = JSON.parse(data);
        for (let c of this.callbacks) {
            c.onLoad(deserialize(o[c.tag], this.deserializeHooks));
        }
    }
    
    
}

export const saveManager = SaveManager.saveManager;
