<template>
    <div id="home"
         @swipeend="handleSwipeend">
        <top-bar :title="position.name">
            <template #left>
                <i class="el-icon-position" @tap="$router.push('/locate')"></i>
            </template>
            <template #right>
                <i class="el-icon-chat-line-round"></i>
            </template>
        </top-bar>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <ul class="clearfix index-entry">
                        <li v-for="(item,index) in $options.option.indexEntry1"
                            :key="index"
                            @tap="toShopCategory(item)">
                            <img :src="imgCDN+item.image_url" alt="">
                            <span v-text="item.title"></span>
                        </li>
                    </ul>
                </div>
                <div class="swiper-slide">
                    <ul class="clearfix index-entry">
                        <li v-for="(item,index) in $options.option.indexEntry2"
                            :key="index"
                            @tap="toShopCategory(item)">
                            <img :src="imgCDN+item.image_url" alt="">
                            <span v-text="item.title"></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <shop-list ref="shopList"
                   :data="homeShopList"
                   :have-more="homeHaveMore"
                   style="border-top: .025rem solid #e4e4e4;margin-top: .5rem;min-height: calc(100% - 9.05rem)"/>
    </div>
</template>

<script>
    import Swiper from 'swiper'
    import 'swiper/css/swiper.min.css'
    import {mapState, mapGetters} from 'vuex'
    import TopBar from '@/components/TopBar'
    import ShopList from '@/components/ShopList'
    import {imgCDN} from '@/utils/config'
    import {checkLoad} from '@/utils/myUtils'

    export default {
        name: "Home",
        components: {
            TopBar,
            ShopList
        },
        data() {
            return {
                geohash: this.$route.query.geohash,
                imgCDN
            }
        },
        computed: {
            shopListOffset() {
                return this.$isServer ? 0 : 2.3 * parseInt(window.getComputedStyle(document.documentElement).fontSize);
            },
            ...mapState(['position', 'homeShopList']),
            ...mapGetters(['homeHaveMore'])
        },
        option: {
            indexEntry1: [{
                title: '甜品饮品',
                id: '239',
                image_url: '2/35/696aa5cf9820adada9b11a3d14bf5jpeg.jpeg'
            }, {
                title: '商店超市',
                id: '252',
                image_url: '0/da/f42235e6929a5cb0e7013115ce78djpeg.jpeg'
            }, {
                title: '异国料理',
                id: '260',
                image_url: 'b/7e/d1890cf73ae6f2adb97caa39de7fcjpeg.jpeg'
            }, {
                title: '简餐',
                id: '265',
                image_url: 'd/38/7bddb07503aea4b711236348e2632jpeg.jpeg'
            }, {
                title: '咖喱饭',
                id: '268',
                image_url: 'a/fa/d41b04d520d445dc5de42dae9a384jpeg.jpeg'
            }, {
                title: '东南亚菜',
                id: '264',
                image_url: '3/84/8e031bf7b3c036b4ec19edff16e46jpeg.jpeg'
            }, {
                title: '米粉面馆',
                id: '213',
                image_url: 'd/49/7757ff22e8ab28e7dfa5f7e2c2692jpeg.jpeg'
            }, {
                title: '黄焖鸡米饭',
                id: '267',
                image_url: 'e/7e/02b72b5e63c127d5bfae57b8e4ab1jpeg.jpeg'
            }],
            indexEntry2: [{
                title: '川湘菜',
                id: '221',
                image_url: '9/7c/9700836a33e05c2410bda8da59117jpeg.jpeg'
            }, {
                title: '麻辣烫',
                id: '214',
                image_url: '3/c7/a9ef469a12e7a596b559145b87f09jpeg.jpeg'
            }, {
                title: '包子粥店',
                id: '215',
                image_url: '2/17/244241b514affc0f12f4168cf6628jpeg.jpeg'
            }, {
                title: '鲜花蛋糕',
                id: '248',
                image_url: '8/83/171fd98b85dee3b3f4243b7459b48jpeg.jpeg'
            }, {
                title: '日韩料理',
                id: '229',
                image_url: '6/1a/1e0f448be0624c62db416e864d2afjpeg.jpeg'
            }, {
                title: '果蔬生鲜',
                id: '244',
                image_url: '4/34/ea0d51c9608310cf41faa5de6b8efjpeg.jpeg'
            }, {
                title: '汉堡薯条',
                id: '212',
                image_url: 'b/7f/432619fb21a40b05cd25d11eca02djpeg.jpeg'
            }, {
                title: '披萨意面',
                id: '211',
                image_url: '7/b6/235761e50d391445f021922b71789jpeg.jpeg'
            }]
        },
        watch: {
            geohash() {
                this.initData();
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/search' || from.path === '/order' || from.path === '/mine') {
                to.meta.transitionName = '';
            } else if (from.path === '/shopCategory') {
                to.meta.transitionName = 'slide-to-right';
            } else if (from.path === '/shop') {
                to.meta.transitionName = 'slide-to-bottom';
            } else {
                // 重置动画
                to.meta.transitionName = 'slide-to-left';
            }
            next();
        },
        asyncData({store, route}) {
            let geohash = route.query.geohash;
            store.commit('setHomeShopList', []);
            store.commit('setHomeShopListIndex', 0);
            return Promise.all([store.dispatch('fetchPosition', geohash), store.dispatch('fetchHomeShopList', {
                latitude: geohash.split(',')[0],
                longitude: geohash.split(',')[1],
                order_by: 5,
                offset: store.state.shopListLimit * store.state.homeShopListIndex,
                limit: store.state.shopListLimit
            })]);
        },
        mounted() {
            new Swiper('#home .swiper-container');
        },
        activated() {
            this.geohash = this.$route.query.geohash;
        },
        methods: {
            initData() {
                let store = this.$store, geohash = this.geohash;

                // 重置数据
                store.commit('setHomeShopList', []);
                store.commit('setHomeShopListIndex', 0);
                return Promise.all([store.dispatch('fetchPosition', geohash), store.dispatch('fetchHomeShopList', {
                    latitude: geohash.split(',')[0],
                    longitude: geohash.split(',')[1],
                    order_by: 5,
                    offset: store.state.shopListLimit * store.state.homeShopListIndex,
                    limit: store.state.shopListLimit
                })]);
            },
            loadMore() {
                let store = this.$store, geohash = this.geohash;
                return store.dispatch('fetchMoreHomeShopList', {
                    latitude: geohash.split(',')[0],
                    longitude: geohash.split(',')[1],
                    order_by: 5,
                    offset: store.state.shopListLimit * store.state.homeShopListIndex,
                    limit: store.state.shopListLimit
                });
            },
            toShopCategory(item) {
                this.$router.push(`/shopCategory?geohash=${this.geohash}&title=${item.title}&id=${item.id}`);
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
                        if (checkLoad(this.$refs.shopList.$el, this.shopListOffset) && this.homeHaveMore) {
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

    #home {
        @include size(100%, 100%);
        @include absolute();

        overflow-y: auto;
        box-sizing: border-box;
        padding: 1.95rem 0 2.3rem;

        .index-entry {
            background-color: #fff;
            border-bottom: 0.025rem solid #e4e4e4;
            height: 8.5rem;

            li {
                @include size(25%, 50%);
                @include flex(column, null, center);
                float: left;
            }

            img {
                @include size(1.8rem, 1.8rem);
                margin: 0.5rem 0;
            }

            span {
                font-size: 0.55rem;
                color: #666;
            }
        }

        .shop-around-header {
            background-color: #fff;
            margin-top: .5rem;
            padding: .25rem 0 0 .75rem;
            font: 0.475rem/0.8rem "Microsoft YaHei";
            border-top: 1px solid #e4e4e4;
            color: #999;
        }
    }
</style>