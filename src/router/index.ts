import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/index.vue';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'layout',
		component: Layout,
		redirect: '/bill',
		children: [
			{
				path: '/bill',
				name: 'bill',
				meta: {
					title: '明细',
				},
				component: () => import('@/views/bill/index.vue'),
			},

			{
				path: '/statistics',
				name: 'statistics',
				meta: {
					title: '统计',
				},
				component: () => import('@/views/statistics/index.vue'),
			},
			{
				path: '/settings',
				name: 'settings',
				meta: {
					title: '设置',
				},
				component: () => import('@/views/settings/index.vue'),
			},
		],
	},
	{
		path: '/details',
		name: 'details',
		meta: {
			title: '账单详情',
		},
		component: () => import('@/views/bill/details/index.vue'),
	},
	{
		path: '/purposeTotal',
		name: 'purposeTotal',
		meta: {
			title: '消费类型',
		},
		component: () => import('@/views/statistics/purposeTotal/index.vue'),
	},
];

const router = createRouter({
	history: createWebHistory('/mobile/'), // history 模式则使用 createWebHistory()
	routes,
});

export default router;
