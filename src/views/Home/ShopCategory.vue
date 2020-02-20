<template>
    <div id="shop-category"
         @swipeend="handleSwipeend">
        <top-bar show-back :title="$route.query.title"/>
        <ul class="sort-container clearfix">
            <li @tap="categoryClick=!categoryClick;sortClick=false;siftClick=false" :class="{checked: categoryClick}">
                分类<i class="el-icon-caret-bottom"></i>
                <transition name="zoom-in-top">
                    <div v-show="categoryClick" class="category-dropdown"></div>
                </transition>
            </li>
            <li @tap="sortClick=!sortClick;categoryClick=false;siftClick=false" :class="{checked: sortClick}">
                排序<i class="el-icon-caret-bottom"></i>
                <transition name="zoom-in-top">
                    <div v-show="sortClick" class="sort-dropdown">
                        <div class="sort-dropdown-item" :class="{checked: sortIndex[0] === 4}" @tap="sortIndex.splice(0,1,4)"><i
                                class="el-icon-sort">智能排序</i></div>
                        <div class="sort-dropdown-item" :class="{checked: sortIndex[0] === 5}" @tap="sortIndex.splice(0,1,5)"><i
                                class="el-icon-location-outline">距离最近</i></div>
                        <div class="sort-dropdown-item" :class="{checked: sortIndex[0] === 6}" @tap="sortIndex.splice(0,1,6)"><i
                                class="el-icon-paperclip">销量最高</i></div>
                        <div class="sort-dropdown-item" :class="{checked: sortIndex[0] === 1}" @tap="sortIndex.splice(0,1,1)"><i
                                class="el-icon-apple">起送最低</i></div>
                        <div class="sort-dropdown-item" :class="{checked: sortIndex[0] === 2}" @tap="sortIndex.splice(0,1,2)"><i
                                class="el-icon-tableware">配送最快</i></div>
                        <div class="sort-dropdown-item" :class="{checked: sortIndex[0] === 3}" @tap="sortIndex.splice(0,1,3)"><i
                                class="el-icon-coffee">评分最高</i></div>
                    </div>
                </transition>
            </li>
            <li @tap="categoryClick=false;sortClick=false" :class="{checked: siftClick}">
                <span @tap="siftClick=!siftClick">筛选<i class="el-icon-caret-bottom"></i></span>
                <transition name="zoom-in-top">
                    <div v-show="siftClick" class="sift-dropdown clearfix">
                        <h5>配送方式</h5>
                        <button :class="{checked: hummingBird === true}"
                                @tap="hummingBird = !hummingBird">蜂鸟配送
                        </button>
                        <h5>商家特色</h5>
                        <button @tap="brand=!brand" :class="{checked: brand}">品牌商家</button>
                        <button @tap="insurance=!insurance" :class="{checked: insurance}">外卖保</button>
                        <button @tap="onTime=!onTime" :class="{checked: onTime}">准时达</button>
                        <button @tap="recent=!recent" :class="{checked: recent}">新店</button>
                        <button @tap="online=!online" :class="{checked: online}">在线支付</button>
                        <button @tap="invoice=!invoice" :class="{checked: invoice}">开发票</button>
                        <div @tap="siftClick=false">取消</div>
                        <div @tap="siftClick=false;confirm()">确定</div>
                    </div>
                </transition>
            </li>
        </ul>
        <div class="mask" v-show="categoryClick||sortClick||siftClick"
             @tap="categoryClick=false;sortClick=false;siftClick=false"></div>
        <shop-list ref="shopList"
                   :data="categoryShopList"
                   :have-more="categoryHaveMore"
                   style="min-height: 100%"/>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import TopBar from '@/components/TopBar'
    import ShopList from '@/components/ShopList'
    import {checkLoad} from '@/utils/myUtils'

    export default {
        name: "ShopCategory",
        components: {
            TopBar,
            ShopList
        },
        data() {
            return {
                id: this.$route.query.id,
                geohash: this.$route.query.geohash,
                categoryClick: false,
                sortClick: false,
                siftClick: false,
                sortIndex: [4],
                deliveryMode: [],
                hummingBird: false,
                supportIDs: [],
                brand: false,
                insurance: false,
                onTime: false,
                recent: false,
                online: false,
                invoice: false
            }
        },
        computed: {
            ...mapState(['categoryShopList']),
            ...mapGetters(['categoryHaveMore'])
        },
        watch: {
            id() {
                this.initData();
            },
            geohash() {
                this.initData();
            },
            sortIndex() {
                this.initData();
            },
            deliveryMode() {
                this.initData();
            },
            supportIDs() {
                this.initData();
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/shop') {
                to.meta.transitionName = 'slide-to-bottom';
            } else {
                // 重置动画
                to.meta.transitionName = 'slide-to-left';
            }
            next();
        },
        asyncData({store, route}) {
            let id = route.query.id, geohash = route.query.geohash;
            store.commit('setCategoryShopListIndex', 0);
            return store.dispatch('fetchCategoryShopList', {
                latitude: geohash.split(',')[0],
                longitude: geohash.split(',')[1],
                offset: store.state.shopListLimit * store.state.categoryShopListIndex,
                limit: store.state.shopListLimit,
                restaurant_category_ids: [id]
            })
        },
        activated() {
            this.id = this.$route.query.id;
            this.geohash = this.$route.query.geohash;
        },
        deactivated() {
            // 重置属性
            this.categoryClick = false;
            this.sortClick = false;
            this.siftClick = false;
            this.sortIndex[0] = 4;
            this.deliveryMode.length = 0;
            this.supportIDs.length = 0;
            this.hummingBird = false;
            this.brand = false;
            this.insurance = false;
            this.onTime = false;
            this.recent = false;
            this.online = false;
            this.invoice = false;
        },
        methods: {
            initData() {
                let store = this.$store, id = this.id, geohash = this.geohash;

                store.commit('setCategoryShopList', []);
                store.commit('setCategoryShopListIndex', 0);
                return store.dispatch('fetchCategoryShopList', {
                    latitude: geohash.split(',')[0],
                    longitude: geohash.split(',')[1],
                    order_by: this.sortIndex[0],
                    offset: store.state.shopListLimit * store.state.categoryShopListIndex,
                    limit: store.state.shopListLimit,
                    restaurant_category_ids: [id],
                    delivery_mode: this.deliveryMode,
                    support_ids: this.supportIDs
                })
            },
            loadMore() {
                let store = this.$store, id = this.id, geohash = this.geohash;

                return store.dispatch('fetchMoreCategoryShopList', {
                    latitude: geohash.split(',')[0],
                    longitude: geohash.split(',')[1],
                    order_by: this.sortIndex[0],
                    offset: store.state.shopListLimit * store.state.categoryShopListIndex,
                    limit: store.state.shopListLimit,
                    restaurant_category_ids: [id],
                    delivery_mode: this.deliveryMode,
                    support_ids: this.supportIDs
                });
            },
            confirm() {
                if (this.hummingBird) {
                    if (this.deliveryMode.indexOf(1) === -1) {
                        this.deliveryMode.push(1);
                    }
                } else {
                    let i = this.deliveryMode.indexOf(1);
                    if (i > -1) {
                        this.deliveryMode.splice(i, 1);
                    }
                }

                if (this.brand) {
                    if (this.supportIDs.indexOf(8) === -1) {
                        this.supportIDs.push(8);
                    }
                } else {
                    let i = this.supportIDs.indexOf(8);
                    if (i > -1) {
                        this.supportIDs.splice(i, 1);
                    }
                }

                if (this.insurance) {
                    if (this.supportIDs.indexOf(7) === -1) {
                        this.supportIDs.push(7);
                    }
                } else {
                    let i = this.supportIDs.indexOf(7);
                    if (i > -1) {
                        this.supportIDs.splice(i, 1);
                    }
                }

                if (this.onTime) {
                    if (this.supportIDs.indexOf(9) === -1) {
                        this.supportIDs.push(9);
                    }
                } else {
                    let i = this.supportIDs.indexOf(9);
                    if (i > -1) {
                        this.supportIDs.splice(i, 1);
                    }
                }

                if (this.recent) {
                    if (this.supportIDs.indexOf(5) === -1) {
                        this.supportIDs.push(5);
                    }
                } else {
                    let i = this.supportIDs.indexOf(5);
                    if (i > -1) {
                        this.supportIDs.splice(i, 1);
                    }
                }

                if (this.online) {
                    if (this.supportIDs.indexOf(3) === -1) {
                        this.supportIDs.push(3);
                    }
                } else {
                    let i = this.supportIDs.indexOf(3);
                    if (i > -1) {
                        this.supportIDs.splice(i, 1);
                    }
                }

                if (this.invoice) {
                    if (this.supportIDs.indexOf(4) === -1) {
                        this.supportIDs.push(4);
                    }
                } else {
                    let i = this.supportIDs.indexOf(4);
                    if (i > -1) {
                        this.supportIDs.splice(i, 1);
                    }
                }
            },
            handleSwipeend() {
                // 记录停止滑动时的scrollTop
                let touchendScrollTop = this.$refs.shopList.$el.parentElement.scrollTop;
                // 浏览器下一次重流时执行，执行完才会进行下一次重绘
                requestAnimationFrame(() => {
                    if (this.$refs.shopList.$el.parentElement.scrollTop !== touchendScrollTop) {
                        // 没有停下
                        this.handleSwipeend();
                    } else {
                        // 停下了
                        if (checkLoad(this.$refs.shopList.$el) && this.categoryHaveMore) {
                            this.loadMore();
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #shop-category {
        @include absolute();
        @include size(100%, 100%);

        overflow-y: auto;
        box-sizing: border-box;
        padding-top: 3.575rem;

        .sort-container {
            @include fixed(null, 1.95rem, 0);
            @include size(100%);

            background-color: #fff;
            border-bottom: 0.025rem solid #f1f1f1;
            z-index: 3;

            li {
                @include size(33.3%, 1.6rem);
                font-size: 0.55rem;
                color: #444;
                text-align: center;
                line-height: 1.6rem;
                float: left;

                i::before {
                    display: inline-block;
                    transition: all .25s linear;
                }
            }

            li.checked {
                color: $theme;

                i::before {
                    transform: rotateZ(180deg);
                }
            }
        }

        .category-dropdown, .sort-dropdown, .sift-dropdown {
            @include fixed(0, 3.575rem);
            @include size(100%);

            background-color: #fff;
            z-index: 2;
        }

        .sort-dropdown .sort-dropdown-item.checked i {
            color: $theme;
        }

        .sort-dropdown .sort-dropdown-item i {
            display: block;
            line-height: 2rem;
            border-bottom: 0.025rem solid #e4e4e4;
            color: #666;
            text-align: left;
        }

        .sort-dropdown .sort-dropdown-item i::before {
            font-size: 1rem;
            margin: 0 .5rem;
        }

        .sift-dropdown {
            text-align: left;

            h5 {
                font-size: 0.4rem;
                color: #333;
                line-height: 1.5rem;
                height: 1.5rem;
                font-weight: 400;
                padding-left: 0.5rem;
                background-color: #fff;
            }

            button {
                @include size(4.7rem, 1.4rem);

                font-size: 0.4rem;
                color: #333;
                border: 0.025rem solid #eee;
                background-color: #fff;
                margin-left: .5rem;
            }

            button.checked {
                color: $theme;
                border: 0.025rem solid $theme;
            }

            div {
                @include size(42.5%, 1.8rem);
                font-size: 0.8rem;
                line-height: 1.8rem;
                text-align: center;
                margin: .5rem;
            }

            div:first-of-type {
                color: #333;
                background-color: #F5F5F5;
                border: 0.025rem solid #fff;
                border-radius: 0.2rem;
                float: left;
            }

            div:last-of-type {
                color: #fff;
                background-color: #56d176;
                border: 0.025rem solid #fff;
                border-radius: 0.2rem;
                float: right;
            }
        }

        .mask {
            @include fixed(0, 0);
            @include size(100%, 100%);

            background-color: rgba(0, 0, 0, .2);
            z-index: 1;
        }
    }
</style>