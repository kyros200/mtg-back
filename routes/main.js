const express = require('express');
const mainService = require("../services/mainService");

let route = express.Router();

route.get('/search', async (req, res) => {
  mainService.search(req.query.name, req.query.setName, req.query.searchBanned)
  .then((data) => {
    res.status(200).json({success: true, ...data});
  })
  .catch((e) => {
    console.log(e)
    res.status(500).json({success: false, message: "something went wrong"})
  })
});

route.post('/collection', async (req, res) => {
  mainService.setFlags(req.body.data, req.body.have, req.body.ban)
  .then(() => {
    res.status(200).json({success: true, message: `success! Changed ${req.body.data.length} cards`});
  })
  .catch((e) => {
    console.log(e)
    res.status(500).json({success: false, message: "something went wrong"})
  })
});

module.exports = route;
