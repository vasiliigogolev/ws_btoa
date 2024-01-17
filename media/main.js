// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const url = 'ws://127.0.0.1:8001';

    const url_input = document.querySelector('.url-input')
    url_input.value = url

    let socket = null

    const connect_button = document.querySelector('.connect-button')
    connect_button.addEventListener('click', () => {
        if (!socket) {
            socket = new WebSocket(url)
        }
        const status = document.querySelector('.status')

        socket.onerror = function(error) {
            status.textContent = 'Status: error'
        }
        socket.onopen = function(e) {
            status.textContent = 'Status: connected'
        }
        socket.onclose = function(event) {
            status.textContent = 'Status: disconnected'
        }

        console.log(socket.url)
    });

    const send_button = document.querySelector('.send-button')
    send_button.addEventListener('click', () => {
        if (!socket) {
            vscode.postMessage('Socket not connected!')
            return
        }
        let input = document.querySelector('.input')
        let text = input.value
        if (!text) {
            vscode.postMessage('Error!')
            return
        }
        let encodedText = btoa(text)
        let obj = JSON.parse(`{"type":"broadcast", "value": { "name": "command", "command": "LAUNCH_LUA_BUFFER", "data": "${encodedText}", "instant": true }}`)
        socket.send(JSON.stringify(obj))
    })
}());


