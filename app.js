const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const randomId = require("uuid").v4;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${randomId()}`);
});

app.get("/:random", (req, res) => {
  res.render("index", { roomId: req.params.random });
});

io.on("connection", (socket) => {
  socket.on("joinRoom", async (roomId) => {
    //
    socket.join(roomId);
    io.to(roomId).emit(
      "onconnect",
      (await io.in(roomId).fetchSockets()).length
    );
    socket.on("disconnect", async () => {
      io.to(roomId).emit(
        "onconnect",
        (await io.in(roomId).fetchSockets()).length
      );
    });
    socket.on("chang", (data) => {
      io.to(roomId).emit("creat", data);
    });
    //
  });
});

server.listen(3000, () => {
  console.log("server open in port 3000");
});
