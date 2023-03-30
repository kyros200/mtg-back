const axios = require('axios');
const cron = require('node-cron');
const K = require("../database/KnexConnection");

let totalRequests = 0;
let actualRequest = 0;
let setsInfo = [];

const nextRequest = async (has_more, next_page) => {
    if(has_more) {
        console.log("getting next batch")
        const response = await axios.get(next_page);

        console.log("starting next upsert")
        await upsertCards(response.data.data);

        actualRequest = actualRequest + 1;
        console.log(`${actualRequest} de ${totalRequests} done!`)

        if(response.data.has_more) {
            await nextRequest(response.data.has_more, response.data.next_page);
        }
    }
}

const getAllCards = cron.schedule('0 0 * * *', async () => {
    actualRequest = 0;
    console.log("Job has started...")
    setsInfo = (await axios.get('https://api.scryfall.com/sets')).data.data;
    await upsertSets(setsInfo)
    console.log("Got all sets!")
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
        let formattedImg = card.image_uris ? card.image_uris.normal : `${card.card_faces[0].image_uris.normal},${card.card_faces[1].image_uris.normal}`
        let formattedTcg = card.purchase_uris?.tcgplayer
        if (formattedTcg?.includes("https"))
            formattedTcg = null;
        return {
            id: card.id,
            name: card.name,
            setId: card.set_id,
            imageUrl: formattedImg,
            priceUsd: parseFloat(card.prices?.usd || 0),
            urlTcg: formattedTcg,
        }
    })
}

const formatSets = (list) => {
    return list.map((set) => {
        return {
            setId: set.id,
            setReleaseDate: set.released_at,
            setName: set.name,
            setIcon: set.icon_svg_uri,
        }
    })
}

const upsertCards = async (list) => {
    const forbiddenSets= [
        '638940fb-6be9-4be3-b83f-68d3902fbbe5',// Magic Online Promos
        'b432b6ae-1d7d-49b1-ab1c-93ae7195fa06' // Magic Online Theme Decks
    ]

    let formattedList = list.filter((card) => !forbiddenSets.includes(card.set_id))
    try {
        await K('card').insert(formatCards(formattedList)).onConflict('id').merge();
    } catch (e) {
        console.log("ERROR ON UPSERT CARDS = ", e.sqlMessage)
    }
}

const upsertSets = async (list) => {
    try {
        await K('card_set').insert(formatSets(list)).onConflict('setId').merge();
    } catch (e) {
        console.log("ERROR ON UPSERT SETS = ", e.sqlMessage)
    }
}

const start = () => {
    getAllCards.start();
    // cron.schedule('* * * * *', async () => {
    //     console.log("KEEPING ALIVE")
    // }).start();
}

module.exports = { start };