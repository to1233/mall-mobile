<template>

	<view class="container">
		<view class="addressInfo" v-for="(item,index) in addressList">
			<u-row>
				<u-col :span="9" offset="0.5">
					<u-row class="row-margin addressValue">
						<u-tag text="默认" plain size="mini" type="error" v-if="item.default"></u-tag>
						{{item.address}}
					</u-row>

					<u-row class="row-margin contactInfo">
						{{item.username + ' ' + item.tele}}
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
	export default {
		data() {
			return {
				addressList: [{
						address: '广东省 深圳市 福田区 清水河街道',
						username: '大梨',
						tele: '18033441849',
						id: 3
					},
					{
						address: '广东省 深圳市 福田区 清水河街道',
						username: '大梨',
						tele: '18033441849',
						default: true,
						id: 5
					}

				]
			}

		},
		methods: {
			// 通过对应的控制页面新增地址
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
			// 删除前进行提示 确认后进行删除
			handleDeleteAddress(id) {
				let superThis = this;
				uni.showModal({
					title: '提示',
					content: '是否要删除地址',
					success: function(res) {
						if (res.confirm) {
							superThis.$api.msg('删除成功');
						} else {
							superThis.$api.msg('取消删除');
						}
					}
				})
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