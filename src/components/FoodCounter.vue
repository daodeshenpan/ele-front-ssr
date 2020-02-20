<template>
    <div class="food-counter">
        <transition name="zoom-in-right">
            <div v-show="quantity">
                <i class="el-icon-remove-outline remove-from-cart"
                   @tap="$store.commit('removeFromCart',{restaurant_id: food.restaurant_id,
                   category_id: food.category_id,
                   item_id: food.item_id})"></i>
                <b>{{quantity}}</b>
            </div>
        </transition>
        <i class="el-icon-circle-plus add-to-cart"
           @tap="handleTap($event,animate)"></i>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "FoodCounter",
        props: ['food', 'shoppingCartPosition', 'animate'],
        computed: {
            ...mapState(['cart']),
            quantity() {
                let restaurant = this.cart[this.food.restaurant_id] || {};
                let category = restaurant[this.food.category_id] || {};
                let item = category[this.food.item_id];

                if (item) {
                    return item.quantity;
                } else {
                    return 0;
                }
            }
        },
        methods: {
            handleTap(e, animate) {
                if (animate) {
                    this.$store.commit('addToCart', {
                        restaurant_id: this.food.restaurant_id,
                        category_id: this.food.category_id,
                        item_id: this.food.item_id,
                        name: this.food.name,
                        price: this.food.specfoods[0].price,
                        packing_fee: this.food.specfoods[0].packing_fee
                    });

                    let i = document.createElement('i');
                    i.classList.add('el-icon-circle-plus');
                    i.classList.add('add-to-cart-fixed');

                    i.style.top = e.$touches[0].clientY + 'px';
                    i.style.left = e.$touches[0].clientX + 'px';

                    document.body.appendChild(i);

                    requestAnimationFrame(() => {
                        i.style.top = this.shoppingCartPosition.y + 'px';
                        i.style.left = this.shoppingCartPosition.x + 'px';

                        i.addEventListener('transitionend', () => {
                            this.$emit('bounce');
                            document.body.removeChild(i);
                        }, {once: true})
                    })
                } else {
                    this.$store.commit('addToCart', {
                        restaurant_id: this.food.restaurant_id,
                        category_id: this.food.category_id,
                        item_id: this.food.item_id,
                        name: this.food.name,
                        price: this.food.price,
                        packing_fee: this.food.packing_fee
                    });
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    .food-counter, .food-counter div {
        @include flex();
    }

    .add-to-cart, .remove-from-cart, .add-to-cart-fixed {
        font-size: 1rem;
        color: $theme;
    }

    .food-counter b {
        font-size: 0.65rem;
        color: #666;
        min-width: 1rem;
        text-align: center;
    }

    .add-to-cart-fixed {
        transition: top .55s cubic-bezier(0.3, -0.25, 0.7, -0.15), left .55s linear;
        position: fixed;
        z-index: 4;
    }
</style>