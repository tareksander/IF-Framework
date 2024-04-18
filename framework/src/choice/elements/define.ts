import Link from "./link.svelte";


export let define = () => {
    // @ts-ignore
    customElements.define("iff-link", Link.element);
};
