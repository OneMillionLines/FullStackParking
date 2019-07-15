'use strict';
const _ = require("lodash");
//const Vehiclehandler=require('../../Vehiclehandler');
const Myimport=require('../imports');
const db=new Myimport().getDbConnection();
module.exports=async function(req, res) {
    let payload = req.payload;
    const id=payload.id;
    console.log(req.headers.id);
    let result = [];
    let promises = [];
    let command = "select description from orgn where id='"+id+"'";
    let d='';
    promises.push(
      db
        .one(command)
        .then(data => {
          d=data;
          result.push(data);
        })
        .catch(error => (console.log("ERROR:", error),result.push("On getting "+id+" we get error: "+error.detail)))
    );
    await Promise.all(promises);
    let description=d.description.descr;
    result=[];
    promises=[];
    console.log(description);
    command = "update orgn set description=$1 where id=$2";
    values=[payload,payload.id];
    promises.push(
      db
        .none(command,values)
        .then(data => {
          result.push(payload.id);
        })
        .catch(error => (console.log("ERROR:", error),result.push("On posting "+id+" we get error: "+error.detail)))
    );
    await Promise.all(promises);

    return result;
  }
