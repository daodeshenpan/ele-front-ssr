<template>
    <div id="mine">
        <top-bar title="我的">
            <template #right>
                <i class="el-icon-chat-line-round"></i>
            </template>
        </top-bar>
        <div class="top">
            <div @tap="userInfo.id ? $router.push('/profile') : $router.push('/login')">
                <section>
                    <img :src="imgBaseURL + userInfo.avatar" alt="" v-if="userInfo.id">
                    <i class="el-icon-s-custom" v-else></i>
                    <section>
                        <span>{{userInfo.id ? userInfo.username:'登录/注册'}}</span>
                        <i class="el-icon-mobile-phone">暂无绑定手机号</i>
                    </section>
                </section>
                <i class="el-icon-arrow-right"></i>
            </div>
            <ul class="clearfix">
                <li @tap="userInfo.id ? $router.push('/balance') : $router.push('/login')">
                    <span><i>{{userInfo.id ? userInfo.balance : 0 | toFixed2}}</i>元</span>
                    <span>我的余额</span>
                </li>
                <li @tap="userInfo.id ? $router.push('/coupon') : $router.push('/login')">
                    <span><i>{{userInfo.id ? userInfo.gift_amount : 0 }}</i>个</span>
                    <span>我的红包</span>
                </li>
                <li @tap="userInfo.id ? $router.push('/point') : $router.push('/login')">
                    <span><i>{{userInfo.id ? userInfo.point : 0 }}</i>分</span>
                    <span>我的积分</span>
                </li>
            </ul>
        </div>
        <div class="middle">
            <section>
                <i class="el-icon-coffee"></i>
                <section>
                    我的订单
                    <i class="el-icon-arrow-right"></i>
                </section>
            </section>
            <section>
                <i class="el-icon-watermelon"></i>
                <section>
                    积分商城
                    <i class="el-icon-arrow-right"></i>
                </section>
            </section>
            <section>
                <i class="el-icon-grape"></i>
                <section>
                    饿了么会员卡
                    <i class="el-icon-arrow-right"></i>
                </section>
            </section>
        </div>
        <div class="bottom">
            <section>
                <i class="el-icon-ice-cream"></i>
                <section>
                    服务中心
                    <i class="el-icon-arrow-right"></i>
                </section>
            </section>
            <section>
                <i class="el-icon-dish-1"></i>
                <section>
                    下载饿了么APP
                    <i class="el-icon-arrow-right"></i>
                </section>
            </section>
        </div>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {mapState} from 'vuex'
    import {imgBaseURL} from '@/utils/config'

    export default {
        name: "Mine",
        components: {
            TopBar
        },
        data() {
            return {
                imgBaseURL
            }
        },
        computed: mapState(['userInfo']),
        beforeRouteEnter(to, from, next) {
            if (from.path === '/login' || from.path === '/profile' || from.path === '/balance' || from.path === '/coupon' || from.path === '/point') {
                to.meta.transitionName = 'slide-to-right';
            } else {
                to.meta.transitionName = ''
            }
            next();
        },
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #mine {
        @include size(100%, 100%);
        @include absolute();
        overflow-y: auto;
        box-sizing: border-box;
        padding: 1.95rem 0 2.3rem;

        .top {
            > div {
                @include flex(row, space-between, center);
                background: #3190e8;
                padding: .666667rem .6rem;

                > section {
                    @include flex(row, null, center);

                    > img {
                        width: 2.5rem;
                        height: 2.5rem;
                        border-radius: 50%;
                        margin-right: .4rem;
                    }

                    > i {
                        font-size: 2rem;
                        color: #ccc;
                        background-color: #fff;
                        padding: .3rem;
                        border-radius: 50%;
                        border: 1px solid #ccc;
                        margin-right: .4rem;
                    }

                    > section {
                        @include flex(column, null, flex-start);

                        span {
                            font-weight: 700;
                            font-size: 0.8rem;
                            color: #fff;
                            margin-bottom: .3rem;
                        }

                        i {
                            font-size: 0.57333rem;
                            color: #fff;
                        }

                        i::before {
                            font-size: 0.7rem;
                            margin-right: .2rem;
                        }
                    }
                }

                > i {
                    font-size: .6rem;
                    color: #fff;
                }
            }

            ul {
                li {
                    float: left;
                    width: 33.33%;
                    display: inline-block;
                    border-right: 1px solid #f1f1f1;
                    box-sizing: border-box;
                    background-color: #fff;

                    span:first-of-type {
                        font-size: 0.55rem;
                        color: #333;
                        padding: .853333rem 0 .453333rem;
                        display: block;
                        width: 100%;
                        text-align: center;

                        i {
                            display: inline-block;
                            font-size: 1.2rem;
                            color: #f90;
                            font-weight: 700;
                            line-height: 1rem;
                        }
                    }

                    span:last-of-type {
                        font-size: 0.57333rem;
                        color: #666;
                        font-weight: 400;
                        padding-bottom: .453333rem;
                        display: block;
                        width: 100%;
                        text-align: center;
                    }
                }

                li:nth-of-type(2) {
                    span:first-of-type {
                        i {
                            color: #ff5f3e;
                        }
                    }
                }

                li:last-of-type {
                    border: 0;

                    span:first-of-type {
                        i {
                            color: #6ac20b;
                        }
                    }
                }
            }
        }

        .middle, .bottom {
            margin-top: .4rem;
            background: #fff;

            > section {
                @include flex(row, flex-start, center);
                padding-left: .6rem;

                i {
                    margin-right: .2rem;
                    font-size: .6rem;
                }

                > section {
                    @include flex(row, space-between, center);
                    flex: 1;
                    border-bottom: 1px solid #f1f1f1;
                    padding: .433333rem 0 .433333rem 0;
                    font-size: 0.7rem;
                    color: #333;
                }
            }

            > section:first-of-type {
                >i{
                    color: #f90;
                }
            }

            > section:nth-of-type(2) {
                >i{
                    color: #ff5f3e;
                }
            }

            > section:last-of-type {
                >i{
                    color: #6ac20b;
                }
            }
        }
    }
</style>