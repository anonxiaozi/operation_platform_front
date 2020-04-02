<template>
    <div>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-table ref="ExternalData" :data="ExternalData">
                    <el-table-column prop="external_name" label="external_name" sortable width="180">
                    </el-table-column>
                    <el-table-column prop="external_url" label="external_url" width="320">
                        <template slot-scope="scope">
                            <el-tag style="color: blue" @click="toLinke(scope.row.external_url)">
                                {{scope.row.external_url}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="external_remarks" label="external_remarks">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="success" @click="showAuthDialog(scope.row)">查看登录信息</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-dialog :title="external.external_name + ' 的登录信息'" :visible.sync="dialogFormVisible" center :before-close="hidenDialog" width="30%">
            <p style="text-align: center; color: green">{{auth}}</p>
        </el-dialog>
    </div>
</template>
<script>
export default {
    created() {
        this.getExternal();
    },
    data() {
        return {
            ExternalData: [],
            formLabelWidth: '150px',
            dialogFormVisible: false,
            external: {},
            auth: ''
        }
    },
    methods: {
        getExternal() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/external/',
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.ExternalData = resp.data.message;
                        this.showMsg('数据已刷新', 'success')
                    } else {
                        console.log(resp.data)
                        this.showMsg(resp.data.message, 'warning')
                    }
                })
                .catch(err => {
                    this.showNotify(resp.status, resp.data, 'error')
                })
        },
        getAuth() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/external/',
                    method: 'post',
                    data: { 'external_url': this.external.external_url },
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
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        console.log(resp.data.auth);
                        // this.handleExternal(resp.data.auth);
                        this.auth = resp.data.auth;
                        this.dialogFormVisible = true;
                    } else {
                        this.showMsg(resp.data.message, 'warning')
                    }
                })
                .catch(err => {
                    this.showNotify(err.status, err.data, 'error')
                })
        },
        showMsg(data, type) {
            this.$message({
                showClose: true,
                message: data,
                type: type,
                center: true,
            })
        },
        showNotify(title, message, type) {
            this.$notify({
                title: title,
                message: message,
                type: type,
                duration: 30000
            })
        },
        showAuthDialog(external) {
            this.external = external;
            this.getAuth();
        },
        toLinke(url) {
            window.open(url);
        },
        hidenDialog() {
            this.dialogFormVisible = false;
        },
    },
}
</script>