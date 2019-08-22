<template>
  <el-container>
    <ImgList :imgListResult="imgListResult" height="800px" :imgWidthList="[12,12,12,6,4]">
      <!-- 这里设置收藏 -->
      <template #bottom="{img}"></template>
    </ImgList>
  </el-container>
</template>

<script>
import ImgList from "@/components/common/ImgList.vue";
export default {
  components: {
    ImgList
  },
  data() {
    return {
      imgListResult: []
    };
  },
  methods: {
    getImgList() {
      this.$http_token.get("/user/collect").then(res => {
        let result = res.data;
        this.imgListResult = result;
      });
    }
  },
  activated() {
    this.getImgList();
  },
  mounted() {
    this.getImgList();
  }
};
</script>