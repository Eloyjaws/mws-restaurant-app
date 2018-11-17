function main() {
  if ("serviceWorker" in navigator) {
    /* Use '/' as scope when running locally. The current scope is specific to github pages*/
    // const scope = '/'
    // const scope = '/docs/'
    const scope = "/mws-restaurant-app/";
    console.log('registering');
    navigator.serviceWorker
      .register("./sw.js", { updateViaCache: "none", scope })
      .then(reg => {
        if (!navigator.serviceWorker.controller) return;
        if (reg.waiting) {
          //trigger user notification;
          updateWorker(reg.waiting);
          //return;
          console.log("waiting");
        }
        if (reg.installing) {
          //track installing. add event listener on statechange. if reg.state == 'installed'
          trackInstalling(reg.installing);
          //trigger user notification
          //return;
          console.log("installing");
        }
        reg.addEventListener("updatefound", () => {
          //track installing. add event listener on statechange. if reg.state == 'installed'
          trackInstalling(reg.installing);
          //trigger user notification
          //return;
          console.log("update found");
        });
        console.log("SW Registered");
      })
      .catch((err) => {
        console.error('Error', err)
        throw new Error(
          "Something went wrong while registering the service worker"
        );
      });

    navigator.serviceWorker.addEventListener("controllerchange", () =>
      window.location.reload()
    );
  }
}

function isReady() {
  if (document.readyState === "complete") main();
}

const updateWorker = worker => {
  worker.postMessage({ action: "skipWating" });
};

const trackInstalling = worker => {
  worker.addEventListener("statechange", () => {
    if (worker.state == "installed") {
      updateWorker(worker);
    }
  });
};

document.addEventListener("readystatechange", isReady);
