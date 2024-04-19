/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../framework/service.ts":
/*!*******************************!*\
  !*** ../framework/service.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupSW: () => (/* reexport safe */ _src_service_worker_service_worker__WEBPACK_IMPORTED_MODULE_0__.setupSW)
/* harmony export */ });
/* harmony import */ var _src_service_worker_service_worker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/service_worker/service_worker */ "../framework/src/service_worker/service_worker.ts");


/***/ }),

/***/ "../framework/src/service_worker/service_worker.ts":
/*!*********************************************************!*\
  !*** ../framework/src/service_worker/service_worker.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupSW: () => (/* binding */ setupSW)
/* harmony export */ });
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared */ "../framework/src/service_worker/shared.ts");

function setupSW(sw) {
  async function conf() {
    let configURL = new URL(_shared__WEBPACK_IMPORTED_MODULE_0__.configPath, sw.location.href);
    let res = await (await caches.open(_shared__WEBPACK_IMPORTED_MODULE_0__.cacheName)).match(configURL);
    let c = await res.json();
    return c;
  }
  async function deleteCaches() {
    Promise.all((await sw.caches.keys()).filter(k => k != _shared__WEBPACK_IMPORTED_MODULE_0__.cacheName).map(k => sw.caches.delete(k)));
  }
  async function cacheFiles() {
    const c = await sw.caches.open(_shared__WEBPACK_IMPORTED_MODULE_0__.cacheName);
    await c.addAll((await conf()).cacheFiles);
  }
  sw.addEventListener("install", event => {
    sw.skipWaiting();
    event.waitUntil(cacheFiles());
  });
  sw.addEventListener("activate", event => {
    event.waitUntil(Promise.all([sw.clients.claim(), deleteCaches()]));
  });
  let recaching = false;
  async function recache() {
    let channel = new BroadcastChannel(_shared__WEBPACK_IMPORTED_MODULE_0__.updateChannel);
    let m = {
      type: "check",
      available: false
    };
    let configURL = new URL(_shared__WEBPACK_IMPORTED_MODULE_0__.configPath, sw.location.href);
    let res = await (await caches.open(_shared__WEBPACK_IMPORTED_MODULE_0__.cacheName)).match(configURL);
    let c = await res.json();
    try {
      let newC = await (await fetch(configURL, {
        cache: "no-cache"
      })).json();
      if (newC.version > c.version) {
        await cacheFiles();
        (await caches.open(_shared__WEBPACK_IMPORTED_MODULE_0__.cacheName)).put(configURL, new Response(JSON.stringify(newC)));
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
  sw.onmessage = event => {
    let msg = event.data;
    switch (msg.type) {
      case "check":
        {
          if (!recaching) {
            recaching = true;
            event.waitUntil(recache());
          }
        }
    }
  };
  const cacheFirst = async request => {
    const cached = await sw.caches.match(request, {
      cacheName: _shared__WEBPACK_IMPORTED_MODULE_0__.cacheName
    });
    if (cached) {
      return cached;
    }
    return fetch(request);
  };
  sw.addEventListener("fetch", event => {
    event.respondWith(cacheFirst(event.request));
  });
}

/***/ }),

/***/ "../framework/src/service_worker/shared.ts":
/*!*************************************************!*\
  !*** ../framework/src/service_worker/shared.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cacheName: () => (/* binding */ cacheName),
/* harmony export */   configPath: () => (/* binding */ configPath),
/* harmony export */   updateChannel: () => (/* binding */ updateChannel)
/* harmony export */ });
/**
 * @file Shared definitions for the service worker and updater.
 */

/**
 * Cache name.
 */
const cacheName = "iff-cache";

/**
 * Config path relative to the service worker and story HTML file.
 */
const configPath = "./config.json";
/**
 * Channel name for broadcasting messages from the service worker.
 */
const updateChannel = "iff-update";

/**
 * Check for updates via the version field of the config file.
 */

/**
 * Messages accepted by the service worker.
 */

/**
 * Response to {@link ServiceWorkerCheck}.
 */

/**
 * Messages broadcasted by the service worker.
 */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/service.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _if_framework_framework_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @if-framework/framework/service */ "../framework/service.ts");


// Just set up the default IF Framework service worker.
(0,_if_framework_framework_service__WEBPACK_IMPORTED_MODULE_0__.setupSW)(__webpack_require__.g);
})();

/******/ })()
;
//# sourceMappingURL=service.js.map