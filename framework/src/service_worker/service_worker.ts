import { cacheName, ServiceWorkerMessage, configPath, updateChannel, SWConfig, ServiceWorkerResponseCheck } from "./shared";

export function setupSW(sw: ServiceWorkerGlobalScope) {
    
    async function conf() {
        let configURL = new URL(configPath, sw.location.href);
        let res: Response | undefined = await (await caches.open(cacheName)).match(configURL);
        let c = await res!.json() as SWConfig;
        return c;
    }
    
    async function deleteCaches() {
        Promise.all((await sw.caches.keys()).filter((k) => k != cacheName).map((k) => sw.caches.delete(k)));
    }
    
    async function cacheFiles() {
        const c = await sw.caches.open(cacheName);
        await c.addAll((await conf()).cacheFiles);
    }
    
    sw.addEventListener("install", (event) => {
        sw.skipWaiting();
        event.waitUntil(cacheFiles());
    });
    
    sw.addEventListener("activate", (event) => {
        event.waitUntil(Promise.all([sw.clients.claim(), deleteCaches()]));
    });
    
    let recaching = false;
    
    async function recache() {
        let channel = new BroadcastChannel(updateChannel);
        let m: ServiceWorkerResponseCheck = {
            type: "check",
            available: false,
        };
        let configURL = new URL(configPath, sw.location.href);
        let res: Response | undefined = await (await caches.open(cacheName)).match(configURL);
        let c = await res!.json() as SWConfig;
        try {
            let newC = (await (await fetch(configURL, { cache: "no-cache" })).json()) as SWConfig;
            if (newC.version > c.version) {
                await cacheFiles();
                (await caches.open(cacheName)).put(configURL, new Response(JSON.stringify(newC)));
                m.available = true;
                recaching = false;
            } else {
                recaching = false;
            }
        } catch {}
        channel.postMessage(m);
        channel.close();
        recaching = false;
    }
    
    sw.onmessage = (event) => {
        let msg = event.data as ServiceWorkerMessage;
        switch (msg.type) {
            case "check": {
                if (! recaching) {
                    recaching = true;
                    event.waitUntil(recache());
                }
            }
        }
    };
    
    const cacheFirst = async (request: Request) => {
        let c = await conf();
        let url = new URL(request.url);
        let cached;
        if (c.slashIndex === true && url.pathname.endsWith("/")) {
            url.pathname += "index.html";
            cached = await sw.caches.match(url, {
                cacheName: cacheName
            });
        } else {
            cached = await sw.caches.match(request, {
                cacheName: cacheName
            });
        }
        let res: Response;
        if (cached) {
            res =  cached;
        } else {
            res = await fetch(request);
        }
        if (c.isolated === true) {
            let h = new Headers(res.headers);
            h.set("Cross-Origin-Opener-Policy", "same-origin");
            h.set("Cross-Origin-Embedder-Policy", "require-corp");
            return new Response(res.body, {
                headers: h,
                status: res.status,
                statusText: res.statusText
            });
        }
        return res;
      };
    
    sw.addEventListener("fetch", (event) => {
        event.respondWith(cacheFirst(event.request));
    });
}




