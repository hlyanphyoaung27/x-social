require("dotenv").config();
const {clerkMiddleware} = require("@clerk/express")


const express = require("express");
const app = express();


require("express-ws")(app);

const cors  = require("cors");
app.use(cors());



const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



const { postsRouter } = require("./routes/posts");
app.use("/posts", postsRouter);

const { usersRouter } = require("./routes/users");
app.use("/users", usersRouter);

const { notisRouter } = require("./routes/notis");
app.use("/notis", notisRouter);

const { chatsRouter } = require("./routes/chats");
app.use("/chats", chatsRouter);

const {wsRouter} = require("./routes/ws")
app.use(wsRouter);

app.use("/images", express.static(process.env.IMAGES_PATH));



app.listen(process.env.PORT, () => {
    console.log(`X-api is running at ${process.env.PORT}`)
});

