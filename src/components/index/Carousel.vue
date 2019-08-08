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
  data() {
    return {
      imgList: []
    };
  },
  mounted() {
    this.getImgList();
  },
  methods: {
    // 通过后台，拿到图片列表
    getImgList() {
      this.$http.get("/image/carousel").then(res => {
        let result = res.data;
        // 直接使用地址不成功
        result = result.map(v => require(`@/assets/image/${v}`));
        this.imgList = result;
        // this.$nextTick(this.computedImgHeight)
      });
    },
    // 计算走马灯的高度（图片都是16:9的）
    computedImgHeight() {
      let carouselDom = this.$refs.carousel;
      let width = carouselDom.$el.clientWidth;
      let height = (width / 16) * 9;
      if (height > 500) {
        height = 500;
      }
      carouselDom.$el.style.height = height + "px";
      for (let i in carouselDom.$children) {
        carouselDom.$children[i].$el.style.height = height + "px";
      }
    }
  }
};
</script>