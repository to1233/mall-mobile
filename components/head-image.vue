<template>
	<view>
		<view class="top-image">
			<view class="image-wrapper">
				<image :src="imageSrc"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "head-image",
		props: {
			imageSrc: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	// 页面头部图片
	.top-image {
		height: 200px;

		.image-wrapper {
			display: flex;
			justify-content: center;
			align-content: center;
			width: 100%;
			height: 100%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>