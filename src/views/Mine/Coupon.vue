<template>
    <div id="coupon">
        <top-bar show-back title="我的红包"/>
        <section>
            <header>
                <p>
                    有 <span>{{coupon.length}}</span> 个红包即将到期
                </p>
                <img src="../../assets/img/description.png" height="24" width="24">
            </header>
            <ul>
                <li v-for="item in coupon" :key="item.id">
                    <section>
                        <div>
                            <i>¥</i>
                            <span>{{String(item.amount).split('.')[0]}}</span>
                            <b>.</b>
                            <span>{{String(item.amount).split('.')[1]||0}}</span>
                            <p>{{item.description_map.sum_condition}}</p>
                        </div>
                        <div>
                            <h4>{{item.name}}</h4>
                            <p>{{item.description_map.validity_periods}}</p>
                            <p>{{item.description_map.phone}}</p>
                        </div>
                        <p>{{item.description_map.validity_delta}}</p>
                    </section>
                    <footer v-if="item.limit_map">
                        <p>{{item.limit_map.restaurant_flavor_ids}}</p>
                    </footer>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {getCoupon} from '@/api/index'
    import {mapState} from 'vuex'

    export default {
        name: "Coupon",
        components: {
            TopBar
        },
        data() {
            return {
                coupon: []
            }
        },
        computed: mapState(['userInfo']),
        activated() {
            getCoupon(this.userInfo.id, 0, 20).then(({data}) => {
                this.coupon = data;
            })
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #coupon {
        @include absolute();
        @include size(100%, 100%);

        overflow-y: auto;
        box-sizing: border-box;
        padding: 1.95rem .7rem 0;

        > section {
            > header {
                @include flex(row, space-between, center);
                line-height: 2rem;
                font-size: .5rem;

                p {
                    color: #666;
                }

                img {
                    @include size(.6rem, .6rem);
                    margin-right: .2rem;
                }
            }

            ul {
                li {
                    background: #fff url(../../assets/img/hongbao.png) repeat-x;
                    background-size: .5rem .2rem;
                    margin-bottom: 0.5rem;
                    border-radius: 0.25rem;

                    > section {
                        @include flex(row, space-between, center);
                        padding: 1rem 0.5rem .8rem;
                        > div:first-of-type {
                            border-right: 0.025rem dotted #ccc;
                            flex: 1;
                            font-family: Helvetica Neue,Tahoma,Arial;
                            font-size: 0;
                            i{
                                font-size: 0.75rem;
                                color: #ff5340;
                                font-weight: bold;
                            }
                            span:first-of-type{
                                font-size: 1.5rem;
                                color: #ff5340;
                            }
                            b{
                                font-size: 0.8rem;
                                color: #ff5340;
                                font-weight: bold;
                            }
                            span:last-of-type{
                                font-size: 0.8rem;
                                color: #ff5340;
                                font-weight: bold;
                            }
                            p{
                                font-size: 0.4rem;
                                color: #999;
                            }
                        }
                        >div:last-of-type{
                            flex: 2;
                            margin-left: 1.5rem;
                            h4{
                                font-size: 0.7rem;
                                color: #666;
                                margin-left: -.7rem;
                            }
                            p{
                                margin-left: -.7rem;
                                font-size: 0.4rem;
                                color: #999;
                            }
                        }
                        >p{
                            font-size: 0.75rem;
                            color: #ff5340;
                        }
                    }

                    > footer {
                        background-color: #f9f9f9;
                        padding: .4rem .4rem;
                        border-bottom-left-radius: 0.25rem;
                        border-bottom-right-radius: 0.25rem;

                        p {
                            font-size: 0.4rem;
                            color: #999;
                            margin-left: .4rem;
                        }
                    }
                }
            }
        }
    }
</style>