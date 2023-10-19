<template>
  <div class="z-install">
    <div class="content " :style="{height: storesAppInfo.appInfo.installed ? '240px': '580px'}">
      <div class="login-wrap">
        <div class="logo flex justify-center">
          <AppLogo></AppLogo>

        </div>
        <div v-if="storesAppInfo.appInfo.installed" class="installed">
            The system has been initialized, please log in directly.
            <Button type="primary" style="margin-top: 10px" @click="$router.replace({name: 'login'})">
                Jump to login page
            </Button>
        </div>
        <div v-else>
            <div class="form-subtitle"> Welcome, please fill in your email, password and account number to initialize the system</div>
          <FormCreate
              v-model:api="fApi"
              :rule="rules"
              :option="options"
              v-model="value"
              @submit="onSubmit"
          ></FormCreate>
        </div>
      </div>
    </div>
    <div class="copyright-wrap">
        <p>System version</p>
      <p>{{ storesAppInfo.appInfo.version }}</p>
    </div>
  </div>

</template>
<script setup lang="ts">
import AppLogo from "/@/components/AppLogo.vue";
import {setupFormRule} from './setup_form_rules'
import setup_form_option from './setup_form_option.json'
import {initSysAdmin} from "/@/api/installer";
import {reactive, Ref, ref} from "vue";
import formCreate, {Api} from "@form-create/element-ui";
import {ElButton as Button, ElMessage} from 'element-plus'
import { useAppInfo } from "/@/stores/appInfo";

import {useRouter} from "vue-router";

const FormCreate = formCreate.$form()
const router = useRouter()
const storesAppInfo = useAppInfo()
//Instance object
const fApi: Ref<Api | null> = ref(null)
// form data
const value = ref({})
const options = reactive(setup_form_option)

const validatePassCheck = (rule:any, value:any, callback:any) => {
  if (value === '') {
      callback(new Error('Please enter password again'));
  } else if (value !== fApi.value!.form.password) {
      callback(new Error('The passwords entered twice are inconsistent!'));
  } else {
    callback();
  }
};
setupFormRule[3].validate?.push({
  required: true,
  trigger: "change",
  validator: validatePassCheck
})
JSON.parse(JSON.stringify(setupFormRule))
const rules = ref(setupFormRule)

function onSubmit(data:any) {
  try {
    fApi.value!.validate(async (valid) => {
      if (valid) {
        try {
          await initSysAdmin(data)
            ElMessage.success('Initialization successful')
          await router.replace({name: 'login'})
        } catch (e) {
            ElMessage.error('initialization failed')
        }
      } else {
          ElMessage.error('Please fill in the information correctly')
      }
    })
  } catch (e) {
      ElMessage.error('Please fill in the information correctly')
  }
}


</script>
<style lang="scss" scoped>
.z-install {
  .el-form-item {
    margin-top: 16px;
  }

  .el-form--large.el-form--label-top .el-form-item .el-form-item__label {
    margin-bottom: 4px !important;
  }

  .el-button {
    width: 100%;
    margin-top: 10px;
  }

  .content {
    position: absolute;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    left: 50%;
    top: 40%;
    margin-left: -211px;
    margin-top: -290px;
    width: 422px;
    height: 680px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    background-color: #fff;
    border-radius: 18px;
  }

  .login-wrap {
    padding: 40px 60px;
    box-sizing: border-box;
    margin: 0 auto;
  }

  .form-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
  }

  .form-subtitle {
    font-size: 12px;
    color: gray;
    text-align: center;
    margin-bottom: 12px;
    margin-top: 8px;
  }

  .logo {
    width: 100%;
  }

  .copyright-wrap {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    color: #afafaf;
    font-size: 12px;
  }

  .installed {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
    color: var(--el-text-color-regular);
  }
}


</style>
