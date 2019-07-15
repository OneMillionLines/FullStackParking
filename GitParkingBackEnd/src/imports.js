'use strict';
const pgp = require("pg-promise")(),
  dbConnection = require("../secrets/db_configuration"),
  db = pgp(dbConnection),
  redis = require("async-redis"),
  amqp = require("amqplib/callback_api"),
  client = redis.createClient();

class getImportObjects{
    constructor(){
    }
    
    getDbConnection(){
        if(db){
            return db;
        }
        else{
            dbConnection = require("../secrets/db_configuration");
            db = pgp(dbConnection);
        }
    }
    getRedisClient(){
        if(client){
            return client;
        }
        else{
            redis = require("async-redis");
            client = redis.createClient();
            return client;
        }
    }

    getAMQP(){
        if(amqp){
            return amqp;
        }
        else{
            amqp = require("amqplib/callback_api");
            return amqp;
        }
    }

}

//const s=new getImportObjects().getDbConnection();
module.exports=getImportObjects;