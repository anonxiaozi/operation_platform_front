<template>
    <el-form :model="formData" ref="loginForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            formData: {
                username: '',
                password: '',
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
                    }).then(resp => {
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