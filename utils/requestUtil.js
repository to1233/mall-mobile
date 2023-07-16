import {
	config
} from 'process';
import Request from '../js_sdk/luch-request/request.js'

const http = new Request();

http.setConfig((config) => {
	/* 设置全局配置 */
	//config.baseUrl = 'http://portal-api.macrozheng.com' /* 根域名不同 */
	config.baseUrl = 'http://127.0.0.1:8201/mall-portal'
	config.header = {
		...config.header
	}
	return config
})

/**
 * 自定义验证器 如果返回true  则进入响应拦截器的响应成功函数(resolve) 否则进入响应器错误函数(reject)
 * @param {Number} status  请求响应体statusCode (只读)
 * @@return {Boolean} 如果为true 则 resolve 否则reject 
 */
http.validateStatus = (statusCode) => {
	return statusCode === 200
}

http.interceptor.request((config, cancel) => {
	/* 请求之前拦截器 */
	const token = uni.getStorageSync('token');
	console.log(token);
	if (token) {
		config.header = {
			'satoken': token,
			...config.header
		}
	} else {
		config.header = {
			...config.header
		}
	}
	return config
})

http.interceptor.response((response) => {
	/*请求之后拦截器*/
	const res = response.data;
	if (res.code != 200) {
		//提示错误信息
		uni.showToast({
			title: res.message,
			duration: 1500
		})

		// 401 未登录处理
		if (res.code === 401) {
			uni.showModal({
				title: '提示',
				content: '你已经被登出,可以取消继续留在该页面,或者重新登录',
				confirmText: '重新登录',
				cancelText: '取消',
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/public/login'
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
		return Promise.reject(response);
	} else {
		return response.data;
	}
}, (response) => {
// 提示错误信息
console.log('response error', response);
uni.showToast({
	title: response.errMsg,
	duration: 1500
})
return Promise.reject(response);
})

export function request(options = {}) {
	return http.request(options);
}

export default request;