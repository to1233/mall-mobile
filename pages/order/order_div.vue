<template>
	<view class="container">

		<view>
			<view class="u-demo-block__content">
				<u-subsection :list="list" mode="subsection" :current="tabCurrentIndex"
					@change="sectionChange"></u-subsection>
			</view>
		</view>
		
		
	
		
			
		

		<view class="order-list">
			<u-list @scrolltolower="scrolltolower" style="	background: #f5f5f5;">

				<!-- 空白页 -->
				<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png" v-if="orderList.length === 0">
				</u-empty>

				<!-- 下面的购物信息 -->
				<u-list-item v-for="(item, index) in orderList" :key="index" v-else>
					<view class="order-item">
						<u-cell :title="item.createTime | formatDateTime">

							<view slot="value" style="display: flex;">
								<view>
									<text class="state"
										:style="{color: '#fa436a'}">{{item.status | formatStatus}}</text>
								</view>
								<view class="delete-icon" v-if="item.status===3||item.status===4">
									<u-icon  name="trash"
										@click="deleteOrder(item.id)"></u-icon>
								</view>

								<view>

								</view>

							</view>



						</u-cell>


						<u-cell-group :border="false">
							<u-cell v-for="(orderItem, itemIndex) in item.orderItemList" :border="false">
								<view slot="icon" class="portrait-box">
									<u-image width="70px" height="70px" :src="orderItem.productPic"></u-image>

								</view>

								<view slot="title" class="u-slot-title">
									<view class="brand_body_item">

										<text class="title clamp">{{orderItem.productName}}</text>
										<text class="attr-box">{{orderItem.productAttr | formatProductAttr}} x
											{{orderItem.productQuantity}}</text>
										<text class="price">{{orderItem.productPrice}}</text>
									</view>
								</view>
							</u-cell>
						</u-cell-group>


						<view>
							<u-row justify="space-between">
								<u-col span="8" offset="3.5">
									<view class="price-box">
										共
										<text class="num">{{2}}</text>
										件商品 实付款
										<text class="price">{{7399}}</text>
									</view>
								</u-col>
							</u-row>
						</view>


						<u-line margin="20rpx"></u-line>

						<view v-if="item.status == 0">
							<u-row>

								<u-col span="2.5" offset="6.5">
									<u-button type="error " size="small" text="取消订单" :plain="true" shape="circle"
										class="custom-style" @click="cancelOrder(item.id)"> </u-button>
								</u-col>

								<u-col span="2.5" offset="0.3">

									<u-button type="error " size="small" text="立即付款" :plain="true" shape="circle"
										class="custom-style" @click="payOrder(item.id)"> </u-button>
								</u-col>
							</u-row>
						</view>


						<view v-if="item.status == 2">
							<u-row>
								<u-col span="2.5" offset="6.5">
									<u-button type="error " size="small" text="查看物流" :plain="true" shape="circle"
										class="custom-style" @click="receiveOrder(item.id)"> </u-button>
								</u-col>

								<u-col span="2.5" offset="0.3">

									<u-button type="error " size="small" text="确认收货" :plain="true" shape="circle"
										class="custom-style" @click="receiveOrder(item.id)"> </u-button>
								</u-col>
							</u-row>
						</view>




						</u-row>
					</view>
				</u-list-item>
			</u-list>
		</view>
	</view>
</template>

<script>
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





		data() {
			return {
				navList: [{
					state: -1,
					name: '全部'
				}, {
					state: 0,
					name: '待付款'
				}, {
					state: 2,
					name: '待收货'
				}, {
					state: 3,
					name: '已完成'
				}, {
					state: 4,
					name: '已取消'
				}],
				tabCurrentIndex: 0,
				orderParam: {
					status: -1,
					pageNum: 1,
					pageSize: 5
				},
				orderList: [],
				loadingType: 'more',
			}
		},
		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = options.state;
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
		computed: {
			list() {
				return this.navList.map(item => {
					return item.name;
				})
			}
		},
		methods: {

			// 获取订单列表
			loadData(type = 'refresh') {
				if (type == 'refresh') {
					this.orderParam.pageNum = 1;
				} else {
					this.orderParam.pageNum++;
				}
				// 这里是将订单挂载到tab 列表下
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
					if (type === 'refresh') {
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

			// 分段事件改变
			sectionChange(index) {
				this.tabCurrentIndex = index;
				this.loadData();
			},
			scrolltolower() {
				this.loadData();
			},
			// 删除订单
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
			// 取消订单
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
				})
			},
			// 支付订单
			payOrder(orderId) {
				uni.redirectTo({
					url: `/pages/money/pay?orderId=${orderId}`
				});
			},
			// 确认收货
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
							console.log('用户点击取消')
						}
					}
				});
			},
			// 查看订单详情
			showOrderDetail(orderId) {
				uni.navigateTo({
					url: `/pages/order/orderDetail?orderI${orderId}`
				})
			},
			// 计算商品总数量
			calcTotalQuantity(order) {
				let totalQuantity = 0;
				if (order.orderItemList != null && order.orderItemList.length > 0) {
					for (let item of order.orderItemList) {
						totalQuantity += item.productQuantity;
					}
				}
				return totalQuantity;
			},
		}
	}
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;


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
</style>