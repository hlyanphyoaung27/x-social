require("dotenv").config();
const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb")
const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("x");

const clients = [];
const jwt = require("jsonwebtoken");
const { auth } = require("./users");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const secret = process.env.SECRET;

router.ws("/subscribe",(ws, req, res) => {
	ws.on("message", async(token) => {
		console.log("hello", token)
		
		await ClerkExpressRequireAuth()(req, res, async () => {
			const { userId } = req.auth || {};
			const user = await db.collection("users").findOne({ id: userId })
			console.log(user)

			ws._id = userId;
			clients.push(ws);
			console.log(`Add new client ${userId}`)
		});
		});
	});


module.exports = { clients, wsRouter: router };
