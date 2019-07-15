'use strict';
const _ = require("lodash");

const moment=require('moment')
const Myimport=require('./src/imports');
const myImport=new Myimport();
const client=myImport.getRedisClient();
const db=myImport.getDbConnection();

class costCalculator{
    constructor(vehicle_no){
        this.vehicle_no=vehicle_no;
        this.db=db;
    }

    async fetch_current_space(myId){
        let cache = await this.isPresentInCache(myId);
        if (!_.isEmpty(cache)) return JSON.parse(cache);
        //actual DB Call
        let command = "select space_data from space where space_id=$1";
        let values = [myId];
        let result;
        await this.db
            .one(command,values)
            .then(async data => {
                result= data;
                await client.set(myId, JSON.stringify(result));
            })
            .catch(error => (console.log("ERROR:", error),result="On getting "+values+" we get error: "+error.detail));
        return result;
    }

    async isPresentInCache(myId) {
        try {
          let cache = await client.get(myId);
          if (!_.isEmpty(cache)) return cache;
          return {};
        } catch (err) {
          console.log(err);
        }
      }

    async deload(){
        let command="select time_val,vehicle_data from user_table where vehicle_no=$1"
        let values=[this.vehicle_no];
        this.user_data='';


        await this.db
            .one(command,values)
            .then(data=>{
                this.user_data=data;
            })
            .catch(error=>(console.log("ERROR:", error)));
        
        this.myId=this.user_data.vehicle_data.org_ID+this.user_data.vehicle_data.vehicle_type;
        
        let result= await this.fetch_current_space(this.myId);

        this.rawData=result.space_data;
        this.id=this.rawData.id;


        let cost=await this.calcPrice();
        console.log(cost);
        return cost;
    }
    
    async calcPrice(){
        let t1=this.user_data.time_val;
        let t2=moment.duration(moment().diff(t1))._data;
        let hours=Math.ceil(t2.minutes/60)+t2.hours+t2.days*24+t2.months*31*24+t2.years*366*24;
        let cost=this.rawData.price[this.user_data.vehicle_data.user_type].h0+(this.rawData.price[this.user_data.vehicle_data.user_type].step*(hours-1));
        return cost;
    }

}
module.exports=costCalculator;

// let costcal=new costCalculator("TN45AC1111");
// console.log(costcal.deload());