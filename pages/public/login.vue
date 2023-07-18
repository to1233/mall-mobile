<template>

	<view class="container">
		<view class="img-a">
		</view>
		<view class="wrapper">

			<view>
				<u--form labelPosition="left" :model="form" :rules="rules" ref="uForm">
					<u-form-item label="" prop="username" borderBottom labelWidth="50px" leftIcon="account">
						<u--input v-model="form.username" placeholder="请输入账号" border="none"></u--input>
					</u-form-item>


					<u-form-item label="" prop="password" borderBottom labelWidth="50px" left-icon="lock">
						<u--input v-model="form.password" password disabledColor="#ffffff" placeholder="请输入密码"
							border="none"></u--input>
					</u-form-item>
				</u--form>

				<u-button type="primary" shape="circle" text="登录" customStyle="margin-top: 50px"
					@click="submit"></u-button>
				<u-button shape="circle" text="注册" customStyle="margin-top: 20px" @click="navToRegister()"></u-button>
			</view>


		</view>
	</view>


</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import {
		memberLogin,
		memberInfo
	} from '@/api/member.js';
	export default {
		data() {
			return {
				// 登录的用户信息
				form: {
					username: 'test',
					password: '',
				},
				rules: {
					username: [{
						require: true,
						message: '请填写账号',
						trigger: ['blur', 'change']
					}]
				}
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			// 登录
			...mapMutations(['login']),
			// 登录
			submit() {
				// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.uForm.validate().then(res => {
					uni.$u.toast('校验通过');

					memberLogin({
						username: this.userInfo.username,
						password: this.userInfo.password
					}).then(response => {
						let token = response.data.token.tokenValue;
						// 存储到缓存中
						// 存储到缓存中
						uni.setStorageSync('token', token);
						uni.setStorageSync('username', this.userInfo.username);
						uni.setStorageSync('password', this.userInfo.password);

						memberInfo().then(response => {
							console.log(response.data);
							this.login(response.data);
							uni.navigateBack();
						});

					}).catch(() => {
						this.logining = false;
					});

				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			// 跳转到注册界面
			navToRegister() {
					
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;

		.img-a {
			width: 100%;
			height: 450rpx;
			background-image: url(../../static/head.png);
			background-size: 100%;
		}

		.wrapper {
			position: relative;
			margin-top: -62px;
			background-color: #ffffff;
			padding: 26px 30px;
			border-radius: 8% 8% 0% 0;
			width: 100%;
		}

		.welcome {
			text-align: left;
			font-size: 25px;
			color: #000;
			padding: 165px 0 66px 0;
			font-weight: bold;
		}
	}
</style>