<template>
	<view class="u-page">
		<!-- 评论列表-->

		
		<scroll-view class="list-scroll-content" scroll-y>
			<view class="comment-list">
				<u-list @scrolltolower="scrolltolower">
					<u-list-item v-for="(item, index) in commentList" :key="index">

						<view class="itemBox">
							<u-row>
								<u-col :span="2">
									<u-avatar src="https://cdn.uviewui.com/uview/album/1.jpg"></u-avatar>
								</u-col>
								<u-col :span="2">
									<view>{{item.memberName}}</view>
								</u-col>

								<u-col :span="3.5" offset="5" class="comment-desc">
									<view>{{item.createDay}}</view>
								</u-col>
							</u-row>


							<!-- 商品属性-->
							<u-row class="row-span comment-desc">
								<view>
									款式:{{item.productAttr}}
								</view>
							</u-row>

							<!-- 用户评价-->
							<u-row class="row-span">
								<view>
									{{item.descContent}}
								</view>
							</u-row>

							<u-row class="row-span">
								<u-album :urls="item.urlList | urlListInfo" maxCount="6" multipleSize="100"></u-album>
							</u-row>
						</view>
					</u-list-item>
				</u-list>
			</view>
		</scroll-view>
		<u-loadmore :status="loadingType" />
	</view>

</template>

<script>
	import {
		fetchCommentList
	} from '@/api/comment.js';

	export default {
		data() {
			return {
				albumWidth: 0,
				commentList: [],
				queryParam: {
					productId: 1,
					pageNum: 1,
					pageSize: 5,
					sourceType: 0 , // 0 表示来源为用户设置界面 1 表示 来源为产品集合
				},
				
				loadingType: 'more',
			}
		},
		onLoad(options) {
			//  该商品下的评论信息
			if (options.productId != undefined) {
				this.queryParam.productId = options.productId;
				this.queryParam.sourceType = 1;
			} 
			this.showCommentList('refresh');
		},
		filters: {
			urlListInfo(urlListItem) {
				if (urlListItem == null || urlListItem.length <= 0) {
					return [];
				}
				return urlListItem.map(item => {
					return item.url;
				})
			},
		},
		methods: {
			scrolltolower() {
				this.queryParam.pageNum++;
				this.showCommentList();
			},
			// 展示对应商品下的评论信息
			async showCommentList(type = 'add', loading) {
				// 没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
				}

				if (type === 'refresh') {
					this.queryParam.pageNum = 1;
					this.commentList = [];
				}

				
				fetchCommentList(this.queryParam).then(response => {
					let commentList = response.data.list;
					if (response.data.list.length == 0) {
						this.loadingType = 'nomore';
						this.queryParam.pageNum--;
					} else {

						if (response.data.list.length < this.queryParam.pageSize) {
							this.loadingType = 'nomore';
							this.queryParam.pageNum--;
						} else {
							this.loadingType = 'more';
						}
						this.commentList = this.commentList.concat(commentList);
					}

					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh();
						}
					}
				});
			}
		}

	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.u-page {

		padding: 0 40rpx;

		.itemBox {
			background: #fff;
			padding: 24rpx 24rpx;
			border-radius: 20rpx;
			overflow: hidden;
			margin-top: 24rpx;
			justify-content: space-around;
			align-content: center;


			margin-top: 11px;
			background-color: #fff;
		}

		// 间隔
		.row-span {
			margin-top: 20rpx;
		}

		.comment-desc {
			font-size: 12px;
			color: #909090;
		}



		/* .album {
			@include flex;
			align-items: flex-start;

			&__avatar {
				background-color: $u-bg-color;
				padding: 5px;
				border-radius: 3px;
			}

			&__content {
				margin-left: 10px;
				flex: 1;
			}
		} */

	}
</style>