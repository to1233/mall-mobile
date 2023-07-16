<template>
	<view>

		<view class="category">

			<u-sticky>
				<u-tabs :list="list1" :current="currentIndex" @change="changeTabs" style="background-color: #fff;">
					<view slot="right" style="padding-left: 4px;" @tap="show = !show">
						<u-icon name="list" size="21" bold></u-icon>
					</view>
				</u-tabs>
			</u-sticky>


			<view class="brand_body">
				<u-grid :border="false" @click="click" col="2">
					<u-grid-item v-for="(baseListItem,baseListIndex) in productList" :key="baseListIndex">
						<view class="brand_body_item">
							<u-image width="170px" height="165px"
								src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ac1bf58Ndefaac16.jpg"></u-image>

							<text class="title clamp">华为 HUAWEI P20 </text>
							<text class="title2">AI智慧全面屏 6GB +64GB 亮黑色 全网通版 移动联通电信4G手机 双卡双待手机</text>
							<view class="price-box">
								<text class="price">3788</text>
								<text>已售 0</text>
							</view>
						</view>


					</u-grid-item>
				</u-grid>
				<u-toast ref="uToast" />
			</view>


		</view>

		<uni-load-more :status="loadingType"></uni-load-more>



		<u-popup :show="show" mode="center" :round="10" @close="close" @open="open">
			<view class="u-popup-slot" :style="{
								width:'700rpx' ,
							}">
				<u-grid :border="false" @click="click" col="4">
					<u-grid-item v-for="(baseListItem,baseListIndex) in list1" :key="baseListIndex">
						<view class="tag_item">
							<u-tag @click="showTag(baseListIndex)" :text="baseListItem.name"
								:plain="!baseListItem.checked" shape="circle" size="mini" type="warning" color="#111"
								borderColor="#909399"></u-tag>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</u-popup>


	</view>
</template>

<script>
	import {
		searchProductList
	} from '@/api/product.js';

	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		data() {
			return {
				listSwiper: [
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				],
				productList: [],
				show: false,
				list1: [{
					name: '手机',
				}, {
					name: '电子配件',
					checked: true
				}, {
					name: '数码'
				}, {
					name: '电脑办公'
				}, {
					name: '奢品星选'
				}, {
					name: '玩具乐器'
				}, {
					name: '时令尝新'
				}, {
					name: '运动户外'
				}],
				loadingType: 'more', //加载更多的状态
				currentIndex: 0, // 默认选中第一个
				searchParam: {
					productCategoryId: null,
					pageNum: 1,
					pageSize: 6,
					sort: 0
				}
			}
		},
		onLoad() {
			this.searchParam.productCategoryId = this.currentIndex;
			this.loadData();
		},
		methods: {
			change() {

			},
			changeTabs(tabItemInfo) {
				console.log(tabItemInfo);
				this.searchParam.productCategoryId = tabItemInfo.index;
				this.loadingType = 'loading';
				this.loadData();
			},

			async loadData(type = 'add', loading) {
				this.searchParam.productCategoryId = 19;
				// 没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
				}


				if (type === 'refresh') {
					this.searchParam.pageNum = 1;
					this.productList = [];
				}

				// 根据搜索参数来查询对应的产品信息
				searchProductList(this.searchParam).then(response => {
					let productList = response.data.list;
					if (response.data.list.length === 0) {
						// 没有更多了
						this.loadingType = 'nomore';
						this.searchParam.pageNum--;
					} else {
						if (response.data.list.length < this.searchParam.pageSize) {
							this.loadingType = 'nomore';
							this.searchParam.pageNum--;
						} else {
							this.loadingType = 'more';
						}
						this.productList = this.productList.concat(productList);
					}

					if (type === 'refresh') {
						// 是下滑刷新还是整个页面刷新
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh();
						}
					}
				});
			},

			click() {

			},
			close() {
				this.show = false
			},
			open() {

			},
			showTag(index) {
				this.$api.msg(name);
				this.currentIndex = index;
				this.cleanOther();
				// 清空其他的checked
				this.list1[index]['checked'] = true;
				// 选中对应的tag
				this.show = false;

			},
			cleanOther() {
				for (var index = 0; index < this.list1.length; index++) {
					// 
					this.list1[index]['checked'] = false;
				}
			}
		}


	}
</script>

<style lang="scss">
	.tag_item {

		margin-bottom: 10%;
		margin-top: 5%;
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

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
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
	}


	// 实现对一行文字 超过隐藏并进行 只显示一行的效果，注意: 父级不能存在 align-item: center 效果
	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}
</style>