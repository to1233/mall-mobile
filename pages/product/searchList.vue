<template>
	<view class="container">
		
		<view class="header">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background"></view>
		</view>
	
		<ProductListWithSale :productList="productList"></ProductListWithSale>
	</view>


</template>

<script>
	import ProductListWithSale from '@/components/product-list-with-sale.vue';
	
	import {
		searchProductList
	} from '@/api/product.js'
	
	export default {
		data() {
			return {
				loaded: false,
				brand: {},
				productList: [],
				loadingType: 'more',
				favoriteStatus: false,
				queryParam: {
					keyword: '手机',
					pageNum: 1,
					pageSize: 4
				}
			}
		},
		// 页面加载的时候
		onLoad(options) {
			this.loaded = true;
			this.queryParam.keyword = options.searchValue;
			this.loadData('refresh');
		},
		methods : {
			// 加载商品 带下拉刷新和上划加载
			async loadData(type = 'add', loading) {
				// 没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}
			
				if (type == 'refresh') {
					this.queryParam.pageNum = 1;
					this.productList = [];
				}
				searchProductList(this.queryParam).then(response => {
					let productList = response.data.list;
					if (response.data.list.length == 0) {
						// 没有更多
						this.loadingType = 'nomore';
						this.queryParam.pageNum--;
					} else {
						if (response.data.list.length < this.queryParam.pageSize) {
							this.loadingType = 'nomore';
							this.queryParam.pageNum--;
						} else {
							this.loadingType = 'more';
						}
						this.productList = this.productList.concat(productList);
					}
			
					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh();
						}
					}
				});
			},
		},
		
		// 监听搜索栏的确认事件
		onNavigationBarSearchInputConfirmed(event) {
			this.queryParam.keyword = event.text;
			this.loadData('refresh');
		},
		components: {
			ProductListWithSale
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}
	
	.header {
		position: relative;
		padding-top: 10px;
		background-color:  $page-color-base;
	
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
		}
	}
</style>