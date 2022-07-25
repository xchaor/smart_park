<template>
<!-- 顶部Header组件 -->
  <div class="header">
    <div class="main_title">
        智慧园区数字孪生平台
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
    .header{
      position: absolute;
        display: grid;
        //固定在容器上方
        top: 0;
        justify-items: center;
        width: 100%;
        height: 1.92rem;
        //黑色半透明渐变背景
        background-image: linear-gradient(180deg,rgba(1,1,1,.8),rgba(0,0,0,0));
        .main_title{
          width: 8.4533rem;
          height: 1.92rem;
          background: url(@/assets/images/title.png);
          background-size: contain;
          font-size: .48rem;
          color: #FFFFFF;
          text-align: center;
          line-height: 2.2rem;
          letter-spacing: .0533rem;
          
        }
    }
</style>