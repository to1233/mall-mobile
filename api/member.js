import request from '@/utils/requestUtil'

export function memberLogin(data) {
	return request({
		method: 'POST',
		url: '/sso/login',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: data
	})
}

export function memberInfo() {
	return request({
		method: 'GET',
		url: '/sso/info'
	})
}

/**
 *  注销登录清除后端缓存
 */
export function cleanCacheInfo(memberId) {
	return request({
		method: 'GET',
		url: '/sso/cleanCacheInfo/'+memberId
	})
}

