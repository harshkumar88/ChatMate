const express = require("express");
const app = express();
const registerRouter = require("./src/router.js");
const port = process.env.PORT || 5000;
const path = require("path");
const { Server } = require("socket.io");
require("./src/router.js");
app.use(registerRouter);
const cors = require("cors");
app.use(cors());

app.use(express.static(path.join(__dirname, "client", "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.post("/getPort", (req, res) => {
  return res.json({ port: port });
});
const server = app.listen(port, (res, req) => {
  console.log("I am running on port " + port);
});

//Adding socket for server side
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "https://chat-mate-alpha.vercel.app"],
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("user connected " + socket.id);
  socket.on("AddRoom", () => {
    socket.join("Chat");
  });
  socket.on("message", (id) => {
    console.log("user with id" + socket.id + "send request to " + id);
    socket.to("Chat").emit("NotificationSent", id);
  });
  socket.on("userDetails", (data) => {
    console.log("hii agya");
    socket.to("Chat").emit("getuserDetails", data);
  });

  socket.on("msgInfo", (ele) => {
    socket.to("Chat").emit("getMessage", ele, () => {
      console.log("sendMsg");
    });
  });

  socket.on("msgSaved", (data) => {
    socket.to("Chat").emit("showMsg", data);
  });
  socket.on("removefriend", (friendId, deleteId) => {
    socket.to("Chat").emit("FriendRemove", { friendId, deleteId });
  });
  socket.on("deleteChat", (ele) => {
    socket.to("Chat").emit("chatDelete", ele);
  });
  socket.on("deletefromFriend", (ele) => {
    socket.to("Chat").emit("delete1", ele);
  });
  socket.on("deleteAllChat", (userId, friendid) => {
    socket.to("Chat").emit("deleteMyChat", userId, friendid);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
