// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
  const allowedOrigins = ["http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.enable("trust proxy");

app.post("/api/fetchStockData", (req, res) => {
  // YOUR CODE GOES HERE, PLEASE DO NOT EDIT ANYTHING OUTSIDE THIS FUNCTION
  const resObj = {
    errorCode: 0,
    errorMessage: 'Successfully Retrieved',
    data: null
  }
  try {
    const { stockSymbol, date } = req.body;
    console.log({stockSymbol, date});
    const reqUrl = `https://api.polygon.io/v1/open-close/${stockSymbol}/${date}?adjusted=true`;
    axios
      .get(reqUrl, {
        headers: {
          Authorization: `Bearer ${process.env.POLYGON_API_KEY}`,
        },
      })
      .then((data) => {
        resObj.errorCode = 0;
        resObj.errorMessage = 'Successfully Retrieved';
        resObj.data = data.data;
        res.status(200).json(resObj);
      })
      .catch((error) => {
          resObj.errorCode = 1;
          resObj.errorMessage = 'Failed';
          resObj.data = null;
        if(JSON.stringify(error.response.status).startsWith('4')){
          resObj.errorMessage = error
          res.status(404).json(resObj);
          return;
        }
        resObj.errorMessage = error;
        res.status(500).json(resObj);
      });
  } catch (error) {
    return res.status(500).send(resObj);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
