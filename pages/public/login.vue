<template>

	<view class="container">
		<view class="wrapper">

			<view class="welcome">
				欢迎回来！
			</view>


			<view>
				<u--form labelPosition="left" :model="userInfo" :rules="rules" ref="uForm">
					<u-form-item label="" prop="username" borderBottom ref="uForm" labelWidth="50px" leftIcon="account">
						<u--input v-model="userInfo.username" placeholder="请输入账号" border="none"></u--input>
					</u-form-item>


					<u-form-item label="" prop="password" borderBottom ref="uForm" labelWidth="50px" left-icon="lock">
						<u--input v-model="userInfo.password" password disabledColor="#ffffff" placeholder="请输入密码"
							border="none"></u--input>
					</u-form-item>
				</u--form>

				<u-button type="primary" text="提交" customStyle="margin-top: 50px" @click="submit"></u-button>
				<u-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></u-button>
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
				userInfo: {
					id: '1',
					iconUrl: '/static/userPhoto.jpeg',
					username: '',
					password: '',
				},
				rules: {
					'username': [{
						type: 'string',
						require: true,
						message: '请填写账号',
						trigger: ['blur', 'change']
					}]
				}
			}
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

			// 重置
			reset() {
				const validateList = ['username', 'password']
				this.$refs.uForm.resetFields()
				this.$refs.uForm.clearValidate()
				setTimeout(() => {
					this.$refs.uForm.clearValidate(validateList)
					// 或者使用 this.$refs.form1.clearValidate()
				}, 10)
			},
		}
	}
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;


		.wrapper {
			position: relative;
			z-index: 90;
			background: #fff;
			padding-bottom: 40upx;
			padding: 26px 17px;
			border-radius: 9px 9px 0 0;
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