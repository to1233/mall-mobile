<template>
	<!-- 品牌详情页面 -->
	<view class="container">
		<!-- 头部 -->

		<!--对应的头部图片-->
		<HeadImage :imageSrc="brand.bigPic"></HeadImage>

		<!--品牌描述-->
		<view class="brande-desc">
			<u-row>
				<u-col :span="4">
					<!-- 品牌图标-->
					<view class="brand-image">
						<image :src="brand.logo" mode="aspectFit" />
					</view>
				</u-col>

				<u-col :span="8">
					<u-row>
						<u-col :span="8">
							<u-row>
								{{brand.name}}
							</u-row>
							<u-row class="brand-subTitle">
								品牌首字母：{{brand.firstLetter}}
							</u-row>
						</u-col>

						<u-col :span="4">
							<view class="like-icon">
								<text class="yticon icon-shoucang" :class="{active: favoriteStatus}"
									@click="favorite()"></text>
							</view>

						</u-col>

					</u-row>
				</u-col>
			</u-row>
		</view>


		<u-gap height="10"></u-gap>

		<!-- 品牌故事-->
		<view class="brand-box">
			<u-row justify="center" customStyle="margin-bottom: 10px">
				品牌故事
			</u-row>

			<u-row class="brand-story-detail">
				<text>{{brand.brandStory}}</text>
			</u-row>

		</view>

		<u-gap height="10"></u-gap>

		<!-- 品牌商品描述 -->
		<view class="brand-box">
			<u-row justify="center" customStyle="margin-bottom: 10px;">
				相关产品
			</u-row>
			
			<ProductListWithSale :productList="productList"></ProductListWithSale>
		</view>

		<u-loadmore :status="loadingType" />


	</view>
</template>

<script>
	import {
		getBrandDetail,
		fetchBrandProductList
	} from '@/api/brand';


	import HeadImage from '@/components/head-image.vue';
	import ProductListWithSale from '@/components/product-list-with-sale.vue';
	
	import {
		createBrandAttention,
		deleteBrandAttention,
		brandAttentionDetail
	} from '@/api/memberBrandAttention.js';

	import {
		mapState
	} from 'vuex';


	export default {
		data() {
			return {
				loaded: false,
				brand: {},
				productList: [],
				loadingType: 'more',
				favoriteStatus: false,
				queryParam: {
					brandId: null,
					pageNum: 1,
					pageSize: 4
				}
			};
		},
		components: {
			ProductListWithSale,
			HeadImage
		},
		// 页面加载的时候
		onLoad(options) {
			this.loaded = true;
			let id = options.id;
			getBrandDetail(id).then(response => {
				this.brand = response.data;
				this.initBrandAttention();
			});
			this.queryParam.brandId = id;
			this.loadData('refresh');
		},
		computed: {
			...mapState(['hasLogin'])
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		// 加载更多
		onReachBottom() {
			this.queryParam.pageNum++;
			this.loadData();
		},
		methods: {
			favorite() {
				if (!this.checkForLogin()) {
					return;
				}
				if (this.favoriteStatus) {
					// 取消收藏
					deleteBrandAttention({
						brandId: this.brand.id
					}).then(response => {
						uni.showToast({
							title: '取消收藏成功！',
							icon: 'none'
						});
						this.favoriteStatus = !this.favoriteStatus;
					});
				} else {
					// 收藏
					let brandAttention = {
						brandId: this.brand.id,
						brandName: this.brand.name,
						brandLogo: this.brand.logo,
						brandCity: ""
					}

					createBrandAttention(brandAttention).then(response => {
						uni.showToast({
							title: '收藏成功！',
							icon: 'none'
						});
						this.favoriteStatus = !this.favoriteStatus;
					});
				}
			},
			// 详情
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			// 加载商品 带下拉刷新和上划加载
			async loadData(type = 'add', loading) {
				// 没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}

				if (type == 'refresh') {
					this.queryParam.pageNum = 1;
					this.productList = [];
				}
				fetchBrandProductList(this.queryParam).then(response => {
					let productList = response.data.list;
					if (response.data.list.length == 0) {
						// 没有更多
						this.loadingType = 'nomore';
						this.queryParam.pageNum--;
					} else {
						if (response.data.list.length < this.queryParam.pageSize) {
							this.loadingType = 'nomore';
							this.queryParam.pageNum--;
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
			// 初始化收藏状态
			initBrandAttention() {
				if (this.hasLogin) {
					brandAttentionDetail({
						brandId: this.brand.id
					}).then(response => {
						this.favoriteStatus = response.data != null;
					})
				}
			},

			// 检查登录状态并弹出登录框
			checkForLogin() {
				if (!this.hasLogin) {
					uni.showModal({
						title: '提示',
						content: '你还没有登录,是否要登录？',
						confirmText: '去登录',
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
					return false;
				} else {
					return true;
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}


	.container {

	
		// 品牌描述
		.brande-desc {
			padding: 30upx 50upx;
			background: #fff;
			margin-top: 16upx;
			height: 210rpx;

			.brand-image {
				width: 210upx;
				height: 70upx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.brand-subTitle {
				font-size: $font-sm;
				color: $font-color-light;
				margin-top: 8upx;
			}


			.like-icon {
				display: flex;
				align-items: center;
				justify-content: center;

				.yticon {
					font-size: 80upx;
					color: $font-color-base;
					margin: 0 10upx 0 30upx;

					&.active {
						color: #ff4443;
					}
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