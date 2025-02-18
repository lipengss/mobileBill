import type { DropdownItemOption, TagType } from 'vant';

// 收支类型
const EXPENSES: Map<EXPENSE_TYPE, { label: string; type: TagType; unit: string; color: string }> = new Map([
	['income', { label: '收入', type: 'primary', unit: '+', color: '#1989fa' }],
	['pay', { label: '支出', type: 'warning', unit: '-', color: '#ff976a' }],
]);

// 支付方式
const PAY_METHOD = new Map([
	['cash', { label: '现金', icon: 'cash', color: 'rgb(232, 56, 67)' }],
	['alipay', { label: '支付宝', icon: 'alipay', color: 'rgb(0, 159, 232)', rate: 0.38 }],
	['meituan', { label: '美团', icon: 'meituan', color: 'rgb(255, 195, 0)', rate: 8 }],
	['douyin', { label: '抖音', icon: 'douyin', color: 'rgb(1, 1, 1)', rate: 0 }],
	['wechat', { label: '微信', icon: 'wechat', color: 'rgb(72, 179, 56)', rate: 0 }],
]);

// 统计类型
const STATISTICS_TYPE = new Map<'purpose' | 'payMethod', { label: string; field: string }>([
	['purpose', { label: '用途分类', field: 'purpose' }],
	['payMethod', { label: '支付平台', field: 'payMethod' }],
]);

// 用途
const PURPOSE = new Map([
	['other', { label: '其他', icon: 'other' }],
	['deposit', { label: '续卡', icon: 'deposit' }],
	['catering', { label: '餐饮', icon: 'catering' }],
	['wages', { label: '工资', icon: 'wages' }],
	['manicure', { label: '美甲', icon: 'manicure' }],
	['eyelash', { label: '睫毛', icon: 'eyelash' }],
	['beauty', { label: '美容', icon: 'beauty' }],
	['product', { label: '产品', icon: 'product' }],
	['liveExpenses', { label: '生活缴费', icon: 'liveExpenses' }],
]);

// 将 Map类型转为数组
function formatMap(map: Map<string, any>): DropdownItemOption[] {
	return Array.from(map).map((item): DropdownItemOption => {
		return {
			text: typeof item[1] === 'object' ? item[1].label : item[1],
			value: item[0],
		};
	});
}

// 分割数据
function splitArrayIntoChunks<T>(arr: T[], chunkSize = 20) {
	const result = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		result.push(arr.slice(i, i + chunkSize));
	}
	return result;
}

function formatNumber(value: number) {
	if (value >= 10000) {
		// 如果大于等于 10000，使用 'w' 表示万，并保留一位小数
		return (value / 10000).toFixed(1) + 'w';
	} else if (value >= 1000) {
		// 如果大于等于 1000，使用 'k' 表示千，并保留一位小数
		return (value / 1000).toFixed(1) + 'k';
	} else {
		// 小于 1000 的数值保持原样
		return value.toString();
	}
}

export { EXPENSES, PAY_METHOD, PURPOSE, STATISTICS_TYPE, formatMap, splitArrayIntoChunks, formatNumber };
