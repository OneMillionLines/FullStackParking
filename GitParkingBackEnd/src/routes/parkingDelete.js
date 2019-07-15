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
      let command = "DELETE from orgn where id='"+id+"'";
      let d='';
      promises.push(
        db
          .any(command)
          .then(data => {
            d=data;
            result.push(data);
          })
          .catch(error => (console.log("ERROR:", error),result.push("On deleting "+id+" we get error: "+error.detail)))
      );
      await Promise.all(promises);
      let description=d[0].description.descr;
      console.log(description);
      return description;
    }