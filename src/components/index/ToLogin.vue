<template>
  <el-button-group>
    <el-button v-if="isLogin" type="text">
      <slot></slot>
    </el-button>
    <el-button type="text" v-else>
      <router-link to="/login" tag="a">登录</router-link>/
      <router-link to="/signUp" tag="a">注册</router-link>
    </el-button>
    <!-- <el-button type="primary">注册</el-button> -->
  </el-button-group>
</template>

<script>
export default {
  props: {
    isLogin: {
      type:Boolean,
      default:false
    }
  }
};
</script>