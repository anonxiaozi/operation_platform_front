<template>
    <div style="line-height: normal;">
        <div>
            <el-input placeholder="IP地址、主机名、系统平台" v-model="hostSearch" style="width: 280px; margin-bottom: 12px;">
            </el-input>
            <el-button type="success" size="small" icon="el-icon-refresh" @click="getHostsAgain" style="margin-left: 10px;"></el-button>
        </div>
        <el-row>
            <el-col :span="22" :offset="1">
                <el-table name="ipRecord" ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange" :data="newHosts.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%;" :default-sort="{prop: 'host_createTime', order: 'descending'}">
                    <el-table-column prop="host_name" label="主机名" width="150">
                    </el-table-column>
                    <el-table-column prop="host_addr" label="IP地址" width="150" sortable>
                    </el-table-column>
                    <el-table-column prop="host_os" label="系统平台" width="100" sortable>
                    </el-table-column>
                    <el-table-column width="150" prop="host_spec" label="规格">
                    </el-table-column>
                    <el-table-column width="220" prop="host_createTime" label="创建时间" sortable>
                    </el-table-column>
                    <el-table-column width="100" prop="physical_equipment" label="物理机？" sortable>
                        <template slot-scope="scope">
                            <i class="el-icon-success" v-if="scope.row.physical_equipment"></i>
                            <i class="el-icon-error" v-if="!scope.row.physical_equipment"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="host_remarks" label="备注">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                        <template slot-scope="scope">
                            <el-tag type="warning" effect="dark" @click="showEditHostDialog(scope.row, scope.$index)">编辑</el-tag>&nbsp;
                            <el-tag type="sucess" effect="dark" @click="StartSSH(scope.row.host_addr)" v-show="scope.row.host_os == 'linux'">SSH</el-tag>&nbsp;
                            <el-tag type="info" effect="dark" @click="StartSFTP(scope.row.host_addr)" v-show="scope.row.host_os == 'linux'">SFTP</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div class="block" style="margin-top: 20px">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="hosts.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[6, 9, 11, 13]" :page-size="pageSize">
            </el-pagination>
        </div>
        <EditHost :host="host" @to-hidenEditDialog="hidenEditDialog" :dialogFormVisible="dialogFormVisible" :formLabelWidth="formLabelWidth"></EditHost>
        <NewHost @to-hidenAddDialog="hidenAddDialog" :newdialogFormVisible="newdialogFormVisible" :formLabelWidth="formLabelWidth" @to-refreshHost="refreshHost"></NewHost>
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
            newHosts: [],
            multipleSelection: [],
            host: {},
            idx: 0,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            newdialogFormVisible: false,
            activeName: 'ipRecord',
            dialogTerminalVisible: false,
            currentPage: 1,
            pageSize: 9,
            hostSearch: '',
        }
    },
    created() {
        this.getHosts();
    },
    methods: {
        getHosts() {
            this.$http({
                    url: 'http://' + this.remoteAddr,
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.hosts = resp.data.message;
                        this.newHosts = resp.data.message;
                        this.hostSearch = '';
                        this.$notify.close();
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
        getHostsAgain() {
            this.getHosts();
            this.showMsg('已刷新主机信息', 'success')
        },
        refreshHost(val) {
            this.getHosts();
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
        showEditHostDialog(row, idx) {
            this.dialogFormVisible = true;
            this.idx = idx;
            this.host = JSON.parse(JSON.stringify(row));
        },
        hidenEditDialog(val) {
            if (val.host_addr) {
                this.hosts.splice(this.idx, 1, val);
                this.newHosts.splice(this.idx, 1, val);
            }
            this.dialogFormVisible = false
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
                this.showMsg('已刷新主机信息', 'success')
            };
            this.activeName = tab.name
        },
        StartSSH(host_addr) {
            let routeUrl = this.$router.resolve({
                path: "/terminal/" + host_addr,
            });
            window.open(routeUrl.href, '_blank');
        },
        hidenTerminalDialog(val) {
            this.dialogTerminalVisible = val;
        },
        StartSFTP(host_addr) {
            window.open('winscp-sftp://root:www.fct123.com@' + host_addr)
        },
        handleSizeChange: function(size) {
            this.pageSize = size;
        },
        handleCurrentChange: function(currentPage) {
            this.currentPage = currentPage;
        },
        fetchHost(val) {
            var hostList = [];
            this.currentPage = 1;
            this.newHosts = this.hosts;
            this.newHosts.map(host => {
                console.log(hosts)
                if (host.host_name.search(val) != -1 || (host.host_addr.search(val) != -1) || (host.host_os.search(val) != -1)) {
                    hostList.push(host)
                }
            });
            this.newHosts = hostList;
        },
    },
    watch: {
        hostSearch(val, oldVal) {
            this.fetchHost(val);
        }
    },
    components: {
        NewHost,
        EditHost,
        Terminal
    }
}
</script>