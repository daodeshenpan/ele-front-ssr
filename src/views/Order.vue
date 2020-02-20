<template>
    <div id="order">
        <top-bar title="订单">
            <template #right>
                <i class="el-icon-chat-line-round"></i>
            </template>
        </top-bar>
        <div v-if="!userInfo.id">
            <i class="el-icon-s-custom"></i>
            <p>您还没有登录，请登录后查看订单</p>
            <button @tap="$router.push('/login')">登录</button>
        </div>
        <ul v-else>
            <li v-for="(order,index) in orderList" :key="index">
                <img :src="imgBaseURL + order.restaurant_image_url" alt="">
                <section>
                    <div class="top">
                        <section>
                            <section
                                    @tap="toShop(order)">
                                <b>{{order.restaurant_name}}</b><i class="el-icon-arrow-right"></i>
                            </section>
                            <p>{{order.formatted_created_at}}</p>
                        </section>
                        <span>{{order.status_bar.title}}</span>
                    </div>
                    <div class="middle" @tap="toOrderDetail(order)">
                        <span>{{order.basket.group[0].length > 1 ? order.basket.group[0][0].name + '等' +order.basket.group[0].length +'件商品' : order.basket.group[0][0].name}}</span>
                        <b>￥{{order.total_amount | toFixed2}}</b>
                    </div>
                    <div class="bottom">
                        <button @tap="toShop(order)">
                            再来一单
                        </button>
                    </div>
                </section>
            </li>
        </ul>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {mapState} from 'vuex'
    import {getUserOrder} from '@/api/index'
    import {imgBaseURL} from '@/utils/config'

    export default {
        name: "Order",
        components: {
            TopBar
        },
        data() {
            return {
                orderList: [],
                orderLimit: 20,
                orderIndex: 0,
                fromPayOnline: false,
                imgBaseURL
            }
        },
        computed: mapState(['userInfo']),
        watch: {
            'userInfo.id'() {
                if (this.userInfo.id) {
                    this.initData();
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/shop') {
                to.meta.transitionName = 'slide-to-bottom';
                next();
            } else if (from.path === '/login' || from.path === '/orderDetail') {
                to.meta.transitionName = 'slide-to-right';
                next();
            } else if (from.path === '/payOnline') {
                to.meta.transitionName = '';
                next(vm => vm.fromPayOnline = true);
            } else {
                to.meta.transitionName = '';
                next();
            }

        },
        beforeMount() {
            if (this.userInfo.id) {
                this.initData();
            }
        },
        activated() {
            this.$nextTick(() => {
                if (this.fromPayOnline) {
                    this.initData();
                }
            })
        },
        deactivated() {
            this.fromPayOnline = false;
        },
        methods: {
            initData() {
                getUserOrder(this.userInfo.id, this.orderIndex * this.orderLimit, this.orderLimit).then(({data}) => {
                    this.orderList = data;
                })
            },
            toShop(order) {
                this.$router.push(`/shop?geohash=${this.$route.query.geohash}&id=${order.restaurant_id}`)
            },
            toOrderDetail(order) {
                this.$router.push(`/orderDetail?geohash=${this.$route.query.geohash}&id=${order.id}&user_id=${order.user_id}`)
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #order {
        @include size(100%, 100%);
        @include absolute();
        padding: 1.95rem 0 2.3rem;
        box-sizing: border-box;
        overflow-y: auto;

        > div {
            @include absolute(50%, 50%);
            transform: translate(-50%, -50%);
            text-align: center;

            i {
                font-size: 5rem;
                color: #777;
            }

            p {
                font-size: .5rem;
                color: #777;
            }

            button {
                background-color: $theme;
                padding: .25rem .5rem;
                margin-top: .75rem;
                color: #fff;
            }
        }

        ul {
            li {
                background-color: #fff;
                display: flex;
                margin-bottom: 0.5rem;
                padding: .6rem .6rem 0;

                > img {
                    width: 2rem;
                    height: 2rem;
                    margin-right: 0.4rem;
                }

                > section {
                    flex: 1;

                    .top {
                        @include flex(row, space-between);
                        @include size(100%);
                        border-bottom: 0.025rem solid #f5f5f5;
                        padding-bottom: .3rem;

                        > section {
                            > section {
                                @include flex(row, flex-start, center);
                            }
                        }

                        b {
                            font-size: 0.75rem;
                            color: #333;
                            line-height: 1rem;
                            font-weight: normal;
                            vertical-align: top;
                            margin-right: .2rem;
                        }

                        i {
                            vertical-align: top;
                            font-size: .6rem;
                        }

                        p {
                            font-size: 0.55rem;
                            color: #999;
                            line-height: .8rem;
                        }

                        span {
                            font-size: 0.6rem;
                            color: #333;
                        }
                    }

                    .middle {
                        @include flex(row, space-between);
                        line-height: 2rem;
                        border-bottom: 0.025rem solid #f5f5f5;

                        span {
                            font-size: 0.6rem;
                            color: #666;
                        }

                        b {
                            font-size: 0.6rem;
                            color: #f60;
                            font-weight: bold;
                        }
                    }

                    .bottom {
                        line-height: 1.6rem;
                        @include flex(row, flex-end, center);

                        button {
                            font-size: 0.55rem;
                            color: $theme;
                            border: 0.025rem solid $theme;
                            padding: .1rem .2rem;
                            margin: .6rem 0 .6rem;
                            border-radius: .15rem;
                            background-color: #fff;
                        }
                    }
                }
            }
        }
    }
</style>