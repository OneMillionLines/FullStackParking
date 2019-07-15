'use strict';

const Myimport=require('../src/imports');
const db=new Myimport().getDbConnection();
const _ = require("lodash");
const Vehicle=require('../vehicle');
const Joi= require('@hapi/joi');

const routes = [
  {
    //insert data as a json describing the mall structure
    
    method: "POST",
    path: "/parking",
    handler: require('./routes/parkingPost')
  },
  {
    method: "GET",
    path: "/parking",
    handler: require('./routes/parkingGet')
  },
  {
    method: "PUT",
    path: "/parking",
    handler: require('./routes/parkingPut')
  },
  {
    method: "DELETE",
    path: "/parking",
    handler: require('./routes/parkingDelete')
  },

  //  end of parking crud routes
  //start of user routes
  {
    method: "POST",
    path: "/user",
    options: {
      validate: {
        payload: {
          vehicle_no:   Joi.string().min(5).max(10).required(),
          vehicle_type: Joi.string().valid(['car','bike','van']).required(),
          email:        Joi.string(),
          user_type:    Joi.string().valid(['normal','pass','vip']).required(),
        }
      },
    handler: require('./routes/UserPost')
    }
  },

  {
    method: "PUT",
    path: "/user",
    options: {
      validate: {
        payload: {
          vehicle_no: Joi.string().min(5).max(10).required(),
          org_ID:     Joi.string().min(1).required(),
          type:       Joi.string().valid(['allocate','reserve','alloc_reserve']).required(),
        }
      },
    handler: require('./routes/UserPut')
    }
  },

  {
    method: "DELETE",
    path: "/user",
    handler: require('./routes/UserDelete')
  }
]
module.exports = routes;