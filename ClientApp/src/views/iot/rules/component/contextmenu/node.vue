<template>
  <transition name="el-zoom-in-center">
    <div
      aria-hidden="true"
      class="el-dropdown__popper el-popper is-light is-pure custom-contextmenu"
      role="tooltip"
      data-popper-placement="bottom"
      :style="`top: ${dropdowns.y + 5}px;left: ${dropdowns.x}px;`"
      :key="Math.random()"
      v-show="state.isShow"
    >
      <ul class="el-dropdown-menu">
        <li
          v-for="(v, k) in state.dropdownList"
          class="el-dropdown-menu__item"
          aria-disabled="false"
          tabindex="-1"
          :key="k"
          @click="onCurrentClick(v.contextMenuClickId)"
        >
          <SvgIcon :name="v.icon" />
          <span>{{ v.txt }}{{ state.item.name }}</span>
        </li>
      </ul>
      <div class="el-popper__arrow" style="left: 10px"></div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, defineComponent, reactive, toRefs, onMounted, onUnmounted } from "vue";

const props = defineProps({
  dropdown: {
    type: Object,
  },
});
const emit = defineEmits(["click", "contextmenu", "currentnode"]);

const state = reactive({
  isShow: false,
    dropdownList: [
        { contextMenuClickId: 0, txt: "Delete", icon: "ele-Delete" },
        { contextMenuClickId: 1, txt: "Edit", icon: "ele-Edit" },
    ],
    item: {
        type: "node",
        value: "",
        name: "",
    },
    conn: {},
});
    //Coordinates x,y values passed from parent
    const dropdowns = computed(() => {
        return <any>props.dropdown;
    });
    //Current item menu click
    const onCurrentClick = (contextMenuClickId: number) => {
        emit(
            "currentnode",
            { contextMenuClickId, ...state.item, result: state.item.value },
            state.conn
        );
    };
    // Open the right-click menu: determine whether it is fixed. If it is fixed, the close button will not be displayed.
    const openContextmenu = (item: any, conn = {}) => {
        state.item = item;
        state.conn = conn;
        closeContextmenu();
        setTimeout(() => {
            state.isShow = true;
        }, 10);
    };
    // Close the right-click menu
    const closeContextmenu = () => {
        state.isShow = false;
    };
    // Monitor the page to monitor the closing of the right-click menu
    onMounted(() => {
        document.body.addEventListener("click", closeContextmenu);
        document.body.addEventListener("contextmenu", closeContextmenu);
    });
    // When the page is unloaded, remove the right-click menu listening event
    onUnmounted(() => {
        document.body.removeEventListener("click", closeContextmenu);
        document.body.removeEventListener("contextmenu", closeContextmenu);
    });
defineExpose({
  openContextmenu,
});
</script>

<style scoped lang="scss">
.custom-contextmenu {
  transform-origin: center top;
  z-index: 2190;
  position: fixed;
  .el-dropdown-menu__item {
    font-size: 12px !important;
    white-space: nowrap;
    i {
      font-size: 12px !important;
    }
  }
}
</style>
