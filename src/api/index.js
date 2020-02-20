import axios from 'axios'
import {baseURL} from '@/utils/config'

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

// 登录
export const login = (username, password, captcha_code) => axios({
    method: 'post',
    url: '/v2/login',
    data: {
        username,
        password,
        captcha_code
    }
});

// 用户信息
export const getUserInfo = () => axios({
    method: 'get',
    url: '/v1/user',
});

// 验证码
export const getCaptcha = () => axios({
    method: 'post',
    url: '/v1/captchas',
});

// 热门城市
export const getHotCity = () => axios({
    method: 'get',
    url: '/v1/cities',
    params: {
        type: 'hot'
    }
});

// 所有城市
export const getAllCity = () => axios({
    method: 'get',
    url: '/v1/cities',
    params: {
        type: 'group'
    }
});

// 城市定位
export const guessCityLocation = () => axios({
    method: 'get',
    url: '/v1/cities',
    params: {
        type: 'guess'
    }
});

// 选择城市信息
export const getCityInfo = id => axios({
    method: 'get',
    url: '/v1/cities/' + id
});

// 搜索地址
export const searchPlace = (city_id, keyword) => axios({
    method: 'get',
    url: '/v1/pois',
    params: {
        type: 'search',
        city_id,
        keyword
    }
});

// 精确定位
export const getPosition = geohash => axios({
    method: 'get',
    url: '/v2/pois/' + geohash
});

// 首页分类
export const getIndexEntry = () => axios({
    method: 'get',
    url: '/v2/index_entry'
});

// 店铺列表
export const getShopList = (latitude, longitude, order_by, offset, limit, restaurant_category_ids, delivery_mode, support_ids) => axios({
    method: 'get',
    url: '/shopping/restaurants',
    params: {
        latitude,
        longitude,
        order_by,
        offset,
        limit,
        restaurant_category_ids,
        delivery_mode,
        support_ids
    }
});

// 所有店铺分类
export const getShopCategory = () => axios({
    method: 'get',
    url: '/shopping/v2/restaurant/category'
});

// 店铺详情
export const getShopInfo = shop_id => axios({
    method: 'get',
    url: '/shopping/restaurant/' + shop_id
});

// 店铺菜单
export const getShopMenu = restaurant_id => axios({
    method: 'get',
    url: '/shopping/v2/menu',
    params: {
        restaurant_id
    }
});

// 搜索店铺
export const searchShop = (geohash, keyword) => axios({
    method: 'get',
    url: '/v4/restaurants',
    params: {
        geohash,
        keyword
    }
});

// 店铺评价
export const getShopRating = restaurant_id => axios({
    method: 'get',
    url: '/ugc/v2/restaurants/' + restaurant_id + '/ratings'
});

// 店铺评价分数
export const getRatingScore = restaurant_id => axios({
    method: 'get',
    url: '/ugc/v2/restaurants/' + restaurant_id + '/ratings/scores'
});


// 店铺评价标签
export const getRatingTag = restaurant_id => axios({
    method: 'get',
    url: '/ugc/v2/restaurants/' + restaurant_id + '/ratings/tags'
});

// 检查购物车
export const checkShopCart = (geohash, restaurant_id, entities) => axios({
    method: 'post',
    url: '/v1/carts/checkout',
    data: {
        come_from: 'web',
        geohash,
        restaurant_id,
        entities
    }
});

// 搜索地址
export const searchAddress = keyword => axios({
    method: 'get',
    url: '/v1/pois',
    params: {
        type: 'nearby',
        keyword
    }
});

// 获取地址
export const getAddress = user_id => axios({
    method: 'get',
    url: '/v1/users/' + user_id + '/addresses'
});

// 添加地址
export const addAddress = (user_id, address, address_detail, geohash, name, phone, sex, tag, tag_type) => axios({
    method: 'post',
    url: '/v1/users/' + user_id + '/addresses',
    data: {
        user_id,
        address,
        address_detail,
        geohash,
        name,
        phone,
        tag,
        sex,
        tag_type
    }
});

// 快速备注
export const getQuickNote = (id, sig) => axios({
    method: 'get',
    url: '/v1/carts/' + id + '/remarks',
    params: {
        sig
    }
});

// 下单
export const takeOrder = (user_id, cart_id, address_id, restaurant_id, entities, geohash, description) => axios({
    method: 'post',
    url: '/v1/users/' + user_id + '/carts/ ' + cart_id + '/orders',
    data: {
        address_id,
        restaurant_id,
        entities,
        geohash,
        description
    }
});

// 订单列表
export const getUserOrder = (user_id, offset, limit) => axios({
    method: 'get',
    url: '/bos/v2/users/' + user_id + '/orders',
    params: {
        offset,
        limit
    }
});

// 订单详情
export const getOrderDetail = (user_id, order_id) => axios({
    method: 'get',
    url: '/bos/v1/users/' + user_id + '/orders/' + order_id + '/snapshot'
});

// 退出登录
export const logout = () => axios({
    method: 'get',
    url: '/v2/signout'
});

// 删除地址
export const removeAddress = (user_id, address_id) => axios({
    method: 'delete',
    url: '/v1/users/' + user_id + '/addresses/' + address_id
});

// 红包
export const getCoupon = (user_id, offset, limit) => axios({
    method: 'get',
    url: '/promotion/v2/users/' + user_id + '/hongbaos',
    params: {
        offset,
        limit
    }
});