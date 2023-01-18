let script = async function enviarScript(scriptText) {
    const lines = scriptText
        .split(/[\n\t]+/)
        .map((line) => line.trim())
        .filter((line) => line)
    ;(main = document.querySelector('#main')),
        (textarea = main.querySelector(`div[contenteditable="true"]`))

    if (!textarea) throw new Error('Não há uma conversa do WhatsApp aberta.')

    for (const line of lines) {
        console.log('Enviado:\n' + line)

        textarea.focus()
        document.execCommand('insertText', false, line)
        textarea.dispatchEvent(new Event('change', { bubbles: true }))

        setTimeout(() => {
            ;(
                main.querySelector(`[data-testid="send"]`) ||
                main.querySelector(`[data-icon="send"]`)
            ).click()
        }, 100)

        if (lines.indexOf(line) !== lines.length - 1)
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Time to send the message
    }
    return lines.length
}

// Copies a string to the clipboard. Must be called from within an
// event handler such as click. May return false if it failed, but
// this is not always possible. Browser support for Chrome 43+,
// Firefox 42+, Safari 10+, Edge and Internet Explorer 10+.
// Internet Explorer: The clipboard feature may be disabled by
// an administrator. By default a prompt is shown the first
// time the clipboard is used (per session).
async function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData('Text', text)
    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        var textarea = document.createElement('textarea')
        textarea.textContent = text
        textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea)
        textarea.select()
        try {
            return document.execCommand('copy') // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn('Copy to clipboard failed.', ex)
            return prompt('Copy to clipboard: Ctrl+C, Enter', text)
        } finally {
            document.body.removeChild(textarea)
        }
    }
}
/* ------------------- [START] ------------------- */

// Acionar o envio do script
let btn = (document.getElementById('btn-code').onclick = () => {
    // Do anything
    // copyToClipboard(code.toString() + '\n' + 'enviarScript(' + text + ')')
    // Pegar o texto do input
    let text = document.getElementById('messageLabel').value
    // copyToClipboard(script.toString() + '\n' + 'enviarScript(' + "'" + text + "'" + ')')
    copyToClipboard(script.toString() + '\n' + 'enviarScript(' + '`' + text + '`' + ')').catch(
        console.error,
    )

    function goCopy() {
        console.log('Código copiado!')
    }
    goCopy()
    console.log(
        'Completado: ' + text.trim().split(/\n{2,}/).length + ' mensagens prontas para envio ✅',
    )
})

// Evitar reload da página
const beforeUnloadListener = (event) => {
    event.preventDefault()
    return (event.returnValue = 'Cuidado: O TEXTO será apagado, quer sair?')
}
const textInput = document.querySelector('#messageLabel')

textInput.addEventListener('input', (event) => {
    if (event.target.value !== '') {
        addEventListener('beforeunload', beforeUnloadListener, { capture: true })
    } else {
        removeEventListener('beforeunload', beforeUnloadListener, { capture: true })
    }
})

document.getElementById('btn-code').addEventListener(
    'click',
    (function (clicked) {
        return function () {
            if (!clicked) {
                let last1 = this.innerHTML
                let last2 = this.style
                this.innerHTML = 'Boa! Código copiado ✅'
                this.style.backgroundColor = '#28a745'
                clicked = true
                setTimeout(
                    function () {
                        this.innerHTML = last1
                        this.style = last2
                        clicked = false
                    }.bind(this),
                    2000,
                )
            }
        }
    })(false),
    this,
)
