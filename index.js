//Main Server
const express = require("express");
const { exit } = require("process");
const { Server } = require("socket.io");
const app = express();
const http = require("http").Server(app);
const p = 8080;
app.use(express.static("./public"));

const io = require("socket.io")(http);
io.on("connection", (socket) => {
  console.log(`${socket.id} connected!`);
});

http.listen(p, () => {
  console.log(`Listening on port ${p}!`);
});

//for input
const readline = require("readline");
const { start } = require("repl");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const SerialPort = require("serialport");
// const serial = new SerialPort
(async function () {
  let ports = await SerialPort.list();
  ports.forEach((port, i) => {
    console.log(` ${i + 1}:\t${port.path}`);
  });
  rl.question("Enter port number: ", (a) => {
    if (a <= 0 || a > ports.length) {
      console.error("uh oh");
      exit(1);
    }
    selectedPort = a;
    startComm(ports[a - 1]);
  });
})();

function startComm(p) {
  const Readline = require("@serialport/parser-readline");

  const port = new SerialPort(p.path, { baudRate: 9600 });
  // port.open();
  const parser = port.pipe(new Readline({ delimiter: "\n" }));
  // Read the port data
  port.on("open", () => {
    console.log(`serial port ${p.path} open`);
  });
  parser.on("data", (data) => {
    console.log("Scanned Data:", data);
    io.emit("scanCode", { id: data });
  });
}

const { getDB } = require("./google_sheets");
getDB();
