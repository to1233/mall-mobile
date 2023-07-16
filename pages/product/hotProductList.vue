<template>

	<!-- 产品上新页面-->
	<view class="container">
		
		<HeadImage imageSrc="/static/hot_product_banner.png"></HeadImage>

		<u-gap height="10"></u-gap>


		<view class="brand-box">
			<u-row justify="center" customStyle="margin-bottom: 10px">
				相关产品
			</u-row>
			
			<ProductListWithSale :productList="productList"></ProductListWithSale>
			
		</view>

		<u-loadmore :status="loadingType" />

	</view>
</template>

<script>
	import {
		fetchHotProductList
	} from '@/api/home.js';
	
	import HeadImage from '@/components/head-image.vue';
	
	
	import ProductListWithSale from '@/components/product-list-with-sale.vue';
	
	export default {
		data() {
			return {
				loadingType: 'more', //加载更多状态
				productList: [],
				searchParam: {
					pageNum: 1,
					pageSize: 6
				}
			};
		},
		components:{
			ProductListWithSale,
			HeadImage
		},
		onLoad(options) {
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.searchParam.pageNum++;
			this.loadData();
		},
		methods: {
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}

				if (type === 'refresh') {
					this.searchParam.pageNum = 1;
					this.productList = [];
				}
				fetchHotProductList(this.searchParam).then(response => {
					let productList = response.data;
					if (response.data.length === 0) {
						//没有更多了
						this.loadingType = 'nomore';
						this.searchParam.pageNum--;
					} else {
						if (response.data.length < this.searchParam.pageSize) {
							this.loadingType = 'nomore';
							this.searchParam.pageNum--;
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
			//详情
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.container {

		.brand-box {
			padding: 16px;
			background: #fff;


			.brand-story-detail {
				font-size: 13px;
				color: #909399;
			}
		}
		
	}
</style>