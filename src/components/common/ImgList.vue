<template>
  <div class="hideScroll fixCenter" :style="{maxWidth:maxWidth}">
    <el-row class="showImgs">
      <el-col v-for="(url,index) in imgList" :key="index" :span="span" :style="{minHeight:height}">
        <el-image :src="url" lazy @error="getError">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
        </el-image>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    span: Number,
    height:String,
    maxWidth:String,
    imgList:Array
  },
  methods: {
    getError(err){
      this.$emit('error',err)
    }
  }
};
</script>


<style lang="scss" scoped>
::-webkit-scrollbar {
    display: none;
}

.fixCenter{
  display:inline-flex;
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
