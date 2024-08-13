import sql from 'mssql';

const config = {
  connectionString: process.env.DB_CONNECTION_STRING
};

let pool;

export async function getConnection() {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
  }
  return pool;
}

export async function query(sqlQuery, params = []) {
  const connection = await getConnection();
  const request = connection.request();
  
  params.forEach((param, index) => {
    request.input(`param${index}`, param);
  });

  const result = await request.query(sqlQuery);
  return result.recordset;
}