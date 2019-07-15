'use strict';
const _ = require("lodash");
const SortedArray= require("sorted-array");
const arraySort = require('array-sort');
const moment=require('moment')
const Myimport=require('./src/imports');
const client=new Myimport().getRedisClient();

class vehiclehandler{
    constructor(data,db){
        this.data=data;
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
    
    async getUserData(){
        
        //actual DB Call
        let command = "select vehicle_data from user_table where vehicle_no=$1";
        let values = [this.data.vehicle_no];
        let result;
        await this.db
            .one(command,values)
            .then(async data => {
                result= data.vehicle_data;
                //await client.set(myId, JSON.stringify(result));
            })
            .catch(error => (console.log("ERROR:", error),result="On getting "+values+" we get error: "+error.detail));
        this.vehicle_data=result;
        await console.log(this.vehicle_data);
        return result;
    } 
      
    async load(){
        await console.log(this.vehicle_data);
        this.type=this.vehicle_data.vehicle_type;
        this.name=this.data.org_ID;
        let myId=this.name+this.type;
        
        let db=this.db;
        //console.log()
        let result= await this.fetch_current_space(myId);
        console.log(result,"###################");
        this.rawData=result.space_data;
        this.id=this.rawData.id;
        this.allocated_array=new SortedArray(this.rawData.allocated_array.array);
        this.unallocated_array=this.rawData.unallocated_array;
        

        await this.allocate();
        
        this.rawData.allocated_array=this.allocated_array;
        this.rawData.unallocated_array=this.unallocated_array;
        
        console.log(this.rawData);
        console.log(this.vehicle_pos);
        
        let command="Update space set space_data=$2 where space_id=$1";
        let values=[myId,this.rawData];
        
        await db
            .none(command,values)
            .then(async data=>{
                await client.del(myId);
                await client.set(myId,JSON.stringify({space_data:this.rawData}));
                result="successfully Updated";
                
            })
            .catch(error=>(console.log("ERROR:", error),result="On inserting "+values+" we get error: "+error.detail))
        
        //console.log(result);
        return this.vehicle_pos;
    }
    isfull(){
        if(this.rawData.Acount==this.rawData.Tcount){
            return true;
        }
        return false;
    }
    status(){
        console.log("\nStatus:\n")
        console.log(this.unallocated_array);
        console.log(this.allocated_array);
    }

    
    allocate(){
        if(!this.isfull() && this.unallocated_array.length>=1){
            this.allocated_array.insert(this.unallocated_array[0]);
            this.vehicle_pos=this.unallocated_array.shift();
            console.log("allocated at position ",this.vehicle_pos);
            console.log("capacity remaining: "+this.unallocated_array.length);
            this.rawData.UACount-=1;
            this.rawData.Acount+=1;
        }
        else{
            this.vehicle_pos={ f_id: 0, dist: 0, pos: 0 ,disLen:0};
        }
    }
}
module.exports=vehiclehandler;