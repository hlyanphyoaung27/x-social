require("dotenv").config();
const { ClerkExpressRequireAuth, clerkClient } = require("@clerk/clerk-sdk-node");
const express = require("express");

const { MongoClient, ObjectId } = require("mongodb")
const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("x");
const jwt = require("jsonwebtoken");
const app = express()

const router = express.Router();

const multer = require("multer");
const { getAuth, clerkMiddleware, requireAuth } = require("@clerk/express");

const { faker } = require("@faker-js/faker");
const upload = multer({ dest: process.env.IMAGES_PATH })

app.use(clerkMiddleware());

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const auth = async (req, res, next) => {
	const { authorization } = req.headers;
	const token = authorization && authorization.split(" ")[1];
	if (!token) {
		console.log("No token provided");
		return res.status(401).json({ message: "Unauthorized: No token provided" });
	}
	console.log("Extracted Token:", token);

	await ClerkExpressRequireAuth()(req, res, async () => {

		console.log("Clerk middleware executed");
		console.log("req.auth:", req.auth);
		const { userId } = req.auth || "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18yalo0T08zMzhXdHBraUJVNEtMdFFTejhIUUIiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMzAiLCJleHAiOjE3MzIxNzI1ODksImlhdCI6MTczMjE3MjUyOSwiaXNzIjoiaHR0cHM6Ly9maXQtbGVtbWluZy03Mi5jbGVyay5hY2NvdW50cy5kZXYiLCJqdGkiOiI0NTkyMDg0ZjcyZDVhYmVhMTgyZCIsIm5iZiI6MTczMjE3MjUyNCwic3ViIjoidXNlcl8yamVpSXU0YWNqblpSbDkyc3kyaHZaeFp2cVcifQ.CX0m0KrgBUAzl1p9i4EejO0n4IsKIqjwKbq0UQkch6jNnQWKf77zFzkAEAatVbH1SJUu5QgBi-9kL9hucf0ljiMYMpa8qd5x0h82UXtaQ7TMjjESHNRogfO_btL8Ye1npA1qHeNGH8ptNA_xk6jkurPpAfBNi-HmDtdKD4ZML7oPXlhKBPEz4sBVnPhKbMBxoWQ0I1T8M23t6kqoLReIm_X9bLF26a5yMvzljmuyHrICB2EdKWnwmLcEWcKySgTwI4H5eX1wqfh9pTt4WA0OY18stanBbBe2h59IryTceVloK_KU-sPXN2vVq8HgLVbqnDmioeqQhq--CmzBc6wQWw";
		console.log("userId:", userId);

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const user = await db.collection("users").findOne({ id: userId });
		if (!user) {
			let user = []
			let users = await clerkClient.users.getUserList();
			
			users.data.map(a => {
				console.log("users:", a.name)
				let firstName = a.firstName
				let lastName = a.lastName
				let id = a.id
				user.push({
					id: id,
					name: `${firstName} ${lastName}`,
					username: a.username,
					bio: faker.person.bio(),
					following: [],

				});
			});

			return await db.collection("users").insertMany(user);
		}

		res.locals.user = user;
		next();
	});
};




// const auth = ClerkExpressRequireAuth();

router.get("/verify", auth, async (req, res) => {

	const user = res.locals.user;
	console.log("User", user);
	return res.json(user);
});

router.put("/follow/:id", auth, async (req, res) => {
	const targetUserId = req.params.id;
	const authUserId = res.locals.user._id;

	const targetUser = await db.collection("users").findOne({
		_id: new ObjectId(targetUserId),
	});

	const authUser = await db.collection("users").findOne({
		_id: new ObjectId(authUserId),
	});



	targetUser.followers = targetUser.followers || [];
	authUser.following = authUser.following || [];

	if (targetUser.followers._id === authUserId) return false;
	targetUser.followers.push(new ObjectId(authUserId));

	authUser.following.push(new ObjectId(targetUserId));

	try {
		await db.collection("users").updateOne(
			{ _id: new ObjectId(targetUserId) },
			{
				$set: { followers: targetUser.followers },
			}
		);

		await db.collection("users").updateOne(
			{ _id: new ObjectId(authUserId) },
			{
				$set: { following: authUser.following },
			}
		);

		return res.json({
			followers: targetUser.followers,
			following: authUser.following,
		});
	} catch (e) {
		return res.status(500).json({ msg: e.message });
	}
});

