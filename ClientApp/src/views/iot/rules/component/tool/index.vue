<template>
	<div class="workflow-tool">
		<div class="pl15">{{ setToolTitle }}</div>
		<div class="workflow-tool-right">
			<div class="workflow-tool-icon" v-for="(v, k) in state.toolList" :key="k" :title="v.title"
				@click="onToolClick(v.fnName)">
				<SvgIcon :name="v.icon" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, computed, reactive, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';

const emit = defineEmits(["tool"]);
const props = defineProps({
  ruleName: {
    type: String,
    default: ''
  }
})
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	toolList: [
{ icon: 'ele-Help', title: 'Help', fnName: 'help' },
{ icon: 'ele-Download', title: 'Download', fnName: 'download' },
{ icon: 'ele-Check', title: 'submit', fnName: 'submit' },
{ icon: 'ele-DocumentCopy', title: 'Copy', fnName: 'copy' },
{ icon: 'ele-Delete', title: 'Delete', fnName: 'del' },
{ icon: 'ele-FullScreen', title: 'fullscreen', fnName: 'fullscreen' },
{ icon: 'ele-Back', title: 'return', fnName: 'return' },

],
});
//Set tool title
const setToolTitle = computed(() => {
let { globalTitle } = themeConfig.value;
return `${globalTitle} rule design-`+props.ruleName;
});
//Top toolbar
const onToolClick = (fnName: string) => {
emit('tool', fnName);
};


</script>

<style scoped lang="scss">
.workflow-tool {
	height: 35px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
	color: var(--el-text-color-primary);

	.workflow-tool-right {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}

	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 35px;
		line-height: 35px;
		display: flex;
		align-items: center;

		&:hover {
			background: rgba(0, 0, 0, 0.04);

			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
}
</style>
