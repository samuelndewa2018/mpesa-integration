const express = require("express");
const router = express.Router();
const { token, stkPush } = require("./mpesaController");

router.post("/stk/push", token, stkPush);

module.exports = router;
