<template>
  <div class="post-cards">
    <el-card class="post-list box-card" :body-style="{ padding: 0 }">
      <div slot="header" class="clearfix" v-if="isNotEmpty(title)">
        <span>{{ title }}</span>
      </div>
      <el-card class="no-post" v-show="postCardData.length===0">
        <img width="200px" src="../assets/img/noPost.png"/>
        <p>暂时没有帖子哦</p>
      </el-card>
      <el-card :body-style="{padding: '24px 30px',border: '#F0F1F5 solid 1px'}"
               v-for="post in postCardData"
               :key="post.postId"
               class="box-card" shadow="never" style="border: 0">
        <div class="post-header display-flex">
          <div class="post-user"
               @mouseenter="changeOnMouseId(post.postId)"
               @mouseleave="changeOnMouseId(-1)"
               @click="toPage({name:'user', query: {userId: post.userId}})">
            <g-c-avatar :src="BASEURL+post.userImgUrl"></g-c-avatar>
            <span :class="{'on-mouse': (onMouseId===post.postId)}"
                  style="margin-left: 10px;font-size: 14px">{{ post.userName }}</span>
          </div>
          <span style="margin-left: 10px;font-size: 12px; color: #CCCCCC">
            {{ getTime(post.postCreateTime) }} • {{ getPartitionName(post.partitionId) }}</span>
        </div>
        <div style="cursor: pointer"
             @mouseenter="changeOnMousePostId(post.postId)"
             @mouseleave="changeOnMousePostId(-1)"
             @click="toPage({name:'post', query: {postId: post.postId}})">
          <div class="post-title display-flex">
          <span style="background-color: #00C3FF; color: #FFFFFF" v-show="post.partitionId===3">
            <strong>&nbsp;{{ getPartitionName(post.partitionId) }}&nbsp;</strong></span>
            <h3 :class="{'on-mouse': (onMousePostId===post.postId)}">{{ post.postTitle }}</h3>
          </div>
          <div class="post-content">
            <span>{{ post.postAbbreviation }}</span>
          </div>
          <div class="post-img" v-if="isNotEmpty(post.postImgUrls.length)&&post.postImgUrls.length>0">
            <div v-for="(imgUrl,index) in ((post.postImgUrls.length<=3)?post.postImgUrls:post.postImgUrls.slice(0,3))"
                 :class="{'float-left': index!==(post.postImgUrls.length>3?2:post.postImgUrls.length-1)}"
                 style="position: relative"
                 :index="index">
              <el-image
                  style="width: 120px; height: 120px"
                  :src="BASEURL+imgUrl"
                  fit="cover"></el-image>
              <div
                  style="color: #FFFFFF;width: 40px;position: absolute;z-index: 1500;background-color: rgba(0,0,0,.5);margin: -26px 330px"
                  v-show="post.postImgUrls.length>3&&index===2">
                <i class="el-icon-picture"></i>+{{ post.postImgUrls.length }}
              </div>
            </div>
          </div>
        </div>
        <div class="post-data">
          <div class="post-looks">
            <i class="el-icon-view"></i>&nbsp;{{ post.postLooksNum }}
          </div>
          <div class="post-comments">
            <i class="el-icon-chat-dot-round"></i>&nbsp;{{ post.postCommentsNum }}
          </div>
          <div class="post-likes">
            <i @click="clickLike(post)" class="el-icon-like clickable"
               :class="{'liked':post.postLikeFlag,'clickable-flag':!clickable}"></i>&nbsp;
            {{ post.postLikesNum }}
          </div>
        </div>
      </el-card>
      <el-card v-show="postCardData.length!==0">
        <el-link
            @click="getMorePostData" :disabled="isAllPost"
            type="primary" :underline="false" style="width: 20%;margin-left: 40%">
          {{getMorePostText}}
        </el-link>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {getTime, getPartitionName, isNotEmpty} from "@/uitls";
import {likePost, cancelLikePost} from "@/api";

export default {
  name: "PostCard",
  props: ["postCardData", "title" ,"isAllPost"],
  computed: {
    ...mapState(['BASEURL', 'defaultUserAvatar', 'loginUser']),
    getMorePostText: {
      get: function (){
        return this.isAllPost ? "已经到底了" : "点击加载更多";
      }
    }
  },
  data() {
    return {
      hasBlurFlag: false,
      onMouseId: -1,
      onMousePostId: -1,
      action: {},
      clickable: true,
    }
  },
  methods: {
    ...mapMutations(['toPage']),
    async clickLike(post) {
      post.postLikeFlag = !post.postLikeFlag;
      this.clickable = false;
      this.action.postId = post.postId;
      this.action.actionCategoryId = 1;
      let result;
      if (post.postLikeFlag) {
        post.postLikesNum++;
        result = await likePost(this.action);
      } else {
        post.postLikesNum--;
        result = await cancelLikePost(this.action);
      }
      this.clickable = true;
    },
    isNotEmpty(data) {
      return isNotEmpty(data);
    },
    hasBlur() {
      this.hasBlurFlag = true;
    },
    changeOnMouseId(val) {
      this.onMouseId = val;
    },
    changeOnMousePostId(val) {
      this.onMousePostId = val;
    },
    getTime(createTime) {
      return getTime(createTime);
    },
    getPartitionName(partitionId) {
      return getPartitionName(partitionId);
    },
    getMorePostData() {
      this.$emit("getMoreData");
    },
    isLogin(userId) {
      return this.loginUser.userId === userId;
    }
  }
}
</script>

<style scoped>
.clickable-flag{
  cursor: default;
  pointer-events: none;
}
.clickable {
  cursor: pointer;
}

.liked {
  color: #35D0FF;
}

.no-post {
  align-content: center;
  color: #999999;
  font-size: 14px;
  text-align: center;
  min-height: 400px;
  padding-top: 150px;
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

.float-left {
  float: left;
  margin-right: 5px;
}

.post-img {
  margin: 10px 0;
}

.post-content {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  color: #999999;
}

.post-title {
  margin: 10px 0 10px;
}

.display-flex {
  display: flex;
  align-items: center;
}

.post-user {
  display: flex;
  align-items: center;
  cursor: pointer
}

.on-mouse {
  color: #00C3FF;
}
</style>