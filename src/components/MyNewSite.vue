<template>
    <div>
        <el-dialog title="网站信息" :visible.sync="newdialogFormVisible" center :before-close="hidenDialog">
            <el-form :model="newSite">
                <el-form-item label="网站名称" :label-width="formLabelWidth">
                    <el-input v-model="newSite.site_name"></el-input>
                </el-form-item>
                <el-form-item label="网站URL" :label-width="formLabelWidth">
                    <el-input v-model="newSite.site_url"></el-input>
                </el-form-item>
                <el-form-item label="网站标签 (逗号分隔)" :label-width="formLabelWidth">
                    <el-input v-model="newSite.site_tags"></el-input>
                </el-form-item>
                <el-form-item label="网站描述" :label-width="formLabelWidth">
                    <el-input v-model="newSite.site_remarks" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hidenDialog">取 消</el-button>
                <el-button type="primary" @click="AddSite">创 建</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            newSite: {},
        }
    },
    props: ['newdialogFormVisible', 'formLabelWidth'],
    methods: {
        hidenDialog() {
            this.$emit('to-hidenAddDialog', false)
        },
        AddSite() {
            if(this.newSite.site_url == ''){
                return
            }
            this.$http({
                    url: 'http://' + this.remoteAddr + '/sites/',
                    method: 'post',
                    data: this.newSite,
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
                        this.$emit('to-appendSite', this.handleSite(resp.data.site));
                        this.newSite = {};
                        this.$notify({
                            title: '成功',
                            message: resp.data.message,
                            type: 'success'
                        });
                    } else {
                        this.$notify.error({
                            title: '失败',
                            message: resp.data.message,
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
        handleSite(val) {
            var obj = JSON.parse(val)[0];
            var fields = obj.fields;
            console.log(fields);
            return fields;
        }
    },

}
</script>