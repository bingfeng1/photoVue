<template>
  <div class="hideScroll fixCenter" :style="{maxWidth:maxWidth,width:width}">
    <el-row class="showImgs" :style="{height:height}">
      <el-col
        style="minHeight: 10vh"
        :xs="imgWidthList[0]"
        :sm="imgWidthList[1]"
        :md="imgWidthList[2]"
        :lg="imgWidthList[3]"
        :xl="imgWidthList[4]"
        v-for="(img,index) in imgLists"
        :key="index"
      >
        <el-card :body-style="{padding:'3px'}" shadow="hover">
          <el-image :src="img.url" lazy @error="getError()" :preview-src-list="[img.url]">
            <div slot="error" class="image-slot">
              <img :src="errPath" width="100%" />
            </div>
          </el-image>
          <slot name="bottom" :img="img"></slot>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    maxWidth: String,
    imgListResult: Array,
    width: {
      type: String,
      default: "100%"
    },
    imgWidthList: {
      type: Array,
      default() {
        return [24, 24, 24, 8, 6];
      },
      validator(value) {
        return value.length === 5;
      }
    },
    height:{
      type:String,
      default:'500px'
    }
  },
  computed: {
    imgLists() {
      // 直接添加url属性，这个方式更好
      for (let v of this.imgListResult) {
        v.url = `${this.$http.defaults.baseURL}/${v.filename}`;
      }
      return this.imgListResult;
    }
  },
  methods: {
    getError(err) {
      this.$emit("error", err);
    }
  },
  data() {
    return {
      errPath: require("@/assets/imgload/err.png")
    };
  }
};
</script>


<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}

.fixCenter {
  justify-content: center;
}

.showImgs {
  overflow: auto;
}
.el-col {
  padding: 20px;
}
</style>
