<template>
    <div id="point">
        <top-bar show-back title="我的积分"/>
        <section>
            <section>
                <header>
                    <span>当前积分</span>
                    <img src="../../assets/img/description.png" height="24" width="24">
                </header>
                <p>
                    <span>0</span>
                    <span>分</span>
                </p>
                <button>积分兑换商品</button>
            </section>
        </section>
        <p>最近30天积分纪录</p>
        <div>
            <img src="../../assets/img/no-log.png">
            <p>最近30天无积分纪录</p>
            <p>快去下单赚取大量积分吧</p>
        </div>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    export default {
        name: "Point",
        components: {
            TopBar
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #point {
        @include absolute();
        @include size(100%, 100%);

        overflow-y: auto;
        box-sizing: border-box;
        padding-top: 1.95rem;
        >section{
            padding: .3rem;
            background-color: $theme;
            >section{
                padding: .4rem;
                background-color: #fff;
                border-radius: .15rem;
                header{
                    @include flex(row,space-between,center);
                    font-size: .55rem;
                }
                >p{
                    span:first-of-type{
                        font-size: 1.8rem;
                        color: #333;
                    }
                    span:last-of-type{
                        font-size: 0.7rem;
                        color: #333;
                    }
                }
                >button{
                    @include size(100%,2rem);
                    font-size: 0.8rem;
                    color: #fff;
                    border-radius: 0.15rem;
                    line-height: 2rem;
                    margin-top: 1rem;
                    text-align: center;
                    background-color: #ccc;
                }
            }
        }
        >p{
            font-size: 0.6rem;
            color: #999;
            line-height: 2rem;
            padding-left: .5rem;
        }
        >div{
            text-align: center;
            margin-top: 1rem;
            img{
                @include size(8rem, 5rem);
            }
            p:first-of-type{
                margin-top: .5rem;
                font-size: 0.7rem;
                color: #666;
            }
            p:last-of-type{
                margin-top: .5rem;
                font-size: 0.5rem;
                color: #999;
            }
        }
    }
</style>