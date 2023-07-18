<template>
	<view class="container">

		<u-sticky>
			<view class="top-choice">
				<u-row style="line-height: 80rpx;">
					<u-col :span="3.5" :class="{current: filterIndex  == 0}" textAlign="center" @click="tabClick(0)">
						综合排序
					</u-col>
					<u-col :span="3.5" :class="{current: filterIndex == 1}" textAlign="center" @click="tabClick(1)">
						销量优先
					</u-col>
					<u-col :span="3.5" :class="{current: filterIndex  ===2 }" textAlign="center" @click="tabClick(2)">
						<view class="nav-item">
							<text>价格</text>
							<view class="p-box">
								<text :class="{active: priceOrder === 1 && filterIndex === 2}"
									class="yticon icon-shang"></text>
								<text :class="{active: priceOrder === 2 && filterIndex === 2}"
									class="yticon icon-shang xia"></text>
							</view>
						</view>
					</u-col>
					<u-col :span="1.5" textAlign="center" @click="showRightType">
						<view class="nav-item">
							<view style="margin-right:15rpx;">
								<u-line direction="col" length="30" color="#ddd"></u-line>
							</view>

							<u-icon name="more-circle"></u-icon>
						</view>

					</u-col>
				</u-row>
			</view>
		</u-sticky>


		<view class="search-product-grid">
		
			<ProductListWithSale :productList="productList"></ProductListWithSale>
		</view>

		<u-loadmore :line="true" status="nomore"></u-loadmore>
		<u-popup :show="show" mode="right" @close="close" @open="open" :safeAreaInsetTop="true"
			:customStyle="{'width' : '500rpx'}">
			<u-cell-group v-for="item in cateList" :key="item.id">
				<u-cell style="background: #f8f8f8 ;">
					<view slot="title">
						{{item.name}}
					</view>

				</u-cell>

				<u-cell v-for="tItem in item.children" :key="tItem.id" @click="changeCate(tItem)">
					<view slot="title" :class="{active: tItem.id==searchParam.productCategoryId}">
						{{tItem.name}}
					</view>
				</u-cell>
			</u-cell-group>
		</u-popup>

	</view>

</template>

<script>
	import {
		searchProductList,
		fetchCategoryTreeList
	} from '@/api/product.js';

	import ProductListWithSale from '@/components/product-list-with-sale.vue';


	export default {
		components: {
			ProductListWithSale
		},
		data() {
			return {
				currentIndex: 0,
				list1: [{
					name: '综合排序',
				}, {
					name: '销量',
				}, {
					name: '销量',
				}],
				filterIndex: 0,
				priceOrder: 1,
				productList: [],

				show: false,
				cateList: [],
				searchParam: {
					productCategoryId: null,
					pageNum: 1,
					pageSize: 6,
					sort: 0
				}
			}
		},
		onLoad(options) {
			this.searchParam.productCategoryId = options.sid;
			this.loadCateList(options.fid, options.sid);
			this.loadData();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		onReachBottom() {
			this.searchParam.pageNum++;
			this.loadData();
		},
		methods: {
			tabClick(index) {
				console.log(index);
				this.filterIndex = index;
			},
			// 加载文件
			async loadData(type = 'add', loading) {
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
				if (this.filterIndex == 0) {
					this.searchParam.sort = 0;
				}
				if (this.filterIndex === 1) {
					this.searchParam.sort = 2;
				}

				if (this.filterIndex === 2) {
					if (this.priceOrder == 1) {
						this.searchParam.sort = 3;
					} else {
						this.searchParam.sort = 4;
					}
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
							this.loadingType = 'loadmore';
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
			// 筛选点击
			tabClick(index) {
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				if (index === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				} else {
					this.priceOrder = 0;
				}

				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			// 详情
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},


			//分类点击
			changeCate(item) {
				this.searchParam.productCategoryId = item.id;
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
				this.show = false;
			},
			// 加载分类
			async loadCateList(fid, sid) {
				fetchCategoryTreeList().then(response => {
					this.cateList = response.data;
				})
			},
			// 展示右侧类型的展示
			showRightType() {
				this.show = true;
			},

			open() {
				// console.log('open');
			},
			close() {
				this.show = false
				// console.log('close');
			}

		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.container {



		.top-choice {
			background-color: #fff;

			.nav-item {

				display: flex;
				justify-content: center;
				align-items: center;


				.p-box {
					display: flex;
					flex-direction: column;

					.yticon {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 30upx;
						height: 14upx;
						line-height: 1;
						margin-left: 4upx;
						font-size: 26upx;

						color: #888;

						&.active {
							color: $base-color;
						}
					}

					.xia {
						transform: scaleY(-1);
					}
				}
			}
		}


		.current {
			color: $base-color;
		}

		.active {
			color: $base-color;
		}

		/** 分类对应的商品集合 **/
		.search-product-grid {
			background-color: #fff;
			margin-top: 20rpx;

		}
	}
</style>