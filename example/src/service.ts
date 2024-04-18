import { setupSW } from "@if-framework/framework/service";

// Just set up the default IF Framework service worker.
setupSW(global as unknown as ServiceWorkerGlobalScope);
