const catchAsyncErrors = require("./catchAsyncErrors");

require("dotenv").config();
const datetime = require("node-datetime");
const axios = require("axios");
const pass_key = process.env.PASS_KEY;
const short_code = process.env.SHORT_CODE;
const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;
const newPassword = () => {
  const dt = datetime.create();
  const formatted = dt.format("YmdHMS");
  const passString = short_code + pass_key + formatted;
  const base64Encoded = Buffer.from(passString).toString("base64");
  return base64Encoded;
};

// register token and stk push => /api/v1/process/stk/push

exports.token = catchAsyncErrors(async (req, res, next) => {
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth =
    "Basic " +
    Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
  const headers = {
    Authorization: auth,
  };
  axios
    .get(url, {
      headers: headers,
    })
    .then((response) => {
      let data = response.data;
      let access_token = data.access_token;
      req.token = access_token;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

exports.stkPush = catchAsyncErrors(async (req, res, next) => {
  const { phoneNo, totalPrice } = req.body;
  const token = req.token;
  const dt = datetime.create();
  const formatted = dt.format("YmdHMS");
  const headers = {
    Authorization: "Bearer " + token,
  };
  const stkUrl =
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  let data = {
    BusinessShortCode: "174379",
    Password: newPassword(),
    Timestamp: formatted,
    TransactionType: "CustomerPayBillOnline",
    Amount: `10`,
    PartyA: `+254712012113`,
    PartyB: "174379",
    PhoneNumber: `+254712012113`,
    CallBackURL: "https://mydomain.com/pat",
    AccountReference: "Bramuels Online Stores",
    TransactionDesc: "Lipa na M-PESA",
  };
  axios
    .post(stkUrl, data, {
      headers: headers,
    })
    .then((response) => {
      res.send(response.data);
    });
});
