<script>
	
	import {
		mapMutations
	} from 'vuex';
	
	export default {
		methods: {
			...mapMutations(['login'])
		},
		
		
		onLaunch: function() {
			// 加载缓存信息 防止页面刷新的时候 store 丢失
			let userInfo = uni.getStorageSync('userInfo') || '';
			if(userInfo.id) {
				// 更新登录状态
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						this.login(res.data);
					}
				})
			}
			
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";

	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}


	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialased;
		-moz-osx-font-smoothing: grayscale;
	}



	// 显示对应的图标
	.icon-xuanzhong2:before {
		content: "\e62f";
	}
	
	.icon-daifukuan:before {
		content: "\e68f";
	}
	
	.icon-yishouhuo:before {
		content: "\e71a";
	}
	
	
	.icon-shouye:before {
		content: "\e626";
	}
	
	.icon-shang:before {
		content: "\e624";
	}
	
	.icon-xia:before {
		content: "\e62d";
	}
	
	
	
	.icon-fork:before {
		content: "\e61b";
	}

	.icon-dizhi:before {
		content: "\e614";
	}
	
	
	.icon-saomiao:before {
		content: "\e60d";
	}
	
	.icon-shezhi:before {
		content: "\e60f";
	}
	
	.icon-shouhoutuikuan:before {
		content: "\e631";
	}
	
	.icon-gouwuche:before {
		content: "\e609";
	}
	
	// 箭头
	.icon-you:before {
		content: "\e606";
	}
	
	
	
	.icon-dizhi:before {
		content: "\e614";
	}
	
	.icon-lishijilu:before {
		content: "\e6b9";
	}
	
	.icon-shoucang_xuanzhongzhuangtai:before {
		content: "\e6a9";
	}
	
	.icon-shoucang2:before {
		content: "\e62e";
	}
	.icon-shouhuodizhi:before {
		content: "\e712";
	}
	
	.icon-shoucang:before {
		content: "\e645";
	}
	
	
	.icon-pingjia:before {
		content: "\e67b";
	}
	
	.icon-shezhi1:before {
		content: "\e61d";
	}
	
	.icon-xiatubiao--copy:before {
		content: "\e608";
	}
	
	.icon-iconfontshanchu1:before {
		content: "\e619";
	}
	
	
	// 微信图标
	.icon-weixinzhifu:before {
		content: "\e61a";
	}
	
	// 支付宝图标
	.icon-alipay:before {
		content: "\e636";
	}
	
	//成功按钮
	
	


	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
	
	
	
	// 文字换行并处理
	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}
	
	// 内容框架
	.itemBox {
		background: #fff;
		padding: 24rpx 24rpx;
		border-radius: 20rpx;
		overflow: hidden;
		margin-top: 24rpx;
		justify-content: space-around;
		align-content: center;
	
	
		margin-top: 11px;
		background-color: #fff;
	}
	
</style>