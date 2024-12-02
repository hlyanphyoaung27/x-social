require("dotenv").config()

const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");

const { auth } = require("./users");
const { clients } = require("./ws");
const mongo = new  MongoClient(process.env.MONGO);
mongo.connect().then(() => console.log("Connected to MongoDB")).catch(err => console.error("MongoDB connection error:", err));
const db = mongo.db("x");

router.get("/",auth, async(req, res) => {
    const {user} = res.locals;
    const result = await db.collection("chats").aggregate([
        {
          $match: {
            owner: new ObjectId(user._id)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "origin",
            foreignField: "_id",
            as: "targetUser"
          }
        },
        {
          $unwind : "$targetUser"
        }
      ]).toArray();

    return res.json(result);
})

router.post("/:origin",auth, async(req, res) => {
    const {user} = res.locals;
    const { body } = req.body;
    const { origin } = req.params;
    console.log(origin)

    const chat = {
		type: "chat",
		origin: new ObjectId(origin),
		body,
		owner: new ObjectId(user._id),
		created: new Date(),
	}

     await db.collection("chats").insertOne(chat) ;
     return res.json({msg: "hello"});
});

module.exports = {chatsRouter: router}