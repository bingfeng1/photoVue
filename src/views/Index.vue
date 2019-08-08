<template>
  <div class="index">
    <!-- 这里是主页的路由显示 -->
    <el-container>
      <el-header>
        <!-- 头部内容 -->
        <MyHeader>
          <!-- LOGO -->
          <template #logo>
            <Logo></Logo>
          </template>
          <!-- 搜索功能 -->
          <Search></Search>
          <!-- 登录按钮 -->
          <template #login>
            <ToLogin></ToLogin>
          </template>
        </MyHeader>
      </el-header>
      <el-main>
        <!-- 这里应该会再增加一层body的，暂时先这样 -->
        <el-row>
          <el-col :span="24">
            <!-- 走马灯 -->
            <Carousel></Carousel>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <!-- 尝试使用懒加载，但失败了，明天再试一下 -->
            <div class="demo-image__lazy" style="height:300px">
              <!-- <el-image v-for="url in urls" :key="url" :src="url" lazy></el-image> -->
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import MyHeader from "@/components/index/Header.vue";
import Logo from "@/components/index/Logo.vue";
import Search from "@/components/index/Search.vue";
import ToLogin from "@/components/index/ToLogin.vue";
import Carousel from "@/components/index/Carousel.vue";

export default {
  name: "index",
  components: {
    MyHeader,
    Logo,
    Search,
    ToLogin,
    Carousel
  },
  // data() {
  //   return {
  //     urls: [
  //       "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  //       "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
  //       "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
  //       "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
  //       "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
  //       "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
  //       "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg"
  //     ]
  //   };
  // }
};
</script>

<style lang="scss" scoped>
.el-header,
.el-main {
  padding: 0px;
}
</style>
