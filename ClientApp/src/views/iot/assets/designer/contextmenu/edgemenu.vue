<template>
     <transition name="el-zoom-in-center">
       <div aria-hidden="true" class="el-dropdown__popper el-popper is-light is-pure custom-contextmenu" role="tooltip"
         data-popper-placement="bottom" :style="`top: ${dropdowns.y + 5}px;left: ${dropdowns.x}px;`" :key="Math.random()"
         v-show="state.isShow">
         <ul class="el-dropdown-menu">
           <li v-for="(v, k) in state.menuitems" class="el-dropdown-menu__item" aria-disabled="false" tabindex="-1"
             :key="k" @click="onCurrentClick(v['command'])">
             <SvgIcon :name="v['icon']" />
             <span>{{ v['txt'] }}</span>
           </li>
         </ul>
         <div class="el-popper__arrow" style="left: 10px"></div>
       </div>
     </transition>
   </template>
    
   <script lang="ts" setup>
   import { computed, reactive, onMounted, onUnmounted } from "vue";
  
   const props = defineProps({
     dropdown: {
       type: Object,
     },
   });
   const emit = defineEmits(["click", "contextmenu", "onedgeopencommand"]);
  
   const state = reactive({
     isShow: false,
     menuitems: [
  
     ],
     sender: {}
  
   });
   //Coordinates x,y values passed from parent
   const dropdowns = computed(() => {
     return <any>props.dropdown;
   });
   //Current item menu click
   const onCurrentClick = (command: string) => {
     emit(
       "onedgeopencommand",
       { command, sender:state.sender }
  
     );
   };
   // Open the right-click menu: determine whether it is fixed. If it is fixed, the close button will not be displayed.
   const openContextmenu = (sender: any) => {

     //Here is the edge object
     state.sender = sender;
     state.menuitems = sender.store?.data?.bizdata?.command?.contextmenu
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