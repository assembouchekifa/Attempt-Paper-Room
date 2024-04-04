import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const paper = document.getElementById("paper");
const socket = io("/");
const peer = new Peer();
const inrom = document.getElementById("inroom");
let click = false;
let x, y;
let creat = true,
  lastcreat = true,
  lestSoketId = null;

peer.on("open", function (id) {
  console.log(id);
  socket.emit("peerId", id);
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

paper.width = 3000;
paper.height = 3000;

const cnx = paper.getContext("2d");

cnx.fillStyle = "#000";
cnx.fillRect(0, 0, paper.width, paper.height);

addEventListener("mousedown", (e) => {
  if (e.button != 1) {
    click = true;
  }
  if (e.button == 0) {
    creat = true;
  } else if (e.button == 2) {
    creat = false;
  }
});

addEventListener("mouseup", (e) => {
  socket.emit("up");
  click = false;
});

addEventListener("mousemove", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  if (click) {
    socket.emit("chang", { x, y, creat });
  }
});

socket.emit("joinRoom", roomId);
socket.on("onconnect", (data) => {
  inrom.innerText = data;
});
socket.on("uped", () => {
  lestSoketId = null;
});

socket.on("creat", (data) => {
  if (data.creat != lastcreat || data.socketId != lestSoketId) {
    cnx.closePath();
    cnx.beginPath();
  }
  if (data.creat == true) {
    cnx.strokeStyle = "#fff";
    cnx.lineWidth = 3;
    cnx.lineTo(data.x, data.y);
  } else {
    cnx.strokeStyle = "#000";
    cnx.lineWidth = 15;
    cnx.lineTo(data.x, data.y);
  }
  lestSoketId = data.socketId;
  lastcreat = data.creat;
  cnx.stroke();
});

navigator.mediaDevices
  .getUserMedia({ audio: true, video: false })
  .then((stram1) => {
    peer.on("call", (call) => {
      call.answer(stram1);
      call.on("stream", (stram2) => {
        const aud = document.createElement("audio");
        audAppend(aud, stram2);
        callsGood();
      });
    });

    socket.on("peerConnet", (data) => {
      callUser(data, stram1);
    });
  })
  .catch((err) => {
    console.log(err);
  });

function audAppend(aud, stram) {
  aud.srcObject = stram;
  document.body.appendChild(aud);
  aud.addEventListener("loadedmetadata", () => {
    aud.play();
  });
}

function callUser(data, stram2) {
  console.log(data);
  let call = peer.call(data, stram2);
  call.on("stream", (stream1) => {
    const aud = document.createElement("audio");
    audAppend(aud, stream1);
    callsGood();
  });
}

function callsGood() {
  let div = document.createElement("div");
  div.style.cssText =
    "width: 20px;height: 20px;background: red;border-radius: 50%;position: fixed;bottom: 0;right: 0;margin: 10px;";
  document.body.appendChild(div);
}
