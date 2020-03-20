<template>
    <div id="app">
        <el-container>
            <el-container>
                <el-header>
                    <MyHeader></MyHeader>
                </el-header>
                <el-main>
                    <MyHosts></MyHosts>
                </el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import MyHosts from './components/MyHosts.vue'
import MyHeader from './components/MyHeader.vue'

export default {
    name: 'app',
    components: {
        MyHosts,
        MyHeader,
    }
}
</script>
<style>
html,
body,
#app,
.el-container {
    margin: 0;
    padding: 0;
    height: 100%;
}

.el-header,
.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: normal;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: normal;
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>