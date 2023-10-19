<template>
    <div class="z-install">
        <div class="content">
            <div class="login-wrap">
                <div class="flex justify-center">
                    <AppLogo class="w-200px"></AppLogo>
                </div>
                <div class="text-3xl py-20px mt-20px text-center">注册</div>
                <div>
                    <FormCreate ref="formRef"
                                v-model:api="fApi"
                                :rule="rules"
                                :option="options"
                                @submit="onSubmit"></FormCreate>
                </div>
                <div class="mt10-40px login-animation5 text-center">
                    已有账号?
                    <router-link to="/login"> <el-link type="primary" :underline="false">登录 </el-link></router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import AppLogo from "/@/components/AppLogo.vue";
    import { signUpRule } from './signup_form_rules'
    import { option } from './signup_form_option'
    import formCreate, { Api } from "@form-create/element-ui";
    import { useRouter } from "vue-router";
    const router = useRouter()
    import { ElMessage } from "element-plus";
    import { Ref } from "vue";
    import { signup } from "/@/api/account";
    const formRef = ref(null)

    const options = ref(option)
    //Instance object
    const fApi: Ref<Api | null> = ref(null)
    // form data
    const FormCreate = formCreate.$form()

    const validatePassCheck = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('Please enter password again'));
        } else if (value !== fApi.value!.form.password) {
            callback(new Error('The passwords entered twice are inconsistent!'));
        } else {
            callback();
        }
    };
    signUpRule[3].validate?.push({
        required: true,
        trigger: "change",
        validator: validatePassCheck
    })
    const rules = ref(signUpRule)

    onMounted(async () => {

    })
    function onSubmit(data: any) {
        try {
            fApi.value!.validate(async (valid) => {
                if (valid) {
                    try {
                        await signup(data)
                        ElMessage.success('registration success')
                        await router.replace({ name: 'login' })
                    } catch (e: any) {
                        ElMessage.error('registration failed')
                        for (const error of Object.values(e.response.data.errors)) {
                            ElMessage.error(`${JSON.stringify(error)}`)
                        }
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
        //.el-form--large.el-form--label-top .el-form-item .el-form-item__label {
        //  margin-bottom: 4px !important;
        //}

        .el-button {
            width: 100%;
            margin-top: 10px;
        }

        .content {
            position: absolute;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            left: 50%;
            top: 35%;
            margin-left: -211px;
            margin-top: -290px;
            width: 422px;
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

        :deep(.el-form-item__label) {
            display: none !important;
        }
    }
</style>
