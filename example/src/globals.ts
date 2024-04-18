import { engine } from "@if-framework/framework/choice";

export interface Globals {
    value: string;
};

// Simple function to initialize the globals and cast them to the Globals interface.
export function globals() {
    let g = engine.globals as Globals;
    g.value ??= "";
    return g;
}

