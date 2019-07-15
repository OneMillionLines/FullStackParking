'use strict';

const chai=require('chai');
const should=chai.should();

const Myimport=require('../src/imports');
const db=new Myimport().getDbConnection();

const Vehicle= require('../vehicle');

//initial input data
let inp_data={ "id": "EA", "name": "EA", "floors": 3, "floor_id": [1,2,3], "propo":{"car":3,"bike":1,"van":6}, "descr": { "1": { "car": { "count": 20, "d_id": [ 1,2,3,4 ], "dist": { "1": 10, "2": 5, "3": 3, "4": 2 } }, "bike": { "count": 50, "d_id": [ 1,2,3,4 ], "dist": { "1": 10, "2": 5, "3": 15, "4": 20 } }, "van": { "count": 5, "d_id": [ 1,2 ], "dist": { "1": 2, "2": 3 } } } , "2": { "car": { "count": 20, "d_id": [ 1,2,3,4 ], "dist": { "1": 10, "2": 5, "3": 3, "4": 2 } }, "bike": { "count": 50, "d_id": [ 1, 2, 3, 4 ], "dist": { "1": 10, "2": 5, "3": 15, "4": 20 } }, "van": { "count": 5, "d_id": [ 1, 2 ], "dist": { "1": 2, "2": 3 } } } , "3": { "car": { "count": 20, "d_id": [ 1,2,3,4 ], "dist": { "1": 10, "2": 5, "3": 3, "4": 2 } }, "bike": { "count": 50, "d_id": [ 1,2,3,4 ], "dist": { "1": 10, "2": 5, "3": 15, "4": 20 } }, "van": { "count": 5, "d_id": [ 1,2 ], "dist": { "1": 2, "2": 3 } } } } , "price": { "car": { "h0": 30, "step": 20 }, "bike": { "h0": 30, "step": 20 }, "van": { "h0": 30, "step": 20 } } };

describe('Vehicle', () => {
    describe('#Initialize', () => {
      let vehicle;
  
      beforeEach(() => {
        // Create a new vehicle object before every test.
        vehicle = new Vehicle(inp_data,db);
      });
  
      it('Compares the inputData', () => {
        // This will fail if "input" does not match
        let data=vehicle.getData();
        console.log(data);
        data.should.equal(inp_data);
      });
    });
});
