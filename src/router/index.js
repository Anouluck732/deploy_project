import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/login.vue'
import product from '@/components/product/product.vue'
import product_detail from '@/components/product/product_detail.vue'
import favourite from '@/components/favourite/favourite_list.vue'
import homepage from '@/components/homepage/homepage.vue'
import cardList from '@/components/card/card-list.vue'
import Order from '@/components/order/order.vue'
import orderhistory from '@/components/order/order-history.vue'
import Profile from '@/components/profile/profile.vue'
import Popular_product from '@/components/product/popular_product.vue'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/homepage',
    name: 'homepage',
    component: homepage
  },
  {
    path: '/product',
    name: 'product',
    component: product
  },
  {
    path: '/product/:pid',
    name: 'ProductDetail',
    component: product_detail
  },
  {
    path: '/favourite',
    name: 'favourite',
    component: favourite
  },
  {
    path: '/cart',
    name: 'cart',
    component: cardList
  },
  {
    path:'/order',
    name: 'order',
    component: Order
  },
  {
    path: '/history',
    name: 'order-history',
    component:orderhistory
  },
  {
    path:'/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/popular',
    name: 'popular',
    component: Popular_product

  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')

//   if (to.meta.requiresAuth && !token) {
//     next({ name: 'Login' })
//   } else if (to.name === 'Login' && token) {
//     next({ name: 'product' })
//   } else {
//     next()
//   }
// })

export default router
