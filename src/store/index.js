import Vue from "vue";
import Vuex from 'vuex'
import router from "@/router";
import {isNotEmpty} from "@/uitls";

Vue.use(Vuex)
const vue = new Vue({
    router,
})

export default new Vuex.Store({
    state: {
        //全局变量
        //请求后端服务器根路径
        //BASEURL: "http://124.220.194.48:40011/",
        BASEURL: "http://localhost:80/api/",

        //默认用户头像路径
        defaultUserAvatar: "img/avatar/official/avatarDefaultPc.png",

        //登录用户信息
        loginUser: {
            userId: '',
            userName: '',
            userMail: '',
            userPhone: '',
            userPassword: '',
            userImgUrl: '',
            userSign: '',
            userSex: '',
            userFansNum: '',
            userFocusNum: '',
            userLikesNum: '',
        },

        //登录注册弹窗显示
        loginDialogVisible: false,

        //评论弹窗显示
        commentDialogVisible: false,
        //评论弹窗父级id
        commentId: Number,
    },
    getters: {
        loginFlag(state) {
            return isNotEmpty(state.loginUser.userId);
        }
    },
    mutations: {
        //置空弹窗父级id
        setCommentId(state, commentId) {
            state.commentId = commentId;
        },
        //打开登录弹框
        openCommentDialog(state, commentId) {
            state.commentId = commentId;
            state.commentDialogVisible = true;
        },
        //关闭登录弹框
        closeCommentDialog(state) {
            state.commentDialogVisible = false;
        },
        //打开登录弹框
        openLoginDialog(state) {
            state.loginDialogVisible = true;
        },
        //关闭登录弹框
        closeLoginDialog(state) {
            state.loginDialogVisible = false;
        },
        //用户登录
        setLoginUser(state, user) {
            state.loginUser = user;
            sessionStorage.removeItem("loginUser");
            sessionStorage.setItem("loginUser", JSON.stringify(user));
        },
        //跳转页面
        toPage(state, page) {
            if (vue.$route.name !== page.name) {
                //拦截非法跳转
                if (page.name === "newPost") {
                    if (!this.getters.loginFlag) {
                        this.commit("openLoginDialog");
                        return null;
                    }
                }
                vue.$router.push(page);
            }
        },
        //退出登录
        clearLoginUser(state) {
            state.loginUser = {};
            sessionStorage.removeItem("loginUser");
        },
        //判断用户是否是登录者
        isLoginUser(state, userId) {
            return state.loginUser.userId === userId;
        }
    },
    actions: {},
    modules: {}
})
