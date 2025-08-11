export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("Database not configured. Please set database configuration first.");
    this.name = "DatabaseNotConfiguredError";
  }
}
