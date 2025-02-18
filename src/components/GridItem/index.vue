<template>
	<div class="grid-wrap">
		<div class="item" v-for="item in props.options" @click="onClick(item.value)">
			<div class="icon" :class="{ active: isActive(item.value) }">
				<svg-icon :name="item.value" />
			</div>
			<div class="span">{{ item.text }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DropdownItemOption } from 'vant/es';
import type { DropdownItemOptionValue } from 'vant/lib/dropdown-item/types';
import { withDefaults, defineProps, ref, defineEmits, watch } from 'vue';
interface Props {
	value: string | Array<DropdownItemOptionValue>; // 值
	options: DropdownItemOption[]; // 数据
	bgColor?: string; // 背景颜色
	color?: string; // 文字颜色
	multiple?: boolean; // 是否多选
	activeColor?: string; // 选中颜色
}
const props = withDefaults(defineProps<Props>(), {
	value: '',
	options: () => [],
	bgColor: '#f7f8fa',
	color: '#969799',
	multiple: false,
	activeColor: '#07c160',
});

const emits = defineEmits(['update:value', 'change']);

const tagValue = ref<string | number | Array<DropdownItemOptionValue>>('');

function isActive(val: DropdownItemOptionValue) {
	if (props.multiple) {
		// 多选
		if (!Array.isArray(props.value)) {
			return console.warn('value Must be an Array');
		}
		return props.value.includes(val);
	} else {
		// 单选
		return val === tagValue.value;
	}
}

function onClick(val: DropdownItemOptionValue) {
	if (props.multiple) {
		if (Array.isArray(props.value)) {
			if (props.value.includes(val)) {
				const index = props.value.findIndex((item) => item === val);
				props.value.splice(index, 1);
			} else {
				props.value.push(val);
			}
			emits('update:value', props.value);
		} else {
			emits('update:value', [val]);
		}
	} else {
		emits('update:value', val);
	}
	emits('change', val);
}

watch(
	() => props.value,
	(val: string | Array<DropdownItemOptionValue>) => {
		tagValue.value = val;
	},
	{
		immediate: true,
	}
);
</script>
<style scoped lang="scss">
.grid-wrap {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-gap: 10px;
	.item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 4px;
		.icon {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			margin-bottom: 4px;
			font-size: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: var(--van-gray-1);
			color: var(--van-gray-6);
		}
		.span {
			font-size: 12px;
			color: var(--van-gray-6);
		}
	}
	.active {
		background-color: v-bind('props.activeColor') !important;
		color: #fff !important;
	}
}
</style>
