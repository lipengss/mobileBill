<template>
	<router-view v-slot="{ Component }">
		<keep-alive :include="['statistics']">
			<component :is="Component" />
		</keep-alive>
		<a href="https://beian.miit.gov.cn" target="_blank" class="icp">备案号：京ICP备2024051908号-1</a>
	</router-view>
	<van-tabbar v-model="state.active" @change="onTabChange">
		<van-tabbar-item icon="orders-o" name="/bill">明细</van-tabbar-item>
		<van-tabbar-item icon="bar-chart-o" name="/statistics">统计</van-tabbar-item>
		<van-tabbar-item icon="setting-o" name="/settings">设置</van-tabbar-item>
	</van-tabbar>
</template>
<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const state = reactive({
	active: '/bill',
});

function onTabChange(active: string) {
	router.push({
		path: active,
	});
}
watchEffect(() => {
	state.active = route.path;
});
</script>
<style lang="scss" scoped>
.icp {
	display: block;
	text-align: center;
	padding: 10px 0 100px;
	color: #ccc;
}
</style>
