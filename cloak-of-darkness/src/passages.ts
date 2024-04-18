import { Passage } from '@if-framework/framework/choice';

// @ts-ignore
import { default as p0, meta as p0M, tags as p0T } from './passages/bar.svelte';
// @ts-ignore
import { default as p1, meta as p1M, tags as p1T } from './passages/cloak.svelte';
// @ts-ignore
import { default as p2, meta as p2M, tags as p2T } from './passages/cloakroom.svelte';
// @ts-ignore
import { default as p3, meta as p3M, tags as p3T } from './passages/cloakroomhook.svelte';
// @ts-ignore
import { default as p4, meta as p4M, tags as p4T } from './passages/foyer.svelte';
// @ts-ignore
import { default as p5, meta as p5M, tags as p5T } from './passages/message.md';
// @ts-ignore
import { default as p6, meta as p6M, tags as p6T } from './passages/outside.svelte';
// @ts-ignore
import { default as p7, meta as p7M, tags as p7T } from './passages/start.md';


export default [
    new Passage("bar", p0T, p0M, p0),
    new Passage("cloak", p1T, p1M, p1),
    new Passage("cloakroom", p2T, p2M, p2),
    new Passage("cloakroomhook", p3T, p3M, p3),
    new Passage("foyer", p4T, p4M, p4),
    new Passage("message", p5T, p5M, p5),
    new Passage("outside", p6T, p6M, p6),
    new Passage("start", p7T, p7M, p7),
] as Passage[];
