'use strict';

const _  =require('lodash');
const range = require("range");
const arraySort = require('array-sort');
const SortedArray= require("sorted-array");

class Vehicle{
    constructor(value,db){
        //full json input from payload from user
        this.data=value;
        this.db=db;
        this.distributor();
    }
    getData(){
        //console.log(this.data);
        return this.data;
    }
    distributor(){
        //splitting input into each vehicle
        let carData = this.getVehicleData("car");
        let bikeData= this.getVehicleData("bike");
        let vanData = this.getVehicleData("van");

        carData["unallocated_array"]=this.createArray(carData);
        bikeData["unallocated_array"]=this.createArray(bikeData);
        vanData["unallocated_array"]=this.createArray(vanData);


        this.pushInDB("car",carData);
        this.pushInDB("bike",bikeData);
        this.pushInDB("van",vanData);
    }

    getVehicleData(value){
        let val=value;
        let Data=this.data;
        let id=Data.id;
        let distribution={};
        let mycount=0;
        _.each(Data.floor_id,f_id=>{
            let key_val=Data.descr[f_id][val];
            mycount+=key_val.count;
            distribution[f_id]=key_val;
        });
        let priceVal=Data.price[val];
        let propo=Data.propo[val];
        
        let allocated_array=new SortedArray([]);

        return {"id":id,"descr":distribution,"price":priceVal,"propo":propo,"Tcount":mycount,"floor_id":Data.floor_id,"floors":Data.floors,"Acount":0,"UACount":mycount,"allocated_array":allocated_array};
    }

    createArray(vehic_dat){
        let dat=vehic_dat;
        let unsorted_unallocated_array=[];
        let floor_id=dat.floor_id;
        let descr=dat.descr;
        _.each(floor_id,f_id=>{
            _.each(descr[f_id].d_id,d_number=>{
                _.each(range.range(1,descr[f_id].dist[d_number]+1),pos=>{
                    unsorted_unallocated_array.push({"f_id":f_id,"dist":d_number,"pos":pos,"disLen":descr[f_id].dist[d_number]});
                })
            });
        });
        
        const unallocated_array=arraySort(unsorted_unallocated_array,['f_id','disLen','dist','pos']);
        // console.log(unallocated_array);
        return unallocated_array;
    }

    async pushInDB(value,data){
        let result ;
        let command = "INSERT INTO space(space_id, space_data) VALUES ($1,$2)";
        let myId=data.id+value;
        let values = [myId, data];
        
        await this.db
        .none(command, values)
        .then(data => {
            result=myId+" is inserted"
        })
        .catch(error => (console.log("ERROR:", error),result="On inserting "+values+" we get error: "+error.detail))
        console.log(result);
    }
}
// To check vehicle work independently
//let inp_Data=...
// let vehicle = new Vehicle(inp_Data);

module.exports=Vehicle;