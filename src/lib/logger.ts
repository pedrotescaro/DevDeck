export interface LogMeta {
  [key: string]: any;
}

export const logger = {
  info(msg: string, meta?: LogMeta) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: msg,
        ...meta,
      })
    );
  },
  warn(msg: string, meta?: LogMeta) {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        message: msg,
        ...meta,
      })
    );
  },
  error(msg: string, meta?: LogMeta) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: msg,
        ...meta,
      })
    );
  },
  debug(msg: string, meta?: LogMeta) {
    console.debug(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        message: msg,
        ...meta,
      })
    );
  },
};
