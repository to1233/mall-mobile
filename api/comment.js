import request from '@/utils/requestUtil.js'


/**
 * 分页查询对应的产品评论集合
 * @param {Object} params 产品id
 */
export function fetchCommentList(params) {
	return request({
		method: 'GET',
		url: '/comment/list',
		params: params
	})
}

/**
 * 查询对应的产品下的最新的评论信息
 * @param {Object} productId 产品id
 */
export function findLastComment(productId) {
	return request({
		method: 'GET',
		url: '/comment/findLastCommentWithProduct',
		params: {productId}
	})
}


/**
 * 创建用户的评论信息
 * @param {Object} commentInfo 创建的评论信息
 */
export function createComment(commentInfo) {
	return request ({
		method: 'POST',
		url: '/comment/createComment',
		data: commentInfo
	})
}