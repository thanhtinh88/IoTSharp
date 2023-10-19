<template>
	<slot v-if="getUserAuthBtnList" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';

export default defineComponent({
	name: 'auth',
	props: {
		value: {
			type: String,
			default: () => '',
		},
	},
	setup(props) {
		const stores = useUserInfo();
		const { userInfos } = storeToRefs(stores);
		// Get user permissions in vuex
		const getUserAuthBtnList = computed(() => {
			return userInfos.value.authBtnList.some((v: string) => v === props.value);
		});
		return {
			getUserAuthBtnList,
		};
	},
});
</script>
