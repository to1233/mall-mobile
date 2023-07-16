<template>
	<view class="app">
		<!-- 价格区域 -->
		<view class="price-box">
			<u-row justify="center">
				<text>支付金额</text>
			</u-row>

			<u-row justify="center" class="price">
				¥{{orderInfo.payAmount}}
			</u-row>


		</view>

		<!-- 支付方式 -->
		<view class="pay-type-list">
			<view>
				<!-- 微信支付-->
				<u-row class="type-item" justify="center" @click="changePayType(2)">
					<u-col :span="3">
						<!-- 微信图标 -->
						<text class="icon yticon icon-weixinzhifu"></text>
					</u-col>
					<u-col class="con" :span="6">
						<u-row class="tit">
							微信支付
						</u-row>
						<u-row>
							推荐使用微信支付
						</u-row>
					</u-col>
					<u-col :span="3">
						<!-- 选择 -->
						<radio value="" color="#fa436a" :checked='payType == 2' />
						</radio>
					</u-col>
				</u-row>

				<!-- 支付宝支付 -->
				<u-row class="type-item" @click="changePayType(1)">
					<u-col :span="3">
						<!-- 支付宝图标 -->
						<text class="icon yticon icon-alipay"></text>
					</u-col>
					<u-col class="con" :span="6">
						<u-row class="tit">
							支付宝支付
						</u-row>
					</u-col>
					<u-col :span="3">
						<radio value="" color="#fa436a" :checked='payType == 1' />
						</radio>
					</u-col>
				</u-row>
			</view>
			<view class="submit-button" @click="confirm">
				<u-button text="确认支付" size="normal" type="error" class="custom-style" shape="circle"></u-button>
			</view>


		</view>



	</view>

</template>

<script>
	import {
		fetchOrderDetail,
		payOrderSuccess
	} from '@/api/order.js';
	export default {
		data() {
			return {
				orderId: null,
				payType: 2,
				orderInfo: {}
			};
		},
		onLoad(options) {
			this.orderId = options.orderId;
			fetchOrderDetail(this.orderId).then(response => {
				this.orderInfo = response.data;
			});
		},
		methods: {
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
			confirm: async function() {
				payOrderSuccess({
					orderId: this.orderId,
					payType: this.payType
				}).then(response => {
					uni.redirectTo({
						url: '/pages/money/paySuccess'
					})
				});
			},
		}
	}
</script>

<style lang="scss">
	.app {
		width: 100%;
	}


	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
		}
	}



	.pay-type-list {
		padding: 30px 31px;

		.icon {

			font-size: 52upx;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.con {
			font-size: $font-sm;
			color: $font-color-light;


			.tit {
				font-size: $font-lg;
				color: $font-color-dark;
				margin-bottom: 4upx;
			}
		}

		.type-item {
			height: 120upx;
		}

		.submit-button {
			margin-top:  60rpx;
			.custom-style {
				background-color: $base-color;
			}
			
		}

	}
</style>