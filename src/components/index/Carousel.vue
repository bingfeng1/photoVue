<template>
  <div class="block">
    <!-- 走马灯，拎出来的效果 -->
    <el-carousel ref="carousel" height="40vh">
      <el-carousel-item v-for="(item,index) in carousel" :key="index">
        <el-image style="padding:0px 5vw" :src="item" fit="cover"></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: {
    carousel: {
      typt: Array,
      default: []
    }
  }
};
</script>

<style lang="scss" scoped>
.el-image {
  background: rgba(0, 0, 0, 0.842);
}
</style>