import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';

import router from '@/router/index';
import { createPinia } from 'pinia';

import { Toast, Dialog } from 'vant';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';

const app = createApp(App);

// 引入组件
import 'virtual:svg-icons-register';
// @ts-ignore
import SvgIcon from './components/SvgIcon/SvgIcon.vue';

app.component('SvgIcon', SvgIcon);
app.use(router);
app.use(Toast);
app.use(Dialog);
app.use(createPinia());

app.mount('#app');
