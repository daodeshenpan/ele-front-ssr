<template>
    <div id="locate">
        <top-bar>
            <template #left>
                <span class="top-bar-logo">ele.me</span>
            </template>
        </top-bar>
        <nav class="city-location">
            <div class="city-location-title">
                <span>当前定位城市:</span>
                <span>定位不准确时，请在城市列表中选择</span>
            </div>
            <div class="city-location-content"
                 @tap="handleTap(guessedID)">
                <span>{{guessedName}}</span>
                <i class="el-icon-arrow-right"></i>
            </div>
        </nav>
        <section class="hot-city">
            <h4 class="hot-city-title">热门城市</h4>
            <ul class="hot-city-content clearfix">
                <li v-for="(item,index) in hotCity"
                    :key="index"
                    class="ellipsis"
                    @tap="handleTap(item.id)">{{item.name}}
                </li>
            </ul>
        </section>
        <section class="all-city" v-for="(item,key) in allCitySorted" :key="key">
            <h4 class="all-city-title">{{key}}</h4>
            <ul class="all-city-content clearfix">
                <li v-for="(city,index) in item"
                    :key="index" class="ellipsis"
                    @tap="handleTap(city.id)">{{city.name}}
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import TopBar from '@/components/TopBar'
    import {guessCityLocation} from '@/api/index'

    export default {
        name: "Locate",
        components: {
            TopBar
        },
        data() {
            return {
                guessedName: '',
                guessedID: 0
            }
        },
        computed: {
            ...mapState(['hotCity', 'allCity']),
            allCitySorted() {
                let obj = {};
                for (let i = 65; i <= 90; i++) {
                    if (this.allCity[String.fromCharCode(i)]) {
                        obj[String.fromCharCode(i)] = this.allCity[String.fromCharCode(i)];
                    }
                }
                return obj;
            }
        },
        asyncData({store, route}) {
            return Promise.all([store.dispatch('fetchAllCity'), store.dispatch('fetchHotCity')]);
        },
        beforeMount() {
            guessCityLocation().then(({data}) => {
                this.guessedName = data.name;
                this.guessedID = data.id;
            })
        },
        methods: {
            handleTap(id) {
                this.$router.push('/city?id=' + id);
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #locate {
        @include absolute();
        @include size(100%, 100%);

        overflow-y: auto;

        box-sizing: border-box;
        padding-top: 1.95rem;

        .top-bar-logo {
            font-size: .7rem;
        }

        .city-location {
            background-color: #fff;
            margin-bottom: 0.4rem;
        }

        .city-location-title {
            line-height: 1.45rem;
            padding: .4rem .45rem 0;
            @include flex(row, space-between, center);

            span:first-child {
                font-size: 0.55rem;
                color: #666;
            }

            span:last-child {
                font-weight: 900;
                font-size: 0.475rem;
                color: #9f9f9f;
            }
        }

        .city-location-content {
            @include flex(row, space-between, center);
            height: 1.8rem;
            padding: 0 0.45rem;
            border-top: 1px solid #e4e4e4;
            border-bottom: 2px solid #e4e4e4;
            color: $theme;
            font-size: .75rem;

            i {
                color: #999;
                font-size: 1rem;
            }
        }

        .hot-city {
            background-color: #fff;
            margin-bottom: 0.4rem;
        }

        .hot-city-title {
            color: #666;
            font-weight: 400;
            text-indent: 0.45rem;
            border-top: 2px solid #e4e4e4;
            border-bottom: 1px solid #e4e4e4;
            font: 0.55rem/1.45rem "Helvetica Neue";;
        }

        .hot-city-content li {
            @include size(25%, 1.75rem);

            box-sizing: border-box;
            float: left;
            text-align: center;
            color: #3190e8;
            border-bottom: 0.025rem solid #e4e4e4;
            border-right: 0.025rem solid #e4e4e4;
            font: 0.6rem/1.75rem "Microsoft YaHei";
        }

        .all-city {
            background-color: #fff;
            margin-bottom: 0.4rem;
        }

        .all-city-title {
            color: #666;
            font-weight: 400;
            text-indent: 0.45rem;
            border-top: 2px solid #e4e4e4;
            border-bottom: 1px solid #e4e4e4;
            font: 0.55rem/1.45rem "Helvetica Neue";
        }

        .all-city-content li {
            @include size(25%, 1.75rem);

            box-sizing: border-box;
            float: left;
            text-align: center;
            border-bottom: 0.025rem solid #e4e4e4;
            border-right: 0.025rem solid #e4e4e4;
            font: 0.6rem/1.75rem "Microsoft YaHei";
            color: #666;
        }
    }
</style>