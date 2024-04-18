import Dexie, { type Table } from 'dexie';
import { Save } from './save';

export class SaveDB extends Dexie {
    public saves!: Table<Save>;
    
    public constructor(name: string) {
        super(name);
        this.version(1).stores({
            saves: "slot, name, date"
        });
    }
    
    public get(slot: number) {
        return this.saves.get(slot);
    }
    
    /**
     * Gets all saves.
     */
    public getSaves() {
        return this.saves.toArray();
    }
    
    /**
     * Creates a new save. Disregards the slot and finds the next free one.
     */
    public newSave(s: Save) {
        return this.transaction("rw", [this.saves], async () => {
            s.slot = (await this.saves.toArray()).map((s) => s.slot).reduce((p, c) => Math.max(p, c), -1) + 1;
            await this.saves.add(s, s.slot);
        });
    }
    
    
    /**
     * Removes a save by slot.
     */
    public removeAt(slot: number) {
        this.saves.delete(slot);
    }
    
    
}

