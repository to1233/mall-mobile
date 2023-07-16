<template>
	<view class="content">
		<u-row justify="center">
			<text class="success-icon yticon icon-xuanzhong2"></text>
		</u-row>
		<u-row justify="center">
			<text class="tit">支付成功</text>
		</u-row>


		<view class="btn-group">
			<u-row class="button-style">
				<u-button text="查看订单" size="normal" type="error" shape="circle"
					@click="navTopage('/pages/order/order?state=0')"></u-button>
			</u-row>
			<u-row class="button-style">
				<u-button text="返回首页" size="normal" shape="circle"
					@click="navTopage('/pages/order/order?state=0')"></u-button>
			</u-row>
		</view>
	</view>
</template>

<script>
	export default {

		methods: {
			// 导航到对应页面
			navTopage(url) {
			
				uni.redirectTo({
					url
				});
			}
		}
	}
</script>

<style lang="scss">
	.content {

		.success-icon {
			font-size: 160upx;
			color: #fa436a;
			margin-top: 100upx;
		}

		.tit {
			font-size: 38upx;
			color: #303133;
		}


		.btn-group {
			padding: 80rpx 40rpx;

			.button-style {
				margin-top: 30rpx;
			}
		}
	}
</style>