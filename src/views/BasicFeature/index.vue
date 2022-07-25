<template>
  <div class="view_container">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  // 挂载基本功能视图时显示副导航栏
  mounted() {
    this.$store.dispatch('showSubNav')
  },
  beforeDestroy() {
        this.$store.dispatch("clearArrAll")
    },
}
</script>

<style lang="less" scoped>
    .view_container{
      width:9.5333rem ;
      height: 8rem;
      margin: 0.2rem auto 0;
    }
</style>