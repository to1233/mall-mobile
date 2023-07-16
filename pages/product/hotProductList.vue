<template>

	<!-- 产品上新页面-->
	<view class="container">
		<view class="top-image">
			<view class="image-wrapper">
				<image src="/static/hot_product_banner.png" mode="aspectFill"></image>
			</view>
		</view>
		
		

		<u-gap height="10"></u-gap>


		<view class="brand-box">
			<u-row justify="center" customStyle="margin-bottom: 10px">
				相关产品
			</u-row>
			

			<view class="brand_body">
				<u-grid :border="false" col="2">
					<u-grid-item v-for="(item,baseListIndex) in productList" :key="baseListIndex">
						<view class="brand_body_item" @click="navToDetailPage(item)">
							<u-image width="170px" height="165px" :src="item.pic"></u-image>

							<text class="title clamp">{{item.name}}</text>
							<text class="title2">{{item.subTitle}}</text>
							<view class="price-box">
								<text class="price">￥{{item.price}}</text>
								<text>已售 {{item.sale}}</text>
							</view>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>

		<u-loadmore :status="loadingType" />

	</view>
</template>

<script>
	import {
		fetchHotProductList
	} from '@/api/home.js';
	
	import ProductListWithSale from '@/components/product-list-with-sale.vue';
	
	export default {
		data() {
			return {
				loadingType: 'more', //加载更多状态
				productList: [],
				searchParam: {
					pageNum: 1,
					pageSize: 6
				}
			};
		},
		components:{
			ProductListWithSale
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
				fetchHotProductList(this.searchParam).then(response => {
					let productList = response.data;
					if (response.data.length === 0) {
						//没有更多了
						this.loadingType = 'nomore';
						this.searchParam.pageNum--;
					} else {
						if (response.data.length < this.searchParam.pageSize) {
							this.loadingType = 'nomore';
							this.searchParam.pageNum--;
						} else {
							this.loadingType = 'more';
						}
						this.productList = this.productList.concat(productList);
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
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {}
		},
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


		.brand-box {
			padding: 16px;
			background: #fff;


			.brand-story-detail {
				font-size: 13px;
				color: #909399;
			}
		}


		// 对应的分类下的元素主体
		.brand_body {
			padding: 0 30rpx;
			background: #fff;

			// 重写对应的样式
			.u-grid-item {
				align-items: normal;
			}

			// 自定义slot 元素
			.brand_body_item {
				margin-right: 4%;
				padding-bottom: 20rpx;
			}


			.price-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-right: 10upx;
				font-size: 24upx;
				color: $font-color-light;

				display: flex;
				align-items: center;
				justify-content: space-between;



				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					line-height: 80upx;
				}
			}


			.title {
				font-size: 16px;
				color: #303133;
				line-height: 40px;
			}

			.title2 {
				font-size: 13px;
				color: #909399;
				line-height: 22px;
				height: 44px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: block;
			}
		}
	}
</style>