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
import Welcome from '@/views/login/welcome.vue'
import register from '@/views/login/sign-up.vue'
import CompleteOrder from '@/components/profile/complete-order.vue'
import ChangePassword from '@/components/profile/change-password.vue'

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: Welcome
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
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
    path: '/order',
    name: 'order',
    component: Order
  },
  {
    path: '/history',
    name: 'order-history',
    component: orderhistory
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/popular',
    name: 'popular',
    component: Popular_product
  },
  {
    path: '/complete_order',
    name: 'complete_order',
    component: CompleteOrder 
  },
  {
    path: '/reset-password',
    name: 'resetpassword',
    component: ChangePassword
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Add a global navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') // Assuming the token is stored with the key 'token'
  
  if (!token && to.name !== 'welcome' && to.name !== 'register' && to.name !== 'Login') {
    // Redirect to welcome page if there's no token and the user is not already going to welcome, register, or login pages
    next({ name: 'welcome' })
  } else {
    // Proceed as normal
    next()
  }
})

export default router