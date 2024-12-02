class custom_error extends Error {
    constructor({code, message, server_state, ui_action}) {
        super(message)
        this.code = code
        this.server_state = server_state
        this.ui_action = ui_action
    }
}

module.exports = custom_error




