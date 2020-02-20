<template>
    <div id="manage-address">
        <top-bar show-back title="管理收货地址">
            <template #right>
                <span class="manage" @tap="remove=!remove">编辑</span>
            </template>
        </top-bar>
        <ul>
            <li v-for="(address,index) in allAddress" :key="index" @tap="handleTap(index)">
                <i class="el-icon-success" :class="{border: remove}" ref="icon"></i>
                <div>
                    <div>
                        <span>{{address.name}}</span>
                        <i>{{address.sex === 1 ? '先生' : '女士'}}</i>
                        <b>{{address.phone}}</b>
                    </div>
                    <div>
                        <i>{{address.tag}}</i>
                        <span>{{address.address}}</span>
                        <b>{{address.address_detail}}</b>
                    </div>
                </div>
            </li>
        </ul>
        <span v-show="!remove" class="el-icon-circle-plus-outline" @tap="$router.push('/newAddress')">新增收获地址</span>
        <button :class="{disabled: !checked.length}" v-show="remove" @tap="removeAddress">删除</button>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {mapState} from 'vuex'
    import {removeAddress} from '@/api/index'

    export default {
        name: "ManageAddress",
        components: {
            TopBar
        },
        data() {
            return {
                remove: false,
                checked: []
            }
        },
        computed: mapState(['allAddress', 'userInfo']),
        beforeRouteEnter(to, from, next) {
            if (from.path === '/newAddress') {
                to.meta.transitionName = 'slide-to-right';
            } else {
                to.meta.transitionName = 'slide-to-left';
            }
            next();
        },
        activated() {
            this.initData();
        },
        deactivated() {
            this.remove = false;
        },
        methods: {
            initData() {
                let store = this.$store;
                store.commit('setAllAddress', []);
                return store.dispatch('fetchAllAddress', this.userInfo.id);
            },
            handleTap(index) {
                if (this.remove) {
                    this.$refs.icon[index].classList.toggle('border');
                    this.$refs.icon[index].classList.toggle('checked');
                    let i = this.checked.indexOf(index);
                    if (i > -1) {
                        this.checked.splice(i, 1);
                    } else {
                        this.checked.push(index);
                    }
                }
            },
            removeAddress() {
                let arr = [];
                if (this.checked.length) {
                    this.checked.forEach((value) => {
                        arr.push(removeAddress(this.userInfo.id, this.allAddress[value].id));
                    });
                    Promise.all(arr).then(responses => {
                        if (responses.every(({data}) => {
                            return data.status === 1
                        })) {
                            this.$alert({
                                type: 'success',
                                content: '删除地址成功'
                            });
                            this.checked = [];
                            this.initData();
                        } else {
                            this.$alert({
                                type: 'warning',
                                content: '删除地址失败'
                            });
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #manage-address {
        @include absolute();
        @include size(100%, 100%);

        overflow-y: auto;
        box-sizing: border-box;
        padding-top: 1.95rem;
        background-color: #fff;

        .manage {
            font-size: .7rem;
        }

        ul {
            li {
                @include flex(row, null, center);
                border-bottom: 0.025rem solid #f5f5f5;
                padding: .7rem;
                line-height: 1rem;

                > i {
                    @include size(24px, 24px);
                    margin-right: .4rem;
                    display: none;
                    box-sizing: border-box;
                }

                > i.border {
                    display: block;
                    color: #fff;
                    border: 1px solid #ccc;
                    border-radius: 50%;
                }

                > i.checked {
                    display: block;
                    color: #4cd964;
                    border: 0;
                }

                > div {
                    div:first-of-type {
                        font-size: 0.7rem;
                        color: #333;

                        span {
                            font-weight: bold;
                        }
                    }

                    div:last-of-type {
                        i {
                            font-size: 0.5rem;
                            color: #fff;
                            border-radius: .15rem;
                            background-color: #ff5722;
                            height: .6rem;
                            line-height: .6rem;
                            padding: 0 .2rem;
                            margin-right: .3rem;
                        }

                        span, b {
                            font-size: 0.6rem;
                            color: #777;
                        }
                    }
                }
            }
        }

        > span {
            @include absolute(50%, null, null, 20px);
            transform: translate(-50%);
            color: $theme;
            font-size: 0.8rem;
        }

        > span::before {
            margin-right: .1rem;
            font-size: 1rem;
        }

        > button {
            @include absolute(50%, null, null, 20px);
            transform: translate(-50%);
            width: 90%;
            margin: 0 auto;
            line-height: 1.5rem;
            border-radius: 5px;
            text-align: center;
            background-color: #d8584a;
            font-size: 0.6rem;
            color: #fff;
        }

        > button.disabled {
            background-color: #fff;
            color: #ccc;
            border: 1px solid #ccc;
        }
    }
</style>