<template>
	<view>
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
</template>

<script>
	export default {
		name:"ProductListWithSale",
		props :{
			productList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			//详情
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
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
</style>