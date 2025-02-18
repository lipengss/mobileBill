<template>
	<van-space>
		<van-button size="mini" type="primary" icon="arrow-left" @click="handlePrevMonth" />
		<div class="expenses" @click="showPicker = true" :style="props.style">
			{{ dayjs(props.value).format(props.showFormat) }}
		</div>
		<van-button size="mini" type="primary" icon="arrow" @click="handleNextMonth" />
	</van-space>
	<van-popup v-model:show="showPicker" position="bottom">
		<van-date-picker
			v-model="dateValue"
			title="选择日期"
			:min-date="new Date(2020, 0, 1)"
			:max-date="new Date()"
			:columns-type="props.columnsType"
			@confirm="onConfirm"
			@cancel="onCancel"
		/>
	</van-popup>
</template>
<script setup lang="ts">
import { withDefaults, defineProps, ref, defineEmits, watch } from 'vue';
import { dayjs } from '@/utils/tools';
import type { DatePickerColumnType } from 'vant';

interface Props {
	value: string; // 值
	bgColor?: string; // 背景颜色
	color?: string; // 文字颜色
	showFormat?: string;
	columnsType?: DatePickerColumnType[];
	style?: any;
}
const props = withDefaults(defineProps<Props>(), {
	value: '',
	bgColor: '#f7f8fa',
	color: '#969799',
	showFormat: 'MM月DD日',
	columnsType: () => ['year', 'month'],
	style: {},
});
const showPicker = ref(false);

const emits = defineEmits(['update:value']);

function onCancel() {
	showPicker.value = false;
}
function onConfirm({ selectedValues }: any) {
	showPicker.value = false;
	const date = dayjs(selectedValues).format('YYYY-MM');
	emits('update:value', date);
}

function handlePrevMonth() {
	const date = dayjs(props.value).subtract(1, 'month').format('YYYY-MM');
	emits('update:value', date);
}

function handleNextMonth() {
	const date = dayjs(props.value).add(1, 'month').format('YYYY-MM');
	emits('update:value', date);
}

const dateValue = ref<string[]>([]);

function setDate() {
	dateValue.value = dayjs(props.value).format(props.value).split('-');
}

watch(() => props.value, setDate, {
	immediate: true,
});
</script>
<style lang="scss" scoped>
.expenses {
	display: flex;
	align-items: center;
	border-radius: 4px;
	background-color: v-bind('props.bgColor');
	color: v-bind('props.color');
}
</style>
