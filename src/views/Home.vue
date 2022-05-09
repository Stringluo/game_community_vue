<template>
  <div class="gc-home">
    <div class="header">
      <g-c-header></g-c-header>
    </div>
    <el-row class="content" type="flex" justify="center">
      <el-col class="home-child" :span="16">
        <router-view></router-view>
      </el-col>
    </el-row>
    <div class="footer">
      <g-c-footer></g-c-footer>
    </div>
  </div>
</template>

<script>
import GCHeader from "@/components/GCHeader";
import GCFooter from "@/components/GCFooter";
import LoginDialog from "@/components/dialog/LoginDialog";

export default {
  name: "Home",
  components: {
    GCHeader,
    GCFooter,
    LoginDialog
  },
  methods: {}
}
</script>

<style scoped>
.header {
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1500;
  position: fixed;
  background-color: #2D2F33;
}

.content {
  margin-top: 61px;
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: #F0F1F5;
  min-height: 700px;
}
</style>