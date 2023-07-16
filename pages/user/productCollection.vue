<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || productList.length === 0" class="empty">
			<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png">
			</u-empty>
		</view>
		<view v-else>
			<!-- 浏览历史 -->
			<ProductListWithTime :productList="productList" @scrolltolower="scrolltolower"></ProductListWithTime>
			
		</view>

		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		formatDate
	} from '@/utils/date';

	import {
		mapState
	} from 'vuex';

	import {
		fetchProductCollectionList,
		clearProductCollection
	} from '@/api/memberProductCollection.js';
	
	import ProductListWithTime from '@/components/product-list-with-time.vue';
	
	
	export default {
		components: {
			uniLoadMore,
			ProductListWithTime
		},
		data() {
			return {
				loadingType: 'more',
				productList: [],
				searchParam: {
					pageNum: 1,
					pageSize: 6
				}
			};
		},

		// 监控 store
		computed: {
			...mapState(['hasLogin'])
		},
		onLoad(options) {
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			let thisObj = this;
			if (index === 0) {
				uni.showModal({
					title: '提示',
					content: '是否要清空所有浏览记录？',
					success: function(res) {
						if (res.confirm) {
							clearProductCollection().then(response => {
								thisObj.loadData('refresh');
							});
						}
					}
				});
			}
		},
		// #endif
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
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}

				if (type === 'refresh') {
					this.searchParam.pageNum = 1;
					this.productList = [];
				}
				fetchProductCollectionList(this.searchParam).then(response => {
					let dataList = response.data.list;
					if (dataList.length === 0) {
						//没有更多了
						this.loadingType = 'nomore';
						this.searchParam.pageNum--;
					} else {
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
			//详情
			navToDetailPage(item) {
				let id = item.productId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			// 下滑到底部
			scrolltolower() {
				this.loadData()
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	.container {

		.product-collection {

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