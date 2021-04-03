import winston from "winston";

const dateFormat = () => {
  return new Date(Date.now()).toUTCString();
};
export class LoggerService {
  log_data: any;
  route: any;
  logger: any;

  constructor(route: any) {
    this.log_data = null;
    this.route = route;
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `./logs/${route}.log`,
        }),
      ],
      format: winston.format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${
          info.message
        } | `;
        message = info.obj
          ? message + `data:${JSON.stringify(info.obj)} | `
          : message;
        message = this.log_data
          ? message + `log_data:${JSON.stringify(this.log_data)} | `
          : message;
        return message;
      }),
    });
    this.logger = logger;
  }
  setLogData(log_data: any) {
    this.log_data = log_data;
  }
  async info(message: any, obj?: any) {
    if (obj) {
      this.logger.log("info", message, {
        obj,
      });

      return;
    }

    this.logger.log("info", message);
  }

  async debug(message: any, obj?: any) {
    if (obj) {
      this.logger.log("debug", message, {
        obj,
      });

      return;
    }
    this.logger.log("debug", message);
  }
  public async error(message: any, obj?: any, error?: any) {
    if (obj) {
      this.logger.log("error", message, {
        obj,
        error
      });

      return;
    }
    this.logger.log("error", message);
  }
}
