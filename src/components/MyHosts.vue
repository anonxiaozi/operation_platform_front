<template>
    <div style="line-height: normal;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="主机记录" name="ipRecord">
                <el-table name="ipRecord" ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange" :data="hosts" style="width: 100%;">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="host_name" label="主机名" width="150">
                    </el-table-column>
                    <el-table-column prop="host_addr" label="IP地址" width="150">
                    </el-table-column>
                    <el-table-column prop="host_os" label="系统平台" width="100">
                    </el-table-column>
                    <el-table-column width="150" prop="host_spec" label="规格">
                    </el-table-column>
                    <el-table-column width="220" prop="host_createTime" label="创建时间">
                    </el-table-column>
                    <el-table-column width="100" prop="physical_equipment" label="物理机？">
                        <template slot-scope="scope">
                            <i class="el-icon-success" v-if="scope.row.physical_equipment"></i>
                            <i class="el-icon-error" v-if="!scope.row.physical_equipment"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="host_remarks" label="备注">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                        <template slot-scope="scope">
                            <el-tag type="warning" effect="dark" @click="showEditHostDialog(scope.row)">编辑</el-tag>&nbsp;
                            <el-tag type="sucess" effect="dark" @click="StartSSH()" v-show="scope.row.host_os == 'linux'">SSH</el-tag>&nbsp;
                            <el-tag type="info" effect="dark" @click="StartSFTP(scope.row.host_addr)" v-show="scope.row.host_os == 'linux'">SFTP</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 20px">
                    <!-- <el-button @click="toggleSelection([hosts[1], hosts[2]])">切换第二、第三行的选中状态</el-button> -->
                    <!-- <el-button @click="toggleSelection()">取消选择</el-button> -->
                    <el-button @click="showAddHostDialog" icon="el-icon-plus" type="success" size="small">添加主机</el-button>
                </div>
                <EditHost :host="host" @to-hidenEditDialog="hidenEditDialog" :dialogFormVisible="dialogFormVisible" :formLabelWidth="formLabelWidth" @to-refreshHost="refreshHost"></EditHost>
                <NewHost @to-hidenAddDialog="hidenAddDialog" :newdialogFormVisible="newdialogFormVisible" :formLabelWidth="formLabelWidth" @to-refreshHost="refreshHost"></NewHost>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script type="text/javascript">
import NewHost from './NewHost.vue'
import EditHost from './EditHost.vue'
import Terminal from './MyTerminal.vue'

export default {
    data() {
        return {
            hosts: [],
            multipleSelection: [],
            host: {},
            dialogFormVisible: false,
            formLabelWidth: '120px',
            newdialogFormVisible: false,
            activeName: 'ipRecord',
            dialogTerminalVisible: false
        }
    },
    mounted() {
        this.getHosts();
    },
    methods: {
        getHosts() {
            this.$http.get('http://' + this.remoteAddr)
                .then(resp => {
                    this.hosts = resp.data
                })
                .catch(err => {
                    console.log(err)
                })
        },
        refreshHost() {
            console.log('edit...');
            this.getHosts()
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        showEditHostDialog(row) {
            this.dialogFormVisible = true;
            this.host = JSON.parse(JSON.stringify(row))
        },
        hidenEditDialog(val) {
            this.dialogFormVisible = val
        },
        showAddHostDialog() {
            this.newdialogFormVisible = true;
        },
        hidenAddDialog(val) {
            this.newdialogFormVisible = val;
        },
        handleClick(tab, event) {
            if (tab.name == "ipRecord") {
                this.getHosts();
                this.$message({
                    showClose: true,
                    message: '已刷新主机信息',
                    type: 'success',
                    center: true
                });
            };
            this.activeName = tab.name
        },
        StartSSH() {
            this.$router.push('/terminal')
        },
        hidenTerminalDialog(val) {
            this.dialogTerminalVisible = val;
        },
        StartSFTP(host_addr) {
            window.open('winscp-sftp://root:www.fct123.com@' + host_addr)
        }
    },
    components: {
        NewHost,
        EditHost,
        Terminal
    }
}
</script>