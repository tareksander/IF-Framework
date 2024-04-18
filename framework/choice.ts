/**
 * @file This module contains building blocks for creating choice-based games like with Twine, both high-level and low-level.
 */

export * from "./src/choice/engine";
export * from "./src/choice/config";
export * from "./src/choice/elements/define";
export * from "./src/common/update";
export * from "./src/common/rand";
export * from "./src/common/theme";

export { default as Main } from "./src/choice/ui/main.svelte";
export { default as Sidebar } from "./src/choice/ui/sidebar.svelte";
// @ts-ignore
export { userSavable } from "./src/choice/ui/sidebar.svelte";
export { default as Link } from "./src/choice/elements/link.svelte";