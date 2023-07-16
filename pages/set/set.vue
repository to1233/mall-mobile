<template>
	<view class="container">

		<view class="setBody">
			<u-cell class="cell-item" isLink>
				<view slot="title">
					<text>个人资料</text>
				</view>

			</u-cell>
			

			<u-cell class="cell-item" title="实名认证" isLink>
			</u-cell>

			<u-cell class="cell-item push-message" title="消息推送">

				<view slot="value">
					<u-switch v-model="value3"></u-switch>
				</view>
			</u-cell>

			<u-cell class="cell-item" title="清除缓存" isLink>
			</u-cell>

			<u-cell class="cell-item" title="关于项目" isLink>
			</u-cell>

			<u-cell class="cell-item check-update" title="检查更新" isLink>
				<view slot="value">
					当前版本 1.0.3
				</view>
			</u-cell>


			<u-button @click="toLogout" class="custom-style" shape="circle" type="primary">退出登录</u-button>

		</view>

	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';

	import {
		cleanCacheInfo
	} from "@/api/member.js"



	export default {
		data() {
			return {
				value3: false,
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			console.log(this.userInfo);
		},
		
		methods: {

			...mapMutations(['logout']),
			// 退出登录
			toLogout() {
				uni.showModal({
					content: '确定要退出登录么',
					success: (e) => {

						if (e.confirm) {
							cleanCacheInfo(this.userInfo.id).then(reponse => {
								setTimeout(() => {
									uni.navigateBack();
								}, 200);
							});
							// 清除本地缓存
							this.logout();
							// 清除后端缓存
						}
					}
				});
			}
		}

	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.container {

		.setBody {
			.cell-item {
				line-height: 60rpx;
				background: #fff;
			}

			.push-message {
				margin-top: 8px;
				margin-bottom: 8px;
			}


			.check-update {
				margin-bottom: 50rpx;
			}

			.custom-style {
				height: 90rpx;

			}

		}




	}
</style>