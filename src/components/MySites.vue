<template>
    <div>
        <el-row>
            <el-col :span="17" :offset="3">
                <el-table ref="sitesData" :data="sitesData">
                    <el-table-column prop="site_name" label="site_name" sortable width="180">
                    </el-table-column>
                    <el-table-column prop="site_url" label="site_url" width="180">
                    </el-table-column>
                    <el-table-column prop="site_tags" label="site_tags" width="100">
                        <template slot-scope="scope">
                            <el-tag type="success">{{scope.row.site_tags}}</el-tag>
                        </template>
                        <!-- <template slot-scope="scope"> -->
                        <!-- <el-tag type="success">{{scope.row.site_tags}}</el-tag> -->
                        <!-- <el-tag v-for="tag,idx in splitTags(scope.row.site_tags)" :key="idx"> -->
                        <!-- {{tag}} -->
                        <!-- </el-tag> -->
                        <!-- <el-tag :type="scope.row.tag === '家' ? 'primary' : 'success'" disable-transitions>{{scope.row.tag}}</el-tag> -->
                        <!-- </template> -->
                    </el-table-column>
                    <el-table-column prop="site_remarks" label="site_remarks">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-tag type="warning" effect="dark" @click="showEditHostDialog(scope.row, scope.$index)">编辑</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="2">
                <el-button type="success" icon="el-icon-plus" circle @click=addSite></el-button>
            </el-col>
        </el-row>
        <MyNewSite @to-hidenAddDialog="hidenAddDialog" :newdialogFormVisible="newdialogFormVisible" :formLabelWidth="formLabelWidth" @to-appendSite="appendSite"></MyNewSite>
        <MyEditSite :site="site" @to-hidenEditDialog="hidenEditDialog" :dialogFormVisible="dialogFormVisible" :formLabelWidth="formLabelWidth"></MyEditSite>
    </div>
</template>
<script>
import MyNewSite from './MyNewSite.vue'
import MyEditSite from './MyEditSite.vue'

export default {
    mounted() {
        this.getSites();
    },
    data() {
        return {
            sitesData: [],
            newdialogFormVisible: false,
            formLabelWidth: '150px',
            dialogFormVisible: false,
            idx: 0,
            site: {}
        }
    },
    methods: {
        getSites() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/sites/',
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.sitesData = resp.data.message;
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
        splitTags(tags) {
            return tags.split(',')
        },
        addSite() {
            this.newdialogFormVisible = true;
        },
        hidenAddDialog(val) {
            this.newdialogFormVisible = false;
            this.sitesData.splice(this.idx, val)
        },
        appendSite(val) {
            var len = this.sitesData.length;
            this.$set(this.sitesData, len + 1, val);
            this.sitesData.splice(len + 1);
        },
        showEditHostDialog(row, idx){
            this.idx = idx;
            this.site = row;
            this.dialogFormVisible = true;
        },
        hidenEditDialog(val){
            this.dialogFormVisible = false;
            this.sitesData.splice(this.idx, 1, val);
        }
    },
    components: {
        MyNewSite,
        MyEditSite,
    }
}
</script>