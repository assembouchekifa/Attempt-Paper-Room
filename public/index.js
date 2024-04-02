import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const paper = document.getElementById("paper");
const socket = io("/");
const inrom = document.getElementById("inroom");
let click = false;
let x, y;
let connect = 0;

document.addEventListener("contextmenu", (e) => e.preventDefault());

paper.width = 5000;
paper.height = 5000;

const cnx = paper.getContext("2d");

cnx.fillStyle = "#000";
cnx.fillRect(0, 0, paper.width, paper.height);

addEventListener("mousedown", (e) => {
  cnx.beginPath();
  click = true;
  if (e.button == 0) {
    cnx.strokeStyle = "#fff";
    cnx.lineWidth = 3;
  } else if (e.button == 2) {
    cnx.strokeStyle = "#000";
    cnx.lineWidth = 15;
  }
});

addEventListener("mouseup", (e) => {
  cnx.closePath();
  click = false;
});

addEventListener("mousemove", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  if (click) {
    cnx.lineTo(x, y);
    cnx.stroke();
  }
});

socket.emit("joinRoom", roomId);
socket.on("onconnect", (data) => {
  inrom.innerText = data;
});
