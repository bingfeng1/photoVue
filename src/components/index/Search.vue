<template>
  <div id="search">
    <el-input placeholder="请输入内容" v-model="input" class="input-with-select" ref="input">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: ""
    };
  },
  mounted() {
    // 使用css不成功，搜索和边框之间总有一条缝隙
    this.$refs.input.$el.lastElementChild.style.borderColor = "rgba(0, 255, 34, 0.507)";
  },
  methods:{
    // 搜索，传至根组件
    search(){
      this.$emit('search',this.input)
    }
  }
};
</script>

<style lang="scss" scoped>
#search input.el-input__inner {
  background-color: rgba(255, 0, 0, 0.103);
  border: none;
}

#search .el-button {
  background-color: rgba(0, 255, 34, 0.507);
  line-height: normal;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
