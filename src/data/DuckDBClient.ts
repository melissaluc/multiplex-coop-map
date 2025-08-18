import * as duckdb from "@duckdb/duckdb-wasm";

export class DuckDBClient {
  private db: duckdb.AsyncDuckDB | null = null;
  private conn: duckdb.AsyncDuckDBConnection | null = null;

  async initDuckDB() {
    try {
      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker!}");`], {
          type: "text/javascript",
        })
      );

      const worker = new Worker(worker_url);
      const logger = new duckdb.ConsoleLogger();
      this.db = new duckdb.AsyncDuckDB(logger, worker);
      await this.db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(worker_url);

      this.conn = await this.db.connect();
      await this.conn.query(`
        INSTALL spatial;
        LOAD spatial;`);

      console.log("DuckDB initialized");
    } catch (err) {
      console.error("Error initializing DuckDB:", err);
    }
  }

  async query(sql: string) {
    if (!this.conn) throw new Error("DuckDB not initialized");
    const result = await this.conn.query(sql);
    return result.toArray();
  }

  async registerFile(pattern: string, url: string) {
    if (!this.db) throw new Error("DuckDB not initialized");
    await this.db.registerFileURL(
      pattern,
      url,
      duckdb.DuckDBDataProtocol.HTTP,
      false
    );
  }

  getConnection() {
    return this.conn;
  }
}
