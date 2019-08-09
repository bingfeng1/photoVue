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
        <!-- 整个图片列表放置位置 -->
        <el-row>
          <el-col :span="24" class="flexcenter">
            <ImgList :span="8" height="300px" maxWidth="900px"></ImgList>
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
import ImgList from "@/components/index/ImgList.vue";

export default {
  name: "index",
  components: {
    MyHeader,
    Logo,
    Search,
    ToLogin,
    Carousel,
    ImgList
  }
};
</script>

<style lang="scss" scoped>
.el-header,
.el-main {
  padding: 0px;
}
.flexcenter{
  display: flex;
  justify-content: center;
}
</style>
