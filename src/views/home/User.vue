<template>
  <div class="gc-user">
    <el-card class="user-header" :body-style="{margin:0,padding:0}">
      <g-c-avatar class="header-list header-avatar" :src="BASEURL+user.userImgUrl"></g-c-avatar>
      <div class="header-list user-info">
        <p>
          <span style="font-size: 16px;line-height: 16px;font-weight: 600;">{{ user.userName }}</span>
          <span style="color: #4CC3FF;font-size: 18px;margin-left: 10px" class="el-icon-sex-man"
                v-show="user.userSex===1"></span>
          <span style="color: #FF82C3;font-size: 18px;margin-left: 10px" class="el-icon-sex-woman"
                v-show="user.userSex===0"></span>
        </p>
        <p>
          <span style="color: #FF82C3" class="el-icon-document"></span>
          <span style="color: #999999;font-size: 14px">{{ user.userSign }}</span>
        </p>
        <el-button style="margin-top: 10px;width: 100px" type="primary"
                   @click="toPage({name:'editUser',query:{userId:userId}})" plain v-show="isLogin(user.userId)">编辑
        </el-button>
        <el-button style="margin-top: 10px;width: 100px" type="primary"
                   @click="focusUser(user.userId)"
                   plain v-show="!isLogin(user.userId)&&!user.likeFlag">关注
        </el-button>
        <el-button style="margin-top: 10px;width: 100px"
                   @click="cancelFocusUser(user.userId)"
                   plain v-show="!isLogin(user.userId)&&user.likeFlag">已关注
        </el-button>
      </div>
      <div class="header-right">
        <div class="right-item">
          <p>{{ user.userFansNum }}</p>
          <span>粉丝</span>
        </div>
        <div class="right-item">
          <p>{{ user.userFocusNum }}</p>
          <span>关注</span>
        </div>
        <div class="right-item">
          <p>{{ user.userLikesNum }}</p>
          <span>获赞</span>
        </div>
      </div>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-card>
          <div slot="header" class="clearfix">
            <span>个人中心</span>
          </div>
          <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              @select="handleSelect"
              :router=true>
            <el-menu-item index="1" :route="{name:'postList',query:{userId:userId}}">
              <i class="el-icon-document"></i>
              <span slot="title">{{ isLogin(user.userId) ? "我的" : "" }}发帖</span>
            </el-menu-item>
            <el-menu-item index="2" :route="{name:'connectionList',query:{userId:userId}}">
              <i class="el-icon-star-off"></i>
              <span slot="title">{{ isLogin(user.userId) ? "我的" : "" }}收藏</span>
            </el-menu-item>
            <el-menu-item index="3" :route="{name:'likedList',query:{userId:userId}}">
              <i class="el-icon-like"></i>
              <span slot="title">{{ isLogin(user.userId) ? "我的" : "" }}点赞</span>
            </el-menu-item>
            <el-divider></el-divider>
            <el-menu-item index="4" :route="{name:'fansList',query:{userId:userId}}">
              <i class="el-icon-fans"></i>
              <span slot="title">{{ isLogin(user.userId) ? "我的" : "" }}粉丝</span>
            </el-menu-item>
            <el-menu-item index="5" :route="{name:'focusList',query:{userId:userId}}">
              <i class="el-icon-focus"></i>
              <span slot="title">{{ isLogin(user.userId) ? "我的" : "" }}关注</span>
            </el-menu-item>
            <el-divider v-show="isLogin(user.userId)"></el-divider>
            <el-menu-item index="6" :route="{name:'editUser',query:{userId:userId}}" v-show="isLogin(user.userId)">
              <i class="el-icon-edit"></i>
              <span slot="title">编辑资料</span>
            </el-menu-item>
            <el-menu-item @click="loginOut" v-show="isLogin(user.userId)">
              <i class="el-icon-exit"></i>
              <span slot="title">退出登录</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="17">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {cancelFocusUser, focusUser, getUserById, logoutUser} from "@/api";
import {isNotEmpty} from "@/uitls";

export default {
  name: "User",
  props: ["userId"],
  data() {
    return {
      user: {},
      activeIndex: "",
    }
  },
  computed: {
    ...mapState(['BASEURL', 'loginUser']),
  },
  mounted() {
    this.initUserVue();
  },
  watch: {
    userId: function (newValue, oldValue) {
      if (isNotEmpty(newValue)) {
        this.initUserVue();
      }
    }
  },
  methods: {
    ...mapMutations(['clearLoginUser', 'toPage']),
    async focusUser(focusUserId) {
      if (!this.user.likeFlag) {
        this.user.likeFlag = !this.user.likeFlag;
        await focusUser(focusUserId);
      }
    },
    async cancelFocusUser(focusUserId) {
      if (this.user.likeFlag) {
        this.user.likeFlag = !this.user.likeFlag;
        await cancelFocusUser(focusUserId);
      }
    },
    async initUserVue() {
      if (this.userId === this.loginUser.userId) {
        this.user = this.loginUser;
      } else {
        //后端请求用户信息
        let result = await getUserById(this.userId);
        if (result.flag) {
          this.user = result.data;
        }
      }
    },
    async loginOut() {
      let result = await logoutUser();
      if (result.flag) {
        //退出登录
        await this.$router.push("/");
        this.clearLoginUser();
      }
    },
    handleSelect(key) {
      this.activeIndex = key;
    },
    isLogin(userId) {
      return this.loginUser.userId === userId;
    }
  }
}
</script>

<style scoped>

.el-menu-demo {
  border-right: 0 !important;
}

.header-right {
  float: right;
  align-content: center;
  margin-top: 30px;
}

.right-item {
  float: left;
  text-align: center;
  width: 100px;
}

.right-item > p {
  font-size: 20px;
}

.right-item > span {
  font-size: 14px;
  color: #999999;
}

.user-header {
  height: 120px;
  padding: 20px 50px;
  margin-bottom: 20px;
}

.header-list {
  float: left;
  margin-right: 20px;
}

.header-avatar {
  width: 120px;
  height: 120px;
}

.user-info {
  width: 450px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.user-info > p {
  margin: 5px 0;
}

.user-info > p > span {
  margin: 0 5px;
}
</style>