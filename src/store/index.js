import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import {
    getHotCity,
    getAllCity,
    getCityInfo,
    getPosition,
    getShopList,
    getShopInfo,
    getShopMenu,
    getShopRating,
    getRatingScore,
    getRatingTag,
    checkShopCart,
    getAddress,
    getUserInfo
} from '@/api/index'

export function createStore() {
    return new Vuex.Store({
        state: {
            hotCity: [],
            allCity: {},
            cityInfo: {},
            position: {},
            shopListLimit: 20,
            homeShopList: [],
            homeShopListIndex: 0,
            categoryShopList: [],
            categoryShopListIndex: 0,
            shopInfo: {},
            shopMenu: [],
            shopRating: [],
            shopScore: {},
            shopTag: [],
            cart: {},
            checkData: {
                cart: {
                    restaurant_info: {},
                    groups: [[]]
                },
                payments: []
            },
            allAddress: [],
            chosenIndex: 0,
            quickNote: '',
            customNote: '',
            userInfo: {}
        },
        getters: {
            homeHaveMore(state) {
                return state.homeShopList.length - (state.homeShopListIndex - 1) * state.shopListLimit > (state.shopListLimit - 1);
            },
            categoryHaveMore(state) {
                return state.categoryShopList.length - (state.categoryShopListIndex - 1) * state.shopListLimit > (state.shopListLimit - 1);
            }
        },
        mutations: {
            setHotCity(state, payload) {
                state.hotCity = payload;
            },
            setAllCity(state, payload) {
                state.allCity = payload;
            },
            setCityInfo(state, payload) {
                state.cityInfo = payload;
            },
            setPosition(state, payload) {
                state.position = payload;
            },
            setHomeShopList(state, payload) {
                state.homeShopList = payload;
            },
            setMoreHomeShopList(state, payload) {
                state.homeShopList.push(...payload);
            },
            setHomeShopListIndex(state, payload) {
                state.homeShopListIndex = payload;
            },
            increaseHomeShopListIndex(state) {
                state.homeShopListIndex += 1;
            },
            setCategoryShopList(state, payload) {
                state.categoryShopList = payload;
            },
            setMoreCategoryShopList(state, payload) {
                state.categoryShopList.push(...payload);
            },
            setCategoryShopListIndex(state, payload) {
                state.categoryShopListIndex = payload;
            },
            increaseCategoryShopListIndex(state) {
                state.categoryShopListIndex += 1;
            },
            setShopInfo(state, payload) {
                state.shopInfo = payload;
            },
            setShopMenu(state, payload) {
                state.shopMenu = payload;
            },
            setShopRating(state, payload) {
                state.shopRating = payload;
            },
            setShopScore(state, payload) {
                state.shopScore = payload;
            },
            setShopTag(state, payload) {
                state.shopTag = payload;
            },
            setCart(state, payload) {
                state.cart = payload;
            },
            setShopCart(state, {id, cart}) {
                state.cart[id] = cart;
            },
            addToCart(state, {restaurant_id, category_id, item_id, name, price, packing_fee}) {
                let cart = state.cart;
                let restaurant = cart[restaurant_id] = (cart[restaurant_id] || {});
                let category = restaurant[category_id] = (restaurant[category_id] || {});

                let item = category[item_id] = (category[item_id] || {
                    quantity: 0,
                    restaurant_id: restaurant_id,
                    category_id: category_id,
                    item_id: item_id,
                    id: item_id,
                    name: name,
                    price: price,
                    packing_fee: packing_fee,
                    specs: ['']
                });

                item.quantity++;

                // 触发依赖
                state.cart = {...cart};
            },
            removeFromCart(state, {restaurant_id, category_id, item_id}) {
                let cart = state.cart;
                let restaurant = cart[restaurant_id] || {};
                let category = restaurant[category_id] || {};
                let item = category[item_id];

                if (item) {
                    if (item.quantity > 1) {
                        item.quantity--;
                    } else {
                        item = (category[item_id] = undefined);
                    }
                }

                // 触发依赖
                state.cart = {...cart};
            },
            setCheckData(state, payload){
                state.checkData = payload;
            },
            setAllAddress(state, payload) {
                state.allAddress = payload;
            },
            setChosenIndex(state, payload) {
                state.chosenIndex = payload;
            },
            setNote(state, {quickNote, customNote}) {
                state.quickNote = quickNote;
                state.customNote = customNote;
            },
            setUserInfo(state, payload) {
                state.userInfo = payload;
            }
        },
        actions: {
            fetchHotCity({commit}) {
                return getHotCity().then(({data}) => {
                    commit('setHotCity', data);
                })
            },
            fetchAllCity({commit}) {
                return getAllCity().then(({data}) => {
                    commit('setAllCity', data);
                })
            },
            fetchCityInfo({commit}, id) {
                return getCityInfo(id).then(({data}) => {
                    commit('setCityInfo', data);
                })
            },
            fetchPosition({commit}, geohash) {
                return getPosition(geohash).then(({data}) => {
                    commit('setPosition', data);
                })
            },
            fetchHomeShopList({commit}, {latitude, longitude, order_by, offset, limit, restaurant_category_ids, delivery_mode, support_ids}) {
                return getShopList(latitude, longitude, order_by, offset, limit, restaurant_category_ids, delivery_mode, support_ids).then(({data}) => {
                    commit('setHomeShopList', data);
                    commit('increaseHomeShopListIndex');
                })
            },
            fetchMoreHomeShopList({commit}, {latitude, longitude, order_by, offset, limit, restaurant_category_ids, delivery_mode, support_ids}) {
                return getShopList(latitude, longitude, order_by, offset, limit, restaurant_category_ids, delivery_mode, support_ids).then(({data}) => {
                    commit('setMoreHomeShopList', data);
                    commit('increaseHomeShopListIndex');
                })
            },
            fetchCategoryShopList({commit}, {latitude, longitude, order_by, offset, limit, restaurant_category_ids, delivery_mode, support_ids}) {
                return getShopList(latitude, longitude, order_by, offset, limit, restaurant_category_ids, delivery_mode, support_ids).then(({data}) => {
                    commit('setCategoryShopList', data);
                    commit('increaseCategoryShopListIndex');
                })
            },
            fetchMoreCategoryShopList({commit}, {latitude, longitude, order_by, offset, limit, restaurant_category_ids, delivery_mode, support_ids}) {
                return getShopList(latitude, longitude, order_by, offset, limit, restaurant_category_ids, delivery_mode, support_ids).then(({data}) => {
                    commit('setMoreCategoryShopList', data);
                    commit('increaseCategoryShopListIndex');
                })
            },
            fetchShopInfo({commit}, id) {
                return getShopInfo(id).then(({data}) => {
                    commit('setShopInfo', data);
                })
            },
            fetchShopMenu({commit}, id) {
                return getShopMenu(id).then(({data}) => {
                    commit('setShopMenu', data);
                })
            },
            fetchShopRating({commit}, id) {
                return getShopRating(id).then(({data}) => {
                    commit('setShopRating', data);
                })
            },
            fetchShopScore({commit}, id) {
                return getRatingScore(id).then(({data}) => {
                    commit('setShopScore', data);
                })
            },
            fetchShopTag({commit}, id) {
                return getRatingTag(id).then(({data}) => {
                    commit('setShopTag', data);
                })
            },
            fetchCheckData({commit},{geohash, id, entities}){
                return checkShopCart(geohash, id, entities).then(({data}) => {
                    commit('setCheckData', data);
                });
            },
            fetchAllAddress({commit}, id) {
                return getAddress(id).then(({data}) => {
                    commit('setAllAddress', data);
                })
            },
            fetchUserInfo({commit}) {
                return getUserInfo().then(({data}) => {
                    if (data.status === 0) {

                    } else {
                        commit('setUserInfo', data);
                    }
                })
            }
        },
        modules: {}
    })

}