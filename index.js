/* USAGE
Google Sheets URL: https://docs.google.com/spreadsheets/d/1u2MJjan_NPsNxqk02Ygo5aldm7TpgAuD7taxf4HJCp8/edit#gid=0
Formula: =IMPORTDATA("https://lkrt5ccdrzdvxp4zc6a7bq3fie0wsqud.lambda-url.us-east-1.on.aws/?query=SELECT+%2A+FROM+samples.nyctaxi.trips+LIMIT+5&server_hostname=enb-colab.cloud.databricks.com&http_path=%2Fsql%2F1.0%2Fwarehouses%2F3753d0134d014cdb&access_token=DATABRICKS_TOKEN")
*/
exports.handler = async (event) => {
    console.log(event);
    var dbsql = require('./queryDatabricksSql.js');
    const queryParams = event.queryStringParameters || {};
    var query           = queryParams.query;  // eg. 'SELECT * FROM samples.nyctaxi.trips LIMIT 5';
    var server_hostname = queryParams.server_hostname;
    var http_path       = queryParams.http_path;
    var access_token    = queryParams.access_token;

    var result = await dbsql.getData(query, server_hostname, http_path, access_token);
    var csvString = dbsql.recordsToCsv(result);

    return {
      statusCode: 200,
      headers: {'Content-Type': 'text/csv'},
      body: csvString,
    };
  };

if(require.main === module) {
  console.log(exports.handler({
    queryStringParameters: {
      query: 'SELECT * FROM samples.nyctaxi.trips LIMIT 5', 
      server_hostname: 'enb-colab.cloud.databricks.com', 
      http_path: '/sql/1.0/warehouses/3753d0134d014cdb', 
      access_token: 'DATABRICKS_TOKEN'}
    }));
}