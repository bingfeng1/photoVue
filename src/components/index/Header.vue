<template>
  <el-row>
    <el-col :span="6">
      <slot name="logo"></slot>
    </el-col>
    <el-col :span="12">
      <slot></slot>
    </el-col>
    <el-col :span="6">
      <slot name="login"></slot>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.el-row {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 119, 255, 0.658);
}
</style>
