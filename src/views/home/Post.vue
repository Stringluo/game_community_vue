<template>
  <div class="gc-post">
    <el-dialog
        title="管理"
        :visible.sync="centerDialogVisible"
        width="30%"
        top="30vh"
        center>
      <el-radio v-model="operate" label="edit">编辑</el-radio>
      <el-radio v-model="operate" label="del">删除</el-radio>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false;operatePost(post.postId);">确 定</el-button></span>
    </el-dialog>
    <el-dialog
        title="提示"
        :visible.sync="deleteDialogVisible"
        width="30%"
        top="30vh"
        center>
      <div style="width: 100%;align-content: center;text-align: center">
        <span>确定要删除该帖吗？</span>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="deleteDialogVisible = false;delPost(post.postId);">确 定</el-button></span>
    </el-dialog>
    <el-row :gutter="20">
      <div class="post-info-flex">
        <el-card :body-style="{border: '#F0F1F5 solid 1px',color: '#999999',fontSize: '14px'}"
                 shadow="never" style="border: 0">
          <i class="el-icon-chat-dot-round post-info-icon"></i>
          <br>{{ post.postCommentsNum }}
        </el-card>
        <el-card :body-style="{border: '#F0F1F5 solid 1px',color: '#999999',fontSize: '14px'}"
                 shadow="never" style="border: 0">
          <i @click="clickCollection(post)" :class="{'flag-true':flag.collection}"
             class="el-icon-star-off post-info-icon"></i>
          <br>{{ post.postCollectionsNum }}
        </el-card>
        <el-card :body-style="{border: '#F0F1F5 solid 1px',color: '#999999',fontSize: '14px'}"
                 shadow="never" style="border: 0">
          <i @click="clickLike(post)" :class="{'flag-true':flag.like}"
             class="el-icon-like post-info-icon"></i>
          <br>{{ post.postLikesNum }}
        </el-card>
        <el-card v-if="post.userId===loginUser.userId"
                 :body-style="{border: '#F0F1F5 solid 1px',color: '#999999',fontSize: '14px'}"
                 shadow="never" style="border: 0">
          <i @click="clickSetting(post)"
             class="el-icon-setting post-info-icon"></i>
        </el-card>
      </div>
      <el-col :span="17">
        <!--        正文内容-->
        <el-card :style="{padding: '30px'}">
          <h2>{{ post.postTitle }}</h2>
          <div class="post-info">
            来自板块：<span style="color: #FFAA00">{{ getPartitionName(post.partitionId) }}</span>
            <div class="post-data">
              <div class="post-looks">
                <i class="el-icon-view"></i>&nbsp;{{ post.postLooksNum }}
              </div>
              <div class="post-comments">
                <i class="el-icon-chat-dot-round"></i>&nbsp;{{ post.postCommentsNum }}
              </div>
              <div class="post-likes">
                <i class="el-icon-like"></i>&nbsp;
                {{ post.postLikesNum }}
              </div>
              <div class="post-collections">
                <i class="el-icon-star-off"></i>&nbsp;
                {{ post.postCollectionsNum }}
              </div>
            </div>
          </div>
          <div class="post-time">
            文章发表：{{ getTime(post.postCreateTime) }}
            <span v-show="post.postCreateTime!==post.postEditTime">
              |&em最后编辑：{{ getTime(post.postEditTime) }}</span>
          </div>
          <div class="post-article" v-html="post.postArticle"></div>
          <el-divider></el-divider>
          <div class="post-bottom-infos">
            <el-row type="flex" justify="center">
              <el-col :span="7" class="post-bottom-info">
                <i @click="clickLike(post)"
                   :class="{'flag-true':flag.like,'clickable':!clickable.like}"
                   class="el-icon-like icon-item"></i>&nbsp;<span>{{ post.postLikesNum }}</span>
              </el-col>
              <el-col :span="7" class="post-bottom-info">
                <i @click="clickCollection(post)"
                   :class="{'flag-true':flag.collection,'clickable':!clickable.collection}"
                   class="el-icon-star-off icon-item"></i>&nbsp;<span>{{ post.postCollectionsNum }}</span>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <!--        评论框-->
        <el-card :style="{padding: '15px 30px'}"
                 style="margin: 30px 0;color: #CCCCCC;font-size: 14px">
          <span>看帖是喜欢，评论才是真爱：</span>
          <div style="margin: 20px 0">
            <g-c-comment-input :comment="comment"></g-c-comment-input>
          </div>
          <el-button @click="commentPort" type="primary" style="float: right; width: 100px">评论</el-button>
        </el-card>
        <!--        评论内容展示-->
        <comment-card-list :post="post" :commentCardData="comments" :title="'全部评论'"></comment-card-list>
        <!--        全部帖子展示弹窗帖子-->
        <comment-dialog></comment-dialog>
      </el-col>
      <el-col :span="7">
        <div style="position: fixed;width: 280px;">
          <el-card :body-style="{margin: '15px'}">
            <div class="user-avatar">
              <g-c-avatar :src="BASEURL+user.userImgUrl"></g-c-avatar>
            </div>
            <div class="user-info">
              <span style="font-size: 16px"><strong>{{ user.userName }}</strong></span>
              <div class="user-sign">{{ user.userSign }}</div>
              <el-button style="margin-top: 10px;width: 100px" type="primary"
                         :disabled="!clickable.focus"
                         @click="toPage({name:'editUser',query:{userId:user.userId}})" plain
                         v-show="isLogin(user.userId)">编辑
              </el-button>
              <el-button style="margin-top: 10px;width: 100px" type="primary"
                         :disabled="!clickable.focus"
                         @click="focusUser(user.userId)"
                         plain v-show="!isLogin(user.userId)&&!flag.likeUser">关注
              </el-button>
              <el-button style="margin-top: 10px;width: 100px"
                         :disabled="!clickable.focus"
                         @click="cancelFocusUser(user.userId)"
                         plain v-show="!isLogin(user.userId)&&flag.likeUser">已关注
              </el-button>
            </div>
            <div style="width: 100px;height: 90px">
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {getPostData, commentPost, cancelLikePost, likePost, deletePost} from "@/api";
import {collectionPost, cancelCollectionPost, focusUser, cancelFocusUser} from "@/api";
import {getTime, getPartitionName, isNotEmpty} from "@/uitls";
import GCCommentInput from "@/components/others/GCCommentInput";
import CommentCardList from "@/components/CommentCardList";
import CommentDialog from "@/components/dialog/CommentDialog";

