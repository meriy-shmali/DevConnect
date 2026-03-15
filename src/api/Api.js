import axios from "axios";
const api=axios.create({
    baseURL:""
}) //باتسخدام التوكين كل طلب للباك بينرسل معه التوكين ليعرف انو هاد المستخدم بدو يعمل شي ما
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token")
    if(token){
        config.headers.Authorization=`Bearer${token}`
    }
    return config
})
export default api