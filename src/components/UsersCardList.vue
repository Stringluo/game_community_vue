<template>
  <div class="user-cards">
    <el-card class="post-list box-card" :body-style="{ padding: 0 }">
      <div slot="header" class="clearfix" v-if="isNotEmpty(title)">
        <span>{{ title }}</span>
      </div>
      <el-card class="no-post" v-show="userCardData.length===0">
        <img width="200px" src="../assets/img/noPost.png"/>
        <p>{{ noDataMsg }}</p>
      </el-card>
      <el-card :body-style="{padding: '24px 30px',border: '#F0F1F5 solid 1px'}"
               v-for="user in userCardData"
               :key="user.userId"
               class="box-card" shadow="never" style="border: 0">
        <div class="post-user"
             @mouseenter="changeOnMouseId(user.userId)"
             @mouseleave="changeOnMouseId(-1)"
             @click="toPage({name:'user', query: {userId: user.userId}})">
          <el-avatar :size="50" :src="BASEURL+user.userImgUrl"></el-avatar>
          <p :class="{'on-mouse': (onMouseId===user.userId)}"
             style="margin-left: 10px;font-size: 14px">{{ user.userName }}
            <br><span style="color: #999999;font-size: 12px">{{ user.userSign }}</span>
          </p>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>

import {isNotEmpty} from '@/uitls';
import {mapState, mapMutations} from 'vuex';

export default {
  name: "UsersCardList",
  props: ["userCardData", "title", "noDataMsg"],
  computed: {
    ...mapState(['BASEURL']),
  },
  data() {
    return {
      onMouseId: -1,
    }
  },
  methods: {
    ...mapMutations(['toPage']),
    isNotEmpty(data) {
      return isNotEmpty(data);
    },
    changeOnMouseId(val) {
      this.onMouseId = val;
    },
  }
}
</script>

<style scoped>
.clickable-flag {
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