const K = require("../database/KnexConnection");

search = async (name, setName) => {
  const res = await K('card')
  .join('card_set', 'card.setId', 'card_set.setId')
  .whereRaw(`LOWER(name) LIKE '%${name || ""}%' AND LOWER(setName) LIKE '%${setName || ""}%'`)
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

setHave = async (id, have) => {
  await K('card').where({id: id}).update({have: have});
}

module.exports = { search, setHave };
