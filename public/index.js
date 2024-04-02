import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const paper = document.getElementById("paper");
const socket = io("/");
const inrom = document.getElementById("inroom");
let click = false;
let x, y;
let creat = true,
  lastcreat = true;

document.addEventListener("contextmenu", (e) => e.preventDefault());

paper.width = 5000;
paper.height = 5000;

const cnx = paper.getContext("2d");

cnx.fillStyle = "#000";
cnx.fillRect(0, 0, paper.width, paper.height);

addEventListener("mousedown", (e) => {
  if (e.button != 1) {
    click = true;
  }
  // cnx.beginPath();
  // if (e.button == 0) {

  // } else if (e.button == 2) {
  //   cnx.strokeStyle = "#000";
  //   cnx.lineWidth = 15;
  // }

  if (e.button == 0) {
    creat = true;
  } else if (e.button == 2) {
    creat = false;
  }
});

addEventListener("mouseup", (e) => {
  // cnx.closePath();
  socket.emit("up");
  click = false;
});

addEventListener("mousemove", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  if (click) {
    // cnx.lineTo(x, y);
    // cnx.stroke();
    socket.emit("chang", { x, y, creat });
  }
});

socket.emit("joinRoom", roomId);
socket.on("onconnect", (data) => {
  inrom.innerText = data;
});

socket.on("creat", (data) => {
  if (data.creat != lastcreat) {
    cnx.closePath();
    cnx.beginPath();
  }
  if (data.creat == true) {
    cnx.strokeStyle = "#fff";
    cnx.lineWidth = 3;
    cnx.moveTo(data.x - 3, data.y - 3);
    cnx.lineTo(data.x, data.y);
  } else {
    cnx.strokeStyle = "#000";
    cnx.lineWidth = 15;
    cnx.moveTo(data.x - 15, data.y - 15);
    cnx.lineTo(data.x, data.y);
  }
  lastcreat = data.creat;
  cnx.stroke();
});
