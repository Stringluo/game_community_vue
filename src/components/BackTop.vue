<template>
  <el-backtop :right="180" :bottom="250">
    <div class="back-top">
      <img src="@/assets/img/backTop.png"/>
    </div>
  </el-backtop>
</template>

<script>
export default {
name: "BackTop"
}
</script>

<style scoped>
.back-top>img {
  width: 102px;
}
</style>