<template>
	<!--首页-->
	<view class="u-page">

		<view class="header">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background"></view>
			<view class="swiper">
				<u-swiper :list="swiperImageSrcList" @click="click" indicator height="170"></u-swiper>
			</view>
		</view>
		<u-gap height="10" bgColor="#f7f7f7"></u-gap>
		<view class="guider">
			<u-grid :border="false"  col="4">
				<u-grid-item v-for="(baseListItem,baseListIndex) in baseList" :key="baseListIndex">
					<image :src="baseListItem.src"></image>
					<text class="grid-text">{{baseListItem.title}}</text>
				</u-grid-item>
			</u-grid>
		</view>

		<u-gap height="10" bgColor="#f7f7f7"></u-gap>



		<view class="cotent_body">


<view>
				<view>
					<u-cell-group>
						<u-cell value="" is-link @click="navToHotProductListPage()" :border="false"> 
							<view slot="title" class="u-slot-title">
								<view class="title_left">
									<image class="brand" src="/static/icon_hot_product.png"></image>
									<view class="tit-box">
										<text class="tit">人气推荐</text>
										<text class="tit2">大家都赞不绝口的</text>
									</view>
								</view>

							</view>
						</u-cell>
					</u-cell-group>
				</view>

				<view class="brand_body">
					<u-grid :border="false"  col="1">
						<u-grid-item v-for="(item,baseListIndex) in hotProductList" :key="baseListIndex" >
							<view class="brand_body_item like_body" @click="navToDetailPage(item)">
								<u-image width="105px" height="125px" :src="item.pic"></u-image>

								<view class="like_right">
									<text class="title clamp">{{item.name}} </text>
									<text class="title2">{{item.subTitle}}</text>
									<text class="price">￥{{item.price}}</text>
								</view>

							</view>


						</u-grid-item>
					</u-grid>
					<u-toast ref="uToast" />
				</view>

			</view>


			<u-gap height="10" bgColor="#f7f7f7"></u-gap>



			<!-- 品牌制造商-->
			<view>
				<view>
					<u-cell-group >
						<u-cell value="" is-link @click="navToRecommendBrandPage()" :border="false">
							<view slot="title" class="u-slot-title">
								<view class="title_left">
									<image class="brand" src="/static/icon_home_brand.png"></image>
									<view class="tit-box">
										<text class="tit">品牌制造商直供</text>
										<text class="tit2">工厂直达消费者，剔除品牌溢价</text>
									</view>
								</view>

							</view>
						</u-cell>
					</u-cell-group>
				</view>


				<view class="brand_body">
					<view>
						<u-grid :border="false"  col="2">
							<u-grid-item v-for="(item,baseListIndex) in brandList" :key="baseListIndex" @click="navToBrandDetailPage(item)">
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


			<u-gap height="10" bgColor="#f7f7f7"></u-gap>

			<!--猜你喜欢 -->
			<view>
				<view>
					<u-cell-group>
						<u-cell value=""  :border="false">
							<view slot="title" class="u-slot-title">
								<view class="title_left">
									<image class="brand" src="/static/icon_recommend_product.png"></image>
									<view class="tit-box">
										<text class="tit">猜你喜欢</text>
										<text class="tit2">你喜欢的都在这里了</text>
									</view>
								</view>

							</view>
						</u-cell>
					</u-cell-group>
				</view>


				<view class="brand_body">
					<u-grid :border="false" col="2">
						<u-grid-item v-for="(item,baseListIndex) in recommendProductList" :key="baseListIndex">
							<view class="brand_body_item" @click="navToDetailPage(item)">
								<u-image width="170px" height="165px" :src="item.pic"></u-image>

								<text class="title clamp">{{item.name}}</text>
								<text class="clamp">{{item.subTitle}}</text>
								<text class="price">￥{{item.price}}</text>
							</view>


						</u-grid-item>
					</u-grid>
				</view>
			</view>


		</view>








	</view>
</template>

