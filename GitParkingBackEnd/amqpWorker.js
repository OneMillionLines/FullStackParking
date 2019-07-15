'use strict';

const amqp = require("amqplib/callback_api");
const sgMail = require('@sendgrid/mail');
const api_key=require('./secrets/api_key')
sgMail.setApiKey(api_key);
const costCalc=require('./calcCost');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0


amqp.connect("amqp://localhost", function(error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            let queue="vehicle_queue";
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, async function(msg) {
                console.log(" [x] Received %s", msg.content.toString());
                let payload= JSON.parse(msg.content.toString());
                console.log(payload);
                console.log(payload["vehicle_no"]);
                if(payload["type"]!="sign_up"){
                    let myCost=await new costCalc(payload["vehicle_no"]).deload();
                    console.log(myCost);
                    let message="your "+payload["vehicle_type"] +" "+payload["vehicle_no"]+" is at Floor:"+payload.vehicle_pos["f_id"]+" "+" distribution: "+payload.vehicle_pos["dist"]+" position: "+payload.vehicle_pos["pos"]+" at time "+payload["time"]+" is cost: "+myCost;
                    const mail_message = {
                        to: payload["email"],
                        from: 'Your_parking@spaces.com',
                        subject: 'Parking reminder',
                        text: message,
                        html: '<strong>'+message+'<strong>',
                    };
                    console.log(sgMail);
                    console.log(mail_message);
                    sgMail.send(mail_message);
                }
                else{
                    let message="Welcome to Our Space. \n Your vehicle "+payload["vehicle_no"]+" is successfully signed Up";
                    const mail_message = {
                        to: payload["email"],
                        from: 'Your_parking@spaces.com',
                        subject: 'Welcome to Our Space',
                        text: message,
                        html: '<strong>'+message+'<strong>',
                    };
                    sgMail.send(mail_message);
                }
                
            }, {
                noAck: true
            });
        });
      });