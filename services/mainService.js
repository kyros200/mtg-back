const K = require("../database/KnexConnection");

search = async (name) => {
  const res = await K('card').whereRaw(`LOWER(name) LIKE '%${name || ""}%'`)

  let searchSets = [...res].reduce((a, v) => (
    {...a, [v.setId]: {
      setName: v.setName, 
      setAbr: v.setAbr, 
      setUri: v.setUri, 
      cards: []
    }
  }), {})

  for(let i = 0; i < res.length; i++) {
    searchSets[res[i].setId].cards.push(res[i]);
  }

  return {data: searchSets, count: res.length, countSets: Object.keys(searchSets).length};
}

setHave = async (id, have) => {
  console.log(`id = ${id}, have = ${have}`);
  await K('card').where({id: id}).update({have: have});
}

module.exports = { search, setHave };
