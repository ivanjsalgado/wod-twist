const axios = require("axios");
const cors = require("cors");
const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");

admin.initializeApp();
const app = express();
app.use(cors());
app.use(bodyParser.app.json());
