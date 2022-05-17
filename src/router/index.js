import Vue from 'vue'
import VueRouter from 'vue-router'
import Post from "@/views/home/Post";
import User from "@/views/home/User";
import Home from "@/views/Home";
import Operate from "@/views/Operate";
import Index from "@/views/home/Index";
import Partition from "@/views/home/Partition";
import NewPost from "@/views/home/NewPost";
import FindPassword from "@/views/operate/FindPassword";
import Register from "@/views/operate/Register";
import PostList from "@/views/home/user/PostList";
import EditUser from "@/views/home/user/EditUser";
import Admin from "@/views/Admin";

Vue.use(VueRouter)

const routes = [
    //默认首页
    {path: "/", redirect: "/home"},
    //首页
    {
        path: "/home", component: Home, children: [
            {path: "/", redirect: "index"},
            {name: "index", path: "index", component: Index},
            {
                name: "partition", path: "partition", component: Partition, props($route) {
                    return {
                        partitionId: $route.query.partitionId
                    }
                }
            },
            {
                name: "post", path: "post", component: Post, props($route) {
                    return {
                        postId: $route.query.postId
                    }
                }
            },
            {
                path: "user", component: User, props($route) {
                    return {
                        userId: $route.query.userId
                    }
                }, children: [
                    {name: "user", path: "/", redirect: "postList"},
                    {
                        name: "postList", path: "postList", component: PostList, props($route) {
                            return {
                                userId: $route.query.userId
                            }
                        }
                    },
                    {
                        name: "editUser", path: "editUser", component: EditUser, props($route) {
                            return {
                                userId: $route.query.userId
                            }
                        }
                    },
                ]
            },
            {name: "newPost", path: "newPost", component: NewPost, props($route) {
                    return {
                        editPostId: $route.query.editPostId
                    }
                }},
        ]
    },
    //操作
    {
        path: "/operate", component: Operate, children: [
            {path: "/", redirect: "findPassword"},
            {name: "findPassword", path: "findPassword", component: FindPassword},
            {name: "register", path: "register", component: Register},
        ]
    },
    {
        path: "/admin", component: Admin,
    }
]

const router = new VueRouter({
    /*mode: "history",*/
    routes,
})

export default router
