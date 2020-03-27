<template>
    <div class="container">
        <div ref="terminal"></div>
        <el-button plain @click="showDialog" ref="dialog" style="display: none;"></el-button>
    </div>
</template>
<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Base64 } from "js-base64";
import { WebLinksAddon } from "xterm-addon-web-links"
import { SearchAddon } from "xterm-addon-search"
import { AttachAddon } from 'xterm-addon-attach';

export default {
    mounted() {
        var windowHeight = document.body.clientHeight;
        var width = this.$refs.terminal.offsetWidth;
        var height = windowHeight - 150
        var termRows = Math.floor(height / 18)
        var termCols = Math.floor(width / 9)
        const host_addr = this.$route.params.host;
        const term = new Terminal({
            cursorBlink: true,
            cursorStyle: "block",
            scrollback: 1024,
            tabStopWidth: 4,
            screenkeys: true,
            termName: host_addr,
            allowTransparency: true,
            windowsMode: true,
        });
        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();
        const searchAddon = new SearchAddon();
        term.loadAddon(fitAddon);
        term.loadAddon(webLinksAddon);
        term.loadAddon(searchAddon);
        term.open(this.$refs.terminal);
        const webSocket = new WebSocket('ws://10.15.101.58/connect/' + host_addr + '/');
        const attachAddon = new AttachAddon(webSocket);
        term.loadAddon(attachAddon);
        webSocket.onopen = () => {
            this.TermSize(term, webSocket, Math.floor((document.body.clientHeight - 150) / 18), Math.floor(this.$refs.terminal.offsetWidth / 9));
        }
        webSocket.onerror = () => {
            term.write('\x1b[1;31mconnect ' + host_addr + ' failed\r\n')
        };
        webSocket.onclose = () => {
            term.write('\r\n\x1b[1;31mDisconnected...\r\n');
            this.$refs.dialog.$el.click();
            window.onresize = null
        };
        window.onresize = function() {
            this.TermSize(term, webSocket, Math.floor((document.body.clientHeight - 150) / 18), Math.floor(this.$refs.terminal.offsetWidth / 9));
        }.bind(this)
    },
    methods: {
        TermSize(term, ws, height, width) {
            term.resize(width-2, height-2)
            ws.send('bloke_term_resize,height=' + term.rows + 'width=' + term.cols + ';')
        },
        showDialog() {
            this.$notify({
                title: 'Disconnected...',
                message: '连接已断开 [' + this.$route.params.host + ']',
                type: 'warning',
                duration: 0
            });
        },
        windowChange(fit, term) {
            fit.fit();
            term.scrollToBottom();
        }
    },
}
</script>