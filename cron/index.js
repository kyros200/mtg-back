const axios = require('axios');
const cron = require('node-cron');
const K = require("../database/KnexConnection");

let totalRequests = 0;
let actualRequest = 0;

const nextRequest = async (has_more, next_page) => {
    if(has_more) {
        const response = await axios.get(next_page);

        await upsertCards(response.data.data);

        actualRequest = actualRequest + 1;
        console.log(`${actualRequest} de ${totalRequests} done!`)

        if(response.data.has_more) {
            await nextRequest(response.data.has_more, response.data.next_page);
        }
    }
}

const getAllCards = cron.schedule('1 0 * * *', async () => {
    actualRequest = 0;
    console.log("Job has started...")
    const response = await axios.get('https://api.scryfall.com/cards/search?order=released&unique=prints&q=t:legend+include:extras')

    totalRequests = Math.ceil(response.data.total_cards / 175);

    actualRequest = actualRequest + 1;
    console.log(`${actualRequest} de ${totalRequests} done!`)

    await upsertCards(response.data.data);
    
    await nextRequest(response.data.has_more, response.data.next_page);
    console.log("Success!")
});

const formatCards = (list) => {
    return list.map((card) => {
        return {
            id: card.id,
            name: card.name,
            setId: card.set_id,
            setAbr: card.set,
            setName: card.set_name,
            setUri: card.set_uri,
            imageUrl: card.image_uris?.normal,
            priceUsd: card.prices?.usd,
            priceEur: card.prices?.eur,
            urlTcg: card.purchase_uris?.tcgplayer,
            urlCm: card.purchase_uris?.cardmarket,
            urlCh: card.purchase_uris?.cardhoarder,
        }
    })
}

const upsertCards = async (list) => {
    const queryInsert = K('card').insert(formatCards(list));
  
    const queryFinal = `${queryInsert.toString()} on duplicate key update ${"`id`=Values(`id`)"}`;
  
    const res = await K.raw(queryFinal);
}


const start = () => {
    getAllCards.start();
}

module.exports = { start };