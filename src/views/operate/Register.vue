<template>
  <div class="register">
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-card shadow="false" class="content-card">
          <span style="color: #4EA4DC;font-size: 25px;margin-left: 23px">注册Game Community通行证</span>
          <el-divider></el-divider>
          <el-form ref="user" :model="user" label-width="0">
            <el-form-item>
              <el-input placeholder="邮箱号" v-model="user.mail"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="邮箱验证码" v-model="user.code">
                <el-button slot="append" @click="getCode">获取验证码</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="pass">
              <el-input type="password" placeholder="密码为8-15位（不能全是数字和字母）"
                        v-model="user.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input type="password" placeholder="确认密码"
                        v-model="checkPassword" autocomplete="off"></el-input>
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
    return {
      user: {
        mail: "",
        code: "",
        password: "",
      },
      checkPassword: "",
    }
  },
  methods: {
    async getCode() {
      let result = await getVCode(this.user.mail, "register");
      if (result.flag) {
        alert(result.data);
      }
    },
    async registerUser() {
      let result = await registerUser(this.user);
      if (result.flag) {
        await this.$router.push("/");
        this.$message({
          message: '注册成功',
          type: 'success'
        });
      }
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