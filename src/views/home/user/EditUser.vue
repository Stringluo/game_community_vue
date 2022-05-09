<template>
  <div class="g-c-edit-user">
    <el-card class="edit-user">
      <div slot="header" class="clearfix">
        <span>编辑资料</span>
      </div>
      <div class="edit-item">
        <g-c-avatar style="width: 120px;height: 120px" :src="getUrl()"></g-c-avatar>
        <el-upload
            class="avatar-uploader"
            :action="BASEURL+'loginUsers/uploadAvatar'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <el-link type="primary" :underline="false">修改头像</el-link>
        </el-upload>
        <el-form style="margin-top: 30px" ref="form" :model="user" label-width="100px">
          <el-form-item label="昵称">
            <el-input v-model="user.userName"></el-input>
          </el-form-item>
          <el-form-item style="text-align: left;" label="性别" prop="resource">
            <el-radio-group v-model="user.userSex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
              <el-radio :label="null">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="个性签名" prop="desc">
            <el-input type="textarea" v-model="user.userSign"
                      :autosize="{ minRows: 3 }"
                      maxlength="48"
                      show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="editUser" style="width: 150px" type="primary" plain>保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {clearImg, editUser} from "@/api";

export default {
  name: "EditUser",
  props: ['userId'],
  data() {
    return {
      imageUrl: "",
      user: {
        userName: "",
        userSex: "",
        userSign: "",
      },
      img: {},
    }
  },
  computed: {
    ...mapState(['BASEURL', 'loginUser'])
  },
  mounted() {
    this.user.userName = this.loginUser.userName;
    this.user.userSex = this.loginUser.userSex;
    this.user.userSign = this.loginUser.userSign;
  },
  watch: {
    imageUrl: function (newValue, oldValue) {
      if (oldValue && newValue) {
        this.img.url = oldValue;
        clearImg(this.img);
      }
    }
  },
  methods: {
    ...mapMutations(['setLoginUser']),
    getUrl() {
      return this.BASEURL + (this.imageUrl ? this.imageUrl : this.loginUser.userImgUrl);
    },
    handleAvatarSuccess(res) {
      this.imageUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isJPG && isLt2M;
    },
    async editUser() {
      this.user.userImgUrl = this.imageUrl ? this.imageUrl : this.loginUser.userImgUrl;
      this.user.userId = this.loginUser.userId;
      let result = await editUser(this.user);
      if (result.flag) {
        this.setLoginUser(result.data);
        this.$message.success("修改成功");
        location.reload();
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    }
  }
}
</script>

<style scoped>
.edit-user .edit-item {
  align-content: center;
  text-align: center;
}

.edit-user {
  padding-bottom: 50px;
}
</style>