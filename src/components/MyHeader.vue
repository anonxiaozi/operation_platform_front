<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#3b8e49" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item v-if="this.$route.path != '/login'" index="1" @click="GoHosts">主机记录</el-menu-item>
            <el-menu-item v-if="this.$route.path == '/login'" index="1">请先登录</el-menu-item>
            <el-submenu v-if="this.$route.path != '/login'" index="10" ref="userTag" style="float: right; width: auto;">
                <template slot="title">{{user}}</template>
                <el-menu-item @click="logout">退出登录</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
export default {
    mounted() {
        console.log()

    },
    data() {
        return {
            activeIndex: '1',
            activeIndex2: '1',
            user: localStorage.getItem('user')
        };
    },
    methods: {
        GoHosts() {
            this.$router.push('/hosts').catch(err => { err })
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
        }
    }
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