<template>
  <div class="gc-operate">
    <div class="header">
      <el-row type="flex" justify="center">
        <el-col :span="7">
          <img src="../assets/img/logo.png"/>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
    <div class="footer">
      <g-c-footer></g-c-footer>
    </div>
  </div>
</template>
<script>
import GCFooter from "@/components/GCFooter";

export default {
  name: "Operate",
  components: {
    GCFooter,
  }
}
</script>

<style scoped>
.gc-operate {
  background-color: #EAEAEA;
}

</style>