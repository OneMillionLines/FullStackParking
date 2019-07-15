'use strict';


var park=new Vue({
	el:'#park',
	data: {
		vehicle_no:'',
		org_ID:'',
		to_display:false,
		floor:'',
		distribution:'',
		position:'',
	},
	methods: {
    allocate: async function (event) {

    	if(this.vehicle_no!='' && this.org_ID!=''){
	      	const inp={"vehicle_no":this.vehicle_no,"org_ID":this.org_ID,"type":"allocate"};
	      
	      	const url = `http://localhost:5000/user`;
	      	axios
	            .put(url,inp)
	            .then(res=>{
	            	console.log(res);
	                console.log(res.data);
	                this.to_display=true;
	                this.floor=res.data.f_id;
	                this.distribution=res.data.dist;
	                this.position=res.data.pos;
	            })
	            .catch(error=>{
	                console.log(error)
	            });	
      	}
      	else{
      		alert('vehicle_no,org_ID should not be empty');
      	} 
    },
    reserve: async function (event) {

    	if(this.vehicle_no!='' && this.org_ID!=''){
	      	const inp={"vehicle_no":this.vehicle_no,"org_ID":this.org_ID,"type":"reserve"};
	      
	      	const url = `http://localhost:5000/user`;
	      	axios
	            .put(url,inp)
	            .then(res=>{
	            	console.log(res);
	                console.log(res.data);
	                this.to_display=true;
	                this.floor=res.data.f_id;
	                this.distribution=res.data.dist;
	                this.position=res.data.pos;
	            })
	            .catch(error=>{
	                console.log(error)
	            });	
      	}
      	else{
      		alert('vehicle_no,org_ID should not be empty');
      	} 
    },
    alloc_reserve: async function (event) {

    	if(this.vehicle_no!='' && this.org_ID!=''){
	      	const inp={"vehicle_no":this.vehicle_no,"org_ID":this.org_ID,"type":"alloc_reserve"};
	      
	      	const url = `http://localhost:5000/user`;
	      	axios
	            .put(url,inp)
	            .then(res=>{
	            	console.log(res);
	                console.log(res.data);
	                this.to_display=true;
	                this.floor=res.data.f_id;
	                this.distribution=res.data.dist;
	                this.position=res.data.pos;
	                alert('updated');
	            })
	            .catch(error=>{
	                console.log(error)
	            });	
      	}
      	else{
      		alert('vehicle_no,org_ID should not be empty');
      	} 
    },
  }
});