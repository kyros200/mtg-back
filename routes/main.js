const express = require('express');
const mainService = require("../services/mainService");

let route = express.Router();

route.get('/search', async (req, res) => {
  mainService.search(req.query.name, req.query.setName)
  .then((data) => {
    res.status(200).json({success: true, ...data});
  })
  .catch((e) => {
    console.log(e)
    res.status(500).json({success: false, message: "something went wrong"})
  })
});

route.get('/getall', async (req, res) => {
  mainService.getAll()
  .then((data) => {
    res.status(200).json({success: true, ...data});
  })
  .catch((e) => {
    console.log(e)
    res.status(500).json({success: false, message: "something went wrong"})
  })
});

route.get('/collection', async (req, res) => {
  if (!req.query.id) {
    res.status(400).json({success: false, message: "Id is missing! Need to deliver card id."})
  }

  if (!req.query.have) {
    res.status(400).json({success: false, message: "Boolean is missing! Need to deliver 1 or 0."})
  }

  mainService.setHave(req.query.id, req.query.have)
  .then(() => {
    res.status(200).json({success: true, message: `success! Set ${req.query.id} card with value ${req.query.have}`});
  })
  .catch((e) => {
    console.log(e)
    res.status(500).json({success: false, message: "something went wrong"})
  })
});

module.exports = route;