export default {
  name: "Post",
  props: ["postId"],
  components: {GCCommentInput, CommentCardList, CommentDialog},
  async mounted() {
    const loading = this.openLoad();
    this.postPage.postId = this.postId;
    let result = await getPostData(this.postPage);
    if (result.flag) {
      this.post = result.data.post;
      this.user = result.data.user;
      this.comments = result.data.comments;
      if (isNotEmpty(result.data.flag)) {
        this.flag = result.data.flag;
      }
      loading.close();
    }
    this.initComment();
  },
  data() {
    return {
      operate: "edit",
      centerDialogVisible: false,
      deleteDialogVisible: false,
      postPage: {
        pageNum: 1,
        commentSum: 5,
      },
      post: {},
      user: {},
      comments: [],
      comment: {
        commentContent: "",
      },
      flag: {
        like: false,
        collection: false,
        likeUser: false,
      },
      action: {},
      clickable: {
        like: true,
        collection: true,
        focus: true,
      },
    }
  },
  computed: {
    ...mapState(['BASEURL', 'loginUser'])
  },
  methods: {
    ...mapMutations(['toPage']),
    operatePost(postId) {
      if (this.operate === "edit") {
        this.editPost(postId);
      } else if (this.operate === "del") {
        this.deleteDialogVisible = true;
      }
    },
    editPost(postId) {
      this.toPage({name:"newPost",query:{editPostId:postId}});
    },
    async delPost(postId) {
      let result = await deletePost(postId);
      if(result.flag){
        //删除成功
        this.toPage({name:"index"})
        this.$message({
          message: '删除成功',
          type: 'success'
        });
      }else {
        this.$message.error('删除失败');
      }
    },
    clickSetting() {
      this.centerDialogVisible = true;
    },
    openLoad() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255)'
      });
      return loading;
    },
    isLogin(userId) {
      return this.loginUser.userId === userId;
    },
    async focusUser(focusUserId) {
      this.clickable.focus = false;
      if (!this.flag.likeUser) {
        this.flag.likeUser = !this.flag.likeUser;
        await focusUser(focusUserId);
      }
      this.clickable.focus = true;
    },
    async cancelFocusUser(focusUserId) {
      this.clickable.focus = false;
      if (this.flag.likeUser) {
        this.flag.likeUser = !this.flag.likeUser;
        await cancelFocusUser(focusUserId);
      }
      this.clickable.focus = true;
    },
    async clickCollection(post) {
      this.clickable.collection = false;
      this.flag.collection = !this.flag.collection;
      this.action.postId = post.postId;
      this.action.actionCategoryId = 2;
      let result;
      if (this.flag.collection) {
        post.postCollectionsNum++;
        result = await collectionPost(this.action);
      } else {
        post.postCollectionsNum--;
        result = await cancelCollectionPost(this.action);
      }
      this.clickable.collection = false;
    },
    async clickLike(post) {
      this.clickable.like = false;
      this.flag.like = !this.flag.like;
      this.action.postId = post.postId;
      this.action.actionCategoryId = 1;
      let result;
      if (this.flag.like) {
        post.postLikesNum++;
        result = await likePost(this.action);
      } else {
        post.postLikesNum--;
        result = await cancelLikePost(this.action);
      }
      this.clickable.like = true;
    },
    initComment() {
      this.comment.postId = this.post.postId;
    },
    /*不会递归*/
    /*挂载在vue实例上的方法，调用时需要使用vue实例调用*/
    getTime(createTime) {
      /*vue实例中的js内的方法，调用时需要使用window调用*/
      return getTime(createTime);
    },
    getPartitionName(partitionId) {
      return getPartitionName(partitionId)
    },
    async commentPort() {
      let result = await commentPost(this.comment);
      if (result.flag) {
        this.$message.success("评论成功");
        this.comments = new Array(result.data).concat(this.comments);
        location.reload();
      }
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: default;
  pointer-events: none;
}

