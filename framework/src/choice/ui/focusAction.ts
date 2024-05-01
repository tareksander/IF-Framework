import type { Action } from 'svelte/action';

const focusableQuery = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex=\"0\"], [contenteditable]";
const focusable = (e: HTMLElement) => {
    return e.querySelectorAll(focusableQuery);
};

export const focusTrap: Action<HTMLElement> = (element) => {
    let originalFocus = document.activeElement as (HTMLElement | null);
    if (originalFocus) {
        originalFocus.blur();
    }
    let wl = (e: KeyboardEvent) => {
        if ((document.activeElement === null || ! element.contains(document.activeElement)) && e.key == "Tab") {
            e.preventDefault();
            if (e.shiftKey) {
                let l = focusable(element);
                let last = l.item(l.length-1) as (HTMLElement | undefined);
                if (last) {
                    last.focus();
                }
            } else {
                let first = focusable(element).item(0) as (HTMLElement | undefined);
                if (first) {
                    first.focus();
                }
            }
        }
    };
    let el = (e: KeyboardEvent) => {
        if (e.key == "Tab") {
            e.preventDefault();
            let fl = Array.of(...focusable(element)) as HTMLElement[];
            let i = fl.indexOf(document.activeElement as HTMLElement);
            if (i != -1) {
                if (e.shiftKey) {
                    if (i == 0) {
                        i = fl.length-1;
                    } else {
                        i--;
                    }
                } else {
                    if (i == fl.length-1) {
                        i = 0;
                    } else {
                        i++;
                    }
                }
                fl[i].focus();
            }
        }
    }
    window.addEventListener("keydown", wl);
    element.addEventListener("keydown", el);
    return {
        destroy() {
            window.removeEventListener("keydown", wl);
            element.removeEventListener("keydown", el);
            if (originalFocus) {
                originalFocus.focus();
            } else {
                let cf = document.activeElement as (HTMLElement | null);
                if (cf) {
                    cf.blur();
                }
            }
        }
    };
};



