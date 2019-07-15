'use strict';


var space=new Vue({
	el:'#space',
	data: {
		org_ID:'',
		org_name:'',
		Number_of_Floors:1,
    propo:{
      "car":3,
      "bike":1,
      "van":6
      },
		to_display:false,
    floor_descr: [],
    vehicle_type:'',
    floor_id:[],
    display_floor:false,
    
	},
  
    

	methods: {
    submit: async function (event) {
      
      console.log(this.floor_id);
      const url = `http://localhost:5000/user`;
      axios
                .post(url,inp)
                .then(res=>{
                	console.log(res.data);
                    this.to_display=true;
                    // this.floor=res.data.f_id;
                    // this.distribution=res.data.dist;
                    // this.position=res.data.pos;
                })
                .catch(error=>{
                    console.log(error)
                });
    },
    generate_floor: async function(){
      console.log('asaaaaaa');
       _.each(_.range(1,this.Number_of_Floors+1),val=>{
          this.floor_id.push(val);
       })
       this.display_floor=true;
    }
  }
});
