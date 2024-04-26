const fs = require("node:fs");
const path = require("node:path");
const jsdom = require("jsdom");

module.exports = class ChoicePlugin {
    constructor(options) {
        this.options = options;
    }
    
    static loader = path.resolve(__dirname, "choice-loader.js");
    
    generate(compilation) {
        let files = [];
        let d = fs.opendirSync(this.options.path);
        let f;
        let hasMeta = new Set();
        let hasTags = new Set();
        while ((f = d.readSync())) {
            if (f.name.endsWith(".md") || f.name.endsWith(".svelte")) {
                files.push(f.name);
            }
            if (f.name.endsWith(".svelte")) {
                let contents = jsdom.JSDOM.fragment(fs.readFileSync(path.join(this.options.path, f.name), { encoding: "utf-8" }));
                if (contents.firstChild.nodeName === "SCRIPT" && contents.firstElementChild.getAttribute("context") === "module") {
                    let c = contents.firstElementChild.innerHTML;
                    if (c.search(/^\s*export\s+const\s+tags\s+=/m) !== -1) {
                        hasTags.add(f.name);
                    }
                    if (c.search(/^\s*export\s+const\s+meta\s+=/m) !== -1) {
                        hasMeta.add(f.name);
                    }
                }
            } else {
                hasTags.add(f.name);
                hasMeta.add(f.name);
            }
        }
        d.closeSync();
        files.sort();
        let fOld;
        try {
            fOld = fs.readFileSync(this.options.outFile, { encoding: "utf-8" });
        } catch (e) {
            fOld = "";
        }
        
        let toWrite = "import { Passage } from '@if-framework/framework/choice';\n\n";
        toWrite += files.map((f, i) => `// @ts-ignore\nimport { default as p${i},${hasMeta.has(f) ? " meta as p" + i +"M," : "" }${hasTags.has(f) ? " tags as p" + i +"T" : "" } } from './${path.relative(path.dirname(this.options.outFile), path.join(this.options.path, f))}';\n`).join("");
        toWrite += "\n\nexport default [\n";
        toWrite += files.map((f, i) => `    new Passage("${path.parse(f).name}", ${hasTags.has(f) ? "p" + i +"T" : "[]" }, ${hasMeta.has(f) ? "p" + i +"M" : "{}" }, p${i}),\n`).join("");
        toWrite += "] as Passage[];\n";
        
        if (fOld !== toWrite) {
            fs.writeFileSync(this.options.outFile, toWrite, { encoding: "utf-8" });
        }
    }
    
    apply(compiler) {
        compiler.hooks.run.tap("ChoicePlugin", (compilation) => {
            this.generate();
        });
        compiler.hooks.watchRun.tap("ChoicePlugin", (compilation) => {
            this.generate();
        });
    }
}


