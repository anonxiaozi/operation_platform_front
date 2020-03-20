<template>
    <!-- <el-dialog title="Terminal" :visible.sync="dialogTerminalVisible" :before-close="hidenDialog" append-to-body> -->
        <div class="container">
            <div id="terminal"></div>
        </div>
    <!-- </el-dialog> -->
</template>
<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm';
export default {
    mounted() {
        var term = new Terminal();
        term.open(document.getElementById('terminal'));
        term.write('Hello....[bloke]')
    },
    props: ['dialogTerminalVisible'],
    methods: {
        hidenDialog() {
            this.$emit('to-hidenTerminalDialog', false)
        }
    }
}
</script>
