
import Vue from 'vue'
import App from './App'
import store from './store'
import uView from '@/uni_modules/uview-ui'
import './uni.promisify.adaptor'
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.prototype.$api = {msg,prePage};
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
