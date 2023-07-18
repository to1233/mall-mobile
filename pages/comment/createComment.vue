<template>
	<view class="container">
		<!-- 产品属性 -->

		<view class="itemBox" @click="showProductParam">
			<u-cell :border="false">
				<view slot="icon" class="portrait-box">
					<u-image width="70px" height="70px" :src="orderItemInfo.productPic"></u-image>
				</view>

				<view slot="title" class="u-slot-title">
					<view class="brand_body_item">

						<text class="title clamp">{{orderItemInfo.productName}}</text>
						<text
							class="attr-box">{{formatProductAttr(orderItemInfo.productAttr)}}x{{orderItemInfo.productQuantity}}</text>
						<text class="price">{{orderItemInfo.productPrice}}</text>
					</view>
				</view>
			</u-cell>
		</view>

		<view class="itemBox">
			<u--textarea height="150" v-model="descContent" placeholder="请输入亲的评价">
			</u--textarea>
			<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
				:previewFullImage="true" :maxCount="6"></u-upload>
		</view>


		<view class="itemBox">
			<u-button @click="submitInfo()" type="primary">提交</u-button>
		</view>

		<u-popup :show="showType" @close="closeType" :closeOnClickOverlay="true" :round="10">
			<scroll-view scroll-y show-scrollbar>
				<view class="popupSec">
					<!-- 订单商品图片以及 对应的商品元素属性 -->
					<u-cell-group :border="false">
						<u-cell v-for="(orderItem, itemIndex) in orderChildItemList" :border="false"
							@click="choiceItem(orderItem)">
							<view slot="icon" class="portrait-box">
								<u-image width="70px" height="70px" :src="orderItem.productPic"></u-image>
							</view>

							<view slot="title" class="u-slot-title">
								<view class="brand_body_item">

									<text class="title clamp">{{orderItem.productName}}</text>
									<text
										class="attr-box">{{formatProductAttr(orderItem.productAttr)}}x{{orderItem.productQuantity}}</text>
									<text class="price">{{orderItem.productPrice}}</text>
								</view>
							</view>
						</u-cell>
					</u-cell-group>
				</view>
			</scroll-view>
		</u-popup>
	</view>


</template>

<script>
	import {
		fetchOrderDetail
	} from "@/api/order.js";

	import {
		createComment
	} from "@/api/comment.js";



	export default {
		data() {
			return {
				fileList1: [],
				src: 'https://cdn.uviewui.com/uview/album/1.jpg',
				descContent: '',
				showType: false,
				orderChildItemList: [],
				orderId: 1,
				orderItemInfo: {}, // 评价的目标对象
			}
		},
		onLoad(options) {
			// 对应的订单id
			if (options.orderId != undefined) {
				this.orderId = options.orderId;
			}
			// 加载对应的订单子集合
			this.loadOrderChildItemList();
		},

		// 
		computed: {
			// 格式化对应的订单子元素的属性
			fomrateProductAttr() {
				return `${this.formatProductAttr(this.orderItemInfo.productAttr)}x ${this.orderItemInfo.productQuantity}`;
			}
		},
		methods: {

			formatProductAttr(jsonAttr) {
				if (jsonAttr != undefined) {
					let attrArr = JSON.parse(jsonAttr);
					let attrStr = '';
					for (let attr of attrArr) {
						attrStr += attr.key;
						attrStr += ":";
						attrStr += attr.value;
						attrStr += ";";
					}
					return attrStr
				}
				return '';
			},


			// 根据订单id来获取对应的子商品集合
			loadOrderChildItemList() {
				fetchOrderDetail(this.orderId).then(reponse => {
					this.orderChildItemList = reponse.data.orderItemList;
					// 过滤出未被评论的商品
					this.orderChildItemList = this.orderChildItemList.filter(item => {
						return item.commentFlag == 0;
					})
					
					// 默认第一个
					this.orderItemInfo = this.orderChildItemList[0];
				})
			},
			// 选择这个orderItem 作为子集合
			choiceItem(orderItem) {
				this.orderItemInfo = orderItem;
				this.showType = false;
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url);
					// 上传的结果 
					console.log()
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {

				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://127.0.0.1:8201/mall-portal/upload/commentFile', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						header: {
							satoken: uni.getStorageSync('token')
						},
						success: (res) => {
							setTimeout(() => {
								var obj = JSON.parse(res.data);
								console.log(obj.data);
								resolve(obj.data.networkUrl)
							}, 1000)
						}
					});
				})
			},
			// 提交对应的信息
			submitInfo() {
				// 组装对象
				let resultObject = {
					'descContent': this.descContent,
					'productAttr': this.fomrateProductAttr,
					'productId': this.orderItemInfo.productId,
					'productSkuId': this.orderItemInfo.productSkuId,
					'omsOrderItemId': this.orderItemInfo.id,
					'urlList': this.fileList1.map(item => {
						return item.url;
					})
				}

				createComment(resultObject).then(response => {
					// 刷新上一个页面，并返回
					setTimeout(uni.navigateBack(), 300);
				});
			},

			showProductParam() {
				this.showType = true;
			},
			closeType() {
				this.showType = false
				// console.log('close');
			},


		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}


	.container {


		.brand_body_item {
			display: flex;
			flex-direction: column;
			padding: 0 15px 0 12px;
			overflow: hidden;
			box-sizing: border-box;

			.title {
				font-size: 15px;
				color: #303133;
				line-height: 1;
			}

		}

		.price {
			font-size: $font-base + 2upx;
			color: $font-color-dark;

			&:before {
				content: '￥';
				font-size: $font-sm;
				margin: 0 2upx 0 8upx;
			}
		}

		.num {
			margin: 0 4px;
			color: #303133;
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			font-size: 14px;
			color: #909399;
		}

		.attr-box {
			font-size: 14px;
			color: #909399;
			padding: 5px 6px;
		}


		.popupSec {
			height: 600rpx;
			padding: 0 40rpx;


		}

	}
</style>