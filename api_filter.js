#!/usr/bin/env node

var amqp = require('amqplib/callback_api');


const http = require('http');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(8000);

// test

app.use(async ctx => {
    amqp.connect('amqp://guest:guest@rabbitmq', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'sms';

            for (let i=0;i<100;i++) {
                var msg = "msg " + i;

                channel.assertQueue(queue, {
                    durable: true
                });
                channel.sendToQueue(queue, Buffer.from(msg), {
                    persistent: true
                });
                console.log(" [x] Sent '%s'", msg);
            }

        });
        setTimeout(function() {
            connection.close();
            //process.exit(0)
        }, 500);
    });
    ctx.body = {"msg": "100 job sent"};
});

