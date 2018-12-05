import Vue from 'vue'
import Router from 'vue-router'
import Add from '@/components/Add';
import Edit from '@/components/Edit';
import List from '@/components/List';
import Category from '@/components/Category';
import Comment from '@/components/Comment';
import Order from '@/components/Order';
import OrderInfo from '@/components/OrderInfo';
import User from '@/components/User';
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/list',
            name: 'List',
            component: List
        },
        {
            path: '/edit/:id',
            name: 'Edit',
            component: Edit
        },
        {
            path: '/add',
            name: 'Add',
            component: Add
        },
        {
            path: '/category',
            name: 'Category',
            component: Category
        },
        {
            path: '/comment',
            name: 'Comment',
            component: Comment
        },
        {
            path: '/order',
            name: 'Order',
            component: Order
        },
        {
            path: '/orderInfo',
            name:"orderInfo",
            component:OrderInfo
        },
        {
            path:'/user',
            name:"user",
            component:User
        }
    ]
})
