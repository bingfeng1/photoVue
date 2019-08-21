<template>
  <div class="hideScroll fixCenter" :style="{maxWidth:maxWidth,width:width}">
    <el-row class="showImgs">
      <el-col
        style="minHeight: 10vh"
        :xs="8"
        :sm="8"
        :md="6"
        :lg="4"
        :xl="4"
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
    width:{
      type:String,
      defaults:'100%'
    }
  },
  computed: {
    imgLists() {
      // 直接添加url属性，这个方式更好
      for(let v of this.imgListResult){
        v.url = `${this.$http.defaults.baseURL}/${v.filename}`
      }
      return this.imgListResult
    },
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
  display: inline-flex;
  justify-content: center;
}

.showImgs {
  height: 400px;
  overflow: auto;
}
.el-col {
  padding: 20px;
}
</style>
