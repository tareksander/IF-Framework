import { derived, get, readable, Readable, writable, Writable } from 'svelte/store';
import { config } from './config';
import { deserialize, Save, saveManager, serialize } from '../common/save';
import { SaveDB } from '../common/savedb';
import { applyTheme, loadTheme, saveTheme, Theme } from "../common/theme";
import { RNG } from '../common/rand';

/**
 * Represents a passage/screen of the story.
 */
export class Passage {
    /**
     * The passage name, used to navigate to it. Has to be unique.
     */
    readonly name: string;
    /**
     * The passage tags. Meaning is user-defined.
     */
    readonly tags: string[];
    /**
     * The passage metadata. Meaning is user-defined.
     */
    readonly meta: object;
    /**
     * The class object of a Svelte component.
     */
    readonly component: any;
    
    constructor(name: string, tags: string[], meta: object, component: any) {
        this.name = name;
        this.tags = tags;
        this.meta = meta;
        this.component = component;
    }
}

/**
 * Represents a moment in the {@link History}.
 */
export class Moment {
    /**
     * The passage of the moment.
     */
    readonly passage: string;
    /**
     * The local variables of the passage.
     */
    readonly locals: object;
    
    constructor(passage: string, locals: object) {
        this.passage = passage;
        this.locals = locals;
    }
}

/**
 * Represents the history of past and future moments.
 */
export class History {
    constructor(moments: Moment[], currentIndex: number) {
        this.moments = moments;
        this.currentIndex = currentIndex;
    }
    
    /**
     * The history of passages.
     */
    moments: Moment[] = [];
    
    /**
     * The current index into the history.
     * Indices greater than this are the future for redo,
     * indices less than this are in the past for undo.
     */
    currentIndex: number = 0;
}


/**
 * The engine is responsible for keeping the parsed story data and the current state.
 */
export class Engine {
    /**
     * The global Engine singleton.
     */
    static readonly engine = new Engine();
    
    private _passages: Passage[] = []
    private _passagesByName: Map<string, Passage> = new Map();
    
    /**
     * The {@link SaveDB saves database} for slotted saves and the autosave.
     */
    public readonly saveDB: SaveDB;
    
    /**
     * The {@link History} of past/future {@link Passage}s and their local variables, and the index into the
     * history list for the current {@link Moment}.
     */
    public readonly history = writable(new History([], 0));
    private initialHistory: string|undefined;
    
    /**
     * Callbacks to be called on engine reset.
     */
    public onReset: (() => any)[] = [];
    
    /**
     * Tracks the current {@link Passage}.
     */
    public readonly currentPassage: Readable<Passage>;
    
    /**
     * Whether a load is in progress.
     */
    public readonly loading: Writable<boolean> = writable(false);
    
    /**
     * The locals object of the current story {@link Moment}.
     */
    public get locals() {
        let h = get(this.history);
        return h.moments[h.currentIndex].locals;
    }
    
    /**
     * Global story variables that get automatically saved and loaded can be put here.
     */
    public readonly globals = {};
    
    /**
     * Holds the set of all passages visited in the current save.
     */
    public readonly visitedPassages: Writable<string[]> = writable([]);
    
    /**
     * The story title as extracted from the \<title\> element.
     * Can be changed by the story itself after loading to change the displayed title at runtime.
     */
    public readonly title: Writable<string>;
    private readonly staticTitle: string;
    
    private version: number = 0;
    
    private constructor() {
        this.title = writable(document.title);
        this.staticTitle = document.title;
        this.saveDB = new SaveDB(this.staticTitle);
        this.title.subscribe((title) => {
            document.title = title;
        });
        this.currentPassage = derived(this.history, (h) => this._passagesByName.get(h.moments[h.currentIndex].passage)!);
        saveManager.serializeHooks.set(History.prototype, ["iff.engine.History", (o: object) => o]);
        saveManager.serializeHooks.set(Moment.prototype, ["iff.engine.Moment", (o: object) => o]);
        saveManager.deserializeHooks.set("iff.engine.History", (data) => {
            let d = data as History;
            return new History(d.moments, d.currentIndex)
        });
        saveManager.deserializeHooks.set("iff.engine.Moment", (data) => {
            let d = data as Moment;
            return new Moment(d.passage, d.locals);
        });
        saveManager.serializeHooks.set(RNG.prototype, ["iff.rand.RNG", (o: any) => o.serialize()]);
        saveManager.deserializeHooks.set("iff.rand.RNG", (data) => {
            return RNG.deserialize(data as string);
        });
        saveManager.callbacks.push({
            tag: "history",
            onSave: () => {
                return get(this.history);
            },
            onLoad: (data) => {
                this.history.set(data as History);
            },
        });
        saveManager.callbacks.push({
            tag: "visited",
            onSave: () => {
                return get(this.visitedPassages);
            },
            onLoad: (data) => {
                this.visitedPassages.set(data as string[] ?? []);
            },
        });
        saveManager.callbacks.push({
            tag: "globals",
            onSave: () => {
                return this.globals;
            },
            onLoad: (data) => {
                this.deleteGlobals();
                for (let [k, v] of Object.entries(data)) {
                    // @ts-ignore
                    this.globals[k] = v;
                }
            },
        });
    }
    
    /**
     * Gets the configured savegame version number.
     */
    public get saveVersion() {
        return this.version;
    }
    
