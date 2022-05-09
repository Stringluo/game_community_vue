<template>
  <div class="comment-cards">
    <el-card class="box-card" :body-style="{ padding: 0 }">
      <div slot="header" class="clearfix comment-content-item" v-if="isNotEmpty(title)">
        <span>{{ title }}</span>
      </div>
      <el-card class="no-comment" v-show="commentCardData.length===0" shadow="never">
        <p>暂时没有评论哦</p>
      </el-card>
      <el-card :body-style="{padding: '24px 50px',border: '#F0F1F5 solid 1px'}"
               v-for="comment in commentCardData"
               class="box-card" shadow="never" style="border: 0">
        <comment-content :comment="comment" @setFlagTrue="setFlagTrue"></comment-content>
        <div class="children-comment" v-show="comment.commentBriefs.length>0||showComment===comment.commentId">
          <div style="min-height: 150px" v-show="showComment===comment.commentId">
            <g-c-comment-input :comment="newComment"></g-c-comment-input>
            <el-button @click="commentComment(comment.commentId,comment.commentId,comment.postId)" type="primary"
                       style="margin-top: 10px;float: right; width: 100px">评论
            </el-button>
          </div>
          <template v-for="childrenComment in comment.commentBriefs">
            <comment-content @setFlagTrue="setFlagTrue"
                             :comment="childrenComment" :type="'inner'">
              <div style="min-height: 150px" v-show="showComment===childrenComment.commentId">
                <g-c-comment-input :comment="newComment"></g-c-comment-input>
                <el-button @click="commentComment(comment.commentId,childrenComment.commentId,comment.postId)"
                           type="primary"
                           style="margin-top: 10px;float: right; width: 100px">评论
                </el-button>
              </div>
            </comment-content>
          </template>
          <div style="text-align: center;color: #999999;font-size: 14px"
               v-if="comment.commentChildrenNum>2">
            <span @click="showAllComments(comment.commentId)" style="cursor: pointer">查看全部{{ comment.commentChildrenNum }}条评论
              <i class="el-icon-arrow-right"></i></span>
          </div>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import CommentContent from "@/components/others/CommentContent";
import {mapState,mapMutations} from "vuex";
import {isNotEmpty, getTime} from "@/uitls";
import GCCommentInput from "@/components/others/GCCommentInput";
import {commentComment} from "@/api";

export default {
  name: "CommentCardList",
  props: ['commentCardData', 'title', 'post'],
  computed: {
    ...mapState(['BASEURL'])
  },
  data() {
    return {
      showComment: -1,
      newComment: {
        commentContent: null,
      },
    }
  },
  watch: {
    showComment: function () {
      this.newComment.commentContent = null;
    }
  },
  components: {
    GCCommentInput,
    CommentContent,
  },
  methods: {
    ...mapMutations(['openCommentDialog']),
    showAllComments(commentId){
      this.openCommentDialog(commentId);
    },
    setFlagTrue(commentId) {
      this.showComment = commentId;
    },
    async commentComment(commentRootParentId, commentParentId, postId) {
      this.newComment.commentRootParentId = commentRootParentId;
      this.newComment.commentParentId = commentParentId;
      this.newComment.postId = this.post.postId;
      let result = await commentComment(this.newComment);
      if (result.flag) {
        this.$message.success("评论成功");
        location.reload();
      }
    },
    isNotEmpty(data) {
      return isNotEmpty(data);
    },
    getTime(time) {
      return getTime(time);
    }
  }
}
</script>

<style scoped>
.children-comment {
  background-color: #F7F8FC;
  margin-left: 50px;
  padding: 20px 10px;
}

.box-card {
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
}

.no-comment {
  align-content: center;
  color: #999999;
  font-size: 14px;
  text-align: center;
}

.comment-content-item {
  padding: 5px 30px;
}
</style>