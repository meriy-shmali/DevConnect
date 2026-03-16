
export const staticposts=[
    {
     id:1,
     user:{
    name:"Samer_hili",
    avatar:"/public/images/photo3.jpg",
    isfollowing:true
     },
     date:"2 hours ago" ,
     category:"question",
     text:"How can I optimize React performance?"  ,
     image:[],
     code:"",
     likes:"32",
     dislikes:"0",
     ideas:"2",
     problem:"0",
     comment:"67"

    },
    {
     id:2,
     user:{
     name:'Sara98',
     avatar:'/public/images/photo1.jpg',
     isfollowing:false 
     },
     date:"1 day",
     category:"project",
     text:"here is some of ui/ux",
     images:["/public/images/ui1.png","/public/images/ui2.png"] ,
     code:"",
      likes:"100;",
     dislikes:"7",
     ideas:"30",
     problem:"0",
     comment:"90"
    },
    {
     id:3,
     user:{
     name:'Tarek peter',
     avatar:'/public/images/photo3.jpg' ,
     isfollowing:false  
     },
     date:"7 hours ago",
     category:"problem",
     text:"my code gives error",
     images:[] ,
     code:`const fetchData = async () => {
 const res = await axios.get("/api");
 console.log(res.data)
 <p>hello</p>
 <div>welcome to our project</div>
 <div>welcome to our project</div>
 <div>welcome to our project</div>
 <div>welcome to our project</div>;
}`,
      likes:"10;",
     dislikes:"0",
     ideas:"30",
     problem:"9",
     comment:"20"
    }
]