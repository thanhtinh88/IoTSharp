<template>
	<div class="workflow-tool-help">
		<el-dialog v-model="isShow" width="769px">
			<template #header>
				<div v-drag="['.workflow-tool-help .el-dialog', '.workflow-tool-help .el-dialog__header']">Use help</div>
			</template>
			<div>1. Drag in: Move the mouse into the left navigation, and drag it to the grid-like view on the right when the shape of the mouse changes. </div>
			<div class="mt10">2. Move: Move the mouse into a node element in the view, and drag to change the position when the shape of the mouse changes. </div>
			<div class="mt10">3. Connection: Move the mouse into the icon of a node element in the view, the mouse shape changes (becomes "+"), press the left mouse button to drag the line to connect. </div>
			<div class="mt10">4. Node: Move the mouse into a node element in the view, and click the right mouse button to delete or edit the node. </div>
			<div class="mt10 mb10">5. Line: Move the mouse into a certain line in the view. When the color of the line changes, click the right button of the mouse to delete or edit the line. </div>
		</el-dialog>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
	name: 'pagesWorkflowToolHelp',
	setup() {
const state = reactive({
isShow: false,
});
//Open the pop-up window
const open = () => {
state.isShow = true;
};
//Close pop-up window
const close = () => {
state.isShow = false;
};
return {
open,
close,
...toRefs(state),
};
	},
});
</script>
