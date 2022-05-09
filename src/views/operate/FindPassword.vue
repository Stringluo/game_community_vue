<template>
  <div class="find-password">
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-card shadow="false" class="content-card">
          <el-steps :space="200" :active="stepIndex" finish-status="success" align-center>
            <el-step title="获取验证码"></el-step>
            <el-step title="进行验证"></el-step>
            <el-step title="更改密码"></el-step>
          </el-steps>
          <el-divider></el-divider>
          <div class="step-content" v-show="stepIndex===0">
            <el-divider direction="vertical"></el-divider>
            <span style="font-size: 15px">您可以使用以下方式进行安全验证</span>
            <br><br>
            <span style="font-size: 25px;margin: 20px">绑定邮箱验证</span>
            <br><br>
            <el-divider direction="vertical"></el-divider>
            <span style="font-size: 15px">点击获取验证码，短信将发送至您的绑定手机</span>
            <br><br>
            <el-input v-model="user.mail" placeholder="请输入需要重置密码的邮箱" style="margin: 20px 20px"></el-input>
            <el-button type="primary"
                       style="width: 50%;margin: 50px 25%;height: 50px"
                       @click="getCode">获取验证码
            </el-button>
          </div>

          <div class="step-content" v-show="stepIndex===1">
            <el-divider direction="vertical"></el-divider>
            <span style="font-size: 15px">尊敬的{{ user.mail }}用户</span>
            <el-input v-model="user.code" placeholder="请输入您的验证码" style="margin: 50px 20px"></el-input>
            <el-button type="primary"
                       style="width: 50%;margin: 50px 25%;height: 50px"
                       @click="verifyCode">进行验证
            </el-button>
          </div>

          <div class="step-content" v-show="stepIndex===2">
            <el-form ref="user" :model="user" label-width="0">
              <el-form-item prop="pass">
                <el-input type="password" v-model="user.password"
                          autocomplete="off" placeholder="请输入新的密码"></el-input>
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input type="password" v-model="checkPassword"
                          autocomplete="off" placeholder="请确认密码"></el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary"
                       style="width: 50%;margin: 50px 25%;height: 50px"
                       @click="changePassword">更改密码
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getVCode,verifyCode,changePassword} from "@/api";

export default {
  name: "FindPassword",
  data() {
    return {
      stepIndex: 0,
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
      let result = await getVCode(this.user.mail,"findPassword");
      if (result.flag) {
        alert(result.data);
        this.stepIndex++;
      }
    },
    async verifyCode() {
      let result = await verifyCode(this.user);
      if (result.flag) {
        this.stepIndex++;
      }
    },
    async changePassword() {
      let result = await changePassword(this.user);
      if (result.flag) {
        await this.$router.push("/");
        this.$message({
          message: '修改成功',
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