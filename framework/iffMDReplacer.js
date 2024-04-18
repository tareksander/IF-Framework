const marked = require("marked");

function replace(match, p1, p2, offset, string, groups) {
    let source = p2;
    source = source.trim();
    // @ts-ignore
    return `{@html "<div ${p1}>${marked.parse(source).replace(/\r?\n/g, "<br>").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}</div>"}`;
}

module.exports = [/<iff-markdown(.*?)>(.*?)<\/iff-markdown>/gs, replace];

