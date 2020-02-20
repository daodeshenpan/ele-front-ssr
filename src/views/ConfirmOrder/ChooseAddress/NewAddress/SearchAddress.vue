<template>
    <div id="search-address">
        <top-bar show-back title="选择地址"/>
        <form @submit.prevent>
            <input type="text" placeholder="请输入小区/写字楼/学校等" @input="handleInput" v-model="keyword">
        </form>
        <ul v-if="searchResult.length">
            <li v-for="(result,index) in searchResult" :key="index"
                @tap="toNewAddress(result)">
                <h4>{{result.name}}</h4>
                <p>{{result.address}}</p>
            </li>
        </ul>
        <div v-else class="tip">
            <p>找不到地址？</p>
            <p>尝试输入小区、写字楼或学校名</p>
            <p>详细地址（如门牌号等）可稍后输入哦</p>
        </div>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {searchAddress} from '@/api/index'

    export default {
        name: "SearchAddress",
        components: {
            TopBar
        },
        data() {
            return {
                keyword: '',
                searchResult: []
            }
        },
        deactivated() {
            this.keyword = '';
            this.searchResult = [];
        },
        methods: {
            handleInput() {
                if (this.keyword) {
                    searchAddress(this.keyword).then(({data}) => {
                        this.searchResult = data;
                    })
                } else {
                    this.searchResult = [];
                }
            },
            toNewAddress(result) {
                this.$router.replace(`/newAddress?addressName=${result.name}&addressGeohash=${result.geohash}`);
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #search-address {
        @include size(100%, 100%);
        @include absolute();
        padding-top: 1.95rem;
        box-sizing: border-box;
        background-color: #fff;
        overflow-y: auto;

        form {
            padding: .7rem;

            input {
                @include size(100%, 1.5rem);
                box-sizing: border-box;
                font-size: 0.65rem;
                color: #999;
                background-color: #f1f1f1;
                margin-right: .6rem;
                border-radius: 0.15rem;
                padding: 0 .4rem;
            }
        }

        ul {
            padding: 0 .7rem .7rem;

            li {
                padding: .7rem 0;
                border-bottom: 0.025rem solid #f5f5f5;
                line-height: 1rem;

                h4 {
                    font-size: 0.75rem;
                    color: #555;
                    font-weight: normal;
                }

                p {
                    font-size: 0.65rem;
                    color: #999;
                }
            }
        }

        .tip {
            @include size(100%);
            @include absolute(50%, 50%);
            transform: translate(-50%, -50%);
            text-align: center;

            p {
                font-size: 0.5rem;
                color: #aaa;
                line-height: .7rem;
                text-align: center;
            }
        }
    }
</style>