.icon-item {
  cursor: pointer;
}

.flag-true {
  color: #35D0FF;
}

.post-bottom-info {
  text-align: center;
  font-size: 14px;
  color: #999999;
}

.post-bottom-info i {
  font-size: 28px;
}

.el-avatar--small {
  width: 78px !important;
  height: 78px !important;
}

.user-info, .user-avatar {
  float: left;
}

.user-info {
  width: 100px;
  margin-left: 10px;
}

.user-sign {
  font-size: 12px;
  color: #999999;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-info-icon {
  cursor: pointer;
  font-size: 35px;
  margin-bottom: 10px;
}

.post-info-flex {
  width: 90px;
  height: 260px;
  position: fixed;
  margin-left: -100px;
  text-align: center;
  color: #999999;
  font-size: 14px;
}

.post-article >>> img {
  width: 100%;
  object-fit: cover;
}

.post-article >>> p {
  margin-top: 10px;
}

.post-time {
  text-align: center;
  align-content: center;
  color: #999999;
  font-size: 14px;
  margin: 20px 0;
}

.post-info {
  background-color: #F7F8FC;
  color: #999999;
  font-size: 14px;
  padding: 10px;
  margin: 10px 0;
}

.post-data {
  float: right;
}

.post-data > div {
  float: left;
  color: #CCCCCC;
  width: 80px;
  font-size: 14px;
}

.post-data > div > i {
  font-size: 16px;
}
</style>