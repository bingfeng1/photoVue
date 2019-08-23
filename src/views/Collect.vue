<template>
  <el-container>
    <ImgList :imgListResult="imgListResult" height="800px" :imgWidthList="[12,12,12,6,4]">
      <!-- 这里设置收藏 -->
      <template #bottom="{img}">
        <ImgBotton :img="img">
          <div>{{img.originalname}}</div>
          <Collect :img="img"></Collect>
          <Download :img="img"></Download>
        </ImgBotton>
      </template>
    </ImgList>
  </el-container>
</template>

<script>
import ImgList from "@/components/common/ImgList.vue";
import ImgBotton from "@/components/common/ImgBotton.vue";
import Download from "@/components/common/Download.vue";
import Collect from "@/components/common/Collect.vue";
export default {
  components: {
    ImgList,
    ImgBotton,
    Download,
    Collect
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