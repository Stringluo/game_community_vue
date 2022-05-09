<template>
  <el-row class="top-30" :gutter="20">
    <el-col :span="17">
      <post-card-list :postCardData="postCardData" @getMoreData="getMoreDate"></post-card-list>
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
  name: "Pub",
  props: ['partitionId'],
  components: {PostCardList},
  mounted() {
    //获取初始化数据
    this.getRootData();
  },
  data() {
    return {
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
        partitionId: Number,
        pageNum: 1,
        postSum: 5,
      },
    }
  },
  computed: {
    ...mapState(['BASEURL'])
  },
  watch: {
    partitionId: function (newValue, oldValue) {
      this.postPage.searchParam = "";
      this.getRootData();
    }
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
      this.postPage.partitionId = this.partitionId;
      //获取轮播图数据
      let result1 = await getNewOfficial();
      if (result1.flag) {
        this.postImgS = result1.data;
      }
      //获取帖子数据
      let result2 = await getPostList(this.postPage);
      if (result2.flag) {
        this.postCardData = result2.data;
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