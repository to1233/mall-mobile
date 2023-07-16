<template>
	<view>
		<view class="product-collection">
			<u-list @scrolltolower="scrolltolower">
				<u-list-item v-for="(item, index) in productList" :key="index">

					<u-row class="read-item-box" @click="navToDetailPage(item)">
						<u-col :span="5">
							<u-image width="138px" height="138px" :src="item.productPic"></u-image>
						</u-col>
						<u-col :span="7" class="titleContent">

							<view class="title clamp">
								{{item.productName}}
							</view>

							<view class="title2 ">
								{{item.productSubTitle}}
							</view>

							<view style="display: flex;  justify-content: space-between;line-height: 44px;">
								<text class="price">￥{{item.productPrice}}</text>
								<text class="time">{{item.createTime | formatDateTime}}</text>
							</view>
						</u-col>
					</u-row>
				</u-list-item>
			</u-list>
		</view>
	</view>
</template>

<script>
	
	import {
		formatDate
	} from '@/utils/date';
	
	export default {
		name: "ProductListWithTime",
		props: {
			productList: {
				type: Array,
				default: []
			}
		},
		filters: {
			formatDateTime(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
		},
		data() {
			return {

			};
		},
		methods: {
			// 详情
			navToDetailPage(item) {
				console.log(item);
				let id = item.productId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			// 到达列表的底部
			scrolltolower () {
				this.$emit('scrolltolower');
			}
		}
	}
</script>

<style lang="scss">
	.product-collection {

		padding: 0 30upx;
		margin-top: 16upx;

		.read-item-box {
			margin-top: 16upx;
		}

		.titleContent {
			display: flex;
			flex-direction: column;
			line-height: 44px;

			.title2 {
				font-size: 13px;
				color: #303133;
				line-height: 40upx;
				height: 44px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: block;
			}

			.time {
				font-size: $font-sm;
				color: $font-color-dark;
				line-height: 80upx;
			}

			.price {
				font-size: $font-lg;
				color: $uni-color-primary;
				line-height: 80upx;
			}

		}
	}
</style>