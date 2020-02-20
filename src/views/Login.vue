<template>
    <div id="login">
        <top-bar title="用户登录" show-back/>
        <form>
            <section>
                <input type="text" v-model="form.username" placeholder="用户名">
            </section>
            <section>
                <input type="password" v-model="form.password" placeholder="密码">
            </section>
            <section>
                <input type="text" v-model="form.captcha_code" placeholder="验证码">
                <img :src="captcha" alt="" @tap="changeCaptcha">
            </section>
        </form>
        <button type="button" @tap="submit">登录</button>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {getCaptcha, login} from '@/api/index'

    export default {
        name: "Login",
        components: {
            TopBar
        },
        data() {
            return {
                form: {
                    username: '',
                    password: '',
                    captcha_code: ''
                },
                captcha: '',
                fromShop: false
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/shop') {
                next(vm => {
                    vm.fromShop = true;
                })
            } else {
                next();
            }
        },
        activated() {
            getCaptcha().then(({data}) => {
                this.captcha = data.code
            })
        },
        deactivated() {
            // 离开后重置表单数据
            this.form = {
                username: '',
                password: '',
                captcha_code: ''
            };
            this.captcha = '';
            this.fromShop = false;
        },
        methods: {
            submit() {
                if (!this.form.username) {
                    this.$alert({
                        type: 'warning',
                        content: '请输入用户名'
                    });
                } else if (!this.form.password) {
                    this.$alert({
                        type: 'warning',
                        content: '请输入密码'
                    });
                } else if (!this.form.captcha_code) {
                    this.$alert({
                        type: 'warning',
                        content: '请输入验证码'
                    });
                } else {
                    login(this.form.username, this.form.password, this.form.captcha_code).then(({data}) => {
                        if (data.status === 0) {
                            this.$alert({type: 'warning', content: data.message});
                            getCaptcha().then(({data}) => {
                                this.captcha = data.code
                            });
                        } else {
                            this.$alert({type: 'success', content: '登录成功'});
                            this.$store.commit('setUserInfo', data);
                            if (this.fromShop) {
                                this.$router.replace('/confirmOrder?geohash=' + this.$route.query.geohash + '&id=' + this.$route.query.id);
                            } else {
                                this.$router.go(-1);
                            }
                        }
                    })
                }
            },
            changeCaptcha() {
                getCaptcha().then(({data}) => {
                    this.captcha = data.code
                });
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #login {
        @include absolute();
        @include size(100%,100%);

        overflow-y: auto;
        box-sizing: border-box;
        padding-top: 1.95rem;
        form {
            margin-top: .6rem;
            background-color: #fff;
            section {
                padding: .6rem .8rem;
                border-bottom: 1px solid #f1f1f1;
            }
            section:last-of-type {
                @include flex(row,space-between,center);
                input {
                    @include size(55%);
                }
            }
        }
        input {
            @include size(100%);
            font-size: 0.7rem;
            color: #666;
        }
        button {
            margin: 1rem .5rem;
            font-size: 0.7rem;
            color: #fff;
            background-color: #4cd964;
            padding: .5rem 0;
            border: 1px;
            border-radius: 0.15rem;
            text-align: center;
            width: calc(100% - 1rem);
        }
    }
</style>