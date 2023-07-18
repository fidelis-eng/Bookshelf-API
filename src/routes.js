const {
  saveBookhandler, getallbookshandler, getbookhandler, updatebookhandler, deletebookhandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: saveBookhandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getallbookshandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getbookhandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updatebookhandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deletebookhandler,
  },
];

module.exports = routes;
