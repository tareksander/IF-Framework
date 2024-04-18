// @ts-check

const marked = require("marked");

/**
 * @param {string} source 
 * @returns {string}
 */
module.exports = function loader(source) {
    /**
     * @type {{ tags?: any; options?: any; } | null}
     */
    let meta = {};
    if (source.trimStart().startsWith("<meta>")) {
        source = source.trimStart();
        let i = source.indexOf("</meta>");
        let m = source.substring(6, i);
        source = source.substring(i + 7);
        meta = JSON.parse(m);
    }
    if (typeof meta != "object" || meta === null) {
        // @ts-ignore
        this.emitWarning(new Error("metadata wasn't a JSON object, ignoring"))
        // @ts-ignore
        meta = {}
    }
    let tags = meta.tags;
    tags ??= [];
    meta.tags = undefined;
    let o = {};
    if (typeof meta.options == "object" && meta.options != null) {
        o = meta.options;
    }
    
    let style = "";
    if (source.trimStart().startsWith("<style>")) {
        source = source.trimStart();
        let i = source.indexOf("</style>");
        style = source.substring(7, i);
        source = source.substring(i + 8);
    }
    
    source = source.trimEnd();
    
    return `<script context="module">
    export const meta = ${JSON.stringify(meta)};
    export const tags = ${JSON.stringify(tags)};
</script>

<div>{@html "${ // @ts-ignore
        marked.parse(source).replace(/\r?\n/g, "<br>").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"}
</div>

<style>
    ${style}
</style>`;
}


