<template>
	<view class="u-page">
		<u-navbar title="表单" @leftClick="navigateBack" safeAreaInsetTop fixed placeholder></u-navbar>
		<view class="u-demo-block">
			<text class="u-demo-block__title">基础使用</text>
			<view class="u-demo-block__content">
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<u--form labelPosition="left" :model="model1" ref="form1">
					<u-form-item label="姓名" prop="userInfo.name" borderBottom ref="item1">
						<u--input v-model="model1.userInfo.name" border="none" placeholder="姓名,只能为中文"></u--input>
					</u-form-item>

					<u-button type="primary" text="提交" customStyle="margin-top: 50px" @click="submit"></u-button>
					<u-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></u-button>
				</u--form>
			</view>
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
				showCalendar: false,
				showBirthday: false,
				model1: {
					userInfo: {
						name: '楼兰',
						sex: '',
						birthday: ''
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
					}],
				}
			}
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.form1.setRules(this.rules)
		},
		methods: {
			afterRead(event) {
				this.fileList1.push({
					url: event.file,
					status: 'uploading',
					message: '上传中'
				})
			},
			groupChange(n) {
				// console.log('groupChange', n);
			},
			radioChange(n) {
				// console.log('radioChange', n);
			},
			navigateBack() {
				uni.navigateBack()
			},
			sexSelect(e) {
				this.model1.userInfo.sex = e.name
				this.$refs.form1.validateField('userInfo.sex')
			},
			change(e) {
				// console.log(e);
			},
			formatter(day) {
				const d = new Date()
				let month = d.getMonth() + 1
				const date = d.getDate()
				if (day.month == month && day.day == date + 3) {
					day.bottomInfo = '有优惠'
					day.dot = true
				}
				return day
			},
			calendarConfirm(e) {
				this.showCalendar = false
				this.model1.hotel = `${e[0]} / ${e[e.length - 1]}`
				this.$refs.form1.validateField('hotel')
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						uni.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			calendarClose() {
				this.showCalendar = false
				this.$refs.form1.validateField('hotel')
			},
			birthdayClose() {
				this.showBirthday = false
				this.$refs.form1.validateField('userInfo.birthday')
			},
			birthdayConfirm(e) {
				this.showBirthday = false
				this.model1.userInfo.birthday = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
				this.$refs.form1.validateField('userInfo.birthday')
			},
			submit() {
				// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.form1.validate().then(res => {
					uni.$u.toast('校验通过')
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			reset() {
				const validateList = ['userInfo.name', 'userInfo.sex', 'radiovalue1', 'checkboxValue1', 'intro',
					'hotel', 'code', 'userInfo.birthday'
				]
				this.$refs.form1.resetFields()
				this.$refs.form1.clearValidate()
				setTimeout(() => {
					this.$refs.form1.clearValidate(validateList)
					// 或者使用 this.$refs.form1.clearValidate()
				}, 10)
			},
			hideKeyboard() {
				uni.hideKeyboard()
			}
		},
	}
</script>

<style lang="scss">

</style>