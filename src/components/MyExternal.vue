<template>
    <div>
        <el-row>
            <el-col :span="16" :offset="4">
                <el-table ref="ExternalData" :data="ExternalData">
                    <el-table-column prop="external_name" label="网站名称" sortable width="180">
                    </el-table-column>
                    <el-table-column prop="external_url" label="网站地址" width="320">
                        <template slot-scope="scope">
                            <el-tag style="color: blue" @click="toLinke(scope.row.external_url)">
                                {{scope.row.external_url}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="external_remarks" label="备注">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="success" @click="showAuthDialog(scope.row)">查看登录信息</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="1">
                <el-button type="success" circle icon="el-icon-refresh" @click="getExternalAgain"></el-button>
            </el-col>
        </el-row>
        <el-dialog :title="external.external_name + ' 的登录信息'" :visible.sync="dialogFormVisible" center :before-close="hidenDialog" width="30%">
            <el-form @submit.native.prevent>
                <el-form-item label="请输入口令" :label-width="formLabelWidth">
                    <el-input v-model="phrase" autocomplete="off" required show-password autofocus @keyup.enter.native="getAuth"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hidenDialog">返 回</el-button>
                <el-button type="primary" @click="getAuth">获 取</el-button>
            </div>
            <p style="text-align: center; color: green" v-if="auth"><span style="font-size: larger;color: black;">登录信息为： </span>{{auth}}</p>
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
            auth: '',
            phrase: ''
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
                        this.showMsg(resp.data.message, 'warning')
                    }
                })
                .catch(err => {
                    this.showNotify(resp.status, resp.data, 'error')
                })
        },
        getExternalAgain(){
            this.getExternal()
        },
        getAuth() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/external/',
                    method: 'post',
                    data: { 'external_url': this.external.external_url, 'phrase': this.phrase },
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
                        this.auth = resp.data.auth;
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
            this.dialogFormVisible = true;
            this.external = external;
        },
        toLinke(url) {
            window.open(url);
        },
        hidenDialog() {
            this.dialogFormVisible = false;
            this.auth = '';
            this.phrase = '';
        },
    },
}
</script>