<template>
  <el-form :rules="rules" :status-icon="true"
           class="demo-dynamic" ref="user"
           :model="user" label-width="0" style="margin-top: 20px">
    <el-form-item prop="mail">
      <el-input v-model="user.mail" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input placeholder="验证码" v-model="user.code" class="input-width"></el-input>
      <el-button :disabled="intervalID" :type="type" @click="getCode" style="float: right">{{ codeMsg }}</el-button>
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
import {loginByVCode, getVCode} from "@/api";

export default {
  name: "LoginByCode",
  props: ["clearDataFlag"],
  data() {
    return {
      codeMsg: "获取验证码",
      rules: {
        mail: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        code: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 6, message: '请输入六位数字验证码', trigger: ['blur', 'change']}
        ],
      },
      user: {
        mail: "",
        code: "",
      },
      intervalID: null,
      time: 60,
    }
  },
  computed: {
    type: function () {
      return this.intervalID ? null : "primary";
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
    async getCode() {
      this.$refs["user"].validateField("mail",async (valid) => {
        if (!valid) {
          if (!this.intervalID) {
            let result = await getVCode(this.user.mail, "login");
            if (result.flag) {
              this.$message.success("发送成功")
              this.changeText();
              this.intervalID = setInterval(this.changeText, 1000);
            } else {
              this.$message.error("发送失败")
            }
          }
        } else {
          return false;
        }
      });
    },
    changeText() {
      if (this.time > 0) {
        this.codeMsg = "已发送(" + this.time + ")";
        this.time--;
      } else {
        clearInterval(this.intervalID);
        this.intervalID = null;
        this.codeMsg = "获取验证码";
        this.time = 60;
      }
    },
    async doLogin() {
      this.$refs["user"].validate(async (valid) => {
        if (valid) {
          let result = await loginByVCode(this.user);
          if (result.flag) {
            this.setLoginUser(result.data);
            this.closeLoginDialog();
            location.reload();
          }
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
.input-width {
  width: 60%;
}
</style>