'use strict';
const _ = require("lodash");
const Vehicle=require('../../vehicle');
const Myimport=require('../imports');
const db=new Myimport().getDbConnection();
const moment=require('moment');


module.exports=async function(req, res) {

  let payload = req.payload;
  let result;

  await db.tx(async t=>{

    let vehicle=new Vehicle(payload,t);
    let command = "INSERT INTO orgn(id, description) VALUES ($1,$2)";
    let values = [payload.id, payload];
    
    await t
      .none(command, values)
      .then(data => {
        result=payload.id+" is inserted";
      })
      .catch(error => (console.log("ERROR:", error),result="On inserting "+values+" we get error: "+error.detail));
  });

  console.log(result);
  return result;
}