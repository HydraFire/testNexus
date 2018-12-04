
// /////////////////////////////////////////////////////////////////////////////
const WebSocketServer = require('ws').Server;

const http = require('http');
const express = require('express');
const fs = require('fs');
//
const exp = express();
exp.use(express.static(`${__dirname}/public`));
//
//
// http Server
const server = http.createServer(exp).listen(6060);
// WebSocketServer
const wss = new WebSocketServer({ server });


const timetest = function(ws) {
	let t = 0;
	setInterval(()=>{
		t += 1;
		console.log(t);
		if (t > 600) {
			ws.send('прошло 10 минут');
			t = 0;
		}
	},1000);
}


const idleInterval = function idleInterval(ws) {
  console.log('/// START FUNCTION idleInterval()');
  let pastTime = Date.now();
  // let sumtime = 0;
  // let onetime = true;
  ws.idleInterval = setInterval(() => {
    const now = Date.now();
    pastTime += 10500;
    // console.log(`pastTime = ${pastTime} now = ${now}`);
    if (pastTime < now) {
      // sumtime += now - pastTime;
      const sum = (now - pastTime) / 1000 | 0;
      const min = sum / 60 | 0;
      const sec = sum % 60;
      if (min == 0) {
        console.log(`${sec}s`);
      } else {
        console.log(`${min}m ${sec}s`);
      }

      
      console.log('chargeImpulse');
      ws.send('chargeImpulse');
      
      pastTime = now;
    } else {
      pastTime = now;
    }
    // mainTimeCircle(ws);
  }, 1000);
};

function webSocketOnMessage(ws) {
  ws.on('message', (message) => {
    console.log(message)
  });
}

function webSocketOnConnect(wss) {
  wss.on('connection', (ws) => {
    // Запуск евент листенера на меседжи
    idleInterval(ws);
    timetest(ws);
    webSocketOnMessage(ws);
    // Впринципе хотелось бы зделать чтоб был лог всег IP заходивших на nerv
    ws.addEventListener('close', () => {
     console.log('user disconnect');
    });
  });
}

webSocketOnConnect(wss);
// Тренеруэм нейроную сеть если обновились команды

