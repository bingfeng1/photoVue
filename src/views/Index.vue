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
          <Search @search="search"></Search>
          <!-- 登录按钮 -->
          <template #login>
            <ToLogin :isLogin="isLogin">
              <User :userInfo="userInfo"></User>
            </ToLogin>
          </template>
        </MyHeader>
      </el-header>
      <el-main>
        <!-- 这里应该会再增加一层body的，暂时先这样 -->
        <el-row>
          <el-col :span="24">
            <!-- 走马灯 -->
            <Carousel :carousel="carousel"></Carousel>
          </el-col>
        </el-row>
        <!-- 整个图片列表放置位置 -->
        <el-row>
          <el-col :span="24" class="flexcenter">
            <!-- 这里的span长度应该改为自适应的 -->
            <ImgList :imgList="imgList" :span="8" height="300px" maxWidth="900px" @error="getError"></ImgList>
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
import ImgList from "@/components/common/ImgList.vue";
import User from "@/components/index/User.vue";

import { getUserInfo } from "@/assets/js/common.js";

export default {
  name: "index",
  components: {
    MyHeader,
    Logo,
    Search,
    ToLogin,
    Carousel,
    ImgList,
    User
  },
  mounted() {
    this.getCarousel();
    this.getImgList();
  },
  data() {
    return {
      carousel: [],
      userInfo: {},
      imgList: []
    };
  },
  computed: {
    isLogin() {
      return this.checkLogin();
    }
  },
  methods: {
    // 通过后台，拿到走马灯列表
    getCarousel() {
      this.$http.get("/image/carousel").then(res => {
        let result = res.data;
        // 直接使用地址不成功
        result = result.map(v => require(`@/assets/image/${v}`));
        this.carousel = result;
        // this.$nextTick(this.computedImgHeight)
      });
    },
    // 计算走马灯的高度（图片都是16:9的）
    // computedImgHeight() {
    //   let carouselDom = this.$refs.carousel;
    //   let width = carouselDom.$el.clientWidth;
    //   let height = (width / 16) * 9;
    //   if (height > 500) {
    //     height = 500;
    //   }
    //   carouselDom.$el.style.height = height + "px";
    //   for (let i in carouselDom.$children) {
    //     carouselDom.$children[i].$el.style.height = height + "px";
    //   }
    // },
    search(data) {
      return data;
      // console.log(data);
    },
    // 在session中是否存在用户信息
    checkLogin() {
      let userInfo = getUserInfo();
      // 如果有用户信息
      if (userInfo) {
        let { nickname, base64, type } = userInfo;
        this.$set(this.userInfo, "nickname", nickname);
        this.$set(
          this.userInfo,
          "base64",
          "data:" + type + ";base64," + base64
        );
      }
      return !!this.$store.state.userInfo.token;
    },
    getImgList() {
      this.$http.get("/image/allImage").then(res => {
        let result = res.data;
        result = result.map(v=>{
          return `${this.$http.defaults.baseURL}/${v.filename}`
        })
        this.imgList = result;
      });
    },
    getError(err){
      alert(err)
    }
  },
  
};
</script>

<style lang="scss" scoped>
.el-header,
.el-main {
  padding: 0px;
}
.flexcenter {
  display: flex;
  justify-content: center;
}
</style>
