<template>
	<slot v-if="getUserAuthBtnList" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import { judementSameArr } from '/@/utils/arrayOperation';

export default defineComponent({
	name: 'authAll',
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	setup(props) {
		const stores = useUserInfo();
		const { userInfos } = storeToRefs(stores);
		// Get user permissions in pinia
		const getUserAuthBtnList = computed(() => {
			return judementSameArr(props.value, userInfos.value.authBtnList);
		});
		return {
			getUserAuthBtnList,
		};
	},
});
</script>
