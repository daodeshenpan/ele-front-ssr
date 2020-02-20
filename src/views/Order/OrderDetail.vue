<template>
    <div id="order-detail">
        <top-bar show-back title="订单详情"/>
        <div class="top">
            <img :src="imgBaseURL + orderDetail._doc.restaurant_image_url">
            <span>{{orderDetail._doc.status_bar.title}}</span>
            <button @tap="toShop(orderDetail)">
                再来一单
            </button>
        </div>
        <div class="middle">
            <header @tap="toShop(orderDetail)">
                <section>
                    <img :src="imgBaseURL + orderDetail._doc.restaurant_image_url" alt="">
                    <h4>{{orderDetail._doc.restaurant_name}}</h4>
                </section>
                <i class="el-icon-arrow-right"></i>
            </header>
            <ul>
                <li v-for="item in orderDetail._doc.basket.group[0]">
                    <p>{{item.name}}</p>
                    <div>
                        <span>X{{item.quantity}}</span>
                        <span>¥{{item.price}}</span>
                    </div>
                </li>
            </ul>
            <p>实付￥{{orderDetail._doc.total_amount|toFixed2}}</p>
        </div>
        <div class="delivery">
            <header>配送信息</header>
            <ul>
                <li>送达时间：{{orderDetail.deliver_time}}</li>
                <li>送达地址：{{orderDetail.consignee}}</li>
                <li>配送方式：蜂鸟专送</li>
            </ul>
        </div>
        <div class="order">
            <header>订单信息</header>
            <ul>
                <li>下单时间：{{orderDetail._doc.formatted_created_at}}</li>
                <li>订单编号：{{orderDetail._doc.id}}</li>
                <li>支付方式：在线支付</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {getOrderDetail} from '@/api/index'
    import {imgBaseURL} from '@/utils/config'

    export default {
        name: "OrderDetail",
        components: {
            TopBar
        },
        data() {
            return {
                id: this.$route.query.id,
                userID: this.$route.query.user_id,
                orderDetail: {
                    _doc: {
                        status_bar: {},
                        basket: {group: []}
                    }
                },
                imgBaseURL
            }
        },
        watch: {
            id() {
                this.initData();
            },
            userID() {
                this.initData();
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/shop') {
                to.meta.transitionName = 'slide-to-bottom';
            } else {
                to.meta.transitionName = 'slide-to-left'
            }
            next();
        },
        beforeMount() {
            this.initData();
        },
        activated() {
            this.id = this.$route.query.id;
            this.userID = this.$route.query.user_id;
        },
        methods: {
            initData() {
                getOrderDetail(this.userID, this.id).then(({data}) => {
                    if (data.status === 0){

                    } else {
                        this.orderDetail = data
                    }
                })
            },
            toShop(orderDetail){
                this.$router.push(`/shop?geohash=${this.$route.query.geohash}&id=${orderDetail._doc.restaurant_id}`);
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #order-detail {
        @include size(100%, 100%);
        @include absolute();
        padding-top: 1.95rem;
        box-sizing: border-box;
        overflow-y: auto;

        .top {
            @include flex(column, null, center);
            padding: .7rem;
            background-color: #fff;
            margin-bottom: 0.5rem;

            > img {
                border-radius: 50%;
                width: 3rem;
                height: 3rem;
            }

            > span {
                font-size: 0.9rem;
                color: #333;
                font-weight: bold;
                margin-top: .4rem;
            }

            > button {
                font-size: 0.6rem;
                color: $theme;
                margin-top: .5rem;
                border: 0.025rem solid $theme;
                padding: .15rem .4rem;
                border-radius: .1rem;
                background-color: #fff;
            }
        }

        .middle {
            background-color: #fff;

            > header {
                @include flex(row, space-between, center);
                padding: .5rem;
                border-bottom: 1px solid #f5f5f5;

                > section {
                    @include flex(row, null, center);

                    img {
                        width: 1.2rem;
                        height: 1.2rem;
                        vertical-align: middle;
                        margin-right: .2rem;
                    }

                    h4 {
                        font-size: 0.75rem;
                        color: #333;
                    }
                }
            }

            ul {
                li {
                    @include flex(row, space-between, center);
                    line-height: 2rem;
                    padding: 0 .5rem;

                    p {
                        font-size: 0.6rem;
                        color: #666;
                        flex: 4;
                    }

                    > div {
                        span:first-of-type {
                            font-size: 0.6rem;
                            color: #ccc;
                        }

                        span:last-of-type {
                            font-size: 0.6rem;
                            color: #666;
                        }
                    }
                }
            }

            > p {
                font-size: 0.6rem;
                color: #fb6b23;
                border-top: 1px solid #f5f5f5;
                font-weight: bold;
                line-height: 2rem;
                text-align: right;
                padding-right: .5rem;
            }
        }

        .delivery, .order {
            margin-top: 0.5rem;
            background-color: #fff;

            header {
                font-size: 0.75rem;
                color: #333;
                padding: .5rem;
                border-bottom: 1px solid #f5f5f5;
            }

            ul {
                li {
                    padding: .5rem;
                    font-size: 0.65rem;
                    color: #666;
                    line-height: 1rem;
                }
            }
        }
    }
</style>