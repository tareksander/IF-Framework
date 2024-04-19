<script lang="ts">
    import { engine } from "../engine";
    export let passage:string;
    export let visited: boolean|undefined;
    
    let click = (e: Event) => {
        e.preventDefault();
        history.replaceState(null, "", href())
        engine.goTo(engine.passage(passage)!);
    };
    
    let href = () => {
        let u = new URL(window.location.toString());
        u.hash = passage;
        return u.toString();
    };
    
    function classes() {
        switch (visited) {
            case undefined:
                return "a v";
            case true:
                return "av"
            case false:
                return "a";
        }
    }
</script>

<a on:click={click} href="{href()}" class={classes()}>
    <slot style="color: inherit"></slot>
</a>

<style lang="css">
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