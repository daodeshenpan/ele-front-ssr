<template>
    <div id="profile">
        <top-bar show-back title="账户信息"/>
        <div>
            <input type="file" @change="uploadAvatar" ref="input">
            <h2>头像</h2>
            <img :src="imgBaseURL + userInfo.avatar">
        </div>
        <div @tap="$router.push('/manageAddress')">
            <h2>收货地址</h2>
            <i class="el-icon-arrow-right"></i>
        </div>
        <button @tap="handleTap">退出登录</button>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {logout} from '@/api/index'
    import {baseURL, imgBaseURL} from '@/utils/config'
    import {mapState} from 'vuex'

    export default {
        name: "Profile",
        components: {
            TopBar
        },
        data() {
            return {
                baseURL,
                imgBaseURL
            }
        },
        computed: mapState(['userInfo']),
        beforeRouteEnter(to, from,next){
            if (from.path === '/manageAddress'){
                to.meta.transitionName = 'slide-to-right';
            } else {
                to.meta.transitionName = 'slide-to-left';
            }
            next();
        },
        methods: {
            handleTap() {
                logout().then(({data}) => {
                    if (data.status === 1) {
                        this.$alert({type: 'success', content: data.message});
                        this.$router.go(-1);
                        this.$store.commit('setUserInfo', {});
                    }
                })
            },
            uploadAvatar() {
                let formData = new FormData();
                formData.append('file', this.$refs.input.files[0]);
                let xhr = new XMLHttpRequest();
                xhr.open('post', this.baseURL + '/eus/v1/users/' + this.userInfo.id + '/avatar');
                let that = this;
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (xhr.status === 200 || xhr.status === 304) {
                            let data = JSON.parse(xhr.response);
                            if (data.status === 1) {
                                that.$alert({type: 'success', content: '修改成功'});
                                that.userInfo.avatar = data.image_path;
                            } else {

                            }
                        } else {

                        }
                    }
                };
                xhr.send(formData);
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #profile {
        @include absolute();
        @include size(100%, 100%);

        overflow-y: auto;
        box-sizing: border-box;
        padding-top: 1.95rem;

        > div {
            @include size(100%, 3.1rem);
            @include flex(row, space-between, center);
            position: relative;
            background-color: #fff;
            padding: .5rem .4rem;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            box-sizing: border-box;

            h2 {
                font-size: 0.6rem;
                color: #333;
                font-weight: 500;
            }

            i {
                font-size: .6rem;
            }
        }

        > div:first-of-type {
            margin-top: .4rem;
            border-bottom: 0;

            input {
                @include absolute(0, 0);
                @include size(100%, 100%);
                opacity: 0;
            }

            img {
                @include size(2rem, 2rem);
                border-radius: 50%;
                vertical-align: middle;
            }
        }

        button {
            display: block;
            width: 90%;
            margin: 1.3rem auto 0;
            line-height: 1.5rem;
            border-radius: 5px;
            text-align: center;
            background: #d8584a;
            font-size: 0.6rem;
            color: #fff;
        }
    }
</style>