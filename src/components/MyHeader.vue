<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#3b8e49" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1" @click="GoHosts">主机记录</el-menu-item>
            <!-- <el-submenu index="2">
            <template slot="title">我的工作台</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项1</el-menu-item>
                <el-menu-item index="2-4-2">选项2</el-menu-item>
                <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
        </el-submenu> -->
            <!-- <el-menu-item index="3" disabled>消息中心</el-menu-item> -->
            <el-submenu style="float: right; margin-right: 40px; font-size: larger;" :offset="6">
                <el-menu-item slot="title" >
                    {{user}}
                </el-menu-item>
            </el-submenu>
            <!-- <div style="">{{user}}</div> -->
        </el-menu>
    </div>
</template>
<script>
export default {
    created() {
        // user = localStorage.getItem('user');
    },
    data() {
        return {
            activeIndex: '1',
            activeIndex2: '1',
            user: localStorage.getItem('user')
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);
        },
        GoHosts() {
            this.$router.push('/hosts').catch(err => { err })
        }
    }
}
</script>
<style>
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}

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