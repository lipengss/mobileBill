import dayjs from 'dayjs';
import numeral from 'numeral';
import { filesize, type FileSizeReturnArray } from 'filesize';
import { isEqual, flatten, sortBy, cloneDeep } from 'lodash-es';
import { Local, Session } from './storage';
import { nanoid } from 'nanoid';

function getDayOfWeek(date: string) {
	const today = dayjs();
	// 创建一个 dayjs 对象
	const dayOfWeek = dayjs(date).day();
	// 定义一个星期几的数组
	const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	if (dayjs(date).isSame(today, 'day')) {
		return '今天';
	} else {
		// 返回对应的星期几
		return daysOfWeek[dayOfWeek];
	}
}

function getBytes(jsonData: Array<IOrder>): number {
	try {
		const jsonString = jsonData.length ? JSON.stringify(jsonData) : '';
		const blob = new Blob([jsonString], { type: 'application/json' });
		return blob.size;
	} catch (e) {
		return 0;
	}
}

function formatNum(num: string | number, format: string = '0.00'): string {
	return numeral(num).format(format);
}

function convertToPercentages(arr: number[]): number[] {
	if (!arr.length) return []; // 如果数组为空，返回空数组
	// 找到数组中的最大值
	const max = arr.reduce((pre, cur) => pre + cur, 0);
	// 将数组中的其他值转换为百分比
	return arr.map((num) => Math.floor(numeral(num).divide(max).multiply(100).value() || 0));
}

function multiply(num: number | string, rate: number): string | number {
	if (!num) return 0;
	const b = numeral(rate).divide(100).value();
	return numeral(num).multiply(b).format('0.00');
}

function add(num1: number | string, num2: number | string): string {
	return numeral(num1).add(num2).format('0.00');
}

function subtract(num1: number | string, num2: number | string): string {
	return numeral(num1).subtract(num2).format('0.00');
}

export {
	dayjs,
	add,
	isEqual,
	flatten,
	sortBy,
	cloneDeep,
	nanoid,
	getDayOfWeek,
	getBytes,
	filesize,
	formatNum,
	multiply,
	subtract,
	convertToPercentages,
	numeral,
	Local,
	Session,
};
