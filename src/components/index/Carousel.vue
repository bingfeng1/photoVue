<template>
  <div class="block">
    <!-- 走马灯，拎出来的效果 -->
    <el-carousel ref="carousel">
      <el-carousel-item v-for="(item,index) in imgList" :key="index">
        <el-image style="width: 100%; height: 100%" :src="item" fit="cover"></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props:{
    imgList:Array,
    default:[]
  }
}
</script>