<template>
	<view class="container">
		
		<!-- 空白页 -->
		<view v-if="!hasLogin || brandList.length === 0" class="empty">
			<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png">
			</u-empty>
		</view>
		
		<!-- 品牌列表 -->
		<view class="hot-section">
			<view v-for="(item,index) in brandList" :key="index" class="guess-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.brandLogo" mode="aspectFit"></image>
				</view>
		
				<view class="txt">
					<text class="title clamp">{{item.brandName}}</text>
				</view>
			</view>
		</view>
		
		
	</view>
	
	
	
</template>

<script>
	import {
		mapState
	} from 'vuex';
	

	import {
		formatDate
	} from '@/utils/date';
	import {
		fetchBrandAttentionList,
		clearBrandAttention
	} from '@/api/memberBrandAttention.js';
	export default {
		data() {
			return {
				loadingType: 'more',
				brandList: [],
				searchParam: {
					pageNum: 1,
					pageSize: 6
				}
			};
		},
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
		//加载更多
		onReachBottom() {
			this.searchParam.pageNum++;
			this.loadData();
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			let thisObj = this;
			if (index === 0) {
				uni.showModal({
				    title: '提示',
				    content: '是否要清空所有浏览记录？',
				    success: function (res) {
				        if (res.confirm) {
				            clearBrandAttention().then(response=>{
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
					this.brandList = [];
				}
				fetchBrandAttentionList(this.searchParam).then(response => {
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
						this.brandList = this.brandList.concat(dataList);
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
				let id = item.brandId;
				uni.navigateTo({
					url: `/pages/brand/brandDetail?id=${id}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}
	
	.hot-section {
		display: flex;
		flex-wrap: wrap;
		margin-top: 16upx;
	
		.guess-item {
			display: flex;
			flex-direction: row;
			width: 100%;
			padding: 0 30upx;
			margin-bottom: 16upx;
			background-color: #fff;
			align-items: center;
		}
	
		.image-wrapper {
			width: 30%;
			height: 170upx;
			border-radius: 3px;
			overflow: hidden;
			background: #fff;
	
			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
	
		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
	
	
		.txt {
			width: 70%;
			display: flex;
			flex-direction: row;
			padding-left: 40upx;
			align-items: center;
		}
	}
	
	
	
	
</style>