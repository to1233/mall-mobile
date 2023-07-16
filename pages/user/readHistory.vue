<template>
	<view class="container">

		<!-- 空白页 -->
		<view v-if="!hasLogin || productList.length === 0" class="empty">
			<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png">
			</u-empty>
		</view>

		<!-- 浏览历史 -->
		<ProductListWithTime :productList="productList" @scrolltolower="scrolltolower"></ProductListWithTime>

		<u-loadmore :status="loadingType" />
	</view>


</template>

<script>

	import {
		mapState
	} from 'vuex';

	import {
		fetchReadHistoryList,
		clearReadHistory
	} from '@/api/memberReadHistory.js';
	
	import ProductListWithTime from '@/components/product-list-with-time.vue';

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
		components: {
			ProductListWithTime
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
	
		methods: {
			// 下滑到底部
			scrolltolower() {
				this.searchParam.pageNum++;
				this.loadData();
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
	
			stopPrevent() {}

		}
	}
</script>

<style lang="scss">
	.container {
	}
</style>