import { Readable, Writable, writable } from "svelte/store";
import { ServiceWorkerCheck, ServiceWorkerResponseMessage, cacheName, configPath, updateChannel } from "../service_worker/shared";

/**
 * The Updater is responsible for checking for game updates and communicating with the service worker.
 */
export class Updater {
    /**
     * The global Updater singleton.
     */
    static updater = new Updater();
    
    private _updateAvailable: Writable<boolean> = writable(false);
    
    /**
     * Whether an update is available, downloaded and will be applied on a page refresh.
     * A value of false means there is no update available, there was no check yet, 
     * config.json or service.js is missing in the directory of the story HTML file,
     * or the browser doesn't support service workers.
     */
    public updateAvailable: Readable<boolean>;
    
    
    private constructor() {
        this.updateAvailable = this._updateAvailable;
        new BroadcastChannel(updateChannel).onmessage = (m) => {
            let d = m.data as ServiceWorkerResponseMessage;
            switch (d.type) {
                case "check":
                    if (d.available) {
                        this._updateAvailable.set(true);
                    }
                    break;
            }
        };
    }
    
    /**
     * Registers the service worker if not already. If registered, checks for an update instead.
     */
    async register() {
        let cont = navigator.serviceWorker.controller;
        if (!cont) {
            let url = new URL(configPath, window.location.href);
            let c = await caches.open(cacheName);
            let fetched;
            try {
                fetched = await fetch(url, { cache: "no-cache" });
                if (fetched.status == 200) {
                    await c.put(url, fetched);
                    navigator.serviceWorker.register(new URL("./service.js", window.location.href));
                }
            } catch {}
        } else {
            let m: ServiceWorkerCheck = {
                type: "check"
            };
            cont.postMessage(m);
        }
    }
    
    
}


/**
 * The global Updater singleton.
 */
export const updater: Updater = Updater.updater;

