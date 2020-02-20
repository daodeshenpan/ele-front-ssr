<template>
    <ul class="shop-list">
        <li v-if="!data.length" style="border-bottom: 0;padding: 0">
            <loading-icon/>
        </li>
        <li v-if="data.length" v-for="(item, index) in data" :key="index"
            @tap="toShop(item)">
            <img :src="imgBaseURL + item.image_path" alt="">
            <div class="shop-list-info">
                <div class="shop-list-info-header">
                    <h4 :class="['ellipsis',{premium: item.is_premium}]">{{item.name}}</h4>
                    <ul>
                        <li v-for="item in item.supports" class="support">{{item.icon_name}}</li>
                    </ul>
                </div>
                <div class="shop-list-info-content">
                    <div>
                        <em>{{item.rating}}</em>
                        <b>月售{{item.recent_order_num}}单</b>
                    </div>
                    <div>
                        <i v-if="item.delivery_mode">蜂鸟专送</i>
                        <span v-if="isPunctual(item.supports)">准时达</span>
                    </div>
                </div>
                <div class="shop-list-info-footer">
                    <b>￥{{item.float_minimum_order_amount}}起送/￥{{item.float_delivery_fee}}配送</b>
                    <em>{{item.distance}}/{{item.order_lead_time}}</em>
                </div>
            </div>
        </li>
        <li v-if="data.length && haveMore"
            style="position: relative">
            <loading-icon/>
        </li>
    </ul>
</template>

<script>
    import {imgBaseURL} from '@/utils/config'
    import LoadingIcon from '@/components/LoadingIcon'

    export default {
        name: "ShopList",
        components: {
            LoadingIcon
        },
        props: {
            data: Array,
            haveMore: Boolean
        },
        data() {
            return {
                imgBaseURL
            }
        },
        methods: {
            isPunctual(supports) {
                if (Array.isArray(supports) && supports.length) {
                    return supports.some((support) => {
                        return support.icon_name === '准';
                    })
                } else {
                    return false;
                }
            },
            toShop(item){
                this.$router.push(`/shop?geohash=${this.$route.query.geohash}&id=${item.id}`)
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    .shop-list {
        background-color: #fff;
        position: relative;
        text-align: center;

        > li {
            @include flex();
            border-bottom: 0.025rem solid #f1f1f1;
            padding: 0.7rem 0.4rem;
            background-color: #fff;

            > img {
                @include size(2.7rem, 2.7rem);
                display: block;
                margin-right: 0.4rem;
            }
        }
    }

    .shop-list-info {
        flex: 1;
        @include flex(column, space-between);
    }

    .shop-list-info-header, .shop-list-info-content, .shop-list-info-footer {
        @include flex(row, space-between, center);
    }

    .shop-list-info-header h4 {
        @include size(8.5rem);
        color: #333;
        padding-top: .01rem;
        font: 0.65rem/0.65rem "PingFangSC-Regular";
        font-weight: 700;
        text-align: left;
    }

    .shop-list-info-header h4.premium::before {
        content: '品牌';
        display: inline-block;
        font-size: 0.5rem;
        line-height: .6rem;
        color: #333;
        background-color: #ffd930;
        padding: 0 0.1rem;
        border-radius: 0.1rem;
        margin-right: 0.2rem;
    }

    .shop-list-info-header ul {
        @include flex();

        .support {
            font-size: 0.5rem;
            color: #999;
            border: 0.025rem solid #f1f1f1;
            padding: 0 0.04rem;
            border-radius: 0.08rem;
            margin-left: 0.05rem;
        }
    }

    .shop-list-info-content {
        margin-top: 0.4rem;
        height: 0.6rem;

        em {
            font-size: 0.4rem;
            color: #ff6000;
            margin: 0 0.2rem;
        }

        b {
            margin-left: -0.2rem;
            font-size: 0.4rem;
            color: #666;
        }

        div:first-child {
            transform: scale(.9);
            margin-left: -0.3rem;
        }

        div:last-child {
            transform: scale(.7);
            transform-origin: right center;
        }

        i {
            color: #fff;
            background-color: $theme;
            border: 0.025rem solid $theme;
            font-size: 0.4rem;
            padding: 0.04rem 0.08rem 0;
            border-radius: 0.08rem;
            margin-left: 0.08rem;
        }

        span {
            color: $theme;
            border: 0.025rem solid $theme;
            font-size: 0.4rem;
            padding: 0.04rem 0.08rem 0;
            border-radius: 0.08rem;
            margin-left: 0.08rem;
        }
    }

    .shop-list-info-footer {
        margin-top: 0.52rem;

        b {
            transform: scale(0.9);
            font-size: 0.5rem;
            color: #666;
            margin-left: -0.3rem;
        }

        em {
            transform: scale(0.9);
            font-size: 0.5rem;
            color: $theme;
        }
    }
</style>