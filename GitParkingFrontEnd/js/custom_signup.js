'use strict';


var contact=new Vue({
	el:'#contact',
	data: {
		vehicle_no:'',
		vehicle_type:'',
		to_display:false,
		email_id:'',
		user_type:'',
		message:'',
	},
	methods: {
    submit: async function (event) {

    	if(this.vehicle_no!='' && this.vehicle_type!='' && this.email_id!=''&&this.user_type!=''){
	      	const inp={"vehicle_no":this.vehicle_no,"vehicle_type":this.vehicle_type,"email":this.email_id,"user_type":this.user_type};
	      
	      	const url = `http://localhost:5000/user`;
	      	axios
	            .post(url,inp)
	            .then(res=>{
	            	this.to_display=true;
	            	console.log(res);
	            	this.message=res.data;
	                console.log(res.data);
	            })
	            .catch(error=>{
	                console.log(error)
	            });	
      	}
      	else{
      		alert('vehicle_no,vehicle_type, should not be empty');
      	}

      
    }
  }
});