<template>
  <users-card-list :title="isLoginUser(userId) ? '我的关注' : '关注'"
                   :noDataMsg="isLoginUser(userId) ? '您还没有关注呦~' : '该用户还没有关注'"
                   :userCardData="userCardData"></users-card-list>
</template>

<script>
import UsersCardList from "@/components/UsersCardList";
import {mapState} from "vuex";
import {getUserFocus} from "@/api";

export default {
  name: "FocusList",
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
      let result = await getUserFocus(this.userId);
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