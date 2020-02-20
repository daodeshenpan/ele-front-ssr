<template>
    <div id="new-address">
        <top-bar show-back title="新增地址"/>
        <form @submit.prevent>
            <div class="user">
                <span>联系人</span>
                <div>
                    <input type="text" placeholder="请输入收货人的姓名" v-model="form.name">
                    <div>
                        <span class="el-icon-success" :class="{checked: form.sex === 1}"
                              @tap="form.sex = 1">先生</span>
                        <span class="el-icon-success" :class="{checked: form.sex === 2}"
                              @tap="form.sex = 2">女士</span>
                    </div>
                </div>
            </div>
            <div class="phone">
                <span>手机号</span>
                <input type="text" placeholder="请输入收货手机号码" v-model.number="form.phone">
            </div>
            <div class="address">
                <span>送餐地址</span>
                <div>
                    <b @tap="$router.replace('/searchAddress')"
                       :class="{empty: !addressName}">
                        {{addressName? addressName :'选择收货地址'}}
                        <i class="el-icon-arrow-right" v-show="!addressName"></i></b>
                    <input type="text" placeholder="详细地址如门牌号等" v-model="form.addressDetail">
                </div>
            </div>
            <div class="tag">
                <span>标签</span>
                <div>
                    <i :class="{checked: form.tag === '家'}" @tap="form.tag='家';form.tagType=2">家</i>
                    <i :class="{checked: form.tag === '公司'}" @tap="form.tag='公司';form.tagType=3">公司</i>
                    <i :class="{checked: form.tag === '学校'}" @tap="form.tag='学校';form.tagType=4">学校</i>
                </div>
            </div>
        </form>
        <div class="confirm" @tap="confirm">确定</div>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {mapState} from 'vuex'
    import {addAddress} from '@/api/index'

    export default {
        name: "NewAddress",
        components: {
            TopBar
        },
        data() {
            return {
                form: {
                    name: '',
                    sex: 1,
                    phone: '',
                    addressDetail: '',
                    tag: '家',
                    tagType: 2
                },
                addressName: this.$route.query.addressName,
                addressGeohash: this.$route.query.addressGeohash
            }
        },
        computed: {
            ...mapState(['userInfo'])
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/searchAddress') {
                to.meta.transitionName = 'slide-to-right';
            } else {
                to.meta.transitionName = 'slide-to-left';
            }
            next();
        },
        activated() {
            this.addressName = this.$route.query.addressName;
            this.addressGeohash = this.$route.query.addressGeohash;
        },
        beforeRouteLeave(to, from, next) {
            if (to.path !== '/searchAddress') {
                this.form = {
                    name: '',
                    sex: 1,
                    phone: '',
                    addressDetail: '',
                    tag: '家',
                    tagType: 2
                };
            }
            next();
        },
        methods: {
            confirm() {
                if (!this.form.name) {
                    this.$alert({type: 'warning', content: '请输入姓名'})
                } else if (!this.form.phone) {
                    this.$alert({type: 'warning', content: '请输入号码'})
                } else if (!this.addressName) {
                    this.$alert({type: 'warning', content: '请选择地址'})
                } else if (!this.form.addressDetail) {
                    this.$alert({type: 'warning', content: '请输入详细地址'})
                } else {
                    addAddress(this.userInfo.id, this.addressName, this.form.addressDetail, this.addressGeohash, this.form.name, this.form.phone, this.form.sex, this.form.tag, this.form.tagType).then(({data}) => {
                        if (data.status === 1) {
                            this.$alert({
                                type: 'success',
                                content: data.success
                            });
                            this.$router.go(-1);
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #new-address {
        @include size(100%, 100%);
        @include absolute();
        padding-top: 1.95rem;
        box-sizing: border-box;

        form {
            background-color: #fff;
            padding: 0 .7rem;

            .user {
                @include flex();
                border-bottom: 0.025rem solid #f5f5f5;

                > span {
                    font-size: 0.7rem;
                    color: #333;
                    flex: 2;
                    line-height: 2.5rem;
                    font-weight: bold;
                }

                > div {
                    flex: 5;

                    input {
                        width: 100%;
                        height: 2.5rem;
                        font-size: 0.7rem;
                        color: #333;
                    }

                    > div {
                        display: flex;
                        border-top: 0.025rem solid #f5f5f5;

                        > span {
                            line-height: 2.5rem;
                            font-size: 0.7rem;
                            color: #333;
                            margin-right: .8rem;
                        }

                        > span::before {
                            line-height: 2.5rem;
                            font-size: 0.9rem;
                            margin-right: .3rem;
                            color: #ccc;
                        }

                        > span.checked::before {
                            color: #4cd964;
                        }
                    }
                }
            }

            .phone {
                @include flex();
                border-bottom: 0.025rem solid #f5f5f5;

                span {
                    font-size: 0.7rem;
                    color: #333;
                    flex: 2;
                    line-height: 2.5rem;
                    font-weight: bold;
                }

                input {
                    flex: 5;
                    height: 2.5rem;
                    font-size: 0.7rem;
                    color: #333;
                }
            }

            .address {
                @include flex();
                border-bottom: 0.025rem solid #f5f5f5;

                > span {
                    font-size: 0.7rem;
                    color: #333;
                    flex: 2;
                    line-height: 2.5rem;
                    font-weight: bold;
                }

                > div {
                    flex: 5;

                    b {
                        display: block;
                        @include size(100%, 2.5rem);
                        font-size: 0.7rem;
                        color: #333;
                        line-height: 2.5rem;
                        border-bottom: 0.025rem solid #f5f5f5;
                    }

                    b.empty {
                        color: #777;
                    }

                    input {
                        @include size(100%, 2.5rem);
                        font-size: 0.7rem;
                        color: #333;
                    }
                }
            }

            .tag {
                @include flex();

                > span {
                    font-size: 0.7rem;
                    color: #333;
                    flex: 2;
                    line-height: 2.5rem;
                    font-weight: bold;
                }

                > div {
                    @include flex(row, null, center);
                    flex: 5;

                    > i {
                        font-size: .65rem;
                        width: 1.8rem;
                        border: 1px solid #777;
                        padding: .1rem .2rem;
                        border-radius: 10px;
                        margin-right: .6rem;
                        text-align: center;
                        color: #777;
                    }

                    > i.checked {
                        color: #4cd964;
                        border: 1px solid #4cd964;
                    }
                }
            }
        }

        .confirm {
            background-color: #4cd964;
            font-size: 0.7rem;
            color: #fff;
            text-align: center;
            margin: .6rem .7rem 0;
            line-height: 1.8rem;
            border-radius: 0.2rem;
        }
    }
</style>