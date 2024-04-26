/**
 * @file This module contains building blocks for creating choice-based games like with Twine, both high-level and low-level.
 */

export * from "./src/choice/engine";
export * from "./src/choice/config";
export * from "./src/choice/elements/define";
export * from "./src/common/update";
export * from "./src/common/rand";
export * from "./src/common/theme";
export * from "./src/choice/ui/dialog";

export { default as Main } from "./src/choice/ui/main.svelte";
export { default as Sidebar } from "./src/choice/ui/sidebar.svelte";
export { default as SaveDialog } from "./src/choice/ui/saveDialogChoice.svelte";
export { default as Link } from "./src/choice/elements/link.svelte";

// @ts-ignore
export { overlays } from "./src/choice/ui/main.svelte";

