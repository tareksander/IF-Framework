import { Writable, writable } from "svelte/store";
import { Passage } from "./engine";

/**
 * Stores engine configuration data.
 * For non-store values, these values should not be modified after the UI is started.
 */
export class Config {
    /**
     * The global Config singleton.
     */
    static config: Config = new Config();
    
    
    /**
     * Controls whether the save UI is available to the player.
     */
    public userSavable = writable(true);
    
    /**
     * Set to use a custom component to signal story updates.
     * The string is included as raw HTML.
     * Set to a empty string to disable the update notification.
     */
    public updateNotification: undefined | string;
    
    /**
     * Determines whether autosaves are used.
     * If false, autosaves never occur, if true, after every history change.
     * You can also use a function that tells the engine whether to autosave depending on the passage. 
     */
    public autosave: boolean | ((p: Passage) => boolean) = false;
    
    /**
     * Whether to save automatically in session storage after each history change.
     * Should be avoided for games with large state, you should instead use {@link autosave} and {@link autoload}.
     */
    public sessionSave: boolean = true;
    
    /**
     * Whether to automatically load an autosave if no save was found in session storage.
     */
    public autoload: boolean = true;
    
    
    
    /**
     * The limit of states held in the history. When a new state is added and the limit is reached, the oldest state will be discarded.
     */
    public historyLimit = 50;
    
    /**
     * Determines if the user can navigate the history.
     */
    public userNavigable: Writable<boolean> = writable(true);
    
    private constructor() {}
    
    
}

/**
 * The global Config singleton.
 */
export const config: Config = Config.config;