    /**
     * Deletes all global variables, resets the history and calls reset callbacks.
     */
    public async reset() {
        if (! this.initialHistory) return;
        this.loading.set(true);
        if (config.visitedLinks == "browser") {
            let url = new URL(window.location.toString());
            url.hash = "";
            history.replaceState(null, "", url.toString());
        }
        this.deleteGlobals();
        this.visitedPassages.set([]);
        sessionStorage.removeItem(this.staticTitle + " save");
        this.history.set(deserialize(JSON.parse(this.initialHistory!), saveManager.deserializeHooks));
        if (this.onReset) {
            for (let r of this.onReset) {
                try {
                    r();
                } catch (e) {
                    console.log("Error in onReset: %o", e);
                }
            }
        }
        await new Promise((r) => {
            setTimeout(r, 200);
        });
        this.loading.set(false);
    }
    
    
    /**
     * Clears all global variables.
     */
    private deleteGlobals() {
        let g = this.globals;
        for (let k of Object.keys(this.globals)) {
            // @ts-ignore
            delete g[k];
        }
    }
    
    /**
     * Loads a {@link Theme} from local storage.
     */
    public loadTheme = () => loadTheme(this.staticTitle);
    /**
     * Saves a {@link Theme} to local storage.
     */
    public saveTheme = (t: Theme) => saveTheme(this.staticTitle, t);
    /**
     * Applies a {@link Theme} to the document.
     */
    public applyTheme = applyTheme;
    
    /**
     * Tries to save the current save in session storage, if small enough and enabled.
     */
    public saveSession() {
        if (config.sessionSave) {
            try {
                let json = saveManager.serializeData();
                // More than 1mb risks hitting the session storage quote, and that could also be needed for other things.
                if (json.length * 2 >= 1000000) {
                    sessionStorage.removeItem(this.staticTitle + " save");
                } else {
                    sessionStorage.setItem(this.staticTitle + " save", json);
                }
            } catch (error) {
                if (error instanceof DOMException && error.code == DOMException.QUOTA_EXCEEDED_ERR) {
                    // If the quota is exceeded, remove again, so no old history is loaded again.
                    sessionStorage.removeItem(this.staticTitle + " save");
                } else {
                    console.log("Error while saving to session storage: %o", error);
                }
            }
        }
    }
    
    /**
     * Loads directly from a safe or from a Promise for a safe.
     * Sets the loading state during load, so the UI can know it should not modify the engine state while it loads.
     * The Promise resolves as false if the save could not be loaded.
     */
    public async loadSave(s: Save | Promise<Save>): Promise<boolean> {
        this.loading.set(true);
        if (s instanceof Promise) {
            try {
                let save = await s;
                if (save.version !== this.version) return false;
                saveManager.loadData(save.data);
            } catch (e) {
                console.log("Error while loading: %o", e);
            } finally {
                await new Promise((r) => {
                    setTimeout(r, 200);
                });
                this.loading.set(false);
            }
        } else {
            if (s.version !== this.version) return false;
            saveManager.loadData(s.data);
            await new Promise((r) => {
                setTimeout(r, 200);
            });
            this.loading.set(false);
        }
        return true;
    }
    
    
    /**
     * Sets the initial {@link History} if no history could be found in session storage.
     * Initiates an autoload if autoload is enabled and no session history is found.
     * 
     * @param h The initial {@link History}
     * @param version The save version. Saves with a differing version will be rejected. See {@link Save.version} for more information
     */
    public init(h: History, version: number) {
        this.version = version;
        this.initialHistory = JSON.stringify(serialize(h, saveManager.serializeHooks));
        this.history.subscribe((h) => {
            if (h.currentIndex >= h.moments.length) return;
            let p = h.moments[h.currentIndex].passage;
            let v = get(this.visitedPassages);
            if (! v.includes(p)) {
                this.visitedPassages.set([...v, p]);
            }
        });
        if (config.sessionSave) {
            try {
                let json = sessionStorage.getItem(this.staticTitle + " save");
                if (json) {
                    saveManager.loadData(json);
                } else {
                    this.history.set(h);
                }
            } catch (error) {
                this.history.set(h);
            }
            this.history.subscribe(() => {
                this.saveSession();
            });
            return;
        } else {
            sessionStorage.removeItem(this.staticTitle + " save");
        }
        if (config.autoload) {
            this.loading.set(true);
            (async () => {
                let autosave = await this.saveDB.get(-1);
                if (autosave) {
                    saveManager.loadData(autosave.data);
                } else {
                    this.history.set(h);
                }
                this.loading.set(false);
            })();
            return;
        }
        this.history.set(h);
    }
    
    /**
     * Add {@link Passage}s to the engine. This should only be called during initialization.
     */
    public addPassages(passages: Passage[]) {
        this._passages = [...this._passages, ...passages];
        for (let p of passages) {
            this._passagesByName.set(p.name, p);
        }
    }
    
    
    /**
     * Get all {@link Passage}s.
     */
    public get passages() {
        return this._passages.values;
    }
    
    /**
     * Gets a {@link Passage} by its index.
     */
    public passageAt(i: number) {
        return this._passages[i];
    }
    
    /**
     * Gets a {@link Passage} by its name.
     */
    public passage(name: string) {
        return this._passagesByName.get(name);
    }
    
    
    /**
     * Adds a new {@link Moment} to the history with the specified {@link Passage} and sets it as the current Moment.
     * Optionally you can pre-set local variables.
     */
    public goTo(passage: Passage, locals: object = {}) {
        let h = get(this.history);
        h.moments = [new Moment(passage.name, locals), ...h.moments.slice(h.currentIndex)];
        while (h.moments.length > config.historyLimit) {
            h.moments.pop();
        }
        h.currentIndex = 0;
        this.history.set(h);
    }
    
    
    
    
    
    
};

/**
 * The global Engine singleton.
 */
export const engine: Engine = Engine.engine;
