<template>
    <div>
        <el-dialog title="主机信息" :visible.sync="dialogFormVisible" center :before-close="hidenDialog">
            <el-form :model="host">
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="host.host_addr" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="端口" :label-width="formLabelWidth">
                    <el-input v-model="host.host_port" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" :label-width="formLabelWidth">
                    <el-input v-model="host.host_createTime" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="主机名" :label-width="formLabelWidth">
                    <el-input v-model="host.host_name" autocomplete="off"></el-input>
                </el-form-item>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="host.host_user" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="私钥" :label-width="formLabelWidth">
                    <el-input v-model="host.host_key" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="系统平台" :label-width="formLabelWidth">
                    <el-radio-group v-model="host.host_os">
                        <el-radio label="win32">win32</el-radio>
                        <el-radio label="linux">linux</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="规格" :label-width="formLabelWidth">
                    <el-input v-model="host.host_spec" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="物理机" :label-width="formLabelWidth">
                    <el-switch v-model="host.physical_equipment" autocomplete="off"></el-switch>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input v-model="host.host_remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hidenDialog">返 回</el-button>
                <el-button type="primary" @click="ChangeHost">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            success: false,
            newHost: {},
        }
    },
    props: ['host', 'dialogFormVisible', 'formLabelWidth'],
    methods: {
        ChangeHost() {
            this.$http({
                    url: 'http://' + this.remoteAddr,
                    method: 'post',
                    data: this.host,
                    transformRequest: [function(data) {
                        let result = 'action=edit&';
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
                        this.$notify({
                            title: '成功',
                            message: this.host.host_addr + ' 主机信息修改成功',
                            type: 'success'
                        });
                        this.newHost = this.handleHost(resp.data.message)
                    } else {
                        this.$notify({
                            title: '失败',
                            message: resp.data.data,
                            type: 'error'
                        });
                    }
                })
                .catch(err => {
                    console.log(err)
                })
                .then(() => {
                    this.hidenDialog();
                })
        },
        hidenDialog() {
            this.$emit('to-hidenEditDialog', this.newHost)
        },
        handleHost(val){
            var obj = JSON.parse(val)[0];
            var fields = obj.fields;
            fields['host_addr'] = obj.pk;
            return fields;
        }
    }
}
</script>