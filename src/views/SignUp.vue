<template>
  <!-- 注册界面 -->
  <article>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户注册</span>
      </div>
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">
        <el-form-item label="注册账号" prop="account">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
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
            action="http://localhost:3000/headImg"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <!-- :before-upload="beforeAvatarUpload" -->
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </article>
</template>

<script>
const hobbyOption = ["足球", "篮球", "游戏", "其他"];
export default {
  data() {
    // 验证条件判断
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
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
        nickname:"",
        sex: -1,
        hobbies: [],
        birthday: "",
        imageUrl: "",
        imageBase64: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        account: [{ validator: checkAccount, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("/signup", this.form)
            .then(res => {
              const result = res.data;
              // if (result.sessionId) {
              //   // 放在session中
              //   window.sessionStorage.setItem(
              //     "userInfo",
              //     JSON.stringify(result)
              //   );
              //   // this.$router.push("/");
              // } else {
              //   // this.$message.error("账号或者密码错误");
              // }
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

    handleAvatarSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw);
      this.form.imageBase64 = res;
    }
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === "image/jpeg";
    //   const isLt2M = file.size / 1024 / 1024 < 2;

    //   if (!isJPG) {
    //     this.$message.error("上传头像图片只能是 JPG 格式!");
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("上传头像图片大小不能超过 2MB!");
    //   }
    //   return isJPG && isLt2M;
    // }
  }
};
</script>

<style lang="scss">
.el-input {
  width: 300px;
}

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
</style>
