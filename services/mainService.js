const K = require("../database/KnexConnection");

search = async (name, setName, searchBanned = false) => {
  console.log(searchBanned)
  const res = await K('card')
  .join('card_set', 'card.setId', 'card_set.setId')
  .whereRaw(`LOWER(name) LIKE '%${name || ""}%' AND LOWER(setName) LIKE '%${setName || ""}%' ${searchBanned === "true" ? "" : "AND ban = 0"}`)
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
  }

  return {data: searchSets, count: res.length, countSets: Object.keys(searchSets).length};
}

setFlags = async (data, have, ban) => {
  await K('card')
  .whereIn('id', data)
  .update({
    have: have,
    ban: ban
  });
}

module.exports = { search, setFlags };
