const fs = require("node:fs");
const path = require("node:path");

module.exports = class ChoicePlugin {
    constructor(options) {
        this.options = options;
    }
    
    static loader = path.resolve(__dirname, "choice-loader.js");
    
    generate(compilation) {
        let files = [];
        let d = fs.opendirSync(this.options.path);
        let f;
        while ((f = d.readSync())) {
            if (f.name.endsWith(".md") || f.name.endsWith(".svelte")) {
                files.push(f.name);
            }
        }
        d.closeSync();
        files.sort();
        let fOld = fs.readFileSync(this.options.outFile);
        
        let toWrite = "import { Passage } from '@if-framework/framework/choice';\n\n";
        toWrite += files.map((f, i) => `// @ts-ignore\nimport { default as p${i}, meta as p${i}M, tags as p${i}T } from './${path.relative(path.dirname(this.options.outFile), path.join(this.options.path, f))}';\n`).join("");
        toWrite += "\n\nexport default [\n";
        toWrite += files.map((f, i) => `    new Passage("${path.parse(f).name}", p${i}T, p${i}M, p${i}),\n`).join("");
        toWrite += "] as Passage[];\n";
        
        if (fOld != toWrite) {
            fs.writeFileSync(this.options.outFile, toWrite);
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


