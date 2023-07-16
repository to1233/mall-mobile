<template>
	<view class="container">
		<view class="address-section">
			<u-cell icon="map" is-link :border="false" url="/pages/address/address?source=1">

				<!-- user-info -->
				<view slot="title" style="display: flex; flex-direction: row;">
					<text class="name">{{currentAddress.name}}</text>
					<text class="mobile">{{currentAddress.phoneNumber}}</text>
				</view>

				<!-- address-info -->
				<view slot="label" class="address">
					<text class="address">{{currentAddress.province}} {{currentAddress.city}} {{currentAddress.region}}
						{{currentAddress.detailAddress}}</text>
				</view>
			</u-cell>

			<!-- 对应的分割线 -->
			<image class="a-bg"
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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">
			</image>
		</view>

		<u-gap height="10"></u-gap>

		<view class="goods-section">
			<u-cell title="商品信息">

			</u-cell>
			<view class="brand_body">
				<u-grid :border="false" col="1">
					<u-grid-item v-for="(item,baseListIndex) in cartPromotionItemList" :key="baseListIndex">
						<view class="brand_body_item">
							<!-- 图片信息 -->
							<view style="display: flex;align-items: center;justify-content: center;">
								<u-image width="140upx" height="140upx" :src="item.productPic"></u-image>
							</view>

							<view class="like_right">
								<text class="title clamp">{{item.productName}} </text>
								<text class="spec">{{item.productAttr | formatProductAttr}}</text>
								<text class="promotion clamp">{{item.promotionMessage}}</text>

								<view class="price-box">
									<text class="price">￥{{item.price}}</text>
									<text class="number">x {{item.quantity}}</text>
								</view>
							</view>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>

		<u-gap height="10"></u-gap>


		<view class="good-detail">

			<u-cell>
				<view slot="title" class="good-detail-item-attr">
					商品合计
				</view>

				<view slot="value" class="cell-tip">
					￥{{calcAmount.totalAmount}}
				</view>
			</u-cell>
		
			<u-cell>
				<view slot="title" class="good-detail-item-attr">
					运费
				</view>

				<view slot="value" class="cell-tip">
					￥{{calcAmount.freightAmount}}
				</view>

			</u-cell>
			
			<u-cell>
				<view slot="title" class="good-detail-item-attr">
					活动优惠
				</view>
			
				<view slot="value" class="cell-tip red">
					-￥{{calcAmount.promotionAmount}}
				</view>
			</u-cell>
			
			

			<u-cell>
				<view slot="title" class="good-detail-item-attr" style="display: flex;">
					<view>
						备注信息：
					</view>

					<view>
						<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息"
							placeholder-class="placeholder" />
					</view>
				</view>
			</u-cell>
		</view>


		<view class="pay-section">
			<u-row>
				<u-col :span="1.5" offset="0.5">
					<text>实付款</text>
				</u-col>
				<u-col :span="0.5">
					<text>￥</text>
				</u-col>
				<u-col :span="3" class="price">
					<text>{{calcAmount.payAmount}}</text>
				</u-col>
				<u-col :span="4" offset="2.5">
					<u-button text="提交订单" size="normal" type="error" @click="submit" class="submit"></u-button>
				</u-col>
			</u-row>


		</view>




	</view>
</template>

