<template>
	<view class="container">

		<view>
			<!-- 空白页 -->
			<view v-if="!hasLogin || empty === true" class="empty">
				<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png">
				</u-empty>
			</view>


			<!-- 购物车列表 -->

			<view v-else>
				<view class="cartItemList">

					<u-grid :border="false"  col="1">
						<u-grid-item v-for="(item,index) in cartList" :key="index">
							<view class="brand_body_item">

								<view style="position: relative;">
									<u-image width="126px" height="126px" mode="aspectFill" :src="item.productPic">
									</u-image>

									<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}"
										@click="check('item',index)"></view>
								</view>

								<view class="item-right">
									<text class="title clamp">{{item.productName}}</text>
									<text class="attr">{{item.spDataStr}}</text>
									<text class="price">￥{{item.price}}</text>
									<u-number-box v-model="item.quantity" @change="onChange" :name="index"></u-number-box>
								</view>

								<text class="del-btn yticon icon-fork"   @click.stop.prevent="handleDeleteCartItem(index)"></text>
							</view>
						</u-grid-item>
					</u-grid>
				</view>

				<!--底部去结算的效果-->
				<view class="action-section">
					<view class="checkbox">
						<image :src="allChecked ? '/static/selected.png' : '/static/select.png'" mode="aspectFit">
						</image>
						<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
							清空
						</view>
					</view>
					<view class="total-box">
						<text class="price">¥{{total}}元</text>
					</view>
					<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
				</view>
			</view>
		</view>

	</view>


</template>

<script>
	import {
		mapState
	} from 'vuex';

	import {
		fetchCartList,
		deleteCartItem,
		updateQuantity,
		clearCartList,
	} from '@/api/cart.js';


	export default {
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
			};
		},
		onShow() {
			// 页面显示的时候重新加载购物车
			this.loadData();
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			// 请求数据
			async loadData() {
				if (!this.hasLogin) {
					return;
				}
				fetchCartList().then(response => {
					let list = response.data;
					let cartList = list.map(item => {
						item.checked = true;
						item.loaded = "loaded";
						let spDataArr = JSON.parse(item.productAttr);
						let spDataStr = '';
						for (let attr of spDataArr) {
							spDataStr += attr.key;
							spDataStr += ":";
							spDataStr += attr.value;
							spDataStr += ";";
						}
						item.spDataStr = spDataStr;
						return item;
					});
					this.cartList = cartList;
					this.calcTotal(); //计算总价
				});
			},
			onChange(e) {
			
				let cartItem = this.cartList[e.name];
				// 更新后端对应的购物车数据
				updateQuantity({id:cartItem.id, quantity: e.value}).then(response => {
					cartItem.quantity = e.value;
					this.calcTotal();
				});
		
			},
			// 登录界面
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {

					// 取反
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked;
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			// 数量
			numberChange(data) {
				let cartItem = this.cartList[data.index];
				// 更新后端对应的购物车数据
				updateQuantity({
					id: cartItem.id,
					quantity: data.number
				}).then(response => {
					cartItem.quantity = data.number;
					this.calcTotal();
				});
			},
			// 删除
			handleDeleteCartItem(index) {
				let list = this.cartList;
				let row = list[index];
				let id = row.id;
				deleteCartItem({
					ids: id
				}).then(response => {
					this.cartList.splice(index, 1);
					this.calcTotal();
					this.hideLoading();
				});
			},
			clearCart() {
				clearCartList().then(response => {
					uni.showModal({
						content: '清空购物车？',
						success: (e) => {
							if (e.confirm) {
								this.cartList = [];
							}
						}
					})
				})
			},
			// 计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						total += item.price * item.quantity;
					} else if (checked === true) {
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			// 创建订单
			createOrder() {

				let list = this.cartList;
				let cartIds = [];
				list.forEach(item => {
					if (item.checked) {
						cartIds.push(item.id);
					}
				})
				if (cartIds.length == 0) {
					uni.showToast({
						title: '您还未选择要下单的商品！',
						duration: 1000
					})
					return;
				}
				uni.navigateTo({
					url: `/pages/order/createOrder?cartIds=${JSON.stringify(cartIds)}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;

		/* 空白页*/
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}


		.cartItemList {

			// 重写对应的样式
			.u-grid-item {
				align-items: normal;
			}

			.brand_body_item {
				display: flex;
				flex-direction: row;
				padding: 30upx 40upx;

				.checkbox {
					position: absolute;
					left: -16upx;
					top: -16upx;
					z-index: 8;
					font-size: 44upx;
					line-height: 1;
					padding: 4upx;
					color: $font-color-disabled;
					background: #fff;
					border-radius: 50px;
				}


				.checked {
					color: $uni-color-primary;
				}

				.item-right {
					display: flex;
					flex-direction: column;
					flex: 1;
					overflow: hidden;
					position: relative;
					padding-left: 30upx;


					.title,
					.price {
						font-size: $font-base + 2upx;
						color: $font-color-dark;
						height: 40upx;
						line-height: 40upx;
					}

					.attr {
						font-size: $font-sm + 2upx;
						color: $font-color-light;
						height: 50upx;
						line-height: 50upx;
					}

					.price {
						height: 50upx;
						line-height: 50upx;
					}
				}


				.del-btn {
					padding: 4upx 10upx;
					font-size: 34upx;
					height: 50upx;
					color: $font-color-light;
				}

			}




		}

	}


	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}

		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: .2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}


		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}


		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
</style>