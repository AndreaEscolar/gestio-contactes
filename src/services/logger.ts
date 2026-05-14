type LogLevel = 'debug' |'info' | 'warn' | 'error'

const isDev = import.meta.env.DEV

function log(level: LogLevel, message: string, data?: unknown) {
    if(!isDev && level === 'debug') {
        return
    }

    const timestamp = new Date().toLocaleTimeString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    const styles: Record<LogLevel, string> = {
        debug: 'color: #94a3b8',
        info: 'color: #2563eb; font-weight: bold',
        warn: 'color: #f59e0b; font-weight: bold',
        error: 'color: #ef4444; font-weight: bold' 
    }

     if (data) {
        console[level](`%c${prefix} ${message}`, styles[level], data)
    } else {
        console[level](`%c${prefix} ${message}`, styles[level])
    }
}

export const logger = {
    debug: (msg: string, data?: unknown) => log('debug', msg, data),
    info:  (msg: string, data?: unknown) => log('info',  msg, data),
    warn:  (msg: string, data?: unknown) => log('warn',  msg, data),
    error: (msg: string, data?: unknown) => log('error', msg, data),
}
