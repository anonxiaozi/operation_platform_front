<template>
    <div>
        <el-dialog title="主机信息" :visible.sync="newdialogFormVisible" center :before-close="hidenDialog">
            <el-form :model="newHost">
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="newHost.host_addr" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="端口" :label-width="formLabelWidth">
                    <el-input v-model="newHost.host_port" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="主机名" :label-width="formLabelWidth">
                    <el-input v-model="newHost.host_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="newHost.host_user" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="私钥" :label-width="formLabelWidth">
                    <el-input v-model="newHost.host_key" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="系统平台" :label-width="formLabelWidth">
                	<el-radio-group v-model="newHost.host_os">
                        <el-radio label="win32">win32</el-radio>
                        <el-radio label="linux">linux</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="规格" :label-width="formLabelWidth">
                    <el-input v-model="newHost.host_spec" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="物理机" :label-width="formLabelWidth">
                    <el-switch v-model="newHost.physical_equipment" autocomplete="off"></el-switch>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input v-model="newHost.host_remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hidenDialog">返 回</el-button>
                <el-button type="primary" @click="AddHost">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            newHost: {
                'host_addr': '',
                'host_name': '',
                'host_spec': '',
                'host_os': '',
                'physical_equipment': '',
                'host_remarks': ''
            },
        }
    },
    props: ['newdialogFormVisible', 'formLabelWidth'],
    methods: {
        hidenDialog() {
            this.$emit('to-hidenAddDialog', false)
        },
        AddHost() {
            this.$http({
                    url: 'http://' + this.remoteAddr,
                    method: 'post',
                    data: this.newHost,
                    transformRequest: [function(data) {
                        let result = 'action=add&';
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
                        this.$emit('to-refreshHost', true);
                        this.$notify({
                            title: '成功',
                            message: '添加主机 ' + this.newHost.host_addr + ' 成功',
                            type: 'success'
                        });
                    } else {
                    	this.$notify.error({
                            title: '失败',
                            message: resp.data.data,
                            type: 'failed'
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
    },
}
</script>