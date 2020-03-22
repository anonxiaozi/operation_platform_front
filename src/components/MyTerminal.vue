<template>
    <div class="container">
        <div ref="terminal"></div>
    </div>
</template>
<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Base64 } from "js-base64";
import { WebLinksAddon } from "xterm-addon-web-links"
import { SearchAddon } from "xterm-addon-search"

var bindTerminal = (term, websocket) => {
    term.write('\r\nWelcome to Felix Web Ssh Terminal\n\r\n');
    // send heartbeat package to avoid closing webSocket connection in some proxy environmental such as nginx.
    var send_data = ''
    var heartBeatTimer = setInterval(function() {
        websocket.send(JSON.stringify({ type: "heartbeat", message: "" }));
    }, 20 * 1000);
    websocket.addEventListener("open", () => {
        term.onData(data => {
            send_data += data
            websocket.send(
                JSON.stringify({
                    message: Base64.encode(send_data)
                })
            )
        })
    });
    websocket.addEventListener("message", (event) => {
        term.writeln(event.data);
    })
    websocket.addEventListener("close", function() {
        console.log('close.')
    });
};
export default {
    mounted() {
        const host_addr = this.$route.params.host;
        const term = new Terminal({
            termName: host_addr
        });
        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();
        const searchAddon = new SearchAddon();
        term.loadAddon(fitAddon);
        term.loadAddon(webLinksAddon);
        term.loadAddon(searchAddon);
        term.open(this.$refs.terminal);
        term.write('Hello....[' + host_addr + ']');
        const webSocket = new WebSocket('ws://10.15.101.58:80/t/');
        webSocket.onclose = ce => {
            console.log(ce)
        };
        // bindTerminal(term, webSocket, true, 0);
    },
    props: ['dialogTerminalVisible'],
    methods: {
        hidenDialog() {
            this.$emit('to-hidenTerminalDialog', false)
        },
    }
}
</script>