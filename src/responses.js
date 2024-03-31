const errorResponse = (h, status, code, message) => {
  const response = h.response({
    status: `${status}`,
    message: `${message}`,
  });
  response.code(code);
  response.type('application/json');
  response.header('X-Custom', 'some-value');
  return response;
};

const successResponse = (h, status, code, message = '', dataKey = '', dataValue = '') => {
  const response = h.response({
    status: `${status}`,
  });
  if (message !== '') {
    response.source.message = `${message}`;
  }
  if (dataKey !== '' && dataValue !== '') {
    response.source.data = {};
    response.source.data[dataKey] = dataValue;
  }
  response.code(code);
  response.type('application/json');
  response.header('X-Custom', 'some-value');
  return response;
};

module.exports = {
  errorResponse,
  successResponse,
};
