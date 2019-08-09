<template>
  <div class="hideScroll" :style="{maxWidth:maxWidth}">
    <el-row class="showImgs">
      <el-col v-for="(url,index) in urls" :key="index" :span="span" :style="{minHeight:height}">
        <!-- 尝试使用懒加载，但失败了，明天再试一下 -->
        <!-- <el-image :src="url.image_url" lazy @error="toAlert">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
        </el-image>-->
        <img v-lazy="url.image_url"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    span: Number,
    height:String,
    maxWidth:String
  },
  data() {
    return {
      urls: [],
    };
  },
  mounted() {
    this.getImgList();
    this.$Lazyload.$on("loaded", function({ el, naturalHeight, error }) {
      if (naturalHeight == 1) {
        el.src = error;
      }
    });
  },
  methods: {
    getImgList() {
      this.$http.get("/image/allImage").then(res => {
        let result = res.data;
        this.urls = result;
      });
    },
    toAlert() {
      alert("error");
    }
  }
};
</script>


<style lang="scss" scoped>
::-webkit-scrollbar {
    display: none;
}

.showImgs {
  height: 400px;
  overflow: auto;
}
.el-col {
  padding: 20px;
}
img {
  width: 100%;
  object-fit: contain;
}
img[lazy=loading] {
  width: 20px;
}
</style>
