'use strict';

var checkout=new Vue({
	el:'#checkout',
	data: {
		vehicle_no:'',
		cost:'',
	},
	methods: {
    submit: async function (event) {
	  if(this.vehicle_no!=''){
	  	const inp={"vehicle_no":this.vehicle_no};
      	console.log(inp);

      	const url = `http://localhost:5000/user`;
      	axios
                .delete(url,{data:inp})
                .then(res=>{
                	console.log(res.data);
                    this.cost=res.data;
                })
                .catch(error=>{
                    console.log(error)
                });	
	  }
      
    }
  }
});
