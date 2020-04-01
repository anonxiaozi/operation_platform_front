<template>
    <div>
        <el-menu :default-active="activeTab" class="el-menu-demo" mode="horizontal" background-color="#3b8e49" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item v-if="isLogin()" index="hosts" @click="GoHosts">主机记录</el-menu-item>
            <el-menu-item v-if="isLogin()" index="sites" @click="GoSites">网站记录</el-menu-item>
            <el-menu-item v-if="this.$route.path == '/login'" index="login">请先登录</el-menu-item>
            <el-submenu v-if="isLogin()" index="10" ref="userTag" style="float: right; width: auto;">
                <template slot="title">{{user}}</template>
                <el-menu-item @click="logout">退出登录</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
export default {
    created(){
        this.activeTab = this.$route.path.substr(1)
    },
    data() {
        return {
            user: localStorage.getItem('user'),
            activeTab: 'hosts'
        };
    },
    methods: {
        GoHosts() {
            this.$router.push('/hosts').catch(err => { err })
        },
        GoSites() {
            this.$router.push('/sites').catch(err => { err })
        },
        logout() {
            this.$http({
                url: 'http://' + this.remoteAddr + '/logout/',
                method: 'post',
            }).then(resp => {
                if (resp.data.status == 200) {
                    localStorage.removeItem('token');
                    this.$router.push('/login');
                } else {
                    this.$message({
                        showClose: true,
                        message: resp.data.message,
                        type: 'failed',
                        center: true,
                    })
                }
            }).catch(resp => {
                console.log(resp.data)
            })
        },
        isLogin() {
            return this.$route.path != '/login';
        },
    },
}
</script>
<style>
.el-icon-arrow-down {
    font-size: 12px;
}

.demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
}
</style>