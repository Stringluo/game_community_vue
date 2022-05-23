<template>
  <el-row class="top-30" :gutter="20">
    <el-col :span="17">
      <el-carousel :interval="4000" type="card" height="185px">
        <el-carousel-item v-for="postImg in postImgS" :key="postImg.postImgId">
          <a @click="toPage({name:'post',query:{postId:postImg.postId}})">
            <el-image
                style="width: 100%; height: 100%"
                :src="BASEURL+postImg.postImgUrl"></el-image>
          </a>
        </el-carousel-item>
      </el-carousel>
      <post-card-list :isAllPost="isAllPost" :postCardData="postCardData" @getMoreData="getMoreDate"></post-card-list>
    </el-col>
    <el-col :span="7">
      <el-card class="box-card release-card">
        <h4>搜索</h4>
        <el-divider></el-divider>
        <el-input placeholder="请输入内容" v-model="postPage.searchParam" class="input-with-select">
          <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-card>
      <el-card class="box-card release-card" style="margin-top: 200px">
        <h4>发布</h4>
        <el-divider></el-divider>
        <el-button icon="el-icon-edit" type="primary"
                   @click="toPage({name:'newPost'})">发布帖子
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
        <p class="release-text">讨论、分析、攻略、同人文</p>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import PostCardList from "@/components/PostCardList";
import {getNewOfficial, getPostList} from "@/api";

export default {
  name: "Index",
  components: {PostCardList},
  mounted() {
    //获取初始化数据
    this.getRootData();
  },
  data() {
    return {
      isAllPost: false,
      fullscreenLoading: false,
      //轮播图数据
      postImgS: [
        {
          postId: "",
          postImgUrl: "",
          postImgId: "",
        }
      ],
      //帖子数据
      postCardData: [
        {
          userId: "",
          userName: "",
          userImgUrl: "",
          postCreateTime: "",
          postEditTime: "",
          partitionId: "",
          postTitle: "",
          postAbbreviation: "",
          postImgUrls: [],
          postImgCount: "",
          postLooksNum: "",
          postLikesNum: "",
          postCommentsNum: "",
          postCollectionsNum: "",
        }
      ],
      postPage: {
        searchParam: null,
      },
    }
  },
  computed: {
    ...mapState(['BASEURL'])
  },
  methods: {
    ...mapMutations(['toPage']),
    async search() {
      //初始化数据
      const loading = this.openLoad();
      this.postPage.postSum = 5;
      this.postPage.pageNum = 1;
      //获取帖子数据
      let result = await getPostList(this.postPage);
      if (result.flag) {
        this.postCardData = result.data;
        loading.close();
      }
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
    //获取初始化数据
    async getRootData() {
      const loading = this.openLoad();
      this.postPage.postSum = 5;
      this.postPage.pageNum = 1;
      //获取轮播图数据
      let result1 = await getNewOfficial();
      if (result1.flag) {
        this.postImgS = result1.data;
      }
      //获取帖子数据
      let result2 = await getPostList(this.postPage);
      if (result2.flag) {
        this.postCardData = result2.data;
        if (this.postCardData.length < 5) {
          this.isAllPost = true;
        } else {
          this.isAllPost = false;
        }
      }
      if (result1.flag && result2.flag) {
        loading.close();
      }
    },
    //加载更多帖子数据
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
    }
  },
}
</script>

<style scoped>
.release-text {
  margin-top: 10px;
  font-size: 8px;
}

.release-card {
  position: fixed;
  width: 280px;
  align-content: center;
  text-align: center;
  padding-bottom: 10px;
}

.top-30 {
  margin-top: 30px;
}

</style>