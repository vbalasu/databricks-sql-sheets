# databricks-sql-sheets

```mermaid
graph LR;
server_hostname --> lambda(AWS Lambda\ndatabricks-sql-sheets);
http_path --> lambda;
access_token --> lambda;
query --> lambda;
lambda --> CSV;
```

<img src="media/sheets.png" width="100%" />