
export function elementWrapper(e: any) {
    return class extends e {
        constructor() {
            super();
            this.shadowRoot.adoptedStyleSheets = [...document.styleSheets];
        }
    };
}