<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="3">
      <el-menu
          class="border-bottom-bg border-right-none"
          background-color="#2D2F33"
          text-color="#fff"
          active-text-color="#fff"
          :router=true>
        <el-menu-item index="/">Game Community</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="14">
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo border-bottom-bg"
          mode="horizontal"
          @select="handleSelect"
          background-color="#2D2F33"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router=true>
        <el-menu-item index="1" route="/">首页</el-menu-item>
        <el-menu-item index="2" :route="{name:'partition',query:{partitionId:1}}">酒馆</el-menu-item>
        <el-menu-item index="3" :route="{name:'partition',query:{partitionId:2}}">攻略</el-menu-item>
        <el-menu-item index="4" :route="{name:'partition',query:{partitionId:3}}">官方</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="2">
      <el-menu
          class="border-right-none"
          background-color="#2D2F33"
          :router=true
          @select="clickUser">
        <el-menu-item index="1" :route="$route.path" v-if="!loginFlag">
          <span data-v-24d52219="" class="el-avatar el-avatar--circle">
            <img :src="BASEURL+defaultUserAvatar" style="object-fit: fill;">
          </span>
        </el-menu-item>
        <el-menu-item index="1" :route="{name:'postList',query:{userId:loginUser.userId}}" v-if="loginFlag">
          <span data-v-24d52219="" class="el-avatar el-avatar--circle">
            <img :src="BASEURL+loginUser.userImgUrl" style="object-fit: fill;">
          </span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import {mapState, mapMutations, mapGetters} from "vuex";

export default {
  name: 'GCHeader',
  data() {
    return {
      activeIndex: '1',
      fit: "fill",
    };
  },
  computed: {
    ...mapState(['BASEURL', 'defaultUserAvatar',  'loginUser']),
    ...mapGetters(['loginFlag'])
  },
  methods: {
    ...mapMutations(['openLoginDialog']),
    handleSelect(key) {
      this.activeIndex = key;
    },
    //单击头像事件
    clickUser() {
      if (this.loginFlag) {
        //已登陆
        this.activeIndex = "0";
      } else {
        //未登录
        this.openLoginDialog();
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.el-avatar {
  margin-left: 23px !important;
}

.border-right-none {
  border-right: 0;
}

.border-bottom-bg {
  border-bottom: solid 1px #2D2F33 !important;
}
</style>