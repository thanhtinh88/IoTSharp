<template>
    <el-form size="large" class="login-content-form" @submit.native.prevent>
        <el-form-item class="login-animation1">
            <el-input type="text"
                      placeholder="Please enter user name"
                      v-model="ruleForm.userName"
                      clearable
                      autocomplete="off">
                <template #prefix>
                    <el-icon class="el-input__icon"><ele-User /></el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item class="login-animation2">
            <el-input :type="isShowPassword ? 'text' : 'password'"
                      placeholder="Please enter password"
                      v-model="ruleForm.password"
                      autocomplete="off">
                <template #prefix>
                    <el-icon class="el-input__icon"><ele-Unlock /></el-icon>
                </template>
                <template #suffix>
                    <i class="iconfont el-input__icon login-content-password"
                       :class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
                       @click="isShowPassword = !isShowPassword">
                    </i>
                </template>
            </el-input>
        </el-form-item>

        <el-form-item class="login-animation4">
            <el-button type="primary"
                       class="login-content-submit"
                       size="large"
                       @click="onSignIn"
                       native-type="submit"
                       :loading="loading.signIn">
                <span>{{ $t("message.account.accountBtnText") }}</span>
            </el-button>
        </el-form-item>


        <div class="mt10-40px login-animation5 text-center">
            No account?
            <router-link to="/signup"> <el-link type="primary" :underline="false">Register </el-link></router-link>
        </div>
    </el-form>

    <el-dialog v-model="dialogVisible" title="" width="400px">
        <slide-verify ref="block"
                      :imgs="imgs"
                      slider-text="Swipe right ->"
                      :accuracy="accuracy"
                      @again="onAgain"
                      @success="onSuccess"
                      @fail="onFail"
                      @refresh="onRefresh"></slide-verify>
    </el-dialog>
</template>

<script lang="ts">
    import { toRefs, reactive, defineComponent, computed, ref } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { ElMessage } from "element-plus";
    import { useI18n } from "vue-i18n";
    import Cookies from "js-cookie";
    import { storeToRefs } from "pinia";
    import { useThemeConfig } from "/@/stores/themeConfig";
    import { initFrontEndControlRoutes } from "/@/router/frontEnd";
    import { initBackEndControlRoutes } from "/@/router/backEnd";
    import { Session } from "/@/utils/storage";
    import { formatAxis } from "/@/utils/formatTime";
    import { NextLoading } from "/@/utils/loading";
    import { useLoginApi } from "/@/api/login";
    import SlideVerify, { SlideVerifyInstance } from "vue3-slide-verify";
    import "vue3-slide-verify/dist/style.css";
    export default defineComponent({
        components: { SlideVerify },
        name: "loginAccount",
        setup() {
            const block = ref<SlideVerifyInstance>();
            const { t } = useI18n();
            const storesThemeConfig = useThemeConfig();
            const { themeConfig } = storeToRefs(storesThemeConfig);
            const route = useRoute();
            const router = useRouter();
            const state = reactive({
                dialogVisible: false,
                isShowPassword: false,
                accuracy: 3,
                msg: "",
                imgs: [import.meta.env.VITE_API_URL + '/api/Captcha/Imgs'],
                ruleForm: {
                    userName: "admin@test.com",
                    password: "Abcd_1234",
                    code: "1234",
                },
                loading: {
                    signIn: false,
                },
            });
            // Time acquisition
            const currentTime = computed(() => {
                return formatAxis(new Date());
            });
            // Log in
            const onSignIn = async () => {
                state.dialogVisible = true;
                // Store token in browser cache
            };
            const onAgain = () => {
                state.msg = "Non-human operation detected! try again";
                // refresh
                block.value?.refresh();
            };

            const onSuccess = (times: number) => {
                state.msg = `login success, 耗时${(times / 1000).toFixed(1)}s`;
                state.loading.signIn = true;
                useLoginApi()
                    .signIn({ password: state.ruleForm.password, userName: state.ruleForm.userName })
                    .then(async (res: any) => {
                        if (res && res.code === 10000) {
                            Session.set("token", res.data.token.access_token);
                            // When simulating data and connecting interfaces, remember to delete redundant code and the introduction of corresponding dependencies. Used to determine the login of different users in `/src/stores/userInfo.ts` (simulated data)
                            Cookies.set("userName", state.ruleForm.userName);
                            if (!themeConfig.value.isRequestRoutes) {
                                // Front-end control routing, 2. Please pay attention to the execution order
                                await initFrontEndControlRoutes();
                                signInSuccess();
                            } else {
                                // Simulate backend control routing. If isRequestRoutes is true, backend control routing is enabled.
                                // After adding the dynamic route, perform a router jump, otherwise an error may be reported No match found for location with path "/"
                                await initBackEndControlRoutes();
                                //After executing initBackEndControlRoutes, execute signInSuccess again
                                signInSuccess();
                            }
                            block.value?.refresh();
                        } else {
                            state.loading.signIn = false;
                            state.dialogVisible = false;
                            ElMessage.success('Username does not exist or password is wrong');
                            block.value?.refresh();
                        }
                    }).catch((error) => {
                        state.loading.signIn = false;
                        state.dialogVisible = false;
                        block.value?.refresh();
                    })
                    .finally(() => { });
            };

            const onFail = () => {
                state.msg = "Verification failed";
            };

            const onRefresh = () => {
                state.msg = "Clicked the refresh icon";
            };

            const handleClick = () => {
                // refresh
                block.value?.refresh();
                state.msg = "";
            };
            // Jump after successful login
            const signInSuccess = () => {
                //Initialize login success time greeting
                let currentTimeInfo = currentTime.value;
                // Log in successfully, jump to the home page
                // If it is a copied and pasted path, not the homepage/login page, then redirect to the corresponding path after successful login.
                if (route.query?.redirect) {
                    router.push({
                        path: <string>route.query?.redirect,
                        query:
                            Object.keys(<string>route.query?.params).length > 0
                                ? JSON.parse(<string>route.query?.params)
                                : "",
                    });
                } else {
                    router.push("/");
                }
                // Login success prompt
                // close loading
                state.loading.signIn = true;
                const signInText = t("message.signInText");
                ElMessage.success(`${currentTimeInfo}，${signInText}`);
                // Add loading to prevent a brief blank when entering the interface for the first time
                NextLoading.start();
            };
            return {
                onSignIn,
                onAgain,
                onSuccess,
                onFail,
                onRefresh,
                ...toRefs(state),
            };
        },
    });
</script>

<style scoped lang="scss">
    .login-content-form {
        margin-top: 20px;

        @for $i from 1 through 5 {
            .login-animation#{$i} {
                opacity: 0;
                animation-name: error-num;
                animation-duration: 0.5s;
                animation-fill-mode: forwards;
                animation-delay: calc($i/10) + s;
            }
        }

        .login-content-password {
            display: inline-block;
            width: 20px;
            cursor: pointer;

            &:hover {
                color: #909399;
            }
        }

        .login-content-code {
            width: 100%;
            padding: 0;
            font-weight: bold;
            letter-spacing: 5px;
        }

        .login-content-submit {
            width: 100%;
            letter-spacing: 2px;
            margin-top: 15px;
        }
    }
</style>
