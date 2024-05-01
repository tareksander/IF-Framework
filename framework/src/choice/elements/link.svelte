<script lang="ts">
    import { get } from "svelte/store";
    import { config } from "../config";
    import { engine } from "../engine";
    export let passage:string;
    export let visited: boolean | undefined;
    export let noHref: boolean | undefined;
    
    let click = (e: Event) => {
        if (e instanceof KeyboardEvent && e.key == "Tab") return;
        e.preventDefault();
        if (config.visitedLinks == "browser") {
            history.replaceState(null, "", href())
        }
        engine.goTo(engine.passage(passage)!);
    };
    
    let href = () => {
        if (noHref || config.visitedLinks == "save") return undefined;
        let u = new URL(window.location.toString());
        u.hash = passage;
        return u.toString();
    };
    
    function classes() {
        let v = visited;
        if (config.visitedLinks == "save" && v === undefined) {
            v = get(engine.visitedPassages).includes(passage);
        }
        switch (v) {
            case undefined:
                return "a v";
            case true:
                return "av"
            case false:
                return "a";
        }
    }
</script>

<a tabindex="0" on:keydown={click} on:click={click} href="{href()}" class="{classes()} common">
    <slot style="color: inherit"></slot>
</a>

<style lang="css">
    .common {
        text-decoration: underline;
        cursor: pointer;
    }
    
    .a {
        color: var(--link-color);
    }
    
    .v:visited {
        color: var(--link-visited-color);
    }
    
    .av {
        color: var(--link-visited-color);
    }
</style>