const algoliasearch = require("algoliasearch");
const client = algoliasearch("S9T3S97VUY", process.env.ALGOLIA_TOKEN);
export const petAlgoliaIndex = client.initIndex("pets");
petAlgoliaIndex
  .setSettings({
    searchableAttributes: ["nombre"],
  })
  .then(() => {
    // done
  });
