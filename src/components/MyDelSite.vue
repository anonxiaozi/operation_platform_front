<template>
    <div>
        <el-dialog :visible.sync="DeldialogFormVisible" center :before-close="hidenDialog" width="600px">
            <p style="text-align: center;color: black;box-sizing: border-box;font-size: 25px;margin-top:-25px;">警告：此操作无法恢复</p>
            <p style="text-align: center;color: black;box-sizing: border-box;font-size: 20px;">请输入 <span style="color:red">{{site.site_name}}->{{site.site_url}}</span> 确认</p>
            <el-form :model="site">
                    <el-input v-model="url"></el-input>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hidenDialog">取 消</el-button>
                <el-button type="primary" @click="DelSite" :disabled="checkInput()">删 除</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            url: ''
        }
    },
    props: ['site', 'DeldialogFormVisible', 'formLabelWidth'],
    methods: {
        hidenDialog() {
            this.$emit('to-hidenDelDialog', false)
        },
        DelSite() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/sites/',
                    method: 'post',
                    data: {'site_url': this.site.site_url},
                    transformRequest: [function(data) {
                        let result = 'action=del&';
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
                        this.$emit('to-delSite', this.site.site_url);
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
        checkInput() {
            var content = this.site.site_name + '->' + this.site.site_url;
            return content !== this.url
        }
    },

}
</script>