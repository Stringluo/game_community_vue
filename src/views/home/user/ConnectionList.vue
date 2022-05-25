<template>
  <post-card-list :isAllPost="isAllPost" :title="isLoginUser(userId) ? '我的收藏' : '收藏'" :postCardData="postCardData"
                  @getMoreData="getMoreDate"></post-card-list>
</template>

<script>
import PostCardList from "@/components/PostCardList";
import {mapState} from "vuex";
import {isNotEmpty} from "@/uitls";
import {getPostList} from "@/api";

export default {
  name: "ConnectionList",
  props: ['userId'],
  components: {
    PostCardList,
  },
  data() {
    return {
      isAllPost: false,
      postCardData: [],
      postPage: {
        pageNum: 1,
        postSum: 5,
        userId: Number,
      }
    }
  },
  computed: {
    ...mapState(['loginUser'])
  },
  watch: {
    userId: function (newValue, oldValue) {
      if (isNotEmpty(newValue)) {
        this.initPostList();
      }
    }
  },
  mounted() {
    this.initPostList();
  },
  methods: {
    async initPostList() {
      this.postPage.actionUserId = this.userId;
      this.postPage.actionCategoryId = 2;
      let result = await getPostList(this.postPage);
      if (result.flag) {
        this.postCardData = result.data;
        if (this.postCardData.length < 5) {
          this.isAllPost = true;
        } else {
          this.isAllPost = false;
        }
      }
    },
    async getMoreDate() {
      this.postPage.pageNum++;
      let result = await getPostList(this.postPage);
      if (result.flag) {
        this.postCardData = this.postCardData.concat(result.data);
        if (result.data.length < 5) {
          this.isAllPost = true;
        } else {
          this.isAllPost = false;
        }
      }
    },
    isLoginUser(userId) {
      return this.loginUser.userId === userId;
    }
  }
}
</script>

<style scoped>

</style>