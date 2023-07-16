<template>
	<view class="container">
		<view class="top-image">
			<view class="image-wrapper">
				<image src="/static/recommend_brand_banner.png" mode="aspectFill"></image>
			</view>
		</view>

		<view>
			<u-row justify="center" customStyle="margin-bottom: 10px">
				相关品牌
			</u-row>

			<view class="brand_body">
				<view>
					<u-grid :border="false" col="2">
						<u-grid-item v-for="(item,baseListIndex) in brandList" :key="baseListIndex"
							@click="navToDeailPage(item)">
							<view class="brand_body_item">
								<u-image width="150px" height="150px" :src="item.logo" mode="aspectFit"></u-image>
								<view class="brand_item_info">
									<text class="title clamp">{{item.name}}</text>
									<text class="title2">商品数量：{{item.productCount}}</text>
								</view>
							</view>

						</u-grid-item>
					</u-grid>
					<u-toast ref="uToast" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import {
		fetchBrandProductList,
		fetchBrandRecommendList
	} from '@/api/brand.js';
	
	
	export default {
		data() {
			return {
				loadingType: 'more', // 加载更多状态
				brandList: [],
				searchParam: {
					pageNum: 1,
					pageSize: 6
				}
			};
		},
		
		onLoad(options) {
			this.loadData();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh')
		},
		// 加载更多
		onReachBottom() {
			this.searchParam.pageNum++;
			this.loadData();
		},
		methods: {
			// 加载商品, 带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				// 没有更多直接返回
				if (type == -'add') {
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
				fetchBrandRecommendList(this.searchParam).then(response => {
					let prandList = response.data;
					if (response.data.length === 0) {
						// 没有更多了
						this.loadingType = 'nomore';
						this.searchParam.pageNum--;
					} else {
						if (response.data.length < this.searchParam.pageNum.pageSize) {
							this.loadingType = 'nomore';
							this.searchParam.pageNum--;
						} else {
							this.loadingType = 'more';
						}
						this.brandList = this.brandList.concat(prandList);
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
			navToDeailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/brand/brandDetail?id=${id}`
				})
			},
			stopPrevent() {}
		}
	}
	
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}


	.container {

		// 页面头部图片
		.top-image {
			height: 200px;

			.image-wrapper {
				display: flex;
				justify-content: center;
				align-content: center;
				width: 100%;
				height: 100%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}


		// 对应的分类下的元素主体
		.brand_body {
			padding: 0 30rpx;

			// 重写对应的样式
			.u-grid-item {
				align-items: normal;
			}

			// 自定义slot 元素
			.brand_body_item {
				margin-right: 4%;
				padding-bottom: 20rpx;
			}

			.price {
				font-size: $font-lg;
				color: $uni-color-primary;
				line-height: 80upx;
			}

			.title {
				font-size: 16px;
				color: #303133;
				line-height: 40px;
			}

			.title2 {
				font-size: 12px;
				color: #909399;
				line-height: 20px;
				height: 40px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: block;
			}
		}



	}
</style>