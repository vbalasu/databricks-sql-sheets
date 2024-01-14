// IMPORTANT NOTE: See https://stackoverflow.com/questions/73929812/connect-to-databricks-sql-endpoint-using-nodejs
async function getData(query, server_hostname, http_path, access_token) {
    const { DBSQLClient } = require('@databricks/sql');

    const client = new DBSQLClient();
    const utils  = DBSQLClient.utils;

    try {
        await client.connect(
            options = {
                token: access_token,
                host:  server_hostname,
                path:  http_path
            });        
    } catch (error) {
        console.log(error)
    }
    const session = await client.openSession();

    const queryOperation = await session.executeStatement(
        statement = query,
        options   = { runAsync: true });

    await utils.waitUntilReady(
        operation = queryOperation,
        progress  = false,
        callback  = () => {});

    await utils.fetchAll(
        operation = queryOperation
    );

    await queryOperation.close();

    const result = utils.getResult(
        operation = queryOperation
    ).getValue();

    await session.close();
    client.close();

    return result;
}

function recordsToCsv(records) {
    const Papa = require('papaparse');
    return Papa.unparse(records);
}

async function main() {
    require('dotenv').config();
    var query           = 'SELECT * FROM samples.nyctaxi.trips LIMIT 5';
    var server_hostname = process.env.server_hostname;
    var http_path       = process.env.http_path;
    var access_token    = process.env.access_token;

    var result = await getData(query, server_hostname, http_path, access_token);
    var csvString = recordsToCsv(result);
    console.log(csvString);
}

module.exports = { getData, recordsToCsv, main };

if (require.main === module) {
    main()
}
