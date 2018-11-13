const dbPromise = idb.open("mws-restaurants-app", 1, upgradeDb => {
  const keyValStore = upgradeDb.createObjectStore("restaurants");
});

self.addDataToIdb = (key, value) => {
  dbPromise.then(db => {
    const tx = db.transaction("restaurants", "readwrite");
    const keyValStore = tx.objectStore("restaurants");
    keyValStore.put(value, key);
    return tx.complete;
  });
};

self.getDataFromIdb = key => {
  return dbPromise
    .then(db => {
      if (!db) return;
      const tx = db.transaction("restaurants");
      const keyValStore = tx.objectStore("restaurants");
      return keyValStore.get(key);
    })
    .catch(err => console.log(`Error getting ${key} from idb`));
};
