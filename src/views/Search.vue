<template>
    <div id="search">
        <top-bar title="搜索">
            <template #right>
                <i class="el-icon-chat-line-round"></i>
            </template>
        </top-bar>
        <form @submit.prevent>
            <input type="text" placeholder="请输入店铺名称" @input="handleInput" v-model="keyword">
        </form>
        <section class="search-result">
            <header>{{result.length ? '相关店铺' : '没有相关店铺'}}</header>
            <ul>
                <li v-for="(item,index) in result" :key="index" @tap="$router.push('/shop?id='+item.id)">
                    <img :src="imgBaseURL + item.image_path" alt="">
                    <div>
                        <h4>{{item.name}}</h4>
                        <p>月售{{item.recent_order_num}}单</p>
                        <p>距离{{item.distance}}</p>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {searchShop} from '@/api/index'
    import {imgBaseURL} from '@/utils/config';

    export default {
        name: "Search",
        components: {
            TopBar
        },
        data() {
            return {
                keyword: '',
                result: [],
                imgBaseURL
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/shop') {
                to.meta.transitionName = 'slide-to-bottom';
            } else {
                to.meta.transitionName = '';
            }
            next();
        },
        methods: {
            handleInput() {
                if (this.keyword) {
                    searchShop(this.$route.query.geohash, this.keyword).then(({data}) => {
                        if (data.status === 0){
                            this.result = [];
                        } else {
                            this.result = data;
                        }
                    })
                } else {
                    this.result = [];
                }
            }
        }
    }
</script>

<style>
    #search {
        position: absolute;
        width: 100%;
        height: 100%;

        overflow-y: auto;

        box-sizing: border-box;
        padding: 1.95rem 0 2.3rem;
    }

    #search form {
        background-color: #fff;
        padding: 0.5rem;
        display: flex;
    }

    #search input {
        flex: 4;
        border: 0.025rem solid #e4e4e4;
        font-size: 0.65rem;
        color: #333;
        border-radius: 0.125rem;
        background-color: #f2f2f2;
        font-weight: bold;
        padding: 0 0.25rem;
        height: 1.5rem;
    }

    #search button {
        flex: 1;
        border: 0.025rem solid #3190e8;
        margin-left: .2rem;
        font-size: 0.65rem;
        color: #fff;
        border-radius: 0.125rem;
        background-color: #3190e8;
        font-weight: bold;
        padding: 0 0.25rem;
        height: 1.5rem;
    }

    #search .search-result {
        color: #333;
    }

    #search .search-result header {
        padding: .5rem;
        font-size: .6rem;
        font-weight: bold;
    }

    #search .search-result li {
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border-bottom: 0.025rem solid #e4e4e4;
        line-height: .9rem;
    }

    #search .search-result li > img {
        width: 1.7rem;
        height: 1.7rem;
        margin-right: 0.7rem;
    }

    #search .search-result li h4 {
        font-size: 0.7rem;
        font-weight: normal;
    }

    #search .search-result p {
        font-size: 0.5rem;
    }
</style>