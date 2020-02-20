<template>
    <div id="city">
        <top-bar show-back :title="cityInfo.name"/>
        <form @submit.prevent>
            <div>
                <input type="text" placeholder="输入学校、写字楼、地址" v-model="keyword" @input="searchPlace">
            </div>
        </form>
        <ul class="search-result">
            <li v-for="(item,index) in searchResult"
                :key="index"
                @tap="handleTap(item)">
                <h4 class="ellipsis">{{item.name}}</h4>
                <p class="ellipsis">{{item.address}}</p>
            </li>
        </ul>
        <h4 class="search-history-header" v-if="placeHistory.length">搜索历史</h4>
        <ul class="search-history">
            <li v-for="(item,index) in placeHistory"
                :key="index"
                @tap="handleHistoryTap(item)">
                <h4>{{item.name}}</h4>
                <p>{{item.address}}</p>
            </li>
        </ul>
        <button @tap="clearStorage" v-if="placeHistory.length">清空所有</button>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import TopBar from '@/components/TopBar'
    import {searchPlace} from '@/api/index'
    import {setLocalStorage, getLocalStorage, removeLocalStorage} from '@/utils/myUtils'

    export default {
        name: "City",
        components: {
            TopBar
        },
        data() {
            return {
                id: this.$route.query.id,
                keyword: '',
                searchResult: [],
                placeHistory: []
            }
        },
        computed: mapState(['cityInfo']),
        watch: {
            id(val, oldVal) {
                this.$store.dispatch('fetchCityInfo', val);
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/home') {
                to.meta.transitionName = 'slide-to-right';
            } else {
                to.meta.transitionName = 'slide-to-left';
            }
            next();
        },
        asyncData({store, route}) {
            return store.dispatch('fetchCityInfo', route.query.id);
        },
        beforeMount() {
            this.placeHistory = getLocalStorage('placeHistory') || [];
        },
        activated() {
            this.id = this.$route.query.id;
        },
        deactivated() {
            this.keyword = '';
            this.searchResult = [];
        },
        methods: {
            // 获取搜索结果
            searchPlace() {
                if (this.keyword) {
                    searchPlace(this.id, this.keyword).then(({data}) => {
                        this.searchResult = data;
                    });
                } else {
                    this.searchResult = [];
                }
            },
            // 从搜索结果进入
            handleTap(item) {
                this.$router.push('/home?geohash=' + item.geohash);
                // 添加历史记录
                this.placeHistory.push({
                    name: item.name,
                    address: item.address,
                    geohash: item.geohash
                });

                // 同步到本地存储
                setLocalStorage('placeHistory', this.placeHistory);
            },
            // 从搜索历史进入
            handleHistoryTap(item) {
                this.$router.push('/home?geohash=' + item.geohash);
            },
            // 清除历史记录
            clearStorage() {
                this.placeHistory = [];
                removeLocalStorage('placeHistory');
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #city {
        @include absolute();
        @include size(100%, 100%);

        overflow-y: auto;
        box-sizing: border-box;
        padding-top: 1.95rem;

        .change-city {
            font-size: .6rem;
        }

        form {
            margin-top: .4rem;
            background-color: #fff;
            border-top: 1px solid #e4e4e4;
            border-bottom: 1px solid #e4e4e4;
            padding-top: 0.4rem;

            div:first-child {
                width: 90%;
                margin: 0 auto;
                text-align: center;

                input {
                    @include size(100%, 1.4rem);

                    border: 1px solid #e4e4e4;
                    padding: 0 0.3rem;
                    font-size: 0.65rem;
                    color: #333;
                    border-radius: 0.1rem;
                    margin-bottom: 0.4rem;
                    box-sizing: border-box;
                }
            }

            div:last-child {
                width: 90%;
                margin: 0 auto;
                text-align: center;
            }
        }

        .search-result, .search-history {
            background-color: #fff;

            li {
                margin: 0 auto;
                padding-top: 0.65rem;
                border-bottom: 1px solid #e4e4e4;
            }

            h4 {
                margin: 0 auto 0.35rem;
                width: 90%;
                font-size: 0.65rem;
                color: #333;
                font-weight: normal;
            }

            p {
                width: 90%;
                margin: 0 auto 0.55rem;
                font-size: 0.45rem;
                color: #999;
            }
        }

        .search-history-header {
            background-color: #fff;
            margin-top: .5rem;
            padding: .25rem 0 0 .75rem;
            font: 0.475rem/0.8rem "Microsoft YaHei";
            border-top: 1px solid #e4e4e4;
        }

        > button {
            width: 100%;
            font-size: 0.7rem;
            color: #666;
            text-align: center;
            line-height: 2rem;
            background-color: #fff;
        }
    }
</style>