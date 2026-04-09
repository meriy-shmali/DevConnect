import axios from "axios";

// وظيفة تحديث بيانات الحساب
export const updateaccountreq = (data) => {
    return axios.post("YOUR_API_ENDPOINT_HERE/update", data);
};

// وظيفة جلب بيانات الحساب (إذا كنتِ ستحتاجينها لاحقاً)
export const getaccountdatareq = () => {
    return axios.get("YOUR_API_ENDPOINT_HERE/profile");
};

export const sendotpreq = (email) => {
    return axios.post("YOUR_API_ENDPOINT_HERE/forgot-password",{email});
};
export const logoutreq = () => {
    return axios.post("YOUR_API_ENDPOINT_HERE/logout");
};
 export const resetpasswordreq = (data) => {
    return axios.post("YOUR_API_ENDPOINT_HERE/reset-password",data);
};