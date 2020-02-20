<template>
    <div id="pay-online">
        <top-bar show-back title="在线支付"/>
        <div class="time">
            <header>支付剩余时间</header>
            <p>{{remainingTime}}</p>
        </div>
        <div class="title">
            选择支付方式
        </div>
        <div class="way">
            <section @tap="way='zhifubao'">
                <section>
                    <img src="../../assets/img/zhifubao.png" alt="">
                    <span>支付宝</span>
                </section>
                <i class="el-icon-success" :class="{checked: way === 'zhifubao'}"></i>
            </section>
            <section @tap="way='weixin'">
                <section>
                    <img src="../../assets/img/weixin.png" alt="">
                    <span>微信</span>
                </section>
                <i class="el-icon-success" :class="{checked: way === 'weixin'}"></i>
            </section>
        </div>
        <div class="confirm" @tap="confirm">
            确认支付
        </div>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'

    export default {
        name: "PayOnline",
        components: {
            TopBar
        },
        data() {
            return {
                time: 900,
                timer: null,
                way: 'zhifubao'
            }
        },
        computed: {
            remainingTime() {
                let minute = parseInt(this.time / 60);
                if (minute < 10) {
                    minute = '0' + minute;
                }
                let second = parseInt(this.time % 60);
                if (second < 10) {
                    second = '0' + second;
                }
                return '00 : ' + minute + ' : ' + second;
            }
        },
        activated() {
            this.timer = setInterval(() => {
                this.time--;
            }, 1000);
        },
        deactivated() {
            this.time = 900;
            clearInterval(this.timer);
        },
        methods: {
            confirm() {
                this.$alert({
                    type: 'warning',
                    content: '请前往饿了么APP进行支付'
                });
                this.$router.replace(`/order?geohash=${this.$route.query.geohash}`);
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #pay-online {
        @include size(100%, 100%);
        @include absolute();
        padding-top: 1.95rem;
        box-sizing: border-box;

        .time {
            background-color: #fff;
            padding: .7rem;
            text-align: center;

            header {
                font-size: 0.6rem;
                color: #666;
                margin-top: 1rem;
            }

            p {
                font-size: 1.5rem;
                color: #333;
                margin: .3rem 0 1rem;
            }
        }

        .title {
            background-color: #f1f1f1;
            padding: 0 .7rem;
            font-size: 0.7rem;
            color: #666;
            line-height: 1.8rem;
        }

        .way {
            img {
                width: 2rem;
                height: 2rem;
                margin-right: .2rem;
            }

            > section {
                @include flex(row, space-between, center);
                background-color: #fff;
                padding: .4rem .7rem;
                line-height: 2.6rem;
                border-bottom: 0.025rem solid #f5f5f5;

                > section {
                    @include flex(row, null, center);

                    span {
                        font-size: 0.7rem;
                        color: #666;
                    }
                }

                i {
                    color: #ccc;
                }

                i.checked {
                    color: #4cd964;
                }
            }
        }

        .confirm {
            background-color: #4cd964;
            font-size: 0.7rem;
            color: #fff;
            text-align: center;
            margin: 0 .7rem;
            line-height: 1.8rem;
            border-radius: 0.2rem;
            margin-top: 0.5rem;
            font-weight: bold;
        }
    }
</style>