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
            <el-form :rules="rules" :status-icon="true"
                     ref="mail" :model="user" label-width="0">
              <el-form-item prop="mail">
                <el-input v-model="user.mail" placeholder="请输入需要重置密码的邮箱"
                          style="margin: 20px 20px"></el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary"
                       style="width: 50%;margin: 50px 25%;height: 50px"
                       @click="getCode">获取验证码
            </el-button>
          </div>

          <div class="step-content" v-show="stepIndex===1">
            <el-divider direction="vertical"></el-divider>
            <span style="font-size: 15px">尊敬的{{ user.mail }}用户</span>
            <el-form :rules="rules" :status-icon="true"
                     ref="code" :model="user" label-width="0">
              <el-form-item prop="code">
                <el-input v-model="user.code" placeholder="请输入您的验证码"
                          style="margin: 50px 20px"></el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary"
                       style="width: 50%;margin: 50px 25%;height: 50px"
                       @click="verifyCode">进行验证
            </el-button>
          </div>

          <div class="step-content" v-show="stepIndex===2">
            <el-form :rules="rules" :status-icon="true"
                     ref="password" :model="user" label-width="0">
              <el-form-item prop="password">
                <el-input type="password" v-model="user.password"
                          autocomplete="off" placeholder="请输入新的密码"></el-input>
              </el-form-item>
              <el-form-item prop="checkPassword">
                <el-input type="password" v-model="user.checkPassword"
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
import {getVCode, verifyCode, changePassword} from "@/api";

export default {
  name: "FindPassword",
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
      stepIndex: 0,
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
      user: {
        mail: "",
        code: "",
        password: "",
        checkPassword: "",
      },
    }
  },
  methods: {
    async getCode() {
      this.$refs["mail"].validate(async (valid) => {
        if (valid) {
          let result = await getVCode(this.user.mail, "findPassword");
          if (result.flag) {
            this.stepIndex++;
          }
        } else {
          return false;
        }
      })
    },
    async verifyCode() {
      this.$refs["code"].validate(async (valid) => {
        if (valid) {
          let result = await verifyCode(this.user);
          if (result.flag) {
            this.stepIndex++;
          }
        } else {
          return false;
        }
      })
    },
    async changePassword() {
      this.$refs["password"].validate(async (valid) => {
        if (valid) {
          let result = await changePassword(this.user);
          if (result.flag) {
            await this.$router.push("/");
            this.$message({
              message: '修改成功',
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