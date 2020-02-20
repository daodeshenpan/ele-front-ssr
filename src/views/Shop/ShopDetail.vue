<template>
    <div id="shop-detail">
        <top-bar show-back title="店铺详情"/>
        <div class="shop-activity">
            <h4>活动与属性</h4>
            <ul>
                <li v-for="item in shopInfo.activities" :key="item.id">
                    <i :style='{backgroundColor: "#" + item.icon_color}'>{{item.icon_name}}</i>
                    <span>{{item.description}}(APP专享)</span>
                </li>
            </ul>
            <ul>
                <li v-for="item in shopInfo.supports" :key="item.id">
                    <i :style='{backgroundColor: "#" + item.icon_color}'>{{item.icon_name}}</i>
                    <span>{{item.description}}(APP专享)</span>
                </li>
            </ul>
        </div>
        <div class="shop-info">
            <h4>店铺信息</h4>
            <p>{{shopInfo.name}}</p>
            <p>地址：{{shopInfo.address}}</p>
            <p>营业时间：{{shopInfo.opening_hours[0]}}</p>
            <p @tap="showBusinessLicense=true"><span>营业执照</span><i class="el-icon-arrow-right"></i></p>
            <p @tap="showCateringServiceLicense=true"><span>餐饮服务许可证</span><i class="el-icon-arrow-right"></i></p>
        </div>
        <transition name="fade-in-out">
            <div class="img-mask" v-show="showBusinessLicense || showCateringServiceLicense"
                 @tap="showBusinessLicense=false;showCateringServiceLicense=false">
                <img :src="imgBaseURL + (showBusinessLicense ? shopInfo.license.business_license_image : shopInfo.license.catering_service_license_image)"
                     alt="">
            </div>
        </transition>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {imgBaseURL} from '@/utils/config'
    import {mapState} from 'vuex'

    export default {
        name: "ShopDetail",
        components: {
            TopBar
        },
        data() {
            return {
                showBusinessLicense: false,
                showCateringServiceLicense: false,
                imgBaseURL
            }
        },
        computed: mapState(['shopInfo'])
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #shop-detail {
        @include size(100%, 100%);
        @include absolute();

        overflow-y: auto;
        box-sizing: border-box;
        padding-top: 1.95rem;
        .shop-activity,.shop-info{
            background-color: #fff;
            margin: .4rem 0 0;
            h4{
                font-size: 0.75rem;
                color: #333;
                line-height: 1.8rem;
                padding-left: .6rem;
                border-bottom: 1px solid #f1f1f1;
                margin-bottom: .3rem;
                font-weight: normal;
            }
        }
        .shop-activity {
            padding-bottom: .6rem;
            ul {
                padding: 0 .6rem;
                li {
                    margin-bottom: .2rem;
                    i {
                        font-size: 0.45rem;
                        color: #fff;
                        padding: .1rem;
                        border: 1px;
                        border-radius: 0.1rem;
                        margin-right: .2rem;
                    }
                    span {
                        font-size: 0.55rem;
                        color: #666;
                    }
                }
            }
        }
        .shop-info  {
            p{
                font-size: 0.6rem;
                color: #666;
                padding: .7rem .6rem .7rem 0;
                margin-left: .6rem;
                border-bottom: 0.025rem solid #f5f5f5;
            }
            p:nth-of-type(4),p:nth-of-type(5){
                @include flex(row,space-between);
            }
        }
        .img-mask {
            @include absolute(null,0);
            @include size(100%, 100%);
            z-index: 2;
            background-color: rgba(0, 0, 0, .5);
            img {
                @include absolute(null,50%);
                @include size(100%);
                transform: translateY(-50%);
            }
        }
    }
</style>