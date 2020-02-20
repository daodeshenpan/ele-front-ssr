<template>
    <div id="shop">
        <loading-icon v-if="!shopInfo.id"/>
        <div v-else class="shop-wrap">
            <header>
                <i class="el-icon-arrow-down back" @tap="$router.go(-1)"></i>
                <img :src="imgBaseURL + shopInfo.image_path" alt="" class="header-background">
                <div class="header-content">
                    <div @tap="$router.push('/shopDetail?id='+id)">
                        <img :src="imgBaseURL + shopInfo.image_path" alt="">
                        <div class="header-content-main">
                            <h4 class="ellipsis">{{shopInfo.name}}</h4>
                            <p>蜂鸟专送 / {{shopInfo.order_lead_time}}分钟送达 / 配送￥{{shopInfo.float_delivery_fee}}</p>
                            <p>公告：{{shopInfo.promotion_info}}</p>
                        </div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <div v-if="shopInfo.activities[0]" @tap="showActivityDetail=true">
                        <p class="ellipsis">
                            <span :style="{backgroundColor: '#'+shopInfo.activities[0].icon_color}">{{shopInfo.activities[0].icon_name}}</span>
                            <span>{{shopInfo.activities[0].description}}（APP专享）</span>
                        </p>
                        <p>{{shopInfo.activities.length}}个活动<i class="el-icon-arrow-right"></i>
                        </p>
                    </div>
                </div>
            </header>
            <div class="toggle">
                <div @tap="toggleTab('menu')">
                    <span :class="{active: tab === 'menu'}" ref="span">
                        商品
                        <i class="underline" ref="underline"></i>
                    </span>
                </div>
                <div @tap="toggleTab('comment')">
                    <span :class="{active: tab === 'comment'}">评论</span>
                </div>
            </div>
            <div class="main">
                <div class="menu"
                     style="transform: translateX(0)"
                     ref="menu"
                     @swipe="handleSwipe($event,'menu')"
                     @swipeend="handleSwipeend($event,'menu')"
                     key="menu">
                    <div class="menu-main">
                        <ul class="menu-main-title">
                            <li v-for="(item,index) in shopMenu" :key="index"
                                :class="{selected: menuSelected === index}"
                                @tap="handleTap(index)">
                                    <span>
                                        {{item.name}}
                                    </span>
                            </li>
                        </ul>
                        <ul class="menu-main-content" ref="main" @swipeend="onSwipeend">
                            <li v-for="(item,index) in shopMenu" :key="index">
                                <header>
                                    <b>{{item.name}}</b>
                                    <span>{{item.description}}</span>
                                </header>
                                <section v-for="(food,index) of item.foods">
                                    <div @tap="$router.push(`/foodDetail?image_path=${food.image_path}&name=${food.name}&description=${food.description}&month_sales=${food.month_sales}&satisfy_rate=${food.satisfy_rate}&rating=${food.rating}`)">
                                        <img :src="imgBaseURL + food.image_path" alt="">
                                        <div>
                                            <h4>{{food.name}}</h4>
                                            <p>{{food.description}}</p>
                                            <p>
                                                <span>月售{{food.month_sales}}份</span>&nbsp;<span>好评率{{food.satisfy_rate}}%</span>
                                            </p>
                                            <p v-if="food.activity">
                                                <span :style="{color: '#' + food.activity.image_text_color,borderColor:'#' +food.activity.icon_color}">{{food.activity.image_text}}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <footer>
                                        <div>
                                            <span>¥</span>
                                            <span>{{food.specfoods[0].price}}</span>
                                        </div>
                                        <food-counter :food="food"
                                                      :shopping-cart-position="shoppingCartPosition"
                                                      @bounce="bounce"
                                                      :animate="true"/>
                                    </footer>
                                </section>
                            </li>
                        </ul>
                    </div>
                    <div class="shopping-cart">
                        <div class="cart-icon" ref="cart" :class="{empty:totalAmount === 0}"
                             @tap="totalAmount > 0 ? showCartPanel=!showCartPanel : null">
                            <i class="el-icon-shopping-cart-2"></i>
                            <i class="cart-icon-badge" v-show="totalAmount > 0">{{totalAmount}}</i>
                        </div>
                        <div class="count">
                            <span>￥{{totalPrice|toFixed2}}</span>
                            <b>配送费￥{{shopInfo.float_delivery_fee}}</b>
                        </div>
                        <div v-show="priceToConfirm > 0" class="confirm">
                            还差￥{{priceToConfirm}}起送
                        </div>
                        <div v-show="priceToConfirm <= 0" class="confirm ready"
                             @tap="toOrderConfirm">
                            去结算
                        </div>
                        <transition name="zoom-in-bottom">
                            <div class="shopping-cart-main" v-show="showCartPanel && totalAmount">
                                <header>
                                    <h4>购物车</h4>
                                    <i class="el-icon-delete"
                                       @tap="$store.commit('setShopCart',{id:id,cart: undefined});showCartPanel=false">清空</i>
                                </header>
                                <div class="shopping-cart-content" v-for="(food,index) in totalFood" :key="index">
                                    <p class="ellipsis">{{food.name}}</p>
                                    <div>
                                        <span>￥{{food.price|toFixed2}}</span>
                                        <food-counter :food="food" :animate="false"/>
                                    </div>
                                </div>
                                <div class="shopping-cart-packing">包装费:￥{{totalPackingFee|toFixed2}}</div>
                            </div>
                        </transition>
                    </div>
                    <div class="cart-panel-mask" v-show="showCartPanel && totalAmount" @tap="showCartPanel=false"></div>
                </div>
                <div class="comment"
                     style="transform: translateX(100%)"
                     @swipe="handleSwipe($event,'comment')"
                     @swipeend="handleSwipeend($event,'comment')"
                     ref="comment"
                     key="comment">
                    <div class="comment-score">
                        <div class="comment-score-left">
                            <p>{{shopScore.overall_score|toFixed2}}</p>
                            <p>综合评价</p>
                            <p>高于{{shopScore.compare_rating * 100|toFixed2}}%同类商家</p>
                        </div>
                        <div class="comment-score-right">
                            <p><span>菜品质量：</span>{{shopScore.food_score|toFixed2}}</p>
                            <p><span>服务质量：</span>{{shopScore.service_score|toFixed2}}</p>
                            <p><span>送达时间：</span>{{shopScore.deliver_time}}</p>
                        </div>
                    </div>
                    <ul class="comment-tag">
                        <li v-for="(item,index) in shopTag" :key="index">{{item.name + '('+ item.count+ ')'}}</li>
                    </ul>
                    <ul class="comment-rating">
                        <li v-for="(item,index) in shopRating" :key="index">
                            <div>
                                <img :src="item.avatar ? (imgCDN + item.avatar) : (imgBaseURL + 'default.jpg')"
                                     alt="">
                                <div>
                                    <p>{{item.username}}</p>
                                    <img v-for="(rating,index) in item.item_ratings" v-if="rating.image_hash"
                                         :src="imgCDN + rating.image_hash" alt="">
                                    <p></p>
                                    <span v-for="(rating,index) in item.item_ratings" class="ellipsis">{{rating.food_name}}</span>
                                </div>
                            </div>
                            <span>{{item.rated_at}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <transition name="fade-in-out">
                <section class="activity-detail" v-if="showActivityDetail">
                    <h4>{{shopInfo.name}}</h4>
                    <div class="activity-detail-list">
                        <span>商家活动</span>
                        <ul>
                            <li v-for="(activity,index) in shopInfo.activities" :key="index">
                                <b :style="{backgroundColor: '#'+activity.icon_color}">{{activity.icon_name}}</b>
                                <i>{{activity.description}}（APP专享）</i>
                            </li>
                        </ul>
                    </div>
                    <div class="activity-detail-promotion">
                        <span>商家公告</span>
                        <p>{{shopInfo.promotion_info}}</p>
                    </div>
                    <i class="el-icon-circle-close close" @tap="showActivityDetail=false"></i>
                </section>
            </transition>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {getLocalStorage, setLocalStorage, addBufferMotion, accumulateOffsetTop} from '@/utils/myUtils'
    import {imgBaseURL, imgCDN} from '@/utils/config'
    import FoodCounter from '@/components/FoodCounter'
    import LoadingIcon from '@/components/LoadingIcon'

    export default {
        name: "Shop",
        components: {
            FoodCounter,
            LoadingIcon
        },
        data() {
            return {
                imgBaseURL,
                imgCDN,
                id: this.$route.query.id,
                tab: 'menu',
                showActivityDetail: false,
                menuSelected: 0,
                maxIndex: -1,
                showCartPanel: false,
                shoppingCartPosition: {}
            }
        },
        computed: {
            ...mapState(['shopInfo', 'shopMenu', 'shopRating', 'shopScore', 'shopTag', 'cart', 'userInfo']),
            shoppingCart() {
                return this.cart[this.id] || {};
            },
            totalFood() {
                let array = [];
                Object.keys(this.shoppingCart).forEach(category => {
                    Object.keys(this.shoppingCart[category]).forEach(item => {
                        this.shoppingCart[category][item] ? array.push(this.shoppingCart[category][item]) : null;
                    })
                });
                return array;
            },
            totalPrice() {
                let price = 0;
                this.totalFood.forEach(item => {
                    price += item.price * item.quantity + item.packing_fee * item.quantity;
                });
                return price;
            },
            totalPackingFee() {
                let fee = 0;
                this.totalFood.forEach(item => {
                    fee += item.packing_fee * item.quantity;
                });
                return fee;
            },
            totalAmount() {
                let amount = 0;
                this.totalFood.forEach(item => {
                    amount += item.quantity;
                });
                return amount;
            },
            priceToConfirm() {
                return this.shopInfo.float_minimum_order_amount - this.totalPrice;
            }
        },
        watch: {
            id() {
                this.initData();
            }
        },
        beforeRouteEnter(to, from, next) {
            // 重置动画
            if (from.path === '/shopDetail' || from.path === '/foodDetail' || from.path === '/confirmOrder' || from.path === '/login') {
                to.meta.transitionName = 'slide-to-right';
            } else {
                to.meta.transitionName = 'slide-to-top';
            }
            next();
        },
        asyncData({store, route}) {
            let id = route.query.id;
            store.commit('setShopInfo', {});
            store.commit('setShopMenu', []);
            store.commit('setShopRating', []);
            store.commit('setShopScore', {});
            store.commit('setShopTag', []);
            return Promise.all([store.dispatch('fetchShopInfo', id),
                store.dispatch('fetchShopMenu', id),
                store.dispatch('fetchShopRating', id),
                store.dispatch('fetchShopScore', id),
                store.dispatch('fetchShopTag', id)]);
        },
        beforeMount() {
            this.$store.commit('setCart', getLocalStorage('cartHistory') || {});
        },
        activated() {
            this.id = this.$route.query.id;
        },
        deactivated() {
            this.tab = 'menu';
            this.menuSelected = 0;
            this.maxIndex = -1;
            setLocalStorage('cartHistory', this.cart);
        },
        updated() {
            // 确保可以拿到$refs
            // 计算可以滑动的最后一个序号
            let main = this.$refs.main;
            let cart = this.$refs.cart;
            // 只算一次
            if (main && cart && this.maxIndex < 0) {
                for (let i = main.children.length - 1; i >= 0; i--) {
                    if (main.scrollHeight - main.children[i].offsetTop >= main.clientHeight) {
                        this.maxIndex = i;
                        break;
                    }
                }

                this.shoppingCartPosition = {
                    x: parseInt(window.getComputedStyle(cart).left) + cart.offsetWidth / 2,
                    y: accumulateOffsetTop(cart) + cart.offsetHeight / 2
                }
            }
        },
        methods: {
            initData() {
                let store = this.$store, route = this.$route, id = this.id;

                store.commit('setShopInfo', {});
                store.commit('setShopMenu', []);
                store.commit('setShopRating', []);
                store.commit('setShopScore', {});
                store.commit('setShopTag', []);
                return Promise.all([store.dispatch('fetchShopInfo', id),
                    store.dispatch('fetchShopMenu', id),
                    store.dispatch('fetchShopRating', id),
                    store.dispatch('fetchShopScore', id),
                    store.dispatch('fetchShopTag', id)]);
            },
            handleTap(index) {
                this.isTapScroll = true;
                let main = this.$refs.main;
                this.menuSelected = index;

                if (index <= this.maxIndex) {
                    addBufferMotion(main, {scrollTop: main.children[index].offsetTop}, 0.1, 10);
                } else {
                    addBufferMotion(main, {scrollTop: main.scrollHeight - main.offsetHeight}, 0.1, 10);
                }
            },
            onSwipeend() {
                let main = this.$refs.main;
                // 记录停止滑动时的scrollTop
                let touchendScrollTop = main.scrollTop;
                // 浏览器下一次重流时执行，执行完才会进行下一次重绘
                let requestFrame = requestAnimationFrame(() => {
                    if (main.scrollTop !== touchendScrollTop) {
                        // 没有停下
                        this.onSwipeend();
                    } else {
                        // 停下了
                        for (let i = 0, len = main.children.length; i < len; i++) {
                            if (main.scrollTop >= main.children[i].offsetTop && main.scrollTop < main.children[i + 1].offsetTop) {
                                this.menuSelected = i;
                            }
                        }
                    }
                })
            },
            bounce() {
                let cart = this.$refs.cart;
                cart.classList.add('bounce');
                cart.addEventListener('animationend', () => {
                    cart.classList.remove('bounce');
                }, {once: true})
            },
            toOrderConfirm() {
                if (this.userInfo.id) {
                    this.$router.push(`/confirmOrder?geohash=${this.$route.query.geohash}&id=${this.id}`);
                } else {
                    this.$router.push(`/login?geohash=${this.$route.query.geohash}&id=${this.id}`);
                }
            },
            toggleTab(tab) {
                let menu = this.$refs.menu, comment = this.$refs.comment, span = this.$refs.span,
                    underline = this.$refs.underline;
                let underlineMaxDisplacement = parseFloat(window.getComputedStyle(span).width) + parseFloat(window.getComputedStyle(span).marginRight) * 2;
                this.tab = tab;
                if (this.tab === 'menu') {
                    this.translateXAnimated(menu, '0');
                    this.translateXAnimated(underline, '0');
                    this.translateXAnimated(comment, '100%');
                } else {
                    this.translateXAnimated(menu, '-100%');
                    this.translateXAnimated(underline, underlineMaxDisplacement + 'px');
                    this.translateXAnimated(comment, '0');
                }
            },
            translateXAnimated(element, x) {
                element.style.transition = `transform .3s cubic-bezier(.23, 1, .32, 1)`;
                element.style.transform = `translateX(${x})`;
                element.addEventListener('transitionend', () => {
                    element.style.transition = ``;
                }, {once: true})
            },
            handleSwipe(e, tab) {
                let menu = this.$refs.menu, comment = this.$refs.comment;
                let span = this.$refs.span, underline = this.$refs.underline;
                let menuWidth = parseInt(window.getComputedStyle(menu).width),
                    commentWidth = parseInt(window.getComputedStyle(comment).width);
                let underlineMaxDisplacement = parseFloat(window.getComputedStyle(span).width) + parseFloat(window.getComputedStyle(span).marginRight) * 2;
                if (tab === 'menu') {
                    if (Math.abs(e.$deltaY) / Math.abs(e.$deltaX) < Math.tan(Math.PI / 6)) {
                        // 滑动起点与终点的连线和x轴的角度小于30度，则变换x轴位移
                        menu.style.transform = `translateX(${e.$deltaX}px)`;
                        underline.style.transform = `translateX(${-e.$deltaX / 4}px)`;
                        comment.style.transform = `translateX(${commentWidth + e.$deltaX}px)`;
                    }
                } else {
                    if (Math.abs(e.$deltaY) / Math.abs(e.$deltaX) < Math.tan(Math.PI / 6)) {
                        menu.style.transform = `translateX(${-menuWidth + e.$deltaX}px)`;
                        underline.style.transform = `translateX(${underlineMaxDisplacement - e.$deltaX / 4}px)`;
                        comment.style.transform = `translateX(${e.$deltaX}px)`;
                    }
                }
            },
            handleSwipeend(e, tab) {
                let menu = this.$refs.menu, comment = this.$refs.comment;
                let span = this.$refs.span, underline = this.$refs.underline;
                let translateXRegExp = /translateX\((.*)\)/;
                let menuWidth = parseInt(window.getComputedStyle(menu).width),
                    commentWidth = parseInt(window.getComputedStyle(comment).width);
                let underlineMaxDisplacement = parseFloat(window.getComputedStyle(span).width) + parseFloat(window.getComputedStyle(span).marginRight) * 2;
                if (tab === 'menu') {
                    if (e.$velocityX < -400 && Math.abs(e.$deltaY) / Math.abs(e.$deltaX) < Math.tan(Math.PI / 6)) {
                        // 如果速度大于400，且滑动起点与终点的连线和x轴的角度小于30度，则直接划过
                        this.tab = 'comment';
                        this.translateXAnimated(menu, '-100%'), this.translateXAnimated(underline, underlineMaxDisplacement + 'px'), this.translateXAnimated(comment, '0');
                    } else {
                        // 速度小于400
                        let translateX = parseInt(menu.style.transform.match(translateXRegExp)[1]);
                        if (translateX > 0) {
                            this.translateXAnimated(menu, '0'), this.translateXAnimated(underline, '0'), this.translateXAnimated(comment, '100%');
                        } else if (Math.abs(translateX) < menuWidth * 2 / 3) {
                            this.translateXAnimated(menu, '0'), this.translateXAnimated(underline, '0'), this.translateXAnimated(comment, '100%');
                        } else if (Math.abs(translateX) > menuWidth * 2 / 3) {
                            this.tab = 'comment';
                            this.translateXAnimated(menu, '-100%'), this.translateXAnimated(underline, underlineMaxDisplacement + 'px'), this.translateXAnimated(comment, '0');
                        }
                    }
                } else {
                    if (e.$velocityX > 400 && Math.abs(e.$deltaY) / Math.abs(e.$deltaX) < Math.tan(Math.PI / 6)) {
                        this.tab = 'menu';
                        this.translateXAnimated(menu, '0'), this.translateXAnimated(underline, '0'), this.translateXAnimated(comment, '100%');
                    } else {
                        let translateX = parseInt(comment.style.transform.match(translateXRegExp)[1]);
                        if (translateX < 0) {
                            this.translateXAnimated(menu, '-100%'), this.translateXAnimated(underline, underlineMaxDisplacement + 'px'), this.translateXAnimated(comment, '0');
                        } else if (translateX < commentWidth * 2 / 3) {
                            this.translateXAnimated(menu, '-100%'), this.translateXAnimated(underline, underlineMaxDisplacement + 'px'), this.translateXAnimated(comment, '0');
                        } else if (translateX > commentWidth * 2 / 3) {
                            this.tab = 'menu';
                            this.translateXAnimated(menu, '0'), this.translateXAnimated(underline, '0'), this.translateXAnimated(comment, '100%');
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #shop {
        @include size(100%, 100%);
        @include absolute();
        z-index: 4;
        overflow-y: auto;
        background-color: #fff;

        .shop-wrap {
            @include size(100%, 100%);
            @include absolute();
            @include flex(column);

            header {
                .back {
                    @include absolute(.3rem, .3rem);
                    font-size: 1.2rem;
                    color: #ffffff;
                    z-index: 2;
                }

                .header-background {
                    @include absolute();
                    @include size(100%);
                    filter: blur(10px);
                }

                .header-content {
                    background-color: rgba(119, 103, 137, 0.43);
                    padding: 0.4rem 0 0.4rem 0.4rem;

                    > div:first-child {
                        @include flex(row, null, center);
                        position: relative;

                        img {
                            @include size(2.9rem, 2.9rem);

                            display: block;
                            border-radius: 0.15rem;
                            margin-right: 0.3rem;
                        }

                        h4 {
                            font-size: 0.8rem;
                            color: #fff;
                            font-weight: bold;
                            width: 100%;
                            margin-bottom: 0.3rem;
                        }

                        i {
                            @include absolute(null, null, .3rem);
                            font-size: 1rem;
                            color: #ffffff;
                        }

                        .header-content-main {
                            p {
                                font-size: 0.5rem;
                                color: #fff;
                            }

                            p:first-of-type {
                                margin-bottom: 0.3rem;
                            }

                            p:last-of-type {
                                width: 11.5rem;
                            }
                        }
                    }

                    > div:last-child {
                        @include flex(row, space-between, null);
                        position: relative;
                        margin-top: 0.5rem;
                        padding-right: 1rem;

                        p {
                            font-size: 0.5rem;
                            color: #fff;
                        }

                        p:first-child {
                            width: 84%;

                            span:first-child {
                                padding: 0 .04rem;
                                border-radius: 0.1rem;
                                font-size: .4rem;
                                display: inline-block;
                                margin-right: .2rem;
                            }
                        }

                        p:last-child i {
                            @include absolute(null, null, .3rem);
                            line-height: .7rem;
                        }
                    }
                }
            }

            .toggle {
                @include flex();
                background-color: #fff;
                padding: .3rem 0 .6rem;
                border-bottom: 1px solid #ebebeb;
                z-index: 1;

                div {
                    flex: 1;
                    text-align: center;
                }

                span {
                    @include size(1.3rem);
                    display: block;
                    margin: 0 auto;
                    position: relative;
                    color: #666;
                    font-size: 0.65rem;
                    padding: .2rem 0;
                }

                span.active {
                    color: $theme;
                }

                i.underline {
                    @include size(1.3rem, .12rem);
                    @include absolute(0, null, null, -.12rem);
                    background-color: $theme;
                }
            }

            .main {
                position: relative;
                z-index: 3;
                flex: 1;
                overflow: hidden;
                background-color: $background;

                .menu, .comment {
                    @include absolute();
                    @include size(100%, 100%);
                }

                .menu {
                    .menu-main {
                        @include flex();
                        @include size(100%, 100%);
                        padding-bottom: 2rem;
                        box-sizing: border-box;

                        .menu-main-title {
                            @include size(3.8rem, 100%);
                            overflow-y: auto;

                            li {
                                padding: .7rem .3rem;
                                border-bottom: 0.025rem solid #ededed;
                                box-sizing: border-box;
                                border-left: 0.15rem solid #f8f8f8;
                                position: relative;

                                span {
                                    font-size: 0.6rem;
                                    color: #666;
                                }
                            }

                            li.selected {
                                border-left: 0.15rem solid $theme;
                                background-color: #fff;
                            }
                        }

                        .menu-main-content {
                            flex: 1;
                            overflow-y: auto;
                            position: relative;

                            li header {
                                @include flex(row, space-between, center);
                                padding: .4rem;
                                position: relative;

                                b {
                                    font-size: 0.7rem;
                                    color: #666;
                                    font-weight: bold;
                                }

                                span {
                                    @include size(30%);
                                    font-size: 0.5rem;
                                    color: #999;
                                    overflow: hidden;
                                }
                            }

                            li section {
                                background-color: #fff;
                                padding: .6rem .4rem;
                                border-bottom: 1px solid #f8f8f8;
                                position: relative;

                                > div {
                                    @include flex();

                                    img {
                                        @include size(2rem, 2rem);
                                        margin-right: .4rem;
                                        display: block;
                                    }

                                    > div {
                                        h4 {
                                            font-size: 0.7rem;
                                            color: #333;
                                            margin-bottom: .2rem;
                                        }

                                        p:first-of-type {
                                            font-size: 0.5rem;
                                            color: #999;
                                            line-height: .6rem;
                                        }

                                        p:nth-of-type(2) {
                                            line-height: .8rem;

                                            span {
                                                font-size: 0.5rem;
                                                color: #333;
                                            }
                                        }

                                        p:nth-of-type(3) {
                                            line-height: .4rem;

                                            span {
                                                font-size: .3rem;
                                                border: 1px solid currentColor;
                                                border-radius: 0.3rem;
                                                padding: .08rem;
                                                display: inline-block;
                                            }
                                        }
                                    }
                                }

                                footer {
                                    @include flex(row, space-between);
                                    margin-left: 2.4rem;
                                    font-size: 0;
                                    margin-top: .3rem;

                                    span:first-of-type {
                                        font-size: 0.5rem;
                                        color: #f60;
                                        margin-right: .05rem;
                                    }

                                    span:nth-of-type(2) {
                                        font-size: 0.7rem;
                                        color: #f60;
                                        font-weight: bold;
                                        margin-right: .3rem;
                                    }
                                }
                            }
                        }
                    }

                    .shopping-cart {
                        @include size(100%, 2rem);
                        @include absolute(0, null, null, 0);
                        @include flex();
                        background-color: #3d3d3f;
                        z-index: 4;

                        .cart-icon {
                            @include size(1.4rem, 1.4rem);
                            @include absolute(.5rem, -.7rem);
                            background-color: $theme;
                            padding: .4rem;
                            border: 0.18rem solid #444;
                            border-radius: 50%;
                            color: #ffffff;
                            text-align: center;
                            font-size: 1.4rem;
                            line-height: 1.4rem;
                        }

                        .cart-icon.bounce {
                            animation: bounce .55s;
                        }

                        .cart-icon.empty {
                            background-color: #3d3d3f;
                        }

                        .cart-icon-badge {
                            @include absolute(null, -.25rem, -.25rem);
                            background-color: #ff461d;
                            line-height: .7rem;
                            text-align: center;
                            border-radius: 50%;
                            border: 0.025rem solid #ff461d;
                            min-width: .7rem;
                            height: .7rem;
                            font-size: 0.5rem;
                            color: #fff;
                        }

                        .count {
                            @include absolute(3.5rem, 50%);
                            @include flex(column);
                            transform: translateY(-50%);
                            color: #ffffff;

                            span {
                                font-size: .8rem;
                                font-weight: bold;
                                margin-bottom: .1rem;
                            }

                            b {
                                font-size: .4rem;
                            }
                        }

                        .confirm {
                            @include size(5rem, 100%);
                            @include absolute(null, null, 0);
                            @include flex(row, center, center);
                            background-color: #535356;
                            font-size: 0.7rem;
                            color: #fff;
                            font-weight: bold;
                        }

                        .ready {
                            background-color: #4cd964;
                        }

                        .shopping-cart-main {
                            @include size(100%);
                            @include absolute(null, null, null, 2rem);
                            background-color: #fff;
                            z-index: -1;

                            header {
                                @include flex(row, space-between, center);
                                padding: .3rem .6rem;
                                background-color: #eceff1;
                                font-size: 0.7rem;
                                color: #666;
                            }

                            .shopping-cart-content {
                                @include flex(row, space-between);
                                padding: .6rem .5rem;

                                > div {
                                    @include flex(row, null, center);
                                }

                                p {
                                    font-size: 0.7rem;
                                    color: #666;
                                    font-weight: bold;
                                }

                                span {
                                    font-size: 0.7rem;
                                    color: #f60;
                                    font-weight: bold;
                                    margin-right: .8rem;
                                }
                            }

                            .shopping-cart-packing {
                                padding: 0 .2rem .2rem;
                                font-size: 0.5rem;
                                color: #666;
                                text-align: right;
                            }
                        }
                    }

                    .cart-panel-mask {
                        @include fixed(0, 0);
                        @include size(100%, 100%);
                        background-color: rgba(0, 0, 0, .5);
                        z-index: 3;
                    }
                }

                .comment {
                    overflow-y: auto;

                    .comment-score {
                        @include flex();
                        background-color: #fff;
                        padding: .8rem .5rem;
                        margin-bottom: 0.5rem;

                        .comment-score-left {
                            flex: 1;
                            text-align: center;

                            p:first-of-type {
                                font-size: 1.2rem;
                                color: #f60;
                            }

                            p:nth-of-type(2) {
                                font-size: 0.65rem;
                                color: #666;
                                margin-bottom: .1rem;
                            }

                            p:nth-of-type(3) {
                                font-size: 0.4rem;
                                color: #999;
                            }
                        }

                        .comment-score-right {
                            @include flex(column, space-between);
                            flex: 1;

                            p {
                                font-size: 0.55rem;
                                color: #f60;

                                span {
                                    color: #666;
                                    margin-right: .5rem;
                                    font-size: .65rem;
                                    line-height: 1rem;
                                }
                            }
                        }
                    }

                    .comment-tag {
                        @include flex();
                        flex-wrap: wrap;
                        background-color: #fff;
                        padding: .5rem;

                        li {
                            font-size: 0.6rem;
                            color: #6d7885;
                            padding: .3rem .3rem;
                            background-color: #ebf5ff;
                            border-radius: 0.2rem;
                            border: 1px;
                            margin: 0 .4rem .2rem 0;
                        }
                    }

                    .comment-rating {
                        background-color: #fff;
                        padding: 0 .5rem;

                        li {
                            @include flex(row, space-between);
                            border-top: 1px solid #f1f1f1;
                            padding: .6rem 0 .3rem;

                            > div {
                                @include flex();
                            }

                            > div > img {
                                @include size(1.5rem, 1.5rem);
                                border: 0.025rem;
                                border-radius: 50%;
                                margin-right: .8rem;
                            }

                            p:first-of-type {
                                color: #666;
                                margin-bottom: .4rem;
                                font-size: 0.55rem;
                            }

                            > span {
                                font-size: 0.4rem;
                                color: #999;
                            }

                            > div > div > img {
                                @include size(3rem, 3rem);
                                margin-right: .4rem;
                                display: block;
                                float: left;
                            }

                            > div > div > span {
                                @include size(2.2rem);
                                font-size: 0.55rem;
                                color: #999;
                                padding: .2rem;
                                border: 0.025rem solid #ebebeb;
                                border-radius: 0.15rem;
                                margin: .4rem .4rem .4rem 0;
                                display: block;
                                float: left;
                            }
                        }
                    }
                }
            }

            .activity-detail {
                @include size(100%, 100%);
                @include fixed();
                background-color: #262626;
                z-index: 3;
                padding: 1.25rem;
                box-sizing: border-box;
                color: #ffffff;
                text-align: center;

                .close::before {
                    @include absolute(50%, null, null, 1rem);
                    font-size: 2rem;
                    color: rgb(85, 85, 85);
                    transform: translateX(-50%);
                }

                h4 {
                    font-size: 0.8rem;
                    font-weight: 400;
                }

                .activity-detail-list, .activity-detail-promotion {
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    font-size: 0.5rem;
                    text-align: center;

                    span {
                        border: 0.025rem solid #555;
                        padding: .2rem .4rem;
                        border-radius: 0.5rem;
                        margin-bottom: 1rem;
                        display: inline-block;
                    }
                }

                .activity-detail-list {
                    li {
                        text-align: left;
                        margin-bottom: .2rem;

                        b {
                            padding: 0 .02rem;
                            display: inline-block;
                            border-radius: 0.1rem;
                            line-height: .6rem;
                            color: #fff;
                            margin-right: .2rem;
                        }
                    }
                }

                .activity-detail-promotion p {
                    text-align: left;
                }
            }
        }
    }

    @keyframes bounce {
        0% {
            transform: scale(1)
        }
        25% {
            transform: scale(.8)
        }
        50% {
            transform: scale(1.1)
        }
        75% {
            transform: scale(.9)
        }
        100% {
            transform: scale(1)
        }
    }
</style>