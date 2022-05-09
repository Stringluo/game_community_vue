<template>
  <div class="app">
    <router-view></router-view>
    <login-dialog></login-dialog>
    <back-top></back-top>
  </div>
</template>

<script>
import LoginDialog from "@/components/dialog/LoginDialog";
import BackTop from "@/components/BackTop";
import {isNotEmpty} from "@/uitls";
import {mapMutations} from "vuex";
import {refreshSession, hasLoginUser, loginByCookie, destroySession} from "@/api";

export default {
  name: 'app',
  data() {
    return {
      refreshSessionID: "",
    }
  },
  components: {
    LoginDialog,
    BackTop,
  },
  async mounted() {
    /*window.onbeforeunload = async function (){*/
    /*判断本地存储是否有登录信息*/
    if (isNotEmpty(sessionStorage.getItem("loginUser"))) {
      let result = await hasLoginUser();
      if (result.flag) {
        this.setLoginUser(JSON.parse(sessionStorage.getItem("loginUser")));
      } else {
        sessionStorage.removeItem("loginUser");
      }
    } else {
      //发送cookie检测是否登录
      let result = await loginByCookie();
      if (result.flag) {
        this.setLoginUser(result.data);
      }
    }
    /*创建定时器，每过一段时间刷新一次session*/
    this.refreshSessionID = setInterval(refreshSession, 1000 * 7100);
  },
  beforeDestroy() {
    destroySession();
  },
  destroyed() {
    clearInterval(this.refreshSessionID);
  },
  methods: {
    ...mapMutations(['setLoginUser']),
  },
  watch: {
    /*监路由跳转，恢复滚动到初始位置*/
    $route: function (to, from) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
