const net = require('net');
const { URL } = require('url');

const dbUrlStr = process.env.DATABASE_URL;
if (!dbUrlStr) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

try {
  // Replace postgresql:// with http:// so URL parser doesn't fail on custom protocol
  const normalizedUrl = dbUrlStr
    .replace(/^postgresql:\/\//, 'http://')
    .replace(/^postgres:\/\//, 'http://');
  const dbUrl = new URL(normalizedUrl);
  const host = dbUrl.hostname || 'db';
  const port = parseInt(dbUrl.port || '5432', 10);

  console.log(`Waiting for database at ${host}:${port}...`);

  const maxAttempts = 30;
  let attempts = 0;

  const checkConnection = () => {
    attempts++;
    const socket = net.createConnection({ host, port, timeout: 2000 }, () => {
      console.log('Database is ready! Port is accepting connections.');
      socket.end();
      process.exit(0);
    });

    socket.on('error', (err) => {
      socket.destroy();
      if (attempts >= maxAttempts) {
        console.error('Database connection timeout. Exiting...');
        process.exit(1);
      }
      console.log(
        `Database not ready (attempt ${attempts}/${maxAttempts}), retrying in 2 seconds...`
      );
      setTimeout(checkConnection, 2000);
    });
  };

  checkConnection();
} catch (e) {
  console.error('Failed to parse DATABASE_URL:', e);
  process.exit(1);
}
