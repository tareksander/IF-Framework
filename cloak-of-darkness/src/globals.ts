import { engine } from "@if-framework/framework/choice";
import { Writable, writable, get } from "svelte/store";

// Interface for type safety of the engine's global variables.
export interface Globals {
    hasCloak: boolean;
    room: Writable<string>;
    lastRoom: string;
};

// Simple function to initialize the globals and cast them to the Globals interface.
export function globals() {
    let g = engine.globals as Globals;
    g.hasCloak ??= true;
    g.room ??= writable("");
    g.lastRoom ??= "";
    return g;
}

export function room(r: string) {
    let g = globals();
    g.lastRoom = get(g.room);
    g.room.set(r);
}
