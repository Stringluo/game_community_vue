<template>
  <users-card-list :title="isLoginUser(userId) ? '我的粉丝' : '粉丝'"
                   :noDataMsg="isLoginUser(userId) ? '还没有人关注您呦~' : '该用户还没有粉丝'"
                   :userCardData="userCardData"></users-card-list>
</template>

<script>

import UsersCardList from "@/components/UsersCardList";
import {getUserFans} from "@/api";
import {mapState} from "vuex";

export default {
  name: "FansList",
  props: ['userId'],
  components: {UsersCardList},
  mounted() {
    this.initUserList();
  },
  computed: {
    ...mapState(['loginUser']),
  },
  data() {
    return {
      userCardData: [],
    }
  },
  methods: {
    async initUserList() {
      let result = await getUserFans(this.userId);
      if (result.flag) {
        this.userCardData = result.data;
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