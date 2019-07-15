'use strict';
const _ = require("lodash");
//const Vehiclehandler=require('../../Vehiclehandler');
const Myimport=require('../imports');
const db=new Myimport().getDbConnection();

module.exports=async function(req, res) {
      console.log(req.query);
      const id=req.headers.id;
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
      console.log(description);
      console.log(req.query);
      return description;
    }