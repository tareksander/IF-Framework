<script lang="ts">
    import { liveQuery } from "dexie";
    import { engine } from "../engine";
    import { Readable, Writable, derived, get, writable } from "svelte/store";
    import { Save, saveManager } from "../save";
    import { onDestroy, onMount } from "svelte";
    
    interface ExportedSave {
        data: string,
        title: string,
    };
    
    interface Export {
        name: string,
        URL: string,
    };
    
    let name = "";
    let autosave = liveQuery(() => engine.saveDB.get(-1));
    let exported: Writable<Export|null> = writable(null);
    let width: number = Infinity;
    
    onDestroy(() => {
        let e = get(exported);
        if (e != null) {
            URL.revokeObjectURL(e.URL);
            exported.set(null);
        }
    });
    
    let saves = derived(liveQuery(() => engine.saveDB.getSaves()) as unknown as Readable<Save[]>, (l) => {
        if (l === undefined) return [];
        let saves: (Save|null)[] = [];
        for (let i = 0; i <= Math.max(10, ...l.map((e)=> e.slot)); i++) {
            let s = l.find((e) => e.slot == i);
            if (s) {
                saves.push(s);
            } else {
                saves.push(null);
            }
        }
        return saves;
    });
    
    function save(): Save {
        return {
            name: name,
            date: new Date(),
            slot: -2,
            data: saveManager.serializeData()
        };
    }
    
    function newSave() {
        if (name.length != 0) {
            engine.saveDB.newSave(save());
        }
    }
    
    function saveAt(slot: number) {
        if (name.length != 0) {
            let s = save();
            s.slot = slot;
            engine.saveDB.saves.put(s, slot);
        }
    }
    
    function deleteAt(slot: number) {
        engine.saveDB.saves.delete(slot);
    }
    
    async function loadFrom(slot: number) {
        engine.loadSave((await engine.saveDB.get(slot))!);
    }
    
    async function exportFrom(slot: number) {
        let s = (await engine.saveDB.get(slot))!;
        let b = new Blob([JSON.stringify({data: s.data, title: engine.saveDB.name})]);
        let e = get(exported);
        if (e != null) {
            URL.revokeObjectURL(e.URL);
        }
        exported.set({
            name: s.name,
            URL: URL.createObjectURL(b)
        });
    }
    
    let imported: HTMLInputElement;
    
    onMount(() => {
        imported.addEventListener("input", async () => {
            let file = imported.files?.item(0);
            if (file != null) {
                let data: ExportedSave;
                try {
                    data = JSON.parse(await file.text());
                } catch {
                    return;
                } finally {
                    imported.value = "";
                }
                if (! Object.hasOwn(data, "title") || ! Object.hasOwn(data, "data") || typeof data.data !== "string" || data.title !== engine.saveDB.name) {
                    return;
                }
                engine.loadSave({
                    name: "",
                    date: new Date(),
                    data: data.data,
                    slot: 0,
                });
            }
        });
    });
    
</script>

<svelte:window bind:innerWidth={width}/>
<div class="container">
    <h1>Save/Load</h1>
    <table>
        <thead>
            <tr>
                <th style="line-break: strict;">Name</th>
                <th>Date</th>
                {#if width < 800}
                    <th style="line-break: auto;">Save Overwrite Load Export Delete</th>
                {:else}
                    <th>Save/Overwrite</th>
                    <th>Load</th>
                    <th>Export</th>
                    <th>Delete</th>
                {/if}
            </tr>
        </thead>
        <tbody>
            {#if $autosave}
                <td>Autosave</td>
                <td>{$autosave.date}</td>
                {#if width < 800}
                    <td><button on:click={() => loadFrom(-1)}>Load</button>
                    <button on:click={() => exportFrom(-1)}>Export</button>
                    <button on:click={() => deleteAt(-1)}>Delete</button></td>
                {:else}
                    <td><button on:click={() => loadFrom(-1)}>Load</button></td>
                    <td><button on:click={() => exportFrom(-1)}>Export</button></td>
                    <td><button on:click={() => deleteAt(-1)}>Delete</button></td>
                {/if}
            {/if}
            {#each $saves as s, i}
            <tr>
                {#if s == null}
                    <td></td>
                    <td></td>
                    <td><button on:click={() => saveAt(i)}>Save</button></td>
                {:else}
                    <td>{s.name}</td>
                    <td>{s.date.toLocaleString()}</td>
                    {#if width < 800}
                        <td><button on:click={() => saveAt(i)}>Overwrite</button>
                        <button on:click={() => loadFrom(i)}>Load</button>
                        <button on:click={() => exportFrom(i)}>Export</button>
                        <button on:click={() => deleteAt(i)}>Delete</button></td>
                    {:else}
                        <td><button on:click={() => saveAt(i)}>Overwrite</button></td>
                        <td><button on:click={() => loadFrom(i)}>Load</button></td>
                        <td><button on:click={() => exportFrom(i)}>Export</button></td>
                        <td><button on:click={() => deleteAt(i)}>Delete</button></td>
                    {/if}
                {/if}
            </tr>
            {/each}
        </tbody>
    </table>
    <div style="padding: 1em;">
        {#if $exported}
            <a href="{$exported.URL}" download="{$exported.name}.save" target="_blank">Download Export</a>
        {/if}
        <label for="name">Name: </label>
        <input id=name type="text" bind:value={name}>
        <button on:click={newSave}>New Save</button>
        <label for="import">Import: </label>
        <input id="import" bind:this={imported} type="file" accept=".save">
    </div>
</div>

<style lang="css">
    
    table {
        border-collapse: collapse;
        table-layout: fixed;
        border: 2px solid var(--ui-primary-color);
    }
    
    thead {
        border-bottom: 2px solid var(--ui-primary-color);
    }
    
    tbody td {
        text-align: center;
        padding: 0.25em;
        border: 1px solid var(--ui-primary-color);
    }
    
    tr :nth-child(1) {
        line-break: anywhere;
    }
    
    th {
        padding: 0.5em;
        font-size: large;
    }
    
    button {
        background-color: var(--background-color);
    }
    
    .container {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    
</style>
