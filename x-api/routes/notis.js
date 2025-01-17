require("dotenv").config();

const express = require("express");

const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("x");

const bodyParser = require("body-parser");
const { auth } = require("./users");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", auth, async (req, res) => {
    const user = res.locals.user;
    try {
        const notis = await db.collection("notis")
            .aggregate([
                {
                    $match: {
                        owner: new ObjectId(user._id)
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                },
                {
                    $limit: 40
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "actor",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                }
            ]).toArray();
        return res.json(notis)
    }catch(e) {
        return res.status(500).json({ error: e.message})
    }
});

router.post("/", auth , async(req, res) => {
    const user = res.locals.user;
    const {type, target} = req.body;

    let post = await db.collection("posts").findOne({
        _id: new ObjectId(target)
    });

    let result = await db.collection("notis").insertOne({
        type,
        actor: new ObjectId(user._id),
        msg: `${type} your post`,
        target: new ObjectId(target),
        owner: post.owner,
        read: false,
        created: new Date()
    });

    let noti = await db.collection("notis").findOne({_id: new ObjectId(result.insertedId)});

    return res.json(noti);
});

router.put("/:id", auth, async(req, res) => {
    const {id} = req.params;
    console.log()

    await db.collection("notis").updateOne(
        {_id: new ObjectId(id)},
        {
            $set: {read: true}
        }
    );

    return res.json({ msg: "noti marked read"});
});

module.exports = { notisRouter: router}


