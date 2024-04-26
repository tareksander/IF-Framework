import { Passage } from '@if-framework/framework/choice';

// @ts-ignore
import { default as p0, meta as p0M, tags as p0T } from './passages/test.md';
// @ts-ignore
import { default as p1, meta as p1M, tags as p1T } from './passages/test2.svelte';
// @ts-ignore
import { default as p2, } from './passages/test3.svelte';


export default [
    new Passage("test", p0T, p0M, p0),
    new Passage("test2", p1T, p1M, p1),
    new Passage("test3", [], {}, p2),
] as Passage[];
