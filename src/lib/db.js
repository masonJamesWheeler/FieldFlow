import sql from 'mssql';

const config = {
  connectionString: "Server=tcp:fieldflow-sql.database.windows.net,1433;Initial Catalog=FieldFlow-DB;Persist Security Info=False;User ID=fieldflow;Password=PurpleReign81!!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
};

let pool;

export async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config.connectionString);
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
  console.log(result);
  return result.recordset;
}