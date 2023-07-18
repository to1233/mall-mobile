<template>

	<view class="container">

		<view class="headBox">
			<u-cell isLink disabled>
				<view slot="icon" class="portrait-box">
					<image class="portrait" :src=" this.hasLogin ? this.userInfo.icon :  '/static/missing-face.png'">
					</image>
				</view>

				<view slot="title" class="u-slot-title" v-if="hasLogin">
					<view class="u-font-lg" style="color: rgb(255, 255, 255);font-weight: bold;font-size: 20px;">
						{{this.userInfo.nickname}}
					</view>
				</view>

				<view slot="title" class="u-slot-title" v-else @click="toLogin">
					<view class="u-font-lg" style="color: rgb(255, 255, 255);font-weight: bold;font-size: 20px;">登录
						/ 注册
					</view>
					<view class="detail">登录后享受更好的服务体验</view>
				</view>

			</u-cell>
		</view>

		<view class="cover-container">
			<!--  拥有的统计信息-->
			<view class="ownInfo-content">
				<view class="itemBox">
					<u-grid :border="false" @click="click">
						<u-grid-item>
							<view class="ownInfo-save-item">
								<text class="num">{{userInfo.intergration || '暂无'}}</text>
								<text>积分</text>
							</view>
						</u-grid-item>

						<u-grid-item>
							<view class="ownInfo-save-item">
								<text class="num">{{userInfo.growth || '暂无'}}</text>
								<text>成长值</text>
							</view>

						</u-grid-item>

						<u-grid-item>
							<view class="ownInfo-save-item">
								<text class="num">{{userInfo.couponCount || '暂无'}}</text>
								<text>优惠券</text>
							</view>

						</u-grid-item>

					</u-grid>
					<u-toast ref="uToast" />
				</view>

			</view>


			<!-- 订单信息 -->
			<view class="itemBox">
				<u-grid :border="false" col="4">
					<u-grid-item v-for="(item,baseListIndex) in order" :key="baseListIndex">

						<view class="orderItem" @click="navTo(`/pages/order/order?state=${item.state}`)">
							<text class="yticon" :class="item.icon"></text>
							<view class="grid-text">{{item.word}}</view>
						</view>


					</u-grid-item>
				</u-grid>
				<u-toast ref="uToast" />
			</view>


			<!-- 功能区 -->
			<view class="itemBox">
				<u-cell isLink :url="item.url" :titleStyle="{fontWeight: 500}" :title="item.title"
					v-for="(item, index) in list" :key="index">
					<view slot="icon" class="icon-box">
						<text class="yticon " :class="item.iconUrl" :style="{color: item.color}"></text>
					</view>
					<view slot="title" class="u-slot-title">
						<text>{{item.title}}</text>
					</view>

				</u-cell>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';


	export default {
		data() {
			return {

				baseList: [{
					type: '积分',
					data: 100,
				}, {
					type: '成长值',
					data: 100,
				}, {
					type: '优惠券',
					data: 100,
				}],
				// 订单
				order: [{
						icon: 'icon-shouye',
						word: '全部订单',
						state: 0
					},

					{
						icon: 'icon-daifukuan',
						word: '待付款',
						state: 1
					}, {
						icon: 'icon-yishouhuo',
						word: '待收货',
						state: 2
					}, {
						icon: 'icon-shouhoutuikuan',
						word: '退款/售后',
						state: 3
					}
				],
				list: [{
						imgName: 'car',
						title: '地址管理',
						iconUrl: 'icon-dizhi',
						color: '#5fcda2',
						url: '/pages/address/address'
					},
					{
						imgName: 'data',
						title: '我的足迹',
						iconUrl: 'icon-lishijilu',
						color: '#e07472',
						url: '/pages/user/readHistory'
					}, {
						imgName: 'comment',
						title: '我的关注',
						iconUrl: 'icon-shoucang',
						color: '#5fcda2',
						url: '/pages/user/brandAttention'
					}, {
						imgName: 'coupon',
						title: '我的收藏',
						iconUrl: 'icon-shoucang_xuanzhongzhuangtai',
						color: '#54b4ef',
						url: '/pages/user/productCollection'
					}, {
						imgName: 'history',
						title: '我的评价',
						iconUrl: 'icon-pingjia',
						color: '#ee883b',
						url: '/pages/comment/list'
					}, {
						imgName: 'list',
						title: '设置',
						iconUrl: 'icon-shezhi1',
						color: '#e07472',
						url: '/pages/set/set'
					}
				]
			}
		},
		onLoad() {
			console.log('传输的结果---{}', this.userInfo.icon);
		},


		// 监控 store
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		// #ifndef MP
		// 对应的页面头部点击事件
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			} else if (index === 1) {
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				// 清除当前页面上的红点
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
		methods: {
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url
				})
			},
			// 去登录
			toLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}


	.container {


		.u-cell-icon {
			width: 16px;
			height: 16px;
			margin-right: 3px;
		}

		// 头部区域
		.headBox {
			background: linear-gradient(to left top, rgb(41, 121, 255), rgba(41, 121, 255, 0.75));

			border-radius: 50% / 0 0 5% 5%;
			overflow: hidden;
			padding: 80upx 20upx 0;


			.portrait {
				width: 130upx;
				height: 130upx;
				border: 5upx solid #fff;
				border-radius: 50%;
			}

			.u-slot-title {
				padding-left: 15upx;
			}

			.detail {
				color: #fff;
				font-size: 13px;
				padding-top: 3px;
			}
		}

		// 整体外壳
		.cover-container {
			background: $page-color-base;

			padding: 0 30upx;
			position: relative;
			background: #f5f5f5;
			padding-bottom: 20upx;

			.arc {
				position: absolute;
				left: 0;
				top: -34upx;
				width: 100%;
				height: 36upx;
			}
		}

		// 单个模块壳子
		.itemBox {
			background: #fff;
			padding: 0 24rpx;
			border-radius: 20rpx;
			overflow: hidden;
			margin-top: 24rpx;
			justify-content: space-around;
			align-content: center;

			padding: 15px 0;
			margin-top: 11px;
			background-color: #fff;

			.orderItem {
				display: flex;
				flex-direction: column;

				align-items: center;
				justify-content: center;

				.yticon {
					font-size: 48upx;
					margin-bottom: 18upx;
					color: #fa436a;
				}
			}

			.num {
				font-size: $font-lg;
				color: $font-color-dark;
				margin-bottom: 8upx;
			}


			.titleBox {
				padding: 32rpx 0;
				border-bottom: 1rpx solid #eee;

				.title {
					font-size: 28rpx;
					font-weight: bold;
				}

				.word {
					font-size: 24rpx;
					color: #999;
				}
			}

			.grid-text {
				font-size: 24rpx;
				color: #333;
				padding-top: 10rpx;
			}

			.icon-box {
				line-height: 60upx;
			}

			// 用户存储信息 
			.ownInfo-save-item {
				display: flex;
				flex-direction: column;
				height: 77px;
				font-size: 13px;
				justify-content: center;
				align-items: center;
			}



		}


		.function-content {
			background: #fff;
		}

	}
</style>