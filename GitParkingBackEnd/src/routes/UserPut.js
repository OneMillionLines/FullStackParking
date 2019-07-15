'use strict';
const _ = require("lodash");
const Vehiclehandler=require('../../VehicleInsert');
const Myimport=require('../imports');
const Import=new Myimport();
const db=Import.getDbConnection();
const amqp=require('amqplib/callback_api');
const moment=require('moment');

module.exports=async function(req, res) {
    let UserData;
    let payload = req.payload;
    let result;
    let Currtime=moment();
    if (payload["type"]=="allocate" || payload["type"]=="reserve"){
        await db.tx(async t=>{
    
            let vehiclehandler=new Vehiclehandler(payload,t);
            UserData=await vehiclehandler.getUserData();
            let vehicle_pos= await vehiclehandler.load();
            let command= "UPDATE user_table set time_val=$2 , vehicle_data=$3 where vehicle_no=$1";
            let values;
            
            if(!_.isEqual(vehicle_pos,{ f_id: 0, dist: 0, pos: 0 ,disLen:0})){
              UserData["vehicle_pos"]=vehicle_pos;
              UserData["notify_count"]=1;
              UserData["org_ID"]=payload["org_ID"];
              UserData["type"]=payload["type"];
              values = [payload.vehicle_no,Currtime,UserData];
              await t
                .none(command, values)
                .then(data => {
                  result=vehicle_pos;
                })
                .catch(error => (console.log("ERROR:", error),result="On inserting "+values+" we get error: "+error.detail));
            }
            else{
              result="Sorry No space available";
            }
            
          });
    }
    else{
        console.log("#########################");
        await db.tx(async t=>{
            let vehiclehandler=new Vehiclehandler(payload,t);
            UserData=await vehiclehandler.getUserData();
            console.log(UserData);
            UserData["type"]="allocate";
            let command= "UPDATE user_table set vehicle_data=$2 where vehicle_no=$1";
            let values=[payload.vehicle_no,UserData];
            await t
                .none(command, values)
                .then(data => {
                  result=UserData["vehicle_pos"];
                })
                .catch(error => (console.log("ERROR:", error),result="On inserting "+values+" we get error: "+error.detail));
        });
    }
    
    
    amqp.connect("amqp://localhost", function(error0, connection) {
          if (error0) {
            throw error0;
          }
          connection.createChannel(function(error1, channel) {
            if (error1) {
              throw error1;
            }
            // console.log("###################################################");
            let exchange = "vehicle_exchange";
            UserData["time"]=Currtime;
            // console.log(payload);
            let SPayload = JSON.stringify(UserData);
            channel.publish(exchange, '', Buffer.from(SPayload));
            console.log(" [x] Sent %s", SPayload);
          });
        });
  
    return result;
  }