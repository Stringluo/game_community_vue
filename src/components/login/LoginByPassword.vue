<template>
  <el-form
      :rules="rules" class="demo-dynamic" :status-icon="true"
      ref="user" :model="user" label-width="0"
      style="margin-top: 20px">
    <el-form-item prop="mail">
      <el-input v-model="user.mail" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item prop="password">
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
      rules: {
        mail: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 20, message: '密码由6-20位数字字母符号组成', trigger: ['blur', 'change']}
        ],
      },
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
        this.resetForm("user");
      }
    }
  },
  methods: {
    ...mapMutations(['setLoginUser', 'closeLoginDialog', 'toPage']),
    async doLogin() {
      this.$refs["user"].validate(async (valid) => {
        if (valid) {
          let result = await loginByPassword(this.user);
          if (result.flag) {
            this.setLoginUser(result.data);
            this.closeLoginDialog();
            location.reload();
          }
        } else {
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    registerUser() {
      this.closeLoginDialog();
      this.toPage({name: 'register'});
    },
    findPassword() {
      this.closeLoginDialog();
      this.toPage({name: 'findPassword'});
    },
  }
}
</script>

<style scoped>

</style>