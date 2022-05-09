<template>
  <el-form class="demo-dynamic" ref="user" :model="user" label-width="0" style="margin-top: 20px">
    <el-form-item>
      <el-input v-model="user.mail" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input type="password" placeholder="密码" v-model="user.password" class="input-width"></el-input>
    </el-form-item>
    <el-form-item>
      <el-tooltip class="item" effect="dark" content="记住登陆状态，30天免登录" placement="right">
        <el-checkbox v-model="user.rememberMe"><span style="font-size: 10px;color: #78797B">记住我</span></el-checkbox>
      </el-tooltip>
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
import {loginByPassword} from "@/api";

export default {
  name: "LoginByPassword",
  props: ["clearDataFlag"],
  data() {
    return {
      user: {
        mail: "",
        password: "",
        rememberMe: false
      },
      rememberMe: false,
    }
  },
  watch: {
    clearDataFlag: function (newValue) {
      if (newValue) {
        this.user.mail = "";
        this.user.password = "";
        this.user.rememberMe = false;
      }
    }
  },
  methods: {
    ...mapMutations(['setLoginUser', 'closeLoginDialog','toPage']),
    async doLogin() {
      let result = await loginByPassword(this.user);
      if(result.flag){
        this.setLoginUser(result.data);
        this.closeLoginDialog();
        location.reload();
      }
    },
    registerUser(){
      this.closeLoginDialog();
      this.toPage({name:'register'});
    },
    findPassword(){
      this.closeLoginDialog();
      this.toPage({name:'findPassword'});
    },
  }
}
</script>

<style scoped>

</style>