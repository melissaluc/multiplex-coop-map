import duckdb from "@duckdb/node-api";

// Initialize DuckDB (persistent mode)
const db = new duckdb.Database('db.duckdb'); 
const con = db.connect();

export async function loadDataToDuckDB(tableSchema: string, tableName: string, data: any[]) {
    // Inserts data into table in duckDb
    con.run(tableSchema);
    for (const item of data) {
        // add query
        const insertQuery = `${item}`;
        con.run(insertQuery);
    }

    console.log('Data loaded into DuckDb');
}