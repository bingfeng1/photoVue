<template>
  <!-- 注册界面 -->
  <article>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户注册</span>
      </div>
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">
        <!-- <el-form-item label="注册账号" prop="account">
          <el-input v-model="form.account" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.pass" :show-password="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label="-1">保密</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="兴趣爱好">
          <el-checkbox-group v-model="form.hobbies">
            <el-checkbox v-for="hobby in hobbyOption" :label="hobby" :key="hobby">{{hobby}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="头像设置">
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            :on-change="handleCrop"
            :auto-upload="false"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 裁剪页 -->
      <transition name="slim-fade">
        <div v-show="cropShow" class="crop-wrap">
          <SlimCropper ref="cropper" :src="inputImgUrl"></SlimCropper>
          <div class="btn-box">
            <button @click="hideCrop">取消</button>
            <button @click="submitCrop">使用</button>
          </div>
        </div>
      </transition>
    </el-card>
  </article>
</template>

<script>
const hobbyOption = ["足球", "篮球", "游戏", "其他"];
export default {
  data() {
    // 验证条件判断
    // var checkAccount = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("账号不能为空"));
    //   } else {
    //     callback();
    //   }
    // };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };

    return {
      hobbyOption,
      form: {
        pass: "",
        account: "",
        nickname: "",
        sex: -1,
        hobbies: [],
        birthday: "",
        imageUrl: "",
        portrait: Object,
        imageType: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        // account: [{ validator: checkAccount, trigger: "blur" }]
      },
      // 头像剪裁属性
      cropShow: false,
      inputImgUrl: ""
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("pass", this.form.pass);
          formData.append("nickname", this.form.nickname);
          formData.append("sex", this.form.sex);
          formData.append("hobbies", this.form.hobbies);
          formData.append("birthday", this.form.birthday);
          formData.append("portrait", this.form.portrait);
          this.$http_token
            .post("/user/changeUserInfo", formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then(res => {
              const result = res.data;
              if (result.message) {
                this.$message.error("修改失败" + result.message);
              } else {
                // 如果注册成功，跳转至登录页面进行登录
                this.$message({
                  message: "修改成功，请重新登录",
                  type: "success"
                });
                this.$router.replace("/login");
              }
            });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCrop(file) {
      this.inputImgUrl = URL.createObjectURL(file.raw);
      this.form.imageType = file.name.split(".")[1];
      this.showCrop();
    },
    // 显示裁剪页
    showCrop() {
      this.cropShow = true;
    },
    // 隐藏裁剪页
    hideCrop() {
      this.cropShow = false;
    },
    // 裁剪页确认
    async submitCrop() {
      const img = await this.$refs.cropper.getCroppedBlob();

      const isJPG = img.type === "image/jpeg";
      const isLt2M = img.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (isJPG && isLt2M) {
        this.form.imageUrl = URL.createObjectURL(img);
        this.form.portrait = new File([img], `${this.form.account}.${this.form.imageType}`);
        this.hideCrop();
      }
    },
    // 获取所有用户信息
    getUserInfo() {
      this.$http_token.get("/user/userInfo").then(res => {
        let result = res.data;
        if(result.birthday == "0000-00-00"){
          result.birthday = ""
        }
        if(result.hobbies){
          result.hobbies = result.hobbies.split(',')
        }else{
          result.hobbies = []
        }
        if(result.portrait){
          result.imageUrl = `${this.$http.defaults.baseURL}/${result.portrait}`;
        }
        for (let o in result) {
          this.$set(this.form, o, result[o]);
        }
      });
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #3a3a3a;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.crop-wrap {
  z-index: 1;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #000;
  .btn-box {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    button {
      width: 60px;
      height: 100%;
      font-size: 16px;
      color: #ffffff;
      text-align: center;
      background: #ffffff52;
      border: none;
    }
  }
}
.slim-fade-enter-active,
.slim-fade-leave-active {
  transition: all 0.4s ease;
}
.slim-fade-enter,
.slim-fade-leave-to {
  opacity: 0;
  transform-origin: top;
  transform: translateY(100%);
}
</style>
