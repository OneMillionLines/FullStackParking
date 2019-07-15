'use strict';
const _ = require("lodash");
const Vehiclehandler=require('../../Vehiclehandler');
const Myimport=require('../imports');
const db=new Myimport().getDbConnection();

module.exports=async function(req, res) {

  let payload = req.payload;
  let result;

  console.log(payload);
  await db.tx(async t=>{
  
    let vehiclehandler=new Vehiclehandler(payload,t);
    result = await vehiclehandler.deload();

  });
  return result;
}