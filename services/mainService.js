const K = require("../database/KnexConnection");

const search = async ({name, setName, searchBanned = false, searchOwned = true}) => {
  const res = await K('card')
  .join('card_set', 'card.setId', 'card_set.setId')
  .whereRaw(`LOWER(name) LIKE '%${name || ""}%' AND LOWER(setName) LIKE '%${setName || ""}%' ${searchBanned === "true" ? "" : "AND ban = 0"} ${searchOwned === "true" ? "" : "AND have = 0"}`)
  .orderBy('setReleaseDate', "desc")

  let searchSets = [...res].reduce((a, v) => (
    {...a, [v.setId]: {
      setName: v.setName, 
      setReleaseDate: v.setReleaseDate, 
      setIcon: v.setIcon, 
      cards: []
    }
  }), {})

  for(let i = 0; i < res.length; i++) {
    searchSets[res[i].setId].cards.push(res[i]);
    searchSets[res[i].setId].cards.sort((a, b) => {
      if(a.name < b.name) return -1
      if(a.name > b.name) return 1
      return 0;
  })
  }

  return {data: searchSets, count: res.length, countSets: Object.keys(searchSets).length};
}

const setFlags = async ({data, have, ban, priceAlex}) => {
  await K('card')
  .whereIn('id', data)
  .update({
    have: have,
    ban: ban,
    priceAlex: priceAlex,
  });
}

module.exports = { search, setFlags };
