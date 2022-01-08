const express = require("express");
const router = express.Router();

const mainRouter = require('./main');

router.use('/', mainRouter);

module.exports = router;
