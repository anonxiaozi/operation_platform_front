<template>
    <div>
        <el-dialog title="网站信息" :visible.sync="dialogFormVisible" center :before-close="hidenDialog">
            <el-form :model="site">
                <el-form-item label="网站地址" :label-width="formLabelWidth">
                    <el-input v-model="site.site_url" disabled></el-input>
                </el-form-item>
                <el-form-item label="网站名称" :label-width="formLabelWidth">
                    <el-input v-model="site.site_name"></el-input>
                </el-form-item>
                <el-form-item label="网站标签" :label-width="formLabelWidth">
                    <el-input v-model="site.site_tags"></el-input>
                </el-form-item>
                <el-form-item label="网站描述" :label-width="formLabelWidth">
                    <el-input v-model="site.site_remarks" type="textarea"></el-input>
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
            newSite: {},
        }
    },
    props: ['site', 'dialogFormVisible', 'formLabelWidth'],
    methods: {
        ChangeHost() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/sites/',
                    method: 'post',
                    data: this.site,
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
                            message: resp.data.message,
                            type: 'success'
                        });
                        this.$emit('to-editSite', this.handleSite(resp.data.site))
                    } else {
                        this.$notify({
                            title: '失败',
                            message: resp.data.message,
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
            this.$emit('to-hidenEditDialog', false)
        },
        handleSite(val){
            var obj = JSON.parse(val)[0];
            var fields = obj.fields;
            return fields;
        }
    }
}
</script>