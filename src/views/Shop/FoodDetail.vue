<template>
    <div id="food-detail">
        <top-bar title="商品详情" show-back/>
        <img :src="imgBaseURL + $route.query.image_path">
        <p class="food-detail-description">{{$route.query.description}}</p>
        <section>
            <p>{{$route.query.name}}</p>
            <p>
                <span>评分:<b>{{$route.query.rating}}</b></span>
            </p>
            <p>
                <span>月售 {{$route.query.month_sales}}单</span>
            </p>
            <p>
                <span>好评率 {{$route.query.satisfy_rate}}%</span>
            </p>
        </section>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {imgBaseURL} from '@/utils/config'

    export default {
        name: "FoodDetail",
        components: {
            TopBar
        },
        data() {
            return {
                imgBaseURL
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #food-detail {
        @include size(100%, 100%);
        @include absolute();

        background-color: #fff;
        padding-top: 1.95rem;
        box-sizing: border-box;
        overflow-y: auto;
        > img {
            @include size(100%);
        }
        .food-detail-description {
            font-size: 0.6rem;
            color: #666;
            margin-top: .5rem;
            line-height: .8rem;
            bottom: .2rem;
            padding: 0 .4rem;
        }
        section {
            padding: .5rem;
            p{
                font-size: 0.6rem;
                color: #666;
                margin-bottom: .3rem;
            }
            p:first-of-type {
                font-size: 0.7rem;
                color: #333;

                margin-bottom: .4rem;
            }
            p:nth-of-type(2) b{
                font-size: 0.55rem;
                color: #f60;
                margin-left: .2rem;
            }
        }
    }
</style>