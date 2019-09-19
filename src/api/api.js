import Vue from 'vue'
import axios from 'axios';
import qs from 'qs';
import util from './util.js'
import router from '../router/index.js'
import { MessageBox } from 'element-ui'

Vue.prototype.$axios=axios;
if(util.changHost().indexOf('g3wei')<0){
      var base = 'http://web.51g4.com';//测试环境
}else{
	var base = '//' + document.domain;//线上
}
let baseUrl = base + '/admin';
axios.defaults.timeout = 6000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded' ;
axios.defaults.headers.post['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' ;
axios.defaults.withCredentials = true ;//用axios发送post请求自动set cookie

if(util.changHost().indexOf('g3wei')>0){
// http response 服务器响应拦截器，
axios.interceptors.response.use(
  response => {
      if(response.config.url == baseUrl + '/login' || response.config.url == baseUrl + '/logout'){
        return response;
      }else if(util.getCookie('ad_auth') == null || response.data.msg == 'FAILED_LOGIN'){
          MessageBox.alert('您已下线，请重新登录', '下线提示', {
            confirmButtonText: '确定',
            callback: action => {
              router.push({ path:'/login'})
            }
          });
      }else{
        return response;
      }
    },
  error => {
      return Promise.reject(error.response) 
});
}

export const DomainName  = { url : baseUrl , domain: base};
export const login = params => {
	return axios.post(`${baseUrl}/login`, qs.stringify(params)).then(rs => rs.data);
};
export const logout = params => {
	return axios.post(`${baseUrl}/logout`, qs.stringify(params)).then(rs => rs.data);
};

//用户 -- 用户列表
export const userList = params => {
	return axios.post(`${baseUrl}/user/list`,qs.stringify(params)).then(rs => rs.data);
}


//用户 -- 配置列表
export const userconfigList = params => {
	return axios.post(`${baseUrl}/userconfig/list`,qs.stringify(params)).then(rs => rs.data);
}

//用户 -- 语言列表
export const userlanguageList = params => {
	return axios.post(`${baseUrl}/userlanguage/list`,qs.stringify(params)).then(rs => rs.data);
}
export const userlanguageDel = params => {
	return axios.post(`${baseUrl}/userlanguage/delete`,qs.stringify(params)).then(rs => rs.data);
}

//用户 -- 模板列表
export const usertemplateList = params => {
	return axios.post(`${baseUrl}/usertemplate/list`,qs.stringify(params)).then(rs => rs.data);
}

//用户 -- 新增用户模板
export const usertemplateAdd = params => {
	return axios.post(`${baseUrl}/usertemplate/add`,qs.stringify(params)).then(rs => rs.data);
}
//用户 -- 编辑用户模板
export const usertemplateEdit = params => {
	return axios.post(`${baseUrl}/usertemplate/edit`,qs.stringify(params)).then(rs => rs.data);
}
//用户 -- 删除用户模板
export const usertemplateDel = params => {
	return axios.post(`${baseUrl}/usertemplate/delete`,qs.stringify(params)).then(rs => rs.data);
}
//用户状态
export const userStatus = params => {
	return axios.post(`${baseUrl}/user/status`,qs.stringify(params)).then(rs => rs.data);
}

//用户期限--过期时间
export const userExpired = params => {
	return axios.post(`${baseUrl}/user/expired`,qs.stringify(params)).then(rs => rs.data);
}

//域名列表
export const domainList = params => {
	return axios.post(`${baseUrl}/domain/list`,qs.stringify(params)).then(rs => rs.data);
}

//解析状态
export const domainResolution = params => {
	return axios.post(`${baseUrl}/domain/resolution`,qs.stringify(params)).then(rs => rs.data);
}

//编辑域名
export const domainEdit = params => {
	return axios.post(`${baseUrl}/domain/edit`,qs.stringify(params)).then(rs => rs.data);
}

//编辑域名
export const domainDel = params => {
	return axios.post(`${baseUrl}/domain/delete`,qs.stringify(params)).then(rs => rs.data);
}
//SEO
export const seoList = params => {
	return axios.post(`${baseUrl}/seo/list`,qs.stringify(params)).then(rs => rs.data);
}
export const seoDel = params => {
	return axios.post(`${baseUrl}/seo/delete`,qs.stringify(params)).then(rs => rs.data);
}
export const seoVerify = params => {
	return axios.post(`${baseUrl}/seo/verify`,qs.stringify(params)).then(rs => rs.data);
}
export const seoPush = params => {
	return axios.post(`${baseUrl}/seo/push`,qs.stringify(params)).then(rs => rs.data);
}
//api列表
export const apiList = params => {
	return axios.post(`${baseUrl}/api/list`, qs.stringify(params)).then(rs => rs.data)
}

//模板管理列表
export const templateList = params => {
	return axios.post(`${baseUrl}/template/list`,qs.stringify(params)).then(rs => rs.data);
}

//颜色列表
export const colorList = params => {
	return axios.post(`${baseUrl}/color/list`, qs.stringify(params)).then(rs => rs.data)
}
export const colorDel = params => {
	return axios.post(`${baseUrl}/color/delete`, qs.stringify(params)).then(rs => rs.data)
}

export const industryList = params => {
	return axios.post(`${baseUrl}/industry/list`, qs.stringify(params)).then(rs => rs.data)
}
export const industryDel = params => {
	return axios.post(`${baseUrl}/industry/delete`, qs.stringify(params)).then(rs => rs.data)
}

// 新增模板
export const templateAdd = params => {
	return axios.post(`${baseUrl}/template/add`, qs.stringify(params)).then(rs => rs.data)
}

export const colorUpdate = params => {
	return axios.post(`${baseUrl}/color/update`, qs.stringify(params)).then(rs => rs.data)
}

export const colorAdd = params => {
	return axios.post(`${baseUrl}/color/add`, qs.stringify(params)).then(rs => rs.data)
}

// 小程序
export const minAppAdd = params => {
	return axios.post(`${baseUrl}/app/add`, qs.stringify(params)).then(rs => rs.data)
}

export const appList = params => {
	return axios.post(`${baseUrl}/app/list`,qs.stringify(params)).then(rs => rs.data);
}

export const minAppDel = params => {
	return axios.post(`${baseUrl}/app/delete`, qs.stringify(params)).then(rs => rs.data)
}

export const minAppEdit = params => {
	return axios.post(`${baseUrl}/app/edit`, qs.stringify(params)).then(rs => rs.data)
}

export const minAppEdit1 = function (data) {
	return axios({
		method: 'post',
		url: `${baseUrl}/app/edit`,
		timeout: 20000,
		data: data,
	  })
}

//新增分类
export const industryAdd = params => {
	return axios.post(`${baseUrl}/industry/add`, qs.stringify(params)).then(rs => rs.data)
}
//修改分类
export const industryEdit = params => {
	return axios.post(`${baseUrl}/industry/edit`, qs.stringify(params)).then(rs => rs.data)
}

//oss 参数信息
export const ossGet = params => {
	return axios.post(`${baseUrl}/oss/get`, qs.stringify(params)).then(rs => rs.data)
}

//删除模板
export const templateDel = params => {
	return axios.post(`${baseUrl}/template/delete`, qs.stringify(params)).then(rs => rs.data)
}

//修改颜色
export const colorEdit = params => {
	return axios.post(`${baseUrl}/color/edit`, qs.stringify(params)).then(rs => rs.data)
}

//用户语言列表
export const userLangList = params => {
	return axios.post(`${baseUrl}/userlanguage/list`, qs.stringify(params)).then(rs => rs.data)
}

//用户语言增加
export const userLangAdd = params => {
	return axios.post(`${baseUrl}/userlanguage/add`, qs.stringify(params)).then(rs => rs.data)
}

//用户语言修改
export const userLangEdit = params => {
	return axios.post(`${baseUrl}/userlanguage/edit`, qs.stringify(params)).then(rs => rs.data)
}

//语言列表
export const LangList = params => {
	return axios.post(`${baseUrl}/language/list`, qs.stringify(params)).then(rs => rs.data)
}

//语言增加
export const LangAdd = params => {
	return axios.post(`${baseUrl}/language/add`, qs.stringify(params)).then(rs => rs.data)
}


//语言编辑
export const LangEdit = params => {
	return axios.post(`${baseUrl}/language/edit`, qs.stringify(params)).then(rs => rs.data)
}

//语言删除
export const LangDel = params => {
	return axios.post(`${baseUrl}/language/delete`, qs.stringify(params)).then(rs => rs.data)
}

//语言删除
export const templateEdit = params => {
	return axios.post(`${baseUrl}/template/edit`, qs.stringify(params)).then(rs => rs.data)
}











