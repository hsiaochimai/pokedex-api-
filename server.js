require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const POKEDEX = require("./pokedex.json");
const cors = require("cors");
const helmet = require("helmet");
const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
const app = express();
app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());
const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychich`,
  `Rock`,
  `Steel`,
  `Water`
];

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  // move to the next middleware
  next();
});

function handleGetTypes(req, res) {
  res.json(validTypes);
}
app.get("/types", handleGetTypes);

function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;
  results = response;
  if (req.query.name) {
    let convertName = req.query.name.toLowerCase();
    results = response.filter(pokemon =>
      pokemon.name.toLowerCase().includes(convertName)
    );
  }
  if (req.query.type) {
    results = response.filter(pokemon => pokemon.type.includes(req.query.type));
  }

  res.json(results);
}
app.get("/pokemon", handleGetPokemon);
app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {});
