<template>
  <el-form class="demo-dynamic" ref="user" :model="user" label-width="0" style="margin-top: 20px">
    <el-form-item>
      <el-input v-model="user.mail" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input placeholder="验证码" v-model="user.code" class="input-width"></el-input>
      <el-button type="primary" @click="getCode" style="float: right">获取验证码</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="doLogin" style="width: 100%">登录</el-button>
    </el-form-item>
    <el-form-item>
      <el-link @click="findPassword" type="info" :underline="false">登陆遇到问题？</el-link>
      <el-link @click="registerUser" type="info" style="float: right" :underline="false">立即注册</el-link>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapMutations} from "vuex";
import {loginByVCode,getVCode} from "@/api";

export default {
  name: "LoginByCode",
  props: ["clearDataFlag"],
  data() {
    return {
      user: {
        mail: "",
        code: "",
      },
    }
  },
  watch: {
    clearDataFlag: function (newValue) {
      if (newValue) {
        this.user.mail = "";
        this.user.code = "";
      }
    }
  },
  methods: {
    ...mapMutations(['setLoginUser', 'closeLoginDialog','toPage']),
    registerUser(){
      this.closeLoginDialog();
      this.toPage({name:'register'});
    },
    findPassword(){
      this.closeLoginDialog();
      this.toPage({name:'findPassword'});
    },
    async getCode() {
      let result = await getVCode(this.user.mail,"login");
      if(result.flag){
        alert(result.data);
      }
    },
    async doLogin() {
      let result = await loginByVCode(this.user);
      if (result.flag) {
        this.setLoginUser(result.data);
        this.closeLoginDialog();
        location.reload();
      }
    }
  }
}
</script>

<style scoped>
.input-width {
  width: 60%;
}
</style>