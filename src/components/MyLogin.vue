<template>
    <el-form :model="formData" ref="loginForm" class="demo-ruleForm" label-width='80px' @submit.native.prevent label-position='left' hide-required-asterisk style="width: 500px; margin: 60px auto;">
        <el-form-item label="用户名" prop="username" required>
            <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="密码" prop="password" autocomplete="off" required>
            <el-input v-model="formData.password" show-password></el-input>
        </el-form-item>
        <br>
        <el-form-item>
            <el-button type="primary" native-type="submit" @click="submitForm('loginForm')">登陆</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            formData: {
                username: 'root',
                password: 'www.123.com',
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: 'http://' + this.remoteAddr + '/login/',
                        method: 'post',
                        data: this.formData,
                        transformRequest: [function(data) {
                            let result = '';
                            for (let item in data) {
                                result += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
                            }
                            return result;
                        }],
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        withCredentials: true,
                    }).then(resp => {
                        this.$cookies.set('token', resp.data.token)
                        localStorage.setItem('token', resp.data.token);
                        localStorage.setItem('user', resp.data.user);
                        if (resp.data.status == 200) {
                            this.$message({
                                showClose: true,
                                message: resp.data.message,
                                type: 'success',
                                center: true,
                                duration: 5000
                            });
                            this.$router.push('/hosts')
                        } else {
                            this.$message({
                                showClose: true,
                                message: resp.data.message,
                                type: 'error',
                                center: true,
                                duration: 5000
                            });
                        }
                    })
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>