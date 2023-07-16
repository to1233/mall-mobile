<template>
	<view class="content">

		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item"
				:class="{current: tabCurrentIndex === index}" @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>


		<!--对应的订单元素列表 -->
		<swiper :current="tabCurrentIndex" class="swiper-box" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- 空白页 -->
					<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png" v-if="orderList.length === 0">
					</u-empty>

					<view class="order-list" v-else>
						<u-list style="	background: #f5f5f5;" @scrolltolower="loadData('add')">

							<!-- 下面的购物信息 -->
							<u-list-item v-for="(item, index) in orderList" :key="index">
								<view class="order-item">

									<!-- 头部 时间以及 操作按钮 -->
									<u-cell :title="item.createTime | formatDateTime">
										<view slot="value" style="display: flex;">
											<view>
												<text class="state"
													:style="{color: '#fa436a'}">{{item.status | formatStatus}}</text>
											</view>
											<view class="delete-icon" v-if="item.status===3||item.status===4">
												<u-icon name="trash" @click="deleteOrder(item.id)"></u-icon>
											</view>
										</view>
									</u-cell>

									<!-- 订单商品图片以及 对应的商品元素属性 -->
									<u-cell-group :border="false">
										<u-cell v-for="(orderItem, itemIndex) in item.orderItemList" :border="false">
											<view slot="icon" class="portrait-box">
												<u-image width="70px" height="70px"
													:src="orderItem.productPic"></u-image>

											</view>

											<view slot="title" class="u-slot-title">
												<view class="brand_body_item">

													<text class="title clamp">{{orderItem.productName}}</text>
													<text
														class="attr-box">{{orderItem.productAttr | formatProductAttr}}x{{orderItem.productQuantity}}</text>
													<text class="price">{{orderItem.productPrice}}</text>
												</view>
											</view>
										</u-cell>
									</u-cell-group>


									<!-- 付款金额 以及对应的数量 -->
									<view>
										<u-row justify="space-between">
											<u-col span="8" offset="3.5">
												<view class="price-box">
													共
													<text class="num">{{calcTotalQuantity(item)}}</text>
													件商品 实付款
													<text class="price">{{item.payAmount}}</text>
												</view>
											</u-col>
										</u-row>
									</view>


									<u-line margin="20rpx"></u-line>

									<view v-if="item.status == 0">
										<u-row>
											<u-col span="2.5" offset="6.5">
												<u-button type="error " size="small" text="取消订单" :plain="true"
													shape="circle" class="custom-style" @click="cancelOrder(item.id)">
												</u-button>
											</u-col>

											<u-col span="2.5" offset="0.3">
												<u-button type="error " size="small" text="立即付款" :plain="true"
													shape="circle" class="custom-style" @click="payOrder(item.id)">
												</u-button>
											</u-col>
										</u-row>
									</view>

									<view v-if="item.status == 2">
										<u-row>
											<u-col span="2.5" offset="6.5">
												<u-button type="error " size="small" text="查看物流" :plain="true"
													shape="circle" class="custom-style" @click="show(item.id)">
												</u-button>
											</u-col>

											<u-col span="2.5" offset="0.3">
												<u-button type="error " size="small" text="确认收货" :plain="true"
													shape="circle" class="custom-style" @click="receiveOrder(item.id)">
												</u-button>
											</u-col>
										</u-row>
									</view>
								</view>
							</u-list-item>
						</u-list>
					</view>

					<!-- 显示更多 -->
					<uni-load-more :status="loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		formatDate
	} from '@/utils/date';
	import {
		fetchOrderList,
		cancelUserOrder,
		confirmReceiveOrder,
		deleteUserOrder
	} from '@/api/order.js';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				tabCurrentIndex: 0,
				orderParam: {
					status: -1,
					pageNum: 1,
					pageSize: 5
				},
				orderList: [],
				loadingType: 'more',
				navList: [{
						state: -1,
						text: '全部'
					},
					{
						state: 0,
						text: '待付款'
					},
					{
						state: 2,
						text: '待收货'
					},
					{
						state: 3,
						text: '已完成'
					},
					{
						state: 4,
						text: '已取消'
					}
				],
			};
		},
		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state;
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if (options.state == 0) {
				this.loadData()
			}
			// #endif

		},
		filters: {
			formatStatus(status) {
				let statusTip = '';
				switch (+status) {
					case 0:
						statusTip = '等待付款';
						break;
					case 1:
						statusTip = '等待发货';
						break;
					case 2:
						statusTip = '等待收货';
						break;
					case 3:
						statusTip = '交易完成';
						break;
					case 4:
						statusTip = '交易关闭';
						break;
				}
				return statusTip;
			},
			formatProductAttr(jsonAttr) {
				let attrArr = JSON.parse(jsonAttr);
				let attrStr = '';
				for (let attr of attrArr) {
					attrStr += attr.key;
					attrStr += ":";
					attrStr += attr.value;
					attrStr += ";";
				}
				return attrStr
			},
			formatDateTime(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
		},
		methods: {
			//获取订单列表
			loadData(type = 'refresh') {
				console.log('被触发了');


				if (type == 'refresh') {
					this.orderParam.pageNum = 1;
				} else {
					this.orderParam.pageNum++;
				}
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				this.orderParam.status = navItem.state;
				this.loadingType = 'loading';
				fetchOrderList(this.orderParam).then(response => {
					let list = response.data.list;
					if (type == 'refresh') {
						this.orderList = list;
						this.loadingType = 'more';
					} else {
						if (list != null && list.length > 0) {
							this.orderList = this.orderList.concat(list);
							this.loadingType = 'more';
						} else {
							this.orderParam.pageNum--;
							this.loadingType = 'noMore';
						}
					}
				});
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData();
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(orderId) {
				let superThis = this;
				uni.showModal({
					title: '提示',
					content: '是否要删除该订单？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							deleteUserOrder({
								orderId: orderId
							}).then(response => {
								uni.hideLoading();
								superThis.loadData();
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//取消订单
			cancelOrder(orderId) {
				let superThis = this;
				uni.showModal({
					title: '提示',
					content: '是否要取消该订单？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							cancelUserOrder({
								orderId: orderId
							}).then(response => {
								uni.hideLoading();
								superThis.loadData();
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//支付订单
			payOrder(orderId) {
				uni.redirectTo({
					url: `/pages/money/pay?orderId=${orderId}`
				});
			},
			//确认收货
			receiveOrder(orderId) {
				let superThis = this;
				uni.showModal({
					title: '提示',
					content: '是否要确认收货？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							confirmReceiveOrder({
								orderId: orderId
							}).then(response => {
								uni.hideLoading();
								superThis.loadData();
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//查看订单详情
			showOrderDetail(orderId) {
				uni.navigateTo({
					url: `/pages/order/orderDetail?orderId=${orderId}`
				})
			},
			//计算商品总数量
			calcTotalQuantity(order) {
				let totalQuantity = 0;
				if (order.orderItemList != null && order.orderItemList.length > 0) {
					for (let item of order.orderItemList) {
						totalQuantity += item.productQuantity
					}
				}
				return totalQuantity;
			},
		},
	}
</script>

<style lang="scss">
	.uni-swiper-item {
		height: auto;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}


	page,
	.content {
		height: 100%;


		.navbar {
			display: flex;
			height: 40px;
			padding: 0 5px;
			background: #fff;
			box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
			position: relative;
			z-index: 10;

			.nav-item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				font-size: 15px;
				color: $font-color-dark;
				position: relative;

				&.current {
					color: $base-color;

					&:after {
						content: '';
						position: absolute;
						left: 50%;
						bottom: 0;
						transform: translateX(-50%);
						width: 44px;
						height: 0;
						border-bottom: 2px solid $base-color;
					}
				}
			}
		}

		.list-scroll-content {
			height: 100%;
		}


		// 订单列表信息
		.order-list {
			margin-top: 20rpx;
			background-color: #fff;

			.order-item {
				background-color: #fff;
				margin-top: 15rpx;
				margin-bottom: 15rpx;
				padding-bottom: 15rpx;
				border-radius: 20rpx;


				.brand_body_item {
					display: flex;
					flex-direction: column;
					padding: 0 15px 0 12px;
					overflow: hidden;
					box-sizing: border-box;

					.title {
						font-size: 15px;
						color: #303133;
						line-height: 1;
					}

				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}

				.num {
					margin: 0 4px;
					color: #303133;
				}

				.price-box {
					display: flex;
					justify-content: flex-end;
					align-items: baseline;
					font-size: 14px;
					color: #909399;
				}

				.attr-box {
					font-size: 14px;
					color: #909399;
					padding: 5px 6px;
				}

				// 删除按钮的样式
				.delete-icon {
					border-left: 3rpx;
					margin-left: 15rpx;
					padding-left: 15rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-left: 1px solid #DCDFE6;
				}
			}
		}


	}

	.custom-style {
		background: #fff9f9;
		color: #fa436a;
	}
</style>s