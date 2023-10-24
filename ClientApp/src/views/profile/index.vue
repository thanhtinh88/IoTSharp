<template>
    <ElCard style="width:500px !important" shadow="never">
        <div class="text-3xl py-20px">Personal Center</div>
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="Basic information" name="basic">
                <FormCreate ref="formRef"
                            v-model:api="fApi"
                            :rule="rules"
                            :option="options"
                            @submit="onSubmit"></FormCreate>
            </el-tab-pane>
            <el-tab-pane label="Password change" name="password">
                <FormCreate ref="passwordRef"
                            v-model:api="passwordFApi"
                            :rule="passwordRules"
                            :option="options"
                            @submit="onResetPassword"></FormCreate>
            </el-tab-pane>
        </el-tabs>
        <div>

        </div>
    </ElCard>
</template>
<script lang="ts" setup>

    import { rule } from './profile_form_rules.ts'
    import { passwordFormRules } from './password_form_rules.ts'
    import { option } from './profile_form_option.ts'
    import formCreate, { Api } from "@form-create/element-ui";
    import { useLoginApi } from "/@/api/login";
    import { ElMessage } from "element-plus";
    import { Ref } from "vue";
    import { sleep } from "/@/utils/other";
    import { ModifyMyInfo, ModifyMyPassword } from "/@/api/account";

    const FormCreate = formCreate.$form()

    const activeName = ref('password')
    const formRef = ref(null)
    const passwordRef = ref(null)


    interface profile {
        name: string;
        email: string;
        phoneNumber: string;
    }


    const rules = ref(rule)
    const validatePassCheck = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('Please enter password again'));
        } else if (value !== passwordFApi.value!.form.passnew) {
            callback(new Error('The passwords entered twice are inconsistent!'));
        } else {
            callback();
        }
    };
    passwordFormRules[2].validate.push({
        required: true,
        trigger: "change",
        validator: validatePassCheck
    })
    // debugger
    const passwordRules = ref(passwordFormRules)
    const options = ref(option)
    //Instance object
    const fApi: Ref<Api | null> = ref(null)
    const passwordFApi: Ref<Api | null> = ref(null)


    onMounted(async () => {
        try {
            const res = await useLoginApi().GetUserInfo({})
            const { email, name, phoneNumber } = res.data as profile
            await sleep(1000)
            fApi.value!.setValue({ email, name, phoneNumber })
        } catch (e) {
        }
    })
    function onSubmit(data: any) {
        try {
            fApi.value!.validate(async (valid) => {
                if (valid) {
                    try {
                        await ModifyMyInfo(data)
                        ElMessage.success('Modification successful')
                    } catch (e) {
                        ElMessage.error('Modification failed')
                    }
                } else {
                    ElMessage.error('Please fill in the information correctly')
                }
            })
        } catch (e) {
            ElMessage.error('Please fill in the information correctly')
        }
    }

    function onResetPassword(data: any) {
        try {
            passwordFApi.value!.validate(async (valid) => {
                if (valid) {
                    try {
                        await ModifyMyPassword(data)
                        ElMessage.success('Modification successful')
                    } catch (e) {
                        ElMessage.error('Modification failed')
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