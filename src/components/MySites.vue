<template>
    <div>
        <el-row>
            <el-col :span="18" :offset="2">
                <el-table ref="sitesData" :data="sitesData">
                    <el-table-column prop="site_name" label="名称" sortable width="180">
                    </el-table-column>
                    <el-table-column prop="site_url" label="地址" width="260">
                        <template slot-scope="scope">
                            <el-tag style="color: green" @click="toLinke(scope.row.site_url)">
                                    {{scope.row.site_url}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="site_tags" label="标签" width="250">
                        <template slot-scope="scope">
                            <el-tag :type="tagType(tag)" v-for="tag,idx in splitTags(scope.row.site_tags)" :key="idx" style="margin-right:3px;">{{tag}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="site_remarks" label="描述">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-tag type="warning" effect="dark" @click="showEditSiteDialog(scope.row, scope.$index)">编辑</el-tag>&nbsp;
                            <el-tag type="error" effect="dark" @click="showDelSiteDialog(scope.row, scope.$index)">删除</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="2">
                <el-button type="success" icon="el-icon-plus" circle @click="addSite"></el-button>
                <el-button type="success" circle icon="el-icon-refresh" @click="getSitesAgain"></el-button>
            </el-col>
        </el-row>
        <MyNewSite @to-hidenAddDialog="hidenAddDialog" :newdialogFormVisible="newdialogFormVisible" :formLabelWidth="formLabelWidth" @to-appendSite="appendSite"></MyNewSite>
        <MyEditSite :site="site" @to-hidenEditDialog="hidenEditDialog" :dialogFormVisible="dialogFormVisible" :formLabelWidth="formLabelWidth" @to-editSite="editSite"></MyEditSite>
        <MyDelSite :site="site" @to-hidenDelDialog="hidenDelDialog" :DeldialogFormVisible="DeldialogFormVisible" :formLabelWidth="formLabelWidth" @to-delSite="delSite"></MyDelSite>
    </div>
</template>
<script>
import MyNewSite from './MyNewSite.vue'
import MyEditSite from './MyEditSite.vue'
import MyDelSite from './MyDelSite.vue'

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
            DeldialogFormVisible: false,
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
            this.sitesData.push(val);
        },
        showEditSiteDialog(row, idx) {
            this.idx = idx;
            this.site = JSON.parse(JSON.stringify(row));
            this.dialogFormVisible = true;
        },
        hidenEditDialog(val) {
            this.dialogFormVisible = false;
        },
        getSitesAgain() {
            this.getSites()
        },
        editSite(val) {
            this.sitesData.splice(this.idx, 1, val);
        },
        tagType(tag) {
            if (tag === 'company') {
                return 'warning'
            } else if (tag === 'online') {
                return 'success'
            } else {
                return ''
            }
        },
        toLinke(url){
            window.open(url);
        },
        showDelSiteDialog(row, idx){
            this.site = row;
            this.idx = idx;
            this.DeldialogFormVisible = true;
        },
        hidenDelDialog(val){
            this.DeldialogFormVisible = false;
        },
        delSite(val){
            this.sitesData.splice(this.idx, 1);
        }
    },
    components: {
        MyNewSite,
        MyEditSite,
        MyDelSite,
    }
}
</script>