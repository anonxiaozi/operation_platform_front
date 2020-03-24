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
import { AttachAddon } from 'xterm-addon-attach';

export default {
    mounted() {
        var send_data = ""
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
        const webSocket = new WebSocket('ws://10.15.101.58:80/ws/chat/first/');
        webSocket.onopen = () => {
            console.log('ws onopen')
        }
        webSocket.onmessage = event => {
            term.writeln(event.data)
            console.log(
                // Base64.decode(JSON.parse(event.data))
                event.data
            )
        }
        webSocket.onclose = ce => {
            console.log(ce)
        };
        const attachAddon = new AttachAddon(socket);
        term.loadAddon(attachAddon);
        // term.attachCustomKeyEventHandler(function(e) {
        //     if (e.keyCode == 13) {
        //         console.log('enter')
        //         webSocket.send(
        //             JSON.stringify({
        //                 message: Base64.encode(send_data)
        //             })
        //         )
        //         send_data = ''
        //     }
        // });
        // term.onData(data => {
        //     if (data !== "") {
        //         term.write(data)
        //         send_data += data
        //     }
        // });
        // // bindTerminal(term, webSocket, true, 0);
    },
    props: ['dialogTerminalVisible'],
    methods: {
        hidenDialog() {
            this.$emit('to-hidenTerminalDialog', false)
        },
    }
}
</script>