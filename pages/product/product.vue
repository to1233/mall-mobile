<template>
	<view class="container">
		<view>
			<u-swiper :list="imageSwiperList" indicator indicatorMode="line" circular height="400"></u-swiper>
		</view>

		<view class="introduce-section">
			<text class="title"> {{product.name}}</text>
			<text class="title2"> {{product.subTitle}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{product.price}}</text>
				<text class="m-price">¥{{product.originalPrice}}</text>
			</view>

			<u-row class="bot-row">
				<u-col :span="3">
					<text>销量: {{product.sale}}</text>
				</u-col>
				<u-col :span="4">
					<text>库存: {{product.stock}}</text>
				</u-col>
				<u-col :span="4">
					<text>浏览量: 768</text>
				</u-col>
			</u-row>


			<u-row class="product-detail-row" @click="showDetailType">
				<u-col :span="3">
					<text>购买类型</text>
				</u-col>
				<u-col :span="8">
					<view style="display: flex;flex-direction: row;">
						<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
							{{sItem.name}}
						</text>
					</view>



				</u-col>
				<u-col :span="1">
					<text class="yticon icon-you"></text>
				</u-col>
			</u-row>
			<u-row class="product-detail-row" @click="showProductParam">
				<u-col :span="3">
					<text>商品参数</text>
				</u-col>
				<u-col :span="8">查看</u-col>
				<u-col :span="1">
					<text class="yticon icon-you"></text>
				</u-col>
			</u-row>
			<u-row class="product-detail-row">
				<u-col :span="3">
					<text>优惠券</text>
				</u-col>
				<u-col :span="8" style="color: #fa436a;">领取优惠券</u-col>
				<u-col :span="1">
					<text class="yticon icon-you"></text>
				</u-col>
			</u-row>

			<u-row class="product-detail-row">
				<u-col :span="3">
					<text>服务类型</text>
				</u-col>
				<u-col :span="8">无忧退货 ·快速退款 ·免费包邮 ·</u-col>
			</u-row>
		</view>

		<view class="eva-section"  v-if="commentInfo.commentCount > 0" @click="navToCommentList">
			<u-cell is-link :border="false">
				<view slot="title">
					<text>评价({{commentInfo.commentCount}})</text>
				</view>

				<view slot="value">
					<text>好评率 100%</text>
				</view>
			</u-cell>

			<u-row>
				<u-col :span="3">
					<view>
						<u-image :src="commentInfo.omsCommentDetail.memberLogoUrl" width="80px" height="80px"></u-image>
					</view>
				</u-col>
				<u-col :span="9">
					<u-row>
						<text>{{commentInfo.omsCommentDetail.memberName}}</text>
					</u-row>
					<u-row>
						<text class="con">{{commentInfo.omsCommentDetail.descContent}}</text>
					</u-row>
					<u-row class="bot">
						<u-col :span="6">
							<text class="attr">购买类型：{{commentInfo.omsCommentDetail.productAttr}}</text>
						</u-col>
						<u-col :span="6">
							<text class="time">{{commentInfo.omsCommentDetail.createDay}}</text>
						</u-col>
					</u-row>
				</u-col>
			</u-row>
			
		</view>
		
		<!-- 暂无任何评论 -->
		<view class="eva-section-no-comment" v-else>
			<text>暂无任何评论</text>
		</view>
		
		

		<!-- 品牌信息 -->
		<view class="brand-info" @click="navToBrandDetail">
			<view style="height: 44px;">
				<u-divider text="品牌信息"></u-divider>
			</view>

			<u-row>
				<u-col :span="4">
					<view class="image-wrapper">
						<u-image :src="brand.logo"
							mode="aspectFill" height="150rpx" width="150rpx"></u-image>
					</view>

				</u-col>
				<u-col :span="8">
					<u-row>
						<text>{{brand.name}}</text>
					</u-row>
					<u-row class="brand-hand-first">
						<text>品牌首字母：{{brand.firstLetter}}</text>
					</u-row>
				</u-col>
			</u-row>
		</view>


		<view class="detail-desc">
			<view style="height: 44px;">
				<u-divider text="图文详情"></u-divider>
			</view>
			<rich-text :nodes="desc"></rich-text>
		</view>


		<!-- 底部操作菜单 -->
		<view class="page-bottom">

			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>


			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>

			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>


			<view class="action-btn-group">
				<button type="primary" class="action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class="action-btn no-border add-cart" @click="addToCart">加入购物车</button>
			</view>
		</view>

		<u-popup :show="showType" @close="closeType" @open="open" :closeOnClickOverlay="true" :round="10">
			<view class="popupSec" @click.stop="stopPrevent">
				<u-row>
					<u-col :span="4" class="image-product">
						<image :src="product.pic"></image>
					</u-col>
					<u-col :span="8" class="right">
						<u-row>
							<text class="price">¥{{product.price}}</text>
						</u-row>
						<u-row>
							<text>库存：{{product.stock}}件 </text>
						</u-row>
						<u-row>
							<text style="display: flex;flex-direction: row;">已选：
							</text>
							<view style="display: flex;flex-direction: row;">
								<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
									{{sItem.name}}
								</text>
							</view>
						</u-row>
					</u-col>
				</u-row>



				<view v-for="(item,index) in specList" :key="index" class="color-param">
					<u-row>
						<text>{{item.name}}</text>
					</u-row>

					<view class="item-list">
						<u-tag v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id"
							shape="circle" size="large" :key="childIndex" class="tit" :plain="!childItem.selected"
							:text="childItem.name" @click="selectSpec(childIndex, childItem.pid)">
						</u-tag>
					</view>
				</view>
				<u-button type="primary" @click="toggleSpec" shape="circle">完成</u-button>
			</view>
		</u-popup>

		<u-popup :show="showParam" @close="closeParam" @open="open" :closeOnClickOverlay="true" :round="10">
			<view @click.stop="stopPrevent" class="popupSec">
				<u-row v-for="item in attrList" class="product-detail-row">
					<u-col :span="4">{{item.key}}</u-col>
					<u-col :span="8">{{item.value}}</u-col>
				</u-row>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import share from "@/components/share.vue";
	import {
		fetchProductDetail
	} from '@/api/product.js'

	import {
		addCartItem
	} from '@/api/cart.js';

	import {
		fetchProductCouponList,
		addMemberCoupon
	} from '@/api/coupon.js'

	import {
		createReadHistory
	} from '@/api/memberReadHistory.js';

	import {
		createProductCollection,
		deleteProductCollection,
		productCollectionDetail
	} from '@/api/memberProductCollection.js';
	
	import {
		findLastComment
	} from '@/api/comment.js';
	
	
	

	import {
		mapState
	} from 'vuex';

	import {
		formatDate
	} from '@/utils/date.js';


	const defaultServiceList = [{
		id: 1,
		name: "无忧退货"
	}, {
		id: 2,
		name: '快速退款'
	}, {
		id: 3,
		name: '免费包邮'
	}];

	const defaultShareList = [{
		type: 1,
		icon: '/static/temp/share_wechat.png',
		text: '微信好友'
	}, {
		type: 2,
		icon: '/static/temp/share_moment.png',
		text: '朋友圈'
	}, {
		type: 3,
		icon: '/static/temp/share_qq.png',
		text: 'QQ好友'
	}, {
		type: 4,
		icon: '/static/temp/share_qqzone.png',
		text: 'QQ空间'
	}]




	export default {
		data() {
			return {
				specClass: 'none',
				attrClass: 'none',
				specSelected: [],
				favorite: false,
				shareList: [],
				imgList: [],
				desc: '',
				commentInfo: [],
				specList: [],
				specChildList: [],
				product: {},
				brand: {},
				serviceList: [],
				skuStockList: [],
				attrList: [],
				promotionTipList: [],
				couponState: 0,
				couponList: [],
				src: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ac1bf58Ndefaac16.jpg',
				showType: false, // 商品类型
				showParam: false, // 商品属性
			}
		},
		computed: {
			...mapState(['hasLogin']),
			imageSwiperList() {
				return this.imgList.map(item => {
					return item.src;
				});
			}
		},

		// 其中 options 会序列化上个页面传递过来的参数
		async onLoad(options) {
			let id = options.id;
			this.shareList = defaultShareList;
			this.loadData(id);
			this.showProductComment(id);
		},
		filters: {
			formDateTime(time) {
				if (time == null || time == '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
			formatCouponUseType(useType) {
				if (useType == 0) {
					return "全场通用"
				} else if (useType == 1) {
					return "指定分类商品可用"
				} else if (useType == 2) {
					return "指定商品可用";
				}
				return null;
			},
		},
		methods: {
			async loadData(id) {
				fetchProductDetail(id).then(response => {
					console.log(response);
					this.product = response.data.product;
					this.skuStockList = response.data.skuStockList;
					this.brand = response.data.brand;
					this.initImgList();
					this.initServiceList();
					this.initSpecList(response.data);
					this.initAttrList(response.data);
					this.initPromotionTipList(response.data);
					this.initProductDesc();
					this.handleReadHistory();
					this.initProductCollection();
				});
			},
			
			async showProductComment(id) {
				console.log('请求评论');
				findLastComment(id).then(response => {
					this.commentInfo = response.data;
					console.log('对应的结果--' +  response.data);
				})
			},
			
			
			showDetailType() {
				this.showType = true;
			},
			closeType() {
				this.showType = false
				// console.log('close');
			},

			showProductParam() {
				this.showParam = true;
			},
			closeParam() {
				this.showParam = false
				// console.log('close');
			},

			open() {
				// console.log('open');
			},
			initImgList() {
				let tempPics = this.product.albumPics.split(',');
				// 添加产品的主图
				tempPics.unshift(this.product.pic);
				for (let item of tempPics) {
					if (item != null && item != '') {
						this.imgList.push({
							src: item
						});
					}
				}
				console.log('对应的图片集合')
				console.log(this.imgList);
			},

			// 收藏
			toFavorite() {


				// 如果没有登录则直接返回
				if (!this.checkForLogin()) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				if (this.favorite) {
					// 取消收藏
					deleteProductCollection({
						productId: this.product.id
					}).then(response => {
						uni.showToast({
							title: '取消收藏成功!',
							icon: 'none'
						});
						this.favorite = !this.favorite;
					})
				} else {
					//收藏
					let productCollection = {
						productId: this.product.id,
						productName: this.product.name,
						productPic: this.product.pic,
						productPrice: this.product.price,
						productSubTitle: this.product.subTitle
					}

					createProductCollection(productCollection).then(response => {
						uni.showToast({
							title: "收藏成功！",
							icon: 'none'
						});
						this.favorite = !this.favorite;
					});
				}
			},
			// 检查登录状态并弹出登录框
			checkForLogin() {
				console.log(this.hasLogin);
				if (!this.hasLogin) {
					uni.showModal({
						title: '提示',
						content: '你还没登录，是否要登录?',
						confirmText: '去登录',
						cancelText: '取消',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/public/login'
								})
							}
						}
					});
					return false;
				} else {
					return true;
				}
			},

			addToCart() {
				if (!this.checkForLogin()) {
					return;
				}
				let productSkuStock = this.getSkuStock();
				let cartItem = {
					price: this.product.price,
					productAttr: productSkuStock.spData,
					productBrand: this.product.brandName,
					productCategoryId: this.product.productCategoryId,
					productId: this.product.id,
					productName: this.product.name,
					productPic: this.product.pic,
					productSkuId: productSkuStock.id,
					productSn: this.product.productSn,
					productSubTitle: this.product.subTitle,
					quantity: 1
				};

				addCartItem(cartItem).then(response => {
					uni.showToast({
						title: response.message,
						duration: 1500
					})
				});
			},


			//设置商品规格
			initSpecList(data) {
				for (let i = 0; i < data.productAttributeList.length; i++) {
					let item = data.productAttributeList[i];
					if (item.type == 0) {
						this.specList.push({
							id: item.id,
							name: item.name
						});
						if (item.handAddStatus == 1) {
							//支持手动新增的
							let valueList = data.productAttributeValueList;
							let filterValueList = valueList.filter(value => value.productAttributeId == item.id);
							let inputList = filterValueList[0].value.split(',');
							for (let j = 0; j < inputList.length; j++) {
								this.specChildList.push({
									pid: item.id,
									pname: item.name,
									name: inputList[j]
								});
							}
						} else if (item.handAddStatus == 0) {
							//不支持手动新增的
							let inputList = item.inputList.split(',');
							for (let j = 0; j < inputList.length; j++) {
								this.specChildList.push({
									pid: item.id,
									pname: item.name,
									name: inputList[j]
								});
							}
						}
					}
				}
				let availAbleSpecSet = new Set();
				for (let i = 0; i < this.skuStockList.length; i++) {
					let spDataArr = JSON.parse(this.skuStockList[i].spData);
					for (let j = 0; j < spDataArr.length; j++) {
						availAbleSpecSet.add(spDataArr[j].value);
					}
				}
				// 根据商品sku筛选出可用规格
				this.specChildList = this.specChildList.filter(item => {
					return availAbleSpecSet.has(item.name)
				});
				// 规格 默认选中第一条
				this.specList.forEach(item => {
					for (let cItem of this.specChildList) {
						if (cItem.pid === item.id) {
							this.$set(cItem, 'selected', true);
							this.specSelected.push(cItem);
							this.changeSpecInfo();
							break;
						}
					}
				})
			},
			// 跳转到品牌详情页
			navToBrandDetail() {
				let id = this.brand.id;
				uni.navigateTo({
					url: '/pages/brand/brandDetail?id='+id
				})
			},
			// 跳转到评论集合页面
			navToCommentList() {
				let productId = this.product.id;
				console.log(this.product.id);
				 uni.navigateTo({
				 	url: '/pages/comment/list?productId='+productId
				 })
			},
			//设置服务信息
			initServiceList() {
				console.log(this.product);
				for (let item of defaultServiceList) {
					if (this.product.serviceIds.indexOf(item.id) != -1) {
						this.serviceList.push(item.name);
					}
				}
			},
			
			// 设置商品参数
			initAttrList(data) {
				for (let item of data.productAttributeList) {
					if (item.type == 1) {
						let valueList = data.productAttributeValueList;
						let filterValueList = valueList.filter(value => value.productAttributeId == item.id);

						let value = filterValueList[0].value;

						this.attrList.push({
							key: item.name,
							value: value
						});
					}
				}
			},

			initPromotionTipList(data) {
				let promotionType = this.product.promotionType;
				if (promotionType == 0) {
					this.promotionTipList.push("暂不优惠");
				} else if (promotionType == 1) {
					this.promotionTipList.push("单品优惠");
				} else if (promotionType == 2) {
					this.promotionType.push("会员优惠");
				} else if (promotionType == 3) {
					this.promotionTipList.push("多买优惠");
					for (let item of data.productLadderList) {
						this.promotionTipList.push("满" + item.count + "件打" + item.discount * 10 + "折");
					}
				} else if (promotionType == 4) {
					this.promotionTipList.push("满减优惠");
					for (let item of data.productFullReductionList) {
						this.promotionTipList.push("满" + item.fullPrice + "元减" + item.reducePrice + "元");
					}
				} else if (promotionType == 5) {
					this.promotionTipList.push("限时优惠")
				}
			},

			// 初始化商品详情信息
			initProductDesc() {
				let rawhtml = this.product.detailMobileHtml;
				let tempNode = document.createElement('div');
				tempNode.innerHTML = rawhtml;
				let imgs = tempNode.getElementsByTagName('img');
				for (let i = 0; i < imgs.length; i++) {
					imgs[i].style.width = '100%';
					imgs[i].style.height = 'auto';
					imgs[i].style.display = 'block';
				}
				this.desc = tempNode.innerHTML;
			},
			// 初始化收藏状态
			initProductCollection() {
				if (this.hasLogin) {
					productCollectionDetail({
						productId: this.product.id
					}).then(response => {
						this.favorite = response.data != null;
					});
				}
			},


			buy() {
				uni.showToast({
					title: '只支持从购物车下单',
					icon: 'none'
				})
			},



			handleReadHistory() {
				if (this.hasLogin) {
					let data = {
						productId: this.product.id,
						productName: this.product.name,
						productPic: this.product.pic,
						productPrice: this.product.price,
						productSubTitle: this.product.subTitle,
					}
					createReadHistory(data);
				}
			},
			stopPrevent() {},
			//规格弹窗开关,点击遮罩层来回切换
			toggleSpec() {
				this.showType = !this.showType;
			},
			// 属性弹框开关
			toggleAttr() {
				if (this.attrClass === 'show') {
					this.attrClass = 'hide';
					setTimeout(() => {
						this.attrClass = 'none'
					}, 250);
				} else if (this.attrClass === 'none') {
					this.attrClass = 'show'
				}
			},

			// 优惠券弹窗开关
			toggleCoupon(type) {
				fetchProductCouponList(this.product.id).then(response => {
					this.couponList = response.data;

					if (this.couponList == null || this.couponList.length == 0) {
						uni.showToast({
							title: '暂无可领优惠券',
							icon: "none"
						})
						return;
					}
					let timer = type === 'show' ? 10 : 300;
					let state = type === 'show' ? 1 : 0;
					this.couponState = 2;
					setTimeout(() => {
						this.couponState = state;
					}, timer)
				});
			},
			// 选择规格
			selectSpec(index, pid) {
				console.log('对应的信息----{}' + index);

				// 所有的规格子元素
				let list = this.specChildList;
				list.forEach(item => {
					// 
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				})
				// 更新对应数组中子元素的状态为选中状态
				this.$set(list[index], 'selected', true);
				// 存储已经选择
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				})

				// 选中的信息
				console.log("选中的信息---{}" + JSON.stringify(this.specSelected));


				this.changeSpecInfo();
			},
			// 当商品规格改变的时候，修改商品信息
			changeSpecInfo() {
				let skuStock = this.getSkuStock();
				if (skuStock != null) {
					this.product.originalPrice = skuStock.price;
					if (this.product.promotionType == 1) {
						// 单品优惠使用促销价
						this.product.price = skuStock.promotionPrice;
					} else {
						this.product.price = skuStock.price;
					}
					this.product.stock = skuStock.stock;
				}
			},
			// 获取当前选中商品的sku
			getSkuStock() {
				for (let i = 0; i < this.skuStockList.length; i++) {
					let spDataArr = JSON.parse(this.skuStockList[i].spData);
					let availAbleSpecSet = new Map();

					for (let j = 0; j < spDataArr.length; j++) {
						availAbleSpecSet.set(spDataArr[j].key, spDataArr[j].value);
					}

					let correctCount = 0;
					for (let item of this.specSelected) {
						let value = availAbleSpecSet.get(item.pname);
						// 如果选中的 规格与对应的sku的属性相同,则累加匹配的总数
						if (value != null && value == item.name) {
							correctCount++;
						}
					}

					if (correctCount == this.specSelected.length) {
						return this.skuStockList[i];
					}
				}
			},

			// 领取优惠券
			addCoupon(coupon) {
				this.toggleCoupon();
				addMemberCoupon(coupon.id).then(response => {
					uni.showToast({
						title: '领取优惠券成功 !',
						duration: 2000
					});
				});
			},
			share() {
				this.$refs.share.toggleMask();
			}

		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 160px;
	}


	.container {

		.introduce-section {
			background: #fff;
			padding: 20upx 30upx;

			.title {
				font-size: 32upx;
				color: $font-color-dark;
				height: 46upx;
				line-height: 46upx;
			}

			.title2 {
				font-size: 28upx;
				color: $font-color-light;
				height: 46upx;
				line-height: 46upx;
			}

			.price-box {
				display: flex;
				align-items: baseline;
				height: 64upx;
				padding: 10upx 0;
				font-size: 26upx;
				color: $uni-color-primary;
			}

			.price {
				font-size: $font-lg + 2upx;
			}

			.m-price {
				margin: 0 12upx;
				color: $font-color-light;
				text-decoration: line-through;
			}

			.bot-row {

				font-size: $font-sm;
				color: $font-color-light;

			}



		}

		.product-detail-row {
			padding: 20rpx 0rpx;
			border-bottom: 1px solid #E4E7ED;
		}

		.eva-section {
			padding: 20upx 30upx;
			background-color: #fff;
			margin-top: 20rpx;
			padding-bottom: 20rpx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
		
		// 没有评论
		.eva-section-no-comment {
			background-color: #fff;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		

		.brand-info {
			background-color: #fff;
			margin-top: 20rpx;
			padding: 20upx 30upx;

			.image-wrapper {
				display: flex;
				justify-content: center;
			}
		}


		.brand-hand-first {
			font-size: 13px;
			color: #909399;
			margin-top: 4px;
		}

		.detail-desc {
			background-color: #fff;
		}


		/* 底部操作菜单 */
		.page-bottom {
			position: fixed;
			left: 25rpx;
			bottom: 75rpx;
			z-index: 95;
			display: flex;
			justify-content: center;
			align-items: center;
			background: rgba(255, 255, 255, .9);
			box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
			border-radius: 16upx;
			width: 700rpx;
			height: 100rpx;

			.p-b-btn {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: $font-sm;
				color: $font-color-base;
				width: 96rpx;
				height: 80rpx;

				.yticon {
					font-size: 40rpx;
					line-height: 48rpx;
					color: $font-color-light;
				}	
				
				&.active,
				&.active .yticon {
					color: $uni-color-primary;
				}

			}
		}


		.action-btn-group {
			display: flex;
			height: 76rpx;
			border-radius: 100rpx;
			overflow: hidden;
			box-shadow: 0 20rpx 40rpx -16rpx #fa436a;

			box-shadow: 1rpx 2rpx 5rpx rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20rpx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28rpx;
				width: 0;
				border-right: 1rpx solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180rpx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}

		.popupSec {
			height: 600rpx;
			padding: 0 40rpx;

			.image-product {
				margin-top: -40rpx;
				border-radius: 8rpx;

				image {
					width: 150rpx;
					height: 150rpx;
				}

			}

			.right {
				font-size: 14px;
				color: #606266;
				line-height: 23px;

				.price {
					font-size: 17px;
					color: #fa436a;
					margin-bottom: 5px;
				}
			}


			.color-param {
				padding-top: 30rpx;

				.item-list {
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					display: flex;
					margin-top: 10rpx;
					margin-bottom: 20rpx;

					.tit {
						margin-right: 20px;
					}
				}
			}
		}


		.selected-text {
			margin-right: 10rpx;
		}
	}
</style>