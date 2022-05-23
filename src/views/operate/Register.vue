<template>
  <div class="register">
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-card shadow="false" class="content-card">
          <span style="color: #4EA4DC;font-size: 25px;margin-left: 23px">注册Game Community通行证</span>
          <el-divider></el-divider>
          <el-form :rules="rules" :status-icon="true"
                   ref="user" :model="user" label-width="0">
            <el-form-item prop="mail">
              <el-input placeholder="邮箱号" v-model="user.mail"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input placeholder="邮箱验证码" v-model="user.code">
                <el-button slot="append" @click="getCode">获取验证码</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" placeholder="密码为8-15位（不能全是数字和字母）"
                        v-model="user.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <el-input type="password" placeholder="确认密码"
                        v-model="user.checkPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         style="width: 50%;margin: 50px 25%;height: 50px"
                         @click="registerUser">注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getVCode, registerUser} from "@/api";

export default {
  name: "Register",
  data() {
    let checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      user: {
        mail: "",
        code: "",
        password: "",
        checkPassword: "",
      },
      rules: {
        mail: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        code: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 6, message: '请输入六位数字验证码', trigger: ['blur', 'change']}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 20, message: '密码由6-20位数字字母符号组成', trigger: ['blur', 'change']}
        ],
        checkPassword: [
          {validator: checkPassword, trigger: ['blur', 'change']}
        ]
      },
    }
  },
  methods: {
    async getCode() {
      this.$refs["user"].validateField("mail", async (valid) => {
        if (!valid) {
          let result = await getVCode(this.user.mail, "register");
          if (result.flag) {
            alert(result.data);
          }
        } else {
          return false;
        }
      })
    },
    async registerUser() {
      this.$refs["user"].validate(async (valid) => {
        if (valid) {
          let result = await registerUser(this.user);
          if (result.flag) {
            await this.$router.push("/");
            this.$message({
              message: '注册成功',
              type: 'success'
            });
          }
        } else {
          return false;
        }
      })
    }
  }
}
</script>

<style scoped>
.content-card {
  padding: 60px 100px;
  margin: 40px 0;
}
</style>