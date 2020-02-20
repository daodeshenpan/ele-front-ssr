import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import Locate from '@/views/Locate'

export function createRouter() {
    return new VueRouter({
        mode: 'history',
        routes: [
            {
                path: '/',
                redirect: '/locate'
            },
            {
                path: '/locate',
                component: Locate,
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-right'
                }
            },
            {
                path: '/city',
                component: () => import(/*webpackChunkName: "City"*/'@/views/City'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/login',
                component: () => import(/*webpackChunkName: "Login"*/'@/views/Login'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/home',
                component: () => import(/*webpackChunkName: "Home"*/'@/views/Home') ,
                meta: {
                    fullPage: false,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/shopCategory',
                component: () => import(/*webpackChunkName: "ShopCategory"*/'@/views/Home/ShopCategory'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/shop',
                component: () => import(/*webpackChunkName: "Shop"*/'@/views/Shop'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-top'
                }
            },
            {
                path: '/shopDetail',
                component: () => import(/*webpackChunkName: "ShopDetail"*/'@/views/Shop/ShopDetail'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/foodDetail',
                component: () => import(/*webpackChunkName: "FoodDetail"*/'@/views/Shop/FoodDetail'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/confirmOrder',
                component: () => import(/*webpackChunkName: "ConfirmOrder"*/'@/views/ConfirmOrder'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/chooseAddress',
                component: () => import(/*webpackChunkName: "ChooseAddress"*/'@/views/ConfirmOrder/ChooseAddress'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/newAddress',
                component: () => import(/*webpackChunkName: "NewAddress"*/'@/views/ConfirmOrder/ChooseAddress/NewAddress'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/searchAddress',
                component: () => import(/*webpackChunkName: "SearchAddress"*/'@/views/ConfirmOrder/ChooseAddress/NewAddress/SearchAddress'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/addNote',
                component: () => import(/*webpackChunkName: "AddNote"*/'@/views/ConfirmOrder/AddNote'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/payOnline',
                component: () => import(/*webpackChunkName: "PayOnline"*/'@/views/ConfirmOrder/PayOnline'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/search',
                component: () => import(/*webpackChunkName: "Search"*/'@/views/Search')
            },
            {
                path: '/order',
                component: () => import(/*webpackChunkName: "Order"*/'@/views/Order')
            },
            {
                path: '/orderDetail',
                component: () => import(/*webpackChunkName: "OrderDetail"*/'@/views/Order/OrderDetail'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/mine',
                component: () => import(/*webpackChunkName: "Mine"*/'@/views/Mine')
            },
            {
                path: '/profile',
                component: () => import(/*webpackChunkName: "Profile"*/'@/views/Mine/Profile'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/balance',
                component: () => import(/*webpackChunkName: "Balance"*/'@/views/Mine/Balance'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/coupon',
                component: () => import(/*webpackChunkName: "Coupon"*/'@/views/Mine/Coupon'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/point',
                component: () => import(/*webpackChunkName: "Point"*/'@/views/Mine/Point'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            },
            {
                path: '/manageAddress',
                component: () => import(/*webpackChunkName: "ManageAddress"*/'@/views/Mine/Profile/ManageAddress'),
                meta: {
                    fullPage: true,
                    transitionName: 'slide-to-left'
                }
            }
        ]
    })
}
