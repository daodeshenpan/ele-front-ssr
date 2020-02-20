<template>
    <div id="choose-address">
        <top-bar show-back title="选择地址"/>
        <ul>
            <li v-for="(address,index) in allAddress" :key="index"
                @tap="$store.commit('setChosenIndex',index);$router.go(-1)">
                <i class="el-icon-success" :class="{hide: chosenIndex !== index}"></i>
                <div>
                    <div>
                        <span>{{address.name}}</span>
                        <i>{{address.sex === 1 ? '先生' : '女士'}}</i>
                        <b>{{address.phone}}</b>
                    </div>
                    <div>
                        <i>{{address.tag}}</i>
                        <span>{{address.address}}</span>
                        <b>{{address.address_detail}}</b>
                    </div>
                </div>
            </li>
        </ul>
        <span class="el-icon-circle-plus-outline" @tap="$router.push('/newAddress')">新增收获地址</span>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {mapState} from 'vuex'

    export default {
        name: "ChooseAddress",
        components: {
            TopBar
        },
        data() {
            return {
                fromNewAddress: false
            }
        },
        computed: mapState(['allAddress', 'chosenIndex', 'userInfo']),
        beforeRouteEnter(to, from, next) {
            if (from.path === '/newAddress') {
                to.meta.transitionName = 'slide-to-right';
                // 记录来自newAddress
                next(vm => vm.fromNewAddress = true);
            } else {
                to.meta.transitionName = 'slide-to-left';
                next();
            }
        },
        activated() {
            // 只有来自newAddress才初始化数据
            this.$nextTick(() => {
                if (this.fromNewAddress) {
                    this.initData();
                }
            });
        },
        deactivated() {
            this.fromNewAddress = false;
        },
        methods: {
            initData(){
                let store = this.$store;

                store.commit('setAllAddress', []);
                return store.dispatch('fetchAllAddress', this.userInfo.id);
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #choose-address {
        @include size(100%, 100%);
        @include absolute();

        box-sizing: border-box;
        padding-top: 1.95rem;
        background-color: #fff;

        ul {
            li {
                @include flex(row, null, center);
                border-bottom: 0.025rem solid #f5f5f5;
                padding: .7rem;
                line-height: 1rem;

                > i {
                    color: #4cd964;
                    margin-right: .4rem;
                }

                > i.hide {
                    opacity: 0;
                }

                > div {
                    div:first-of-type {
                        font-size: 0.7rem;
                        color: #333;

                        span {
                            font-weight: bold;
                        }
                    }

                    div:last-of-type {
                        i {
                            font-size: 0.5rem;
                            color: #fff;
                            border-radius: .15rem;
                            background-color: #ff5722;
                            height: .6rem;
                            line-height: .6rem;
                            padding: 0 .2rem;
                            margin-right: .3rem;
                        }

                        span, b {
                            font-size: 0.6rem;
                            color: #777;
                        }
                    }
                }
            }
        }

        > span {
            @include absolute(50%, null, null, 20px);
            transform: translate(-50%);
            color: $theme;
            font-size: 0.8rem;
        }

        > span::before {
            margin-right: .1rem;
            font-size: 1rem;
        }
    }
</style>