router.put("/unfollow/:id", auth, async (req, res) => {
	const targetUserId = req.params.id;
	const authUserId = res.locals.user._id;

	const targetUser = await db.collection("users").findOne({
		_id: new ObjectId(targetUserId),
	});

	const authUser = await db.collection("users").findOne({
		_id: new ObjectId(authUserId),
	});

	targetUser.followers = targetUser.followers || [];
	authUser.following = authUser.following || [];

	targetUser.followers = targetUser.followers.filter(
		userId => userId.toString() !== authUserId.toString()
	);

	authUser.following = authUser.following.filter(
		userId => userId.toString() !== targetUserId.toString()
	);

	try {
		await db.collection("users").updateOne(
			{ _id: new ObjectId(targetUserId) },
			{
				$set: { followers: targetUser.followers },
			}
		);

		await db.collection("users").updateOne(
			{ _id: new ObjectId(authUserId) },
			{
				$set: { following: authUser.following },
			}
		);

		return res.json({
			followers: targetUser.followers,
			following: authUser.following,
		});
	} catch (e) {
		return res.status(500).json({ msg: e.message });
	}
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
		user.followers = user.followers || [];
		user.following = user.following || [];

		const data = await db.collection("posts").aggregate([
			{
				$match: { owner: user._id },
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
					localField: "_id",
					from: "posts",
					foreignField: "origin",
					as: "comments",
				},
			},
			{
				$unwind: "$owner",
			},
			{
				$limit: 20,
			},
		]).toArray();

		return res.json({ user, posts: data })
	} catch (e) {
		return res.status(500).json({ msg: "Internal server error" })
	}
})

router.get("/following/:id", async (req, res) => {
	const { id } = req.params;
	const following = await db.collection("users").
		aggregate([
			{
				$match: {
					_id: new ObjectId(id)
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "following",
					foreignField: "_id",
					as: "following"
				}
			}
		]).toArray();

	res.json(following[0]);
})

router.get("/followers/:id", async (req, res) => {
	const { id } = req.params;
	const followers = await db.collection("users").
		aggregate([
			{
				$match: {
					_id: new ObjectId(id)
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "followers",
					foreignField: "_id",
					as: "followers"
				}
			}
		]).toArray();

	res.json(followers[0]);
})

router.get("/profile/search", async (req, res) => {
	let { q } = req.query;
	try {
		let result = await db.collection("users").
			aggregate([
				{
					$match: {
						name: new RegExp(`.*${q}.*`, "i"),
					}
				},
				{
					$sort: { name: 1 }
				},
				{
					$limit: 10
				}

			]).toArray();
		if (result) {
			return res.json(result)
		}
	} catch (e) {
		return res.json({ msg: e.message })
	}

	return res.json({ msg: "User not found" })
})

router.post("/photo/:id", upload.single("photo"), async (req, res) => {
	const id = req.params.id;
	const fileName = req.file.filename;

	try {
		await db.collection("users").updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: { photo: fileName }
			}
		)
	} catch (e) {
		return res.status(500).json({ msg: e.message })
	}
	return res.json({ msg: "Photo uploaded" })
});

router.post("/cover/:id", upload.single("cover"), async (req, res) => {
	const id = req.params.id;
	const fileName = req.file.filename;

	try {
		await db.collection("users").updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: { cover: fileName }
			}
		)
	} catch (e) {
		return res.status(500).json({ msg: e.message })
	}
	return res.status(200).json({ msg: "Cover uploaded" })
})

module.exports = { usersRouter: router, auth }