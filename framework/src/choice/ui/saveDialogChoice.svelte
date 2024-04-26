<script lang="ts">
    import { saveManager } from "../../common/save";
    import SaveDialog from "../../common/saveDialog.svelte";
    import { engine } from "../engine";
</script>

<SaveDialog version={engine.saveVersion} saveDB={engine.saveDB} on:load={(s) => engine.loadSave(s.detail)}></SaveDialog>
