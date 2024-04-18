/**
 * Stores a moment in the story history.
 */
export interface Moment {
    /**
     * The passage of the moment.
     */
    passage: string,
    /**
     * The local variables of the moment.
     * Supported values are everything that can be converted to JSON.
     * Additionally, objects implementing the [Svelte store contract] {@link https://svelte.dev/docs/svelte-store}
     * are supported: objects with just a subscribe function will get their value stored and turned into a readable store on load.
     * Objects with also a set and update function will get turned into writable stores. Derive stores should live in the
     * Svelte component of the passage, so they get re-created every time the passage is needed.
     */
    locals: object,
}