<script>
	import {
		fetchContent,
		fetchRecommendProductList
	} from '@/api/home.js';
	import {
		formatDate
	} from '@/utils/date.js';


	export default {
		data() {
			return {
				titleNViewBackground: '',
				titleNViewBackgroundList: ['rgb(203, 87, 60)', 'rgb(205, 215, 218)'],
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				goodsList: [],
				advertiseList: [],
				hotProductList: [],
				newProductList: [],
				homeFlashPromotion: [],
				brandList: [],
				recommendProductList: [],
				recommendParams: {
					pageNum: 1,
					pageSize: 4
				},
				loadingType: 'more',
				baseList: [{
						name: 'photo',
						src: '/static/temp/c3.png',
						title: '专题'
					},
					{
						name: 'lock',
						src: '/static/temp/c5.png',
						title: '话题'
					},
					{
						name: 'star',
						src: '/static/temp/c6.png',
						title: '优选'
					},
					{
						name: 'star',
						src: '/static/temp/c7.png',
						title: '特惠'
					},
				],
			}
		},

		// 下拉刷新
		onPullDownRefresh() {
			this.recommendParams.pageNum = 1;
			this.loadData();
		},
		onReachBottom() {
			this.recommendParams.pageNum++;
			this.loadingType = 'loading';
			fetchRecommendProductList(this.recommendParams).then(response => {
				let addProductList = response.data;
				if (response.data.length == 0) {
					this.recommendParams.pageNum--;
					this.loadingType = 'nomore';
				} else {
					this.recommendProductList = this.recommendProductList.concat(addProductList);
					this.loadingType = 'more';
				}
			})
		},

		computed: {
			cutDownTime() {
				let endTime = new Date(this.homeFlashPromotion.endTime);
				let endDateTime = new Date();
				let startDateTime = new Date();
				endDateTime.setHours(endTime.getHours());
				endDateTime.setMinutes(endTime.getMinutes());
				endDateTime.setSeconds(endTime.getSeconds());
				let offsetTime = (endDateTime.getTime() - startDateTime.getTime());
				let endHour = Math.floor(offsetTime / (60 * 60 * 1000));
				let offsetMinute = offsetTime % (60 * 60 * 1000);
				let endMinute = Math.floor(offsetMinute / (60 * 1000));
				let offsetSecond = offsetTime % (60 * 1000);
				let endSecond = Math.floor(offsetSecond / 1000);
				return {
					endHour: endHour,
					endMinute: endMinute,
					endSecond: endSecond
				}
			},

			swiperImageSrcList() {

				return this.advertiseList.map(item => {
					return item.pic;
				});
			},


		},


		// 过滤器
		filters: {
			formatTime(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, ' hh:mm:ss')
			},
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData() {
				fetchContent().then(response => {
					console.log("OnLoad", response.data);
					this.advertiseList = response.data.advertiseList;
					this.swiperLength = this.advertiseList.length;
					this.titleNViewBackground = this.titleNViewBackgroundList[0];
					this.brandList = response.data.brandList;
					this.homeFlashPromotion = response.data.homeFlashPromotion;
					this.newProductList = response.data.newProductList;
					this.hotProductList = response.data.hotProductList;
					fetchRecommendProductList(this.recommendParams)
						.then(response => {
							this.recommendProductList = response.data;
							uni.stopPullDownRefresh();
						})
				})
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				let changeIndex = index % this.titleNViewBackgroundList.length;
				this.titleNViewBackground = this.carouselList[index];
			},
			//商品详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			// 广告详情页
			navToAdvertisePage(item) {
				let id = item.id;
				console.log("navToAdvertisePage", item);
			},
			// 品牌详情页
			navToBrandDetailPage(item) {
				console.log(item);
				let id = item.id;
				uni.navigateTo({
					url: `/pages/brand/brandDetail?id=${id}`
				})
			},
			// 推荐品牌列表页
			navToRecommendBrandPage() {
				uni.navigateTo({
					url: `/pages/brand/list`
				})
			},
			// 新鲜好物列表页
			navToNewProductListPage() {
				uni.navigateTo({
					url: `/pages/product/newProductList`
				})
			},
			// 人气推荐列表页
			navToHotProductListPage() {
				uni.navigateTo({
					url: `/pages/product/hotProductList`
				})
			},
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			this.$api.msg('点击了搜索框');
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.$api.msg('点击了扫描');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		}
		// #endif
	}
</script>



<style lang="scss">
	.header {
		position: relative;
		padding-top: 10px;
		background-color: rgb(203, 87, 60);

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 300rpx;
			transition: .4s;
			background-color: rgb(203, 87, 60);
		}
	}

	.guider {
		margin-top: 30rpx;

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88rpx;
			height: 88rpx;
			margin-bottom: 14rpx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4rpx 4rpx 20rpx rgba(250, 67, 106, 0.3);
		}
	}

	// 分类标题中对应的 坐标的内容
	.title_left {

		display: flex;
		flex-direction: row;

		image {
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
		}


		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			font-size: $font-lg +2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.brand_item_info {
		display: flex;
		flex-direction: column;
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
		
		.like_body {
			display: flex;
			flex-direction: row;
		}
		
		
		.like_right {
			width: 70%;
			display: flex;
			flex-direction: column;
			padding-left: 20px;
		}
		
		
	}
</style>