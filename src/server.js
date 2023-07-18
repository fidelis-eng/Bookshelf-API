// eslint-disable-next-line import/no-extraneous-dependencies
const hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = hapi.server({
    port: 9000,
    host: 'localhost',
  });

  server.route(routes);

  await server.start();
  // eslint-disable-next-line no-console
  console.log('Server running on %s', server.info.uri);
};

init();
