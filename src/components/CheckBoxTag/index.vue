<template>
	<van-space :size="10" wrap>
		<div class="checkbox-tag" v-for="tag in props.options" :class="[isActive(tag.value) ? 'active' : '', props.size]" @click="onClick(tag.value)">
			{{ tag.text }}
		</div>
	</van-space>
</template>
<script setup lang="ts">
import { withDefaults, defineProps, ref, defineEmits, watch } from 'vue';
import type { DropdownItemOption } from 'vant';
import type { DropdownItemOptionValue } from 'vant/lib/dropdown-item/types';

interface Props {
	value: string | Array<DropdownItemOptionValue>; // 值
	options: DropdownItemOption[]; // 数据
	bgColor?: string; // 背景颜色
	color?: string; // 文字颜色
	multiple?: boolean; // 是否多选
	activeColor?: string; // 选中颜色
	size?: string; // small default larger
}
const props = withDefaults(defineProps<Props>(), {
	value: '',
	options: () => [],
	bgColor: '#f7f8fa',
	color: '#969799',
	multiple: false,
	activeColor: '#1989fa',
	size: 'default',
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
			emits('change', props.value);
		} else {
			emits('update:value', [val]);
			emits('change', [val]);
		}
	} else {
		emits('update:value', val);
		emits('change', val);
	}
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
<style lang="scss" scoped>
:deep .van-space-item {
	margin-bottom: 0 !important;
}
.checkbox-tag {
	text-wrap: nowrap;
	display: flex;
	align-items: center;
	border-radius: 4px;
	background-color: v-bind('props.bgColor');
	color: v-bind('props.color');
	font-size: var(--van-tag-large-font-size);
}
.small {
	padding: var(--van-tag-large-padding);
}
.default {
	padding: 4px 16px;
}
.larger {
	padding: 5px 22px;
}
.active {
	background-color: v-bind('props.activeColor');
	color: #fff !important;
}
</style>
