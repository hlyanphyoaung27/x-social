require("dotenv").config()

const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const { auth } = require("./users");
const { clients } = require("./ws");
const mongo = new  MongoClient(process.env.MONGO);
const db = mongo.db("x");

//posts
router.get("/",async(req, res ) => {
    const posts = await db.collection("posts").aggregate([
			{
				$match: {
					type: "post",	
				},
			},
			{
				$sort: {
					created: -1,
				},
			},
			{
				$limit: 10,
			},
			{
				$lookup: {
					from: "posts",
					localField: "_id",
					foreignField: "origin",
					as: "comments",
					pipeline: [
						{
							$lookup: {
								from: "users",
								localField: "owner",
								foreignField: "_id",
								as: "owner",
							},
						},
						{
							$unwind: "$owner",
						},
					],
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "owner",
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "likes",
					foreignField: "_id",
					as: "likes",
				},
			},
			{
				$unwind: "$owner",
			},
		]).toArray();

      return res.json(posts);
});

//post/likes
router.put("/like/:id", auth, async (req, res) => {
	const { id } = req.params;
	const user = res.locals.user;

	const post = await db
		.collection("posts")
		.findOne({ _id: new ObjectId(id) });

	const likes = [...post.likes, new ObjectId(user._id)];

	const update = await db.collection("posts").updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: { likes },
		}
	);

	await db.collection("notis").insertOne({
		type: "like",
		actor: new ObjectId(user._id),
		msg: "likes your post",
		target: post._id,
		owner: post.owner,
		read: false,
		created: new Date()
	})

	const notiCount = await db.collection("notis").find({
		owner: post.owner
	}).toArray();

	clients.map(client => {
		if(client._id == post.owner._id) {
			client.send({type: "notis", count: notiCount.length});
			console.log(`noti count to sent ${post.owner.toString()}`)
		}
	})

  console.log(update);
	return res.json(update);
});

//post/unlikes
router.put("/unlike/:id", auth, async (req, res) => {
	const { id } = req.params;
	const user = res.locals.user;
	console.log(user._id)

	const post = await db
		.collection("posts")
		.findOne({ _id: new ObjectId(id) });

	const likes = post.likes.filter(like => {
		console.log(like)
		return like.toString() !== user._id.toString()
	});
	console.log(likes);

	const update = await db.collection("posts").updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: { likes },
		}
	);
	console.log(update)

	return res.json(update);
});


//getpost
async function getPost(id) {
	try {
		const data = await db
			.collection("posts")
			.aggregate([
				{
					$match: { _id: new ObjectId(id) },
				},
				{
					$sort: {
						created: -1
					}
				},
				{
					$lookup: {
						localField: "owner",
						from: "users",
						foreignField: "_id",
						as: "owner",
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "likes",
						foreignField: "_id",
						as: "likes",
					},
				},
				{
					$lookup: {
						localField: "_id",
						from: "posts",
						foreignField: "origin",
						as: "comments",
						pipeline: [
							{
								$lookup: {
									from: "users",
									localField: "owner",
									foreignField: "_id",
									as: "owner",
								},
							},
							{
								$lookup: {
									localField: "_id",
									from: "posts",
									foreignField: "origin",
									as: "comments",
								},
							},
							{
								$lookup: {
									from: "users",
									localField: "likes",
									foreignField: "_id",
									as: "likes",
								},
							},
							{
								$unwind: "$owner",
							},
						],
					},
				},
				{
					$unwind: "$owner",
				},
			])
			.toArray();

		return data[0];
	} catch (err) {
		return false;
	}
}

//fetchpost
router.get("/:id",  async(req, res) => {
	const {id} = req.params;
	const post = await getPost(id);
	if(post) {
		return res.json(post)
	}
	return res.status(500).json({ msg: 'this post is not find'})
})

router.post("/comment/:origin", auth, async(req, res) => {
	const {user} = res.locals;
	const {body} = req.body;
	const {origin} = req.params;

	const comment = {
		type: "comment",
		origin: new ObjectId(origin),
		body,
		owner: new ObjectId(user._id),
		created: new Date(),
		likes: []
	}

	const result = await db.collection("posts").insertOne(comment);
	const data = await getPost(result.insertedId);

	const resultPost = await db.collection("posts").findOne({_id: new ObjectId(origin)});

	await db.collection("notis").insertOne({
		type: "comment",
		actor: new ObjectId(user._id),
		msg: "comments your post",
		target: new ObjectId(origin),
		owner: resultPost.owner,
		read: false,
		created: new Date()
	})

	return res.status(201).json(data);
});

router.post("/", auth, async(req, res) => {
	const {user} = res.locals;
	const {body} = req.body;

	const post = {
		type: "post",
		body,
		owner: new ObjectId(user._id),
		created: new Date(),
		likes: []
	}
	const result = await db.collection("posts").insertOne(post);
	const data = await getPost(new ObjectId(result.insertedId));

	return res.status(201).json(data)
})

router.get("/searchpost/search", async (req, res) => {
    let { q } = req.query;
    console.log("Search query:", q);

    try {
        let result = await db.collection("posts").aggregate([
            {
                $match: {
                    type: "post",
                    body: new RegExp(`.*${q}.*`, "i")
                }
            },
            {
                $sort: {
                    created: -1
                }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "origin",
                    as: "comments",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner"
                            }
                        },
                        {
                            $unwind: "$owner"
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "likes",
                    foreignField: "_id",
                    as: "likes"
                }
            },
            {
                $unwind: "$owner"
            }
        ]).toArray();

        console.log("Search results:", result);
        return res.json(result);
    } catch (e) {
        console.error("Error during search:", e);
        return res.status(500).json({ msg: e.message });
    }
});



module.exports = { postsRouter: router };