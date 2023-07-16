<template>
	<view class="container">


		<view class="formBody">
			<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
			<u--form labelPosition="left" :model="model1" ref="form1" labelWidth="160rpx" labelAlign="left">
				<u-form-item label="姓名" prop="userInfo.name" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.name" border="none" placeholder="请输入姓名"></u--input>
				</u-form-item>
				<u-form-item label="手机号码" prop="userInfo.tele" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.tele" border="none" placeholder="请输入手机号码"></u--input>
				</u-form-item>
				<u-form-item label="邮政编码" prop="userInfo.code" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.code" border="none" placeholder="请输入邮政编码"></u--input>
				</u-form-item>
				<u-form-item label="所在区域" prop="userInfo.addressMain" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.addressMain" border="none" placeholder="请选择所在区域"></u--input>
				</u-form-item>
				<u-form-item label="详细地址" prop="userInfo.addressDetail" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.addressDetail" border="none" placeholder="请输入详细地址"></u--input>
				</u-form-item>

				<u-form-item label="设为默认" prop="userInfo.default" borderBottom ref="item3">
					<u-switch slot="right" v-model="model1.userInfo.default" @change="change"></u-switch>
				</u-form-item>
			</u--form>

			<!-- 按钮 -->
			<u-button type="primary" text="提交" customStyle="margin-top: 50px" @click="submit" shape="circle"></u-button>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileList1: [],
				disabled1: false,
				tips: '',
				value: '',
				model1: {
					userInfo: {
						name: '大梨',
						sex: '',
						birthday: '',
						tele: '18033441849',
						code: '518000',
						addressDetail: '清水河街道',
						addressMain: '阿富汗 塔利班 居住地',
						default: false,
					},
					radiovalue1: '苹果',
					checkboxValue1: [],
					intro: '',
					code: ''
				},
				rules: {
					'userInfo.name': [{
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					}, {
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return uni.$u.test.chinese(value);
						},
						message: "姓名必须为中文",
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ["change", "blur"],
					}],
					'userInfo.tele': {
						type: 'string',
						required: true,
						message: '请填写手机号码',
						trigger: ['blur', 'change']
					},
					'userInfo.code': {
						type: 'string',
						required: true,
						message: '请填写邮政编码',
						trigger: ['blur', 'change']
					},

					'userInfo.addressMain': {
						type: 'string',
						required: true,
						message: '请填写邮政编码',
						trigger: ['blur', 'change']
					},

					'userInfo.addressDetail': {
						type: 'string',
						required: true,
						message: '请填写邮政编码',
						trigger: ['blur', 'change']
					}
				},
			}
		},

		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.form1.setRules(this.rules)
		},
		methods: {
			navigateBack() {
				uni.navigateBack()
			},
			change(e) {
				// console.log(e);
			},
			submit() {
				// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.form1.validate().then(res => {
					uni.$u.toast('校验通过');
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
		},
	}
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;

		.formBody {
			margin: 20rpx 20rpx;
		}
	}
</style>