<script>
	import {
		generateConfirmOrder,
		generateOrder
	} from '@/api/order.js';
	import {
		formatDate
	} from '@/utils/date';

	export default {
		data() {
			return {
				maskState: 0, //优惠券面板显示状态
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				couponList: [],
				memberReceiveAddressList: [],
				currentAddress: {},
				cartPromotionItemList: [],
				calcAmount: {},
				currCoupon: null,
				useIntegration: 0,
				integrationConsumeSetting: {},
				memberIntegration: 0,
				cartIds: []
			}
		},
		onLoad(option) {
			//商品数据
			this.cartIds = JSON.parse(option.cartIds);
			console.log(this.cartIds);
			this.loadData();
		},
		filters: {
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
			formatCouponUseType(useType) {
				if (useType == 0) {
					return "全场通用";
				} else if (useType == 1) {
					return "指定分类商品可用";
				} else if (useType == 2) {
					return "指定商品可用";
				}
				return null;
			},
		},
		methods: {
			//生成确认单信息
			async loadData() {
				generateConfirmOrder(JSON.stringify(this.cartIds)).then(response => {
					this.memberReceiveAddressList = response.data.memberReceiveAddressList;
					this.currentAddress = this.getDefaultAddress();
					this.cartPromotionItemList = response.data.cartPromotionItemList;
					this.couponList = [];
					for (let item of response.data.couponHistoryDetailList) {
						this.couponList.push(item.coupon);
					}
					this.calcAmount = response.data.calcAmount;
					this.integrationConsumeSetting = response.data.integrationConsumeSetting;
					this.memberIntegration = response.data.memberIntegration;
				});
			},
			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type) {
				this.payType = type;
			},
			submit() {
				let orderParam = {
					payType: 0,
					couponId: null,
					cartIds: this.cartIds,
					memberReceiveAddressId: this.currentAddress.id,
					useIntegration: this.useIntegration
				}
				if (this.currCoupon != null) {
					orderParam.couponId = this.currCoupon.id;
				}
				generateOrder(orderParam).then(response => {
					let orderId = response.data.order.id;
					uni.showModal({
						title: '提示',
						content: '订单创建成功，是否要立即支付？',
						confirmText: '去支付',
						cancelText: '取消',
						success: function(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: `/pages/money/pay?orderId=${orderId}`
								})
							} else if (res.cancel) {
								console.log("cancel")
								uni.redirectTo({
									url: '/pages/order/order?state=0'
								})
							}
						}
					});
				});
			},
			stopPrevent() {},
			//获取默认收货地址
			getDefaultAddress() {
				for (let item of this.memberReceiveAddressList) {
					if (item.defaultStatus == 1) {
						return item;
					}
				}
				if (this.memberReceiveAddressList != null && this.memberReceiveAddressList.length > 0) {
					return this.memberReceiveAddressList[0];
				}
				return null;
			},
			selectCoupon(coupon) {
				this.currCoupon = coupon;
				this.calcPayAmount();
				this.toggleMask();
			},
			//计算支付金额
			calcPayAmount() {
				this.calcAmount.payAmount = this.calcAmount.totalAmount - this.calcAmount.promotionAmount - this.calcAmount
					.freightAmount;
				if (this.currCoupon != null) {
					this.calcAmount.payAmount = this.calcAmount.payAmount - this.currCoupon.amount;
				}
				if (this.useIntegration != 0) {
					this.calcAmount.payAmount = this.calcAmount.payAmount - this.calcIntegrationAmount();
				}
			},
			//积分转金额
			calcIntegrationAmount(integration) {
				if (this.integrationConsumeSetting == undefined || this.integrationConsumeSetting == null) {
					return 0;
				}
				if (this.integrationConsumeSetting.couponStatus == 0) {
					return 0;
				}
				return integration / this.integrationConsumeSetting.deductionPerAmount;
			},
			handleIntegrationInput(event) {
				if (event.detail.value > this.memberIntegration) {
					this.useIntegration = this.memberIntegration;
					uni.showToast({
						title: `您的积分只有${this.memberIntegration}`,
						duration: 1000
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}


	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}


	}


	.goods-section {
		background: #fff;

		// 对应的分类下的元素主体
		.brand_body {

			// 重写对应的样式
			.u-grid-item {
				align-items: normal;
			}

			// 自定义slot 元素
			.brand_body_item {
				display: flex;
				flex-direction: row;
				margin: 20upx 30upx;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.title {
				font-size: 16px;
				color: #303133;
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


			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.promotion {
				font-size: 24upx;
				color: $base-color;
			}



			.like_right {
				width: 70%;
				display: flex;
				flex-direction: column;
				padding-left: 20px;
			}


			.price {
				margin-bottom: 4upx;
			}

			.number {
				font-size: 26upx;
				color: $font-color-base;
				margin-left: 20upx;
			}
		}
	}

	.good-detail {
		background: #fff;

		// 对应的字体颜色
		.good-detail-item-attr {
			color: #909399;
		}
		
		
		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;
			
			&.red {
				color: $base-color;
			}
		}

	}

	// 底部提交价格的工具
	.pay-section {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		width: 100%;
		height: 90upx;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		// 价格样式
		.price {
			font-size: 36upx;
			color: $base-color;
		}

		// 提交按钮的自定义样式
		.submit {
			height: 90upx;
			background-color: $base-color;
		}

	}
</style>