<template>

	<view class="container">
		<view class="addressInfo" v-for="(item,index) in addressList" @click="checkAddress(item)">
			<u-row>
				<u-col :span="9" offset="0.5">
					<u-row class="row-margin addressValue">
						<u-tag text="默认" plain size="mini" type="error" v-if="item.defaultStatus"></u-tag>
						{{item.province}} {{item.city}} {{item.region}} {{item.detailAddress}}
					</u-row>

					<u-row class="row-margin contactInfo">
						{{item.name + ' ' + item.phoneNumber}}
					</u-row>
				</u-col>

				<u-col :span="2.5">
					<u-row>
						<u-col :span="3" offset="3">
							<u-icon name="edit-pen" size="28" @click="addAddress('edit',item)"></u-icon>
						</u-col>
						<u-col :span="3" offset="2">
							<u-icon name="trash" size="28" @click="handleDeleteAddress(item.id)"></u-icon>
						</u-col>
					</u-row>
				</u-col>
			</u-row>
			<u-line></u-line>
		</view>

		<view class="addAddressButton">
			<!-- 按钮 -->
			<u-button type="primary" text="新建地址" customStyle="margin-top: 50px" @click="addAddress('add')" shape="circle"></u-button>
		</view>

	</view>
</template>

<script>
	import {
		fetchAddressList,
		deleteAddress
	} from '@/api/address.js';
	
	
	export default {
		data() {
			return {
				source: 0,
				addressList: []
			}
		},
		onLoad(option) {
			console.log(option.source);
			this.source = option.source;
			this.loadData();
		},
		methods: {
			async loadData() {
				fetchAddressList().then(response => {
					this.addressList = response.data;
				});
			},
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().currentAddress = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item) {
				if (type == 'edit') {
					uni.navigateTo({
						url: `/pages/address/addressManage?type=${type}&id=${item.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/address/addressManage?type=${type}`
					})
				}
			},
			//处理删除地址
			handleDeleteAddress(id){
				let superThis = this;
				uni.showModal({
				    title: '提示',
				    content: '是否要删除该地址',
				    success: function (res) {
				        if (res.confirm) {
				            deleteAddress(id).then(response=>{
								superThis.loadData();
							});
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			//添加或修改成功之后回调
			refreshList(data, type) {
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				// this.addressList.unshift(data);
				this.loadData();
				console.log(data, type);
			}

		}
	}
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;

		.addressInfo {
			margin-top: 20rpx;

			.row-margin {
				margin-bottom: 15rpx
			}

			.addressValue {
				font-size: 16px;
				color: #303133;
			}

			.contactInfo {
				font-size: 15px;
				color: #909399;
				margin-top: 8px;
			}
		}

		// 新建地址按钮
		.addAddressButton {
			position: fixed;
			left: 16px;
			right: 16px;
			bottom: 8px;
			z-index: 95;
			display: flex;
		}


	}
</style>