let cron = require('cron');
let moment=require('moment');
const Myimport=require('./src/imports');
const db=new Myimport().getDbConnection();
const _=require('lodash');
const amqp = require("amqplib/callback_api");

async function sendMail () {
  let Currtime=moment();
  let command = "select vehicle_no,time_val,vehicle_data from user_table";
  let result;
  await db.tx(async t=>{
    t .any(command)
      .then(async data => {
        console.log(data);
        _.each(data,async myData=>{
          await console.log(myData["vehicle_data"],'############!!!!!!!!!!');
          if(myData.vehicle_data.hasOwnProperty('notify_count')){
              if (myData.vehicle_data["notify_count"]<=moment.duration(Currtime.diff(myData.time_val))._data["hours"])
              {
                //push to mailer
                amqp.connect("amqp://localhost", function(error0, connection) {
                if (error0) {
                  throw error0;
                }
                connection.createChannel(function(error1, channel) {
                  if (error1) {
                    throw error1;
                  }
                  let exchange = "vehicle_exchange";
                  console.log(myData.vehicle_data);
                  let SPayload = JSON.stringify(myData.vehicle_data);
                  channel.publish(exchange, '', Buffer.from(SPayload));
                  console.log(" [x] Sent %s", SPayload);
                  });
                });
                myData.vehicle_data.notify_count+=1;
                await t
                  .none("update user_table set vehicle_data=$1 where vehicle_no=$2",[myData.vehicle_data,myData.vehicle_no])
                  .then(res=>{
                    console.log(myData.vehicle_no+" is notified"); 
                  })
                  .error(console.log("ERROR:", error))
                  .catch(error => (console.log("ERROR:", error),result="On getting "+values+" we get error: "+error.detail));
              } 
            }
      });
      
        })
        
  });
      
}
let cronConfig = {
  cronTime: '* * * * *',
  runOnInit: true,
  job: sendMail
}

new cron.CronJob({
  cronTime: cronConfig.cronTime,
  onTick: cronConfig.job,
  start: true,
  runOnInit: cronConfig.runOnInit
});