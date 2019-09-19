// import * as api from './api';
// export default api;

import Vue from 'vue'
import axios from 'axios';
import qs from 'qs';
Vue.prototype.$axios=axios;

let base = 'http://web.51g4.com/admin';//测试环境

axios.defaults.timeout = 6000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded' ;
axios.defaults.headers.post['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' ;
axios.defaults.withCredentials = true ;//用axios发送post请求自动set cookie

//通用方法
export const POST = (url, params) => {
  return axios.post(`${base}${url}`, qs.stringify(params)).then(res => res.data)
}

export const GET = (url, params) => {
  return axios.get(`${base}${url}`, {params: params}).then(res => res.data)
}

export const PUT = (url, params) => {
  return axios.put(`${base}${url}`, params).then(res => res.data)
}

export const DELETE = (url, params) => {
  return axios.delete(`${base}${url}`, {params: params}).then(res => res.data)
}

export const PATCH = (url, params) => {
  return axios.patch(`${base}${url}`, params).then(res => res.data)
}


