import axios from "axios";

const token = localStorage.getItem('access_token')

const clienteMongoAxios = axios.create({
  
    baseURL: `${import.meta.env.VITE_MONGO_URL}`
})
// axios.interceptors.request.use(function (config) {
//     if(token) {
//         config.headers.set('Authorization', `Bearer ${token}`);
//     }

//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

export default clienteMongoAxios;