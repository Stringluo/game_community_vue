<template>
  <el-dialog title="查看评论" :visible.sync="commentDialogVisible"
             width="39%" style="margin-left: -21%"
             @close="closeDialog"
             :destroy-on-close="true"
             :append-to-body="true">
    <comment-content
        style="margin: 10px 30px"
        @setFlagTrue="setFlagTrue"
        :comment="comment"></comment-content>
    <div class="comment-input" style="min-height: 150px" v-show="showComment===comment.commentId">
      <g-c-comment-input :comment="newComment"></g-c-comment-input>
      <el-button @click="commentComment(comment.commentId,comment.commentId,comment.postId)" type="primary"
                 style="margin-top: 10px;float: right; width: 100px">评论
      </el-button>
    </div>
    <el-divider></el-divider>
    <template v-for="childrenComment in childrenComments">
      <comment-content
          style="margin: 10px 30px" :type="'inner'"
          @setFlagTrue="setFlagTrue"
          :comment="childrenComment"></comment-content>
      <div class="comment-input" v-show="showComment===childrenComment.commentId">
        <g-c-comment-input :comment="newComment"></g-c-comment-input>
        <el-button @click="commentComment(comment.commentId,childrenComment.commentId,comment.postId)"
                   type="primary"
                   style="margin-top: 10px;float: right; width: 100px">评论
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {commentComment, getCommentById, getCommentsByPage} from "@/api";
import {isNotEmpty} from "@/uitls";
import CommentContent from "@/components/others/CommentContent";
import GCCommentInput from "@/components/others/GCCommentInput";

export default {
  name: "CommentDialog",
  components: {CommentContent, GCCommentInput},
  data() {
    return {
      page: {
        pageNum: 1,
        commentSum: 5,
        commentId: Number,
      },
      comment: Object,
      childrenComments: [],
      showComment: -1,
      newComment: {
        commentContent: null,
      },
    }
  },
  mounted() {
  },
  beforeDestroy() {
    this.closeDialog();
  },
  watch: {
    showComment: function () {
      this.newComment.commentContent = null;
    },
    commentId: async function (newValue) {
      if (isNotEmpty(newValue)) {
        //获取基础贴子数据
        this.page.commentId = this.commentId;
        this.comment = await this.getComment();
        this.childrenComments = await this.getCommentPage();
      }
    },
  },
  computed: {
    ...mapState(['commentId']),
    commentDialogVisible: {
      get: function () {
        return this.$store.state.commentDialogVisible;
      },
      set: function (val) {
        this.$store.state.commentDialogVisible = val;
      }
    },
  },
  methods: {
    ...mapMutations(['setCommentId']),
    async getComment() {
      let result = await getCommentById(this.page.commentId);
      if (result.flag) {
        return result.data;
      }
    },
    async getCommentPage() {
      let result = await getCommentsByPage(this.page);
      if (result.flag) {
        return result.data;
      }
    },
    closeDialog() {
      this.setCommentId(null);
      this.showComment = -1;
    },
    setFlagTrue(commentId) {
      this.showComment = commentId;
    },
    async commentComment(commentRootParentId, commentParentId, postId) {
      this.newComment.commentRootParentId = commentRootParentId;
      this.newComment.commentParentId = commentParentId;
      this.newComment.postId = postId;
      let result = await commentComment(this.newComment);
      if (result.flag) {
        this.$message.success("评论成功");
        location.reload();
      }
    },
  }
}
</script>

<style scoped>
.comment-input {
  min-height: 150px;
  margin: 10px 30px 10px 70px;
  background-color: #F7F8FC;
  padding: 10px;
}
</style>