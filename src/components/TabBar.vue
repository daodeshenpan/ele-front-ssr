<template>
    <ul class="tab-bar">
        <li @tap="$router.push('/home?geohash='+$route.query.geohash)">
            <i class="el-icon-eleme" v-if="$route.path !== '/home'"></i>
            <i class="el-icon-platform-eleme selected" v-else></i>
            <span>首页</span>
        </li>
        <li @tap="$router.push('/search?geohash=' + $route.query.geohash)">
            <i class="el-icon-setting" v-if="$route.path !== '/search'"></i>
            <i class="el-icon-s-tools selected" v-else></i>
            <span>搜索</span>
        </li>
        <li @tap="$router.push('/order?geohash=' + $route.query.geohash)">
            <i class="el-icon-goods" v-if="$route.path !== '/order'"></i>
            <i class="el-icon-s-goods selected" v-else></i>
            <span>订单</span>
        </li>
        <li @tap="$router.push('/mine?geohash=' + $route.query.geohash)">
            <i class="el-icon-user" v-if="$route.path !== '/mine'"></i>
            <i class="el-icon-user-solid selected" v-else></i>
            <span>我的</span>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "TabBar"
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    .tab-bar {
        @include size(100%, 2.3rem);
        @include fixed(0, null, null, 0);
        @include flex();

        background-color: #fff;
        z-index: 5;

        li {
            @include size(25%);
            @include flex(column, null, center);
            padding: .25rem;

            i {
                font-size: 1.25rem;
            }

            span {
                font-size: .5rem;
            }

            i.selected, i.selected + span {
                color: $theme;
            }
        }
    }
</style>