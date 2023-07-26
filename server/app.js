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
    errorMessage: "",
    data: null,
  };
  try {
    const { stockSymbol, date } = req.body;
    console.log({ stockSymbol, date });
    const reqUrl = `https://api.polygon.io/v1/open-close/${stockSymbol}/${date}?adjusted=true`;
    axios
      .get(reqUrl, {
        headers: {
          Authorization: `Bearer YA3xzrb6pTrBpih6UxkicYiePRyVZBaC`,
        },
      })
      .then((data) => {
        resObj.errorCode = 0;
        resObj.errorMessage = "Successfully Retrieved";
        resObj.data = data.data;
        res.status(200).json(resObj);
      })
      .catch((error) => {
        resObj.errorCode = 1;
        resObj.errorMessage = "Some Error Occurred";
        resObj.data = null;
        if (JSON.stringify(error.response.status).startsWith("4")) {
          if (error.response.status === 429) {
            resObj.errorMessage =
              "It looks like you're getting an status code 429. You're likely going over the rate limit of 5 requests per minute which comes with the Basic plans";
            res.status(404).json(resObj);
            return;
          } else if (error.response.status === 401) {
            resObj.errorMessage = "Polygon API Key Expired";
            res.status(404).json(resObj);
            return;
          } else if (error.response.status === 400) {
            resObj.errorMessage = "No Details found for your request";
            res.status(404).json(resObj);
            return;
          }
          resObj.errorMessage = "Polygon Server Issue";
          res.status(404).json(resObj);
          return;
        }
        resObj.errorMessage = error;
        res.status(500).json(resObj);
        return;
      });
  } catch (error) {
    resObj.errorMessage = "Some Error Occurred";
    return res.status(500).send(resObj);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
