<template>
  <el-input
      type="textarea"
      :autosize="{ minRows: 4 }"
      maxlength="1000"
      placeholder="请开始你的表演..."
      show-word-limit
      v-model="comment.commentContent">
  </el-input>
</template>

<script>
export default {
  name: "GCCommentInput",
  props: ['comment'],
  data() {
    return {
      /*commentContent: "",*/
    }
  }

}
</script>

<style scoped>

</style>