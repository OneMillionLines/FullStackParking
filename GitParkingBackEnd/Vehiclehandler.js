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
      
    
    isfull(){
        if(this.rawData.Acount==this.rawData.Tcount){
            return true;
        }
        return false;
    }

    async deload(){
        let command="select time_val,vehicle_data from user_table where vehicle_no=$1"
        let values=[this.data.vehicle_no];
        this.user_data='';

        await this.db
            .one(command,values)
            .then(data=>{
                this.user_data=data;
            })
            .catch(error=>(console.log("ERROR:", error)));//,result="On inserting "+values+" we get error: "+error.detail))
        
        this.myId=this.user_data.vehicle_data.org_ID+this.user_data.vehicle_data.vehicle_type;
        
        let result= await this.fetch_current_space(this.myId);
        console.log(result);

        this.rawData=result.space_data;
        this.id=this.rawData.id;
        this.allocated_array=new SortedArray(this.rawData.allocated_array.array);
        this.unallocated_array=this.rawData.unallocated_array;

        let cost=this.calcPrice();
        await this.deallocate();
        
        this.rawData.allocated_array=this.allocated_array;
        
        console.log(this.rawData);
        
        await this.removeUserData();
        await this.updateSpace();
        return cost;
    }
    deallocate(){
        this.allocated_array.remove(this.user_data.vehicle_data.vehicle_pos);
        this.unallocated_array.unshift(this.user_data.vehicle_data.vehicle_pos);
        //console.log("allocated at position ",this.vehicle_pos);
        this.rawData.unallocated_array=arraySort(this.unallocated_array,['f_id','disLen','dist','pos']);
        console.log("capacity remaining: "+this.unallocated_array.length);
        this.rawData.UACount+=1;
        this.rawData.Acount-=1;
    }

    async removeUserData(){
        let vehicle_data=this.user_data.vehicle_data;
        delete vehicle_data.vehicle_pos;
        delete vehicle_data.notify_count;
        delete vehicle_data.type;
        delete vehicle_data.org_ID;
        let command="UPDATE user_table set vehicle_data = $2 where vehicle_no=$1";
        let values=[this.data.vehicle_no,vehicle_data];
        await this.db
            .none(command,values)
            .then(data=>{
                console.log("Deleted user successfully after deallocation")
            })
            .catch(error=>(console.log("ERROR in deleting user in dealloc:", error)));//,result="On inserting "+values+" we get error: "+error.detail))

    }
    async calcPrice(){

        let t1=this.user_data.time_val;
        let t2=moment.duration(moment().diff(t1))._data;
        let hours=Math.ceil(t2.minutes/60)+t2.hours+t2.days*24+t2.months*31*24+t2.years*366*24;
        console.log(t1,t2,hours);
        let cost=this.rawData.price[this.user_data.vehicle_data.user_type].h0+(this.rawData.price[this.user_data.vehicle_data.user_type].step*(hours-1));
        return cost;
    }

    async updateSpace(){
        let command="update space set space_data =$2 where space_id=$1";
        let values=[this.myId,this.rawData];
        await this.db
            .none(command,values)
            .then(data=>{
                console.log("Updated space successfully after deallocation")
            })
            .catch(error=>(console.log("ERROR in update space in dealloc:", error)));//,result="On inserting "+values+" we get error: "+error.detail))
    }

    
}
module.exports=vehiclehandler;