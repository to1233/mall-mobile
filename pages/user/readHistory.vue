<template>
	<view class="container">

		<!-- 空白页 -->
		<view v-if="!hasLogin || productList.length === 0" class="empty">
			<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png">
			</u-empty>
		</view>


		<!-- 浏览历史 -->
		<view class="read-section">
			<u-list @scrolltolower="scrolltolower">
				<u-list-item v-for="(item, index) in productList" :key="index">

					<u-row class="read-item-box" @click="navToDetailPage(item)">
						<u-col :span="5">
							<u-image width="138px" height="138px" :src="item.productPic"></u-image>
						</u-col>
						<u-col :span="7" class="titleContent">

							<view class="title clamp">
								{{item.productName}}
							</view>

							<view class="title2 ">
								{{item.productSubTitle}}
							</view>

							<view style="display: flex;  justify-content: space-between;line-height: 44px;">
								<text class="price">￥{{item.productPrice}}</text>
								<text class="time">{{item.createTime | formatDateTime}}</text>
							</view>
						</u-col>


					</u-row>


				</u-list-item>
			</u-list>
		</view>

		<u-loadmore :status="loadingType" />
	</view>


</template>

<script>
	import {
		formatDate
	} from '@/utils/date';

	import {
		mapState
	} from 'vuex';

	import {
		fetchReadHistoryList,
		clearReadHistory
	} from '@/api/memberReadHistory.js';


	export default {
		data() {
			return {
				indexList: [],
				loadingType: 'more',
				productList: [],
				searchParam: {
					pageNum: 1,
					pageSize: 6
				}
			}
		},
		// 监控 store
		computed: {
			...mapState(['hasLogin'])
		},
		onLoad() {
			this.loadmore()
		},
		// #ifdef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			let thisObj = this;
			if (index === 0) {
				uni.showModal({
					title: '提示',
					content: '是否要清空所有的浏览记录？',
					success: function(res) {
						if (res.confirm) {
							clearReadHistory().then(response => {
								thisObj.loadData('refresh');
							});
						}
					}
				})
			}
		},
		// #endif
		onLoad(options) {
			this.loadData();
		},
		// 下拉刷新 加载更多
		onPullDownRefresh() {
			this.searchParam.pageNum++;
			this.loadData();
		},
		filters: {
			formatDateTime(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
		},
		methods: {
			// 下滑到底部
			scrolltolower() {
				this.loadData()
			},
			// 加载商品 带下拉刷新和下滑加载
			async loadData(type = 'add', loading) {
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
					this.searchParam.pageNum = 1;
					this.productList = [];
				}

				fetchReadHistoryList(this.searchParam).then(response => {
					let dataList = response.data.list;
					if (dataList.length === 0) {
						// 没有更多了
						this.loadingType = 'nomore';
						this.searchParam.pageNum--;
					} else {
						// 累计数据
						if (dataList.length < this.searchParam.pageSize) {
							this.loadingType = 'nomore';
							this.searchParam.pageNum--;
						} else {
							this.loadingType = 'more';
						}
						this.productList = this.productList.concat(dataList);
					}

					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh();
						}
					}
				});
			},
			// 详情
			navToDetailPage(item) {
				console.log(item);
				let id = item.productId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {}

		}
	}
</script>

<style lang="scss">
	.container {

		.read-section {
			padding: 0 30upx;
			margin-top: 16upx;


			.read-item-box {
				margin-top: 16upx;
			}



			.titleContent {
				display: flex;
				flex-direction: column;
				line-height: 44px;

				.title2 {
					font-size: 13px;
					color: #303133;
					line-height: 40upx;
					height: 44px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: block;
				}

				.time {
					font-size: $font-sm;
					color: $font-color-dark;
					line-height: 80upx;
				}

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					line-height: 80upx;
				}

			}
		}
	}
</style>