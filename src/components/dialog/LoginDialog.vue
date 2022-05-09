<template>
  <el-dialog @open="unClearData" @close="clearData" title="登录" :visible.sync="loginDialogVisible" width="26%">
    <el-tabs v-model="activeName">
      <el-tab-pane label="验证登录" name="loginByVCode">
        <login-by-v-code :clearDataFlag="clearDataFlag"></login-by-v-code>
      </el-tab-pane>
      <el-tab-pane label="密码登录" name="loginByPassword">
        <login-by-password :clearDataFlag="clearDataFlag"></login-by-password>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import LoginByVCode from "@/components/login/LoginByVCode";
import LoginByPassword from "@/components/login/LoginByPassword";

export default {
  name: "LoginDialog",
  data() {
    return {
      clearDataFlag: false,
      activeName: 'loginByVCode'
    };
  },
  computed: {
    loginDialogVisible: {
      get: function () {
        return this.$store.state.loginDialogVisible;
      },
      set: function (val) {
        this.$store.state.loginDialogVisible = val;
      }
    },
  },
  methods: {
    clearData(){
      this.clearDataFlag = true;
    },
    unClearData(){
      this.clearDataFlag = false;
    }
  },
  components: {
    LoginByVCode,
    LoginByPassword
  }
}
</script>

<style scoped>
.el-avatar {
  margin-left: 23px !important;
}
</style>