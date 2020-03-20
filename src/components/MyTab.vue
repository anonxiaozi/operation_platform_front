<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="主机记录" name="ipRecord"></el-tab-pane>
    </el-tabs>
</template>
<script>
export default {
    data() {
        return {
            activeName: 'ipRecord'
        };
    },
    methods: {
        handleClick(tab, event) {
            this.activeName = tab.name
        }
    }
};
</script>