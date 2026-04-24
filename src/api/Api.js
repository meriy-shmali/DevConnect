import axios from "axios";
const api=axios.create({
    baseURL:"https://devconnect-vbiy.onrender.com",
    timeout: 60000,
}) //باتسخدام التوكين كل طلب للباك بينرسل معه التوكين ليعرف انو هاد المستخدم بدو يعمل شي ما
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("access")
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
})
export default api