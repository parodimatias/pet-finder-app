const algoliasearch = require("algoliasearch");

const client = algoliasearch("S9T3S97VUY", "5e6c4a6935492b16750a3436a6ce6ffd");
export const petAlgoliaIndex = client.initIndex("pets");
petAlgoliaIndex
  .setSettings({
    searchableAttributes: ["nombre"],
  })
  .then(() => {
    // done
  });
