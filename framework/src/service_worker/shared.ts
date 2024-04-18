/**
 * @file Shared definitions for the service worker and updater.
 */


export interface SWConfig {
    cacheFiles: string[],
    version: number,
}

/**
 * Cache name.
 */
export const cacheName = "iff-cache"

/**
 * Config path relative to the service worker and story HTML file.
 */
export const configPath = "./config.json";
/**
 * Channel name for broadcasting messages from the service worker.
 */
export const updateChannel = "iff-update";


/**
 * Check for updates via the version field of the config file.
 */
export interface ServiceWorkerCheck {
    type: "check",
}

/**
 * Messages accepted by the service worker.
 */
export type ServiceWorkerMessage = ServiceWorkerCheck;

/**
 * Response to {@link ServiceWorkerCheck}.
 */
export interface ServiceWorkerResponseCheck {
    type: "check",
    /**
     * True if an update was found and downloaded correctly and will be applied on page reloads. False otherwise.
     */
    available: boolean,
}


/**
 * Messages broadcasted by the service worker.
 */
export type ServiceWorkerResponseMessage = ServiceWorkerResponseCheck;
