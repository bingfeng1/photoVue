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
            <ImgList
              :imgListResult="imgListResult"
              minWidth="900px"
              width="90vw"
              :imgWidthList="[8,8,6,4,4]"
            >
              <!-- 这里设置收藏 -->
              <template #bottom="{img}">
                <ImgBotton :img="img">
                  <div>{{img.originalname}}</div>
                  <Collect :img="img"></Collect>
                  <Download :img="img"></Download>
                </ImgBotton>
              </template>
            </ImgList>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import MyHeader from "@/components/index/Header.vue";
import Logo from "@/components/common/Logo.vue";
import Search from "@/components/index/Search.vue";
import ToLogin from "@/components/index/ToLogin.vue";
import Carousel from "@/components/index/Carousel.vue";
import ImgList from "@/components/common/ImgList.vue";
import User from "@/components/index/User.vue";
import ImgBotton from "@/components/common/ImgBotton.vue";
import Download from "@/components/common/Download.vue";
import Collect from "@/components/common/Collect.vue";

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
    User,
    ImgBotton,
    Download,
    Collect
  },
  mounted() {
    this.getCarousel();
  },
  // 由于使用了keep-alive，这里需要返回首页的时候，重新刷新图片墙
  activated() {
    this.getImgList();
  },
  data() {
    return {
      carousel: [],
      userInfo: {},
      imgListResult: []
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
      // 如果登录了，那么查看哪些已经收藏过了
      if (this.isLogin) {
        this.$http_token.get("/user/allImage").then(res => {
          let result = res.data;
          this.imgListResult = result;
        });
      } else {
        this.$http.get("/image/allImage").then(res => {
          let result = res.data;
          this.imgListResult = result;
        });
      }
    }
  }
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
