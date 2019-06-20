/**
 * Common logging class to extend.
 */
export class FileAware {

  constructor(private className: string) {}

  log(methodName: string, ...args) {
    const spacer = args && args.length > 0 ? ' --- ' : '';

    console.log(`${this.className}.${methodName}${spacer}`, ...args);
  }

  logTable(methodName: string, tableName: string, data: any[]) {
    this.log(methodName);
    console.groupCollapsed(tableName);
    console.table(data);
    console.groupEnd();
  }
}
