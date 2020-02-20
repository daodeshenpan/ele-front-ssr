<template>
    <div id="confirm-order">
        <top-bar show-back title="确认订单"/>
        <div class="address" @tap="$router.push('/chooseAddress')">
            <div v-if="!allAddress.length" class="empty">
                <span class="el-icon-location-outline">请选择一个地址</span>
                <i class="el-icon-arrow-right"></i>
            </div>
            <div v-else class="ready">
                <section>
                    <span class="el-icon-location-outline"></span>
                    <section>
                        <div>
                            <span>{{allAddress[chosenIndex].name}}</span>
                            <i>{{allAddress[chosenIndex].sex === 1 ? '先生' : '女士'}}</i>
                            <b>{{allAddress[chosenIndex].phone}}</b>
                        </div>
                        <div>
                            <i>{{allAddress[chosenIndex].tag}}</i>
                            <span>{{allAddress[chosenIndex].address}}</span>
                            <b>{{allAddress[chosenIndex].address_detail}}</b>
                        </div>
                    </section>
                </section>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div class="time">
            <p>送达时间</p>
            <div>
                <span>尽快送达 | 预计{{checkData.delivery_reach_time}}</span>
                <i v-if="checkData.cart.is_deliver_by_fengniao">蜂鸟专送</i>
            </div>
        </div>
        <div class="payment">
            <div>
                <span>支付方式</span>
                <div @tap="showDrawer=true">
                    <b>{{payName}}</b>
                    <i class="el-icon-arrow-up"></i>
                </div>
            </div>
            <div>
                <span>红包</span>
                <b>暂时只在饿了么APP中支持</b>
            </div>
        </div>
        <div class="group">
            <div>
                <img :src="imgBaseURL + checkData.cart.restaurant_info.image_path" alt="">
                <span>{{checkData.cart.restaurant_info.name}}</span>
            </div>
            <ul>
                <li v-for="(food,index) in checkData.cart.groups[0]" :key="index">
                    <p>{{food.name}}</p>
                    <div>
                        <b>×{{food.quantity}}</b>
                        <i>￥{{food.price * food.quantity|toFixed2}}</i>
                    </div>
                </li>
            </ul>
            <ul>
                <li>
                    <p>包装费</p>
                    <i>￥{{totalPackingFee|toFixed2}}</i>
                </li>
                <li>
                    <p>配送费</p>
                    <i>￥{{deliveryFee|toFixed2}}</i>
                </li>
            </ul>
            <div>
                <span>小计￥<b>{{totalPrice|toFixed2}}</b></span>
            </div>
        </div>
        <div class="note">
            <span>订单备注</span>
            <div @tap="$router.push('/addNote?id='+id+'&sig='+ checkData.sig)">
                <b v-if="!formattedNote">口味、偏好等</b>
                <b v-else class="ellipsis">{{formattedNote}}</b>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div class="bar">
            <p>待支付￥{{totalPrice|toFixed2}}</p>
            <span @tap="confirm">确认下单</span>
        </div>
        <div class="mask" v-show="showDrawer" @tap="showDrawer=false"></div>
        <transition name="zoom-in-bottom">
            <div class="drawer" v-show="showDrawer">
                <header>支付方式</header>
                <ul>
                    <li v-for="(payment,index) in checkData.payments" :key="index">
                        <span>{{payment.name}}</span>
                        <i class="el-icon-success" :class="{checked: payID === payment.id}"
                           @tap="showDrawer=false;payID = payment.id;payName=payment.name"></i>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import TopBar from '@/components/TopBar'
    import {takeOrder} from '@/api/index'
    import {imgBaseURL} from '@/utils/config'
    import {removeLocalStorage} from '@/utils/myUtils'

    export default {
        name: "ConfirmOrder",
        components: {
            TopBar
        },
        data() {
            return {
                id: this.$route.query.id,
                geohash: this.$route.query.geohash,
                showDrawer: false,
                payName: '货到付款',
                payID: 2,
                fromElse: false,
                imgBaseURL
            }
        },
        computed: {
            ...mapState(['cart', 'checkData', 'allAddress', 'chosenIndex', 'quickNote', 'customNote', 'userInfo']),
            shoppingCart() {
                return this.cart[this.id] || {};
            },
            formattedShopCart() {
                let array = [];
                Object.keys(this.shoppingCart).forEach(category => {
                    Object.keys(this.shoppingCart[category]).forEach(item => {
                        this.shoppingCart[category][item] ? array.push(this.shoppingCart[category][item]) : null;
                    })
                });
                return array;
            },
            deliveryFee() {
                return this.checkData.cart.restaurant_info.float_delivery_fee;
            },
            totalPackingFee() {
                let fee = 0;
                for (let i = 0, len = this.checkData.cart.groups[0].length; i < len; i++) {
                    fee += this.checkData.cart.groups[0][i].quantity * this.checkData.cart.groups[0][i].packing_fee
                }
                return fee;
            },
            totalPrice() {
                let price = 0;
                for (let i = 0, len = this.checkData.cart.groups[0].length; i < len; i++) {
                    price += this.checkData.cart.groups[0][i].quantity * this.checkData.cart.groups[0][i].price;
                }
                price += this.totalPackingFee;
                price += this.deliveryFee;
                return price;
            },
            formattedNote() {
                if (this.quickNote && this.customNote) {
                    return this.quickNote + '，' + this.customNote;
                } else {
                    return this.quickNote || this.customNote;
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/chooseAddress' || from.path === '/addNote' || from.path === '/payOnline') {
                to.meta.transitionName = 'slide-to-right';
                next();
            } else {
                to.meta.transitionName = 'slide-to-left';
                // 记录来自else
                next(vm => vm.fromElse = true);
            }
        },
        activated() {
            // activated触发早于组件内守卫的回调
            // 只有来自else才初始化数据
            this.$nextTick(() => {
                if (this.fromElse) {
                    this.initData();
                }
            })
        },
        deactivated() {
            this.fromElse = false;
        },
        methods: {
            initData() {
                let store = this.$store, id = this.id, geohash = this.geohash;

                store.commit('setCheckData', {
                    cart: {
                        restaurant_info: {},
                        groups: [[]]
                    },
                    payments: []
                });
                store.commit('setAllAddress', []);
                return Promise.all([store.dispatch('fetchCheckData', {geohash, id, entities: [this.formattedShopCart]}), store.dispatch('fetchAllAddress', this.userInfo.id)])
            },
            confirm() {
                if (!this.allAddress.length) {
                    this.$alert({type: 'warning', content: '请先添加一个地址'});
                } else {
                    takeOrder(this.userInfo.id, this.checkData.cart.id, this.allAddress[this.chosenIndex].id, this.id, [this.formattedShopCart], this.geohash, this.formattedNote).then(({data}) => {
                        if (data.status === 1) {
                            this.$alert({
                                type: 'success',
                                content: data.success
                            });
                            this.$router.replace(`/payOnline?geohash=${this.geohash}`);
                            this.$store.commit('setCart', {});
                            this.$store.commit('setNote', {quickNote: '', customNote: ''});
                            removeLocalStorage('cartHistory');
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #confirm-order {
        @include size(100%, 100%);
        @include absolute();
        box-sizing: border-box;
        padding: 1.95rem 0 2.4rem;
        overflow-y: auto;

        .address {
            background-color: #fff;
            padding: 0 0.6rem;
            box-sizing: border-box;
            background: url(../assets/img/address_bottom.png) left bottom repeat-x;
            background-color: #fff;
            background-size: auto .12rem;

            .empty {
                @include size(100%, 3.5rem);
                @include flex(row, space-between, center);

                span {
                    font-size: 0.7rem;
                    color: #666;
                }

                span::before {
                    font-size: 0.9rem;
                    color: $theme;
                    margin-right: 0.2rem;
                }

                i {
                    color: #999;
                }
            }

            .ready {
                @include size(100%, 3.5rem);
                @include flex(row, space-between, center);

                > section {
                    @include flex(row, null, center);

                    > span::before {
                        font-size: 0.9rem;
                        color: $theme;
                        margin-right: 0.2rem;
                    }
                }

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

        .time {
            @include flex(row, space-between, center);
            border-left: 0.2rem solid #3190e8;
            height: 4rem;
            background-color: #fff;
            margin-top: .4rem;
            padding: 0 .7rem;

            p {
                font-size: 0.8rem;
                color: #333;
                font-weight: bold;
                padding-left: .3rem;
            }

            div {
                @include flex(column, null, flex-end);

                span {
                    color: $theme;
                    font-size: 0.7rem;
                }

                i {
                    font-size: 0.5rem;
                    color: #fff;
                    background-color: $theme;
                    width: 2.4rem;
                    margin-top: .5rem;
                    text-align: center;
                    border-radius: 0.12rem;
                    padding: .1rem;
                }
            }
        }

        .payment {
            background-color: #fff;
            margin-top: .4rem;
            padding: 0 .7rem;

            > div {
                @include flex(row, space-between, center);
            }

            > div:first-child {
                line-height: 2rem;

                span {
                    font-size: 0.7rem;
                    color: #666;
                }

                b, i {
                    font-size: 0.6rem;
                    color: #aaa;
                }


            }

            > div:last-child {
                border-top: 0.025rem solid #f5f5f5;

                span, b {
                    font-size: 0.6rem;
                    color: #aaa;
                    line-height: 2rem;
                }
            }
        }

        .group {
            background-color: #fff;
            margin-top: .4rem;

            > div:first-child {
                @include flex(row, null, center);
                padding: .7rem;
                border-bottom: 0.025rem solid #f5f5f5;

                img {
                    @include size(1.2rem, 1.2rem);
                    margin-right: .3rem;
                }

                span {
                    color: #333;
                    font-size: 0.8rem;
                }
            }

            ul:first-of-type {
                padding-top: .5rem;

                li {
                    @include flex(row, space-between);
                    line-height: 1.8rem;
                    padding: 0 .7rem;

                    p {
                        width: 11rem;
                        font-size: 0.65rem;
                        color: #333;
                    }

                    > div {
                        @include flex(row, space-between);
                        flex: 1;
                    }

                    b {
                        font-size: 0.65rem;
                        color: #f60;
                    }

                    i {
                        font-size: 0.65rem;
                    }
                }
            }

            ul:last-of-type {
                border-top: 0.025rem solid #f5f5f5;
                padding: .2rem 0;

                li {
                    @include flex(row, space-between);
                    line-height: 1.4rem;
                    padding: 0 .7rem;

                    p {
                        width: 11rem;
                        font-size: 0.55rem;
                        color: #333;
                    }

                    i {
                        font-size: 0.55rem;
                    }
                }
            }

            > div:last-child {
                display: flex;
                justify-content: flex-end;
                border-top: 0.025rem solid #f5f5f5;
                line-height: 1.8rem;
                padding: .2rem .7rem;
                font-size: .65rem;

                b {
                    font-size: 1rem;
                }
            }
        }

        .note {
            @include flex(row, space-between);
            background-color: #fff;
            margin-top: .4rem;
            padding: 0 .7rem;
            line-height: 2rem;

            span {
                font-size: 0.7rem;
                color: #666;
            }

            > div {
                @include flex(row, null, center);

                b {
                    font-size: 0.6rem;
                    color: #aaa;
                    width: 10rem;
                    display: block;
                    text-align: right;
                }

                i {
                    font-size: 0.6rem;
                    color: #aaa;
                }
            }


        }

        .bar {
            @include size(100%, 2rem);
            @include fixed(null, null, null, 0);
            @include flex();
            line-height: 2rem;
            font-size: 0.75rem;
            color: #fff;

            p {
                background-color: #3c3c3c;
                flex: 5;
                padding-left: .7rem;
            }

            span {
                flex: 2;
                background-color: #56d176;
                text-align: center;
            }
        }

        .mask {
            @include fixed(0, 0);
            @include size(100%, 100%);
            background-color: rgba(0, 0, 0, .2);
            z-index: 2;
        }

        .drawer {
            @include fixed(null, null, null, 0);
            @include size(100%, 10rem);
            background-color: #fff;
            z-index: 3;

            header {
                background-color: #fafafa;
                font-size: 0.7rem;
                color: #333;
                text-align: center;
                line-height: 2rem;
            }

            ul {
                li {
                    @include flex(row, space-between, center);
                    padding: 0 .7rem;
                    line-height: 2.5rem;

                    span {
                        font-size: 0.7rem;
                        color: #333;
                    }

                    i {
                        color: #ccc;
                    }

                    i.checked {
                        color: #4cd964;
                    }
                }
            }
        }
    }
</style>