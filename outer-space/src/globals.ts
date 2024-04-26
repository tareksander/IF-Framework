import { RNG, engine } from "@if-framework/framework/choice";
import { Writable, Readable, writable, get, derived } from "svelte/store";

// Interface for type safety of the engine's global variables.
export interface Globals {
    stage: Writable<number>,
    progress: Writable<number>,
    breachesFront: Writable<number>,
    breachesMid: Writable<number>,
    breachesAft: Writable<number>,
    fuel: Writable<number>,
    scrap: Writable<number>,
    navOffline: Writable<boolean>,
    enginesOffline: Writable<boolean>,
    meteorFrequency: Writable<number>,
    rng: RNG,
};


export let hull: Readable<number>;

function onReset() {
    let g = globals();
    let h = derived([g.breachesFront, g.breachesMid, g.breachesAft], ([f, m, a]) => Math.max(100 - (f + m + a) * 10, 0));
    h.subscribe((h) => {
        if (h <= 1) {
            engine.goTo(engine.passage("fail")!);
        }
    });
    hull = h;
    g.progress.subscribe((p) => {
        if (p >= 100) {
            g.progress.set(0);
            let stage = get(g.stage);
            g.breachesAft.set(0);
            g.breachesMid.set(0);
            g.breachesFront.set(0);
            g.navOffline.set(false);
            g.enginesOffline.set(false);
            if (get(g.scrap) < 2) {
                g.scrap.set(2);
            }
            g.meteorFrequency.set(0.2 + 0.05*stage);
            g.stage.set(stage + 1);
            engine.goTo(engine.passage("ftl" + stage)!);
        }
    });
}

export const init = onReset;

engine.onReset.push(onReset);

/**
 * Simple function to initialize the globals and cast them to the Globals interface.
 */
export function globals() {
    let g = engine.globals as Globals;
    g.stage ??= writable(1);
    g.progress ??= writable(0);
    g.breachesFront ??= writable(0);
    g.breachesMid ??= writable(0);
    g.breachesAft ??= writable(0);
    g.fuel ??= writable(100);
    g.scrap ??= writable(2);
    g.navOffline ??= writable(false);
    g.enginesOffline ??= writable(false);
    g.meteorFrequency ??= writable(0.2);
    g.rng ??= new RNG();
    return g;
}

export function goTo(passage: string) {
    let e = rollEvent();
    if (get(hull) > 0.03) {
        engine.goTo(engine.passage(passage)!, { event: e });
    }
}

export function rollEvent() {
    let g = globals();
    let rng = g.rng;
    const events = ["nav", "meteorFront", "meteorMid", "meteorAft", "engines", null] as const;
    let mf = Math.max(0, Math.min(0.9, get(g.meteorFrequency) - ((get(engine.currentPassage).name === "front") ? 0.2 : 0) + (get(g.enginesOffline) ? 0.2 : 0)));
    let r = events[rng.choose([0.05, mf /3, mf/3, mf/3, 0.05, 0.9 - mf])];
    switch (r) {
        case "meteorFront":
            g.breachesFront.set(get(g.breachesFront) + 1);
            break;
        case "meteorMid":
            g.breachesMid.set(get(g.breachesMid) + 1);
            break;
        case "meteorAft":
            g.breachesAft.set(get(g.breachesAft) + 1);
            break;
        case "nav":
            if (! get(g.navOffline)) {
                g.navOffline.set(true);
            } else {
                r =  null;
            }
            break;
        case "engines":
            if (! get(g.enginesOffline)) {
                g.enginesOffline.set(true);
            } else {
                r = null;
            }
            break;
    }
    
    mf = get(g.meteorFrequency);
    let diff = Math.max(Math.min(0.2 + (get(g.stage) - 1)/20 - mf, 0.25), -0.25);
    switch (rng.choose([0.25-diff, 0.25+diff, 0.5])) {
        case 0:
            mf -= 0.05;
            break;
        case 1:
            mf += 0.05;
            break;
    }
    g.meteorFrequency.set(mf);
    if (! get(g.navOffline)) {
        g.progress.set(get(g.progress) + 5);
    }
    return r;
}
