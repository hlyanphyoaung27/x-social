require("dotenv").config();

const { faker, da } = require("@faker-js/faker");
const bcryptjs = require("bcryptjs");
const { request } = require("express");

const { clerkClient } = require("@clerk/express");



const { MongoClient, ObjectId } = require("mongodb");

const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("x");

const number_of_users = 80;
const number_of_posts = 40;
const number_of_shares = 5;
const number_of_comments = 120;
const number_of_notis = 10;

// const count_clerk_users = await clerkClient.users.getCount();

const first_user_id = "63969fc7526a2ee4e61451db";

async function seedUsers() {
	await db.collection("users").deleteMany({});

	// const clerk = new clerkClient({ apiKey: process.env.CLERK_API_KEY });

	let hash = await bcryptjs.hash("password", 10);
	let user = [];
	
	 let users = await clerkClient.users.getUserList();
	 users.data.map( a => {
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
	



	
	
	
	
	

	for (let i = 2; i <= number_of_users; i++) {
		let firstName = faker.person.firstName();
		let lastName = faker.person.lastName();

		// let hash = await bcrypt.hash("password", 10);

		user.push({
			name: `${firstName} ${lastName}`,
			username: `${firstName}${lastName[0]}`.toLowerCase(),
			password: hash,
			bio: faker.person.bio(),
			created: new Date(),
		})};
		


		
	// console.log(users);


	user.push({
		_id: new ObjectId(first_user_id),
		name: "Alice",
		username: "alice",
		password: hash,
		bio: faker.person.bio(),
		created: new Date(),
	});

	

	try {
		return await db.collection("users").insertMany(user);
	} finally {
		console.log("User seeding done.");
	}
}

async function seedFollows() {
	let sample = Math.floor((Math.random() * number_of_users) / 2) + 5;

	let randomUsers = await db
		.collection("users")
		.aggregate([
			{
				$match: {
					_id: {
						$not: { $eq: new ObjectId(first_user_id) },
					},
				},
			},
			{ $sample: { size: sample } },
		])
		.toArray();

	let followers = randomUsers.map(user => user._id);

	sample = Math.floor((Math.random() * number_of_users) / 2) + 5;
	randomUsers = await db
		.collection("users")
		.aggregate([
			{
				$match: {
					_id: {
						$not: { $eq: new ObjectId(first_user_id) },
					},
				},
			},
			{ $sample: { size: sample } },
		])
		.toArray();

	let following = randomUsers.map(user => user._id);

	try {
		await db.collection("users").updateOne(
			{ _id: new ObjectId(first_user_id) },
			{
				$set: { followers, following },
			}
		);

		for (let i = 0; i < following.length; i++) {
			await db.collection("users").updateOne(
				{ _id: following[i] },
				{
					$set: {
						followers: [new ObjectId(first_user_id)],
					},
				}
			);
		}

		for (let i = 0; i < followers.length; i++) {
			await db.collection("users").updateOne(
				{ _id: followers[i] },
				{
					$set: {
						following: [new ObjectId(first_user_id)],
					},
				}
			);
		}
	} finally {
		console.log("Done adding follows for user Alice");
	}
}

async function seedPosts(users) {
	await db.collection("posts").deleteMany({});

	let data = [];
	for (let i = 0; i < number_of_posts; i++) {
		let likes = [];
		let count = Math.floor(Math.random() * 40);
		for (let i = 0; i < count; i++) {
			likes.push(users[Math.floor(Math.random() * number_of_users)]);
		}

		likes = [...new Set(likes)];

		data.push({
			type: "post",
			body: faker.lorem.paragraph(),
			owner: users[Math.floor(Math.random() * number_of_users)],
			created: new Date(),
			likes: likes,
		});
	}

	try {
		return await db.collection("posts").insertMany(data);
	} finally {
		console.log("Post seeding done.");
	}
}

async function seedShares(posts, users) {
	let data = [];

	for (let i = 0; i < number_of_shares; i++) {
		let likes = [];
		let count = Math.floor(Math.random() * 40);
		for (let i = 0; i < count; i++) {
			likes.push(users[Math.floor(Math.random() * number_of_users)]);
		}

		likes = [...new Set(likes)];

		data.push({
			type: "share",
			origin: posts[Math.floor(Math.random() * number_of_posts)],
			body: faker.lorem.sentence(),
			owner: users[Math.floor(Math.random() * number_of_users)],
			created: new Date(),
			likes: likes,
		});
	}

	try {
		return await db.collection("posts").insertMany(data);
	} finally {
		console.log("Share seeding done.");
	}
}

async function seedComments(postsNshares, users) {
	let data = [];

	for (let i = 0; i < number_of_comments; i++) {
		let likes = [];
		let count = Math.floor(Math.random() * 40);
		for (let i = 0; i < count; i++) {
			likes.push(users[Math.floor(Math.random() * number_of_users)]);
		}

		likes = [...new Set(likes)];

		data.push({
			type: "comment",
			origin: postsNshares[
				Math.floor(Math.random() * (number_of_posts + number_of_shares))
			],
			body: faker.lorem.sentence(),
			owner: users[Math.floor(Math.random() * number_of_users)],
			created: new Date(),
			likes: likes,
		});
	}

	try {
		return await db.collection("posts").insertMany(data);
	} finally {
		console.log("Comment seeding done.");
	}
}

async function seedNotis(postsNshares, users) {
	try {
		await db.collection("notis").deleteMany({});

		let noti_types = ["comment", "like", "share"];

		let data = [];
		for (let i = 0; i < number_of_notis; i++) {
			let notiType = noti_types[Math.floor(Math.random() * 3)];
			data.push({
				type: notiType,
				actor: users[Math.floor(Math.random() * number_of_users)],
				msg: `${notiType}s your post.`,
				target: postsNshares[
					Math.floor(
						Math.random() * (number_of_posts + number_of_shares)
					)
				],
				owner: new ObjectId(first_user_id),
				read: false,
				created: new Date(),
			});
		}

		await db.collection("notis").insertMany(data);
	} finally {
		console.log("Noti seeding done.");
	}
}

async function seed() {
	console.log("Started seeding users...");
	let users = await seedUsers();

	console.log("Started seeding follows for user Alice");
	await seedFollows();

	console.log("Started seeding posts...");
	let posts = await seedPosts(users.insertedIds);

	console.log("Started seeding shares...");
	let shares = await seedShares(posts.insertedIds, users.insertedIds);

	console.log("Started seeding comments...");
	await seedComments(
		{ ...posts.insertedIds, ...shares.insertedIds },
		users.insertedIds
	);

	console.log("Started seeding notis...");
	await seedNotis(
		{ ...posts.insertedIds, ...shares.insertedIds },
		users.insertedIds
	);

	process.exit(0);
}

const express = require("express");
const router = express.Router();
router.get("/", async(req, res) => {
	await seed();
	res.status(200).json({msg: "seeding success"})
})
seed();


