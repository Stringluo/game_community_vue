<template>
  <div class="comment-content-div">
    <div style="float:left;margin-right: 10px;">
      <g-c-avatar :style="{width: size,height: size}" :src="BASEURL+comment.userImgUrl"></g-c-avatar>
    </div>
    <div class="comment-user-info">
      <p :style="{marginBottom: size,paddingTop: (type==='inner'?0:'10px'),color:(type==='inner'?'#00C3FF':'')}">
        <span @click="toPage({name:'user',query:{userId:comment.userId}})"
              class="user-name">{{ comment.userName }}</span>
        <template v-if="comment.commentParentId!==comment.commentRootParentId">
          <span style="color: #999999">回复 </span>
          <span @click="toPage({name:'user',query:{userId:comment.commentParentUserId}})"
                class="user-name">{{ comment.commentParentName }}</span>
        </template>
      </p>
    </div>
    <div class="comment-content">
      <p>{{ comment.commentContent }}</p>
      <div class="comment-info">
        <div class="comment-info-item item-left">
          <span>{{ getTime(comment.commentCreateTime) }}</span>
        </div>
        <div class="comment-info-item item-right">
          <i class="el-icon-unlike"></i>
        </div>
        <div class="comment-info-item item-right">
          <i :class="{'like-comment':comment.commentLikeFlag}"
             @click="clickLike(comment)"
             class="el-icon-like info-item"></i>
          <span>{{ comment.commentLikesNum }}</span>
        </div>
        <div class="comment-info-item item-right">
          <span>|</span>
        </div>
        <div style="cursor: pointer"
             @click="setFlagTrue(comment.commentId)"
             class="comment-info-item item-right">
          <span>回复</span>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {getTime} from "@/uitls";
import {cancelLikeComment, likeComment} from "@/api";

export default {
  name: "CommentContent",
  props: ['comment', 'type'],
  computed: {
    ...mapState(['BASEURL']),
    size() {
      return this.type === "inner" ? "25px" : "40px";
    }
  },
  methods: {
    ...mapMutations(['toPage']),
    setFlagTrue(commentId) {
      this.$emit("setFlagTrue", commentId);
    },
    clickLike(comment) {
      comment.commentLikeFlag = !comment.commentLikeFlag;
      let action = {
        commentId: comment.commentId,
        actionCategoryId: 1,
      };
      if (comment.commentLikeFlag) {
        //点赞
        comment.commentLikesNum++;
        likeComment(action);
      } else {
        //取消点赞
        comment.commentLikesNum--;
        cancelLikeComment(action);
      }
    },
    getTime(time) {
      return getTime(time);
    }
  }
}
</script>

<style scoped>
.user-name {
  cursor: pointer;
}

.info-item {
  cursor: pointer;
}

.like-comment {
  color: #35D0FF;
}

.item-right {
  float: right;
  width: 40px;
  text-align: center;
  align-content: center;
}

.item-left {
  float: left;
}

.comment-info-item > i {
  margin-right: 5px;
}

.comment-info {
  font-size: 14px;
  color: #CCC;
  margin-top: 30px;
  padding-bottom: 30px;
}

.comment-content {
  margin-left: 50px;
}

.comment-user-info {
  margin: 10px;
  font-size: 16px;
  color: #666;
}
</style>