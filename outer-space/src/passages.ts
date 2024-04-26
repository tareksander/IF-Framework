import { Passage } from '@if-framework/framework/choice';

// @ts-ignore
import { default as p0, } from './passages/aft.svelte';
// @ts-ignore
import { default as p1, meta as p1M, tags as p1T } from './passages/end.md';
// @ts-ignore
import { default as p2, meta as p2M, tags as p2T } from './passages/fail.md';
// @ts-ignore
import { default as p3, } from './passages/front.svelte';
// @ts-ignore
import { default as p4, meta as p4M, tags as p4T } from './passages/ftl1.md';
// @ts-ignore
import { default as p5, meta as p5M, tags as p5T } from './passages/ftl2.md';
// @ts-ignore
import { default as p6, meta as p6M, tags as p6T } from './passages/ftl3.md';
// @ts-ignore
import { default as p7, meta as p7M, tags as p7T } from './passages/intro.md';
// @ts-ignore
import { default as p8, } from './passages/midsection.svelte';
// @ts-ignore
import { default as p9, meta as p9M, tags as p9T } from './passages/start.md';


export default [
    new Passage("aft", [], {}, p0),
    new Passage("end", p1T, p1M, p1),
    new Passage("fail", p2T, p2M, p2),
    new Passage("front", [], {}, p3),
    new Passage("ftl1", p4T, p4M, p4),
    new Passage("ftl2", p5T, p5M, p5),
    new Passage("ftl3", p6T, p6M, p6),
    new Passage("intro", p7T, p7M, p7),
    new Passage("midsection", [], {}, p8),
    new Passage("start", p9T, p9M, p9),
] as Passage[];
