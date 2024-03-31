const { v4: uuidv4 } = require('uuid');
const Book = require('./model/Book');
const books = require('./books');

const saveBookhandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name == null || name === '' || name === 'null') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    response.type('application/json');
    response.header('X-Custom', 'some-value');

    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    response.type('application/json');
    response.header('X-Custom', 'some-value');

    return response;
  }

  const finished = () => {
    if (readPage === pageCount) {
      return true;
    }
    return false;
  };
  const id = `${uuidv4()}`;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let isSuccess = false;

  books.push(new Book(id, name, year, author, summary, publisher, pageCount, readPage, finished(), reading, insertedAt, updatedAt));

  if (books[books.length - 1].id === id) {
    isSuccess = true;
  }

  if (!isSuccess) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    response.type('application/json');
    response.header('X-Custom', 'some-value');
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  response.type('application/json');
  response.header('X-Custom', 'some-value');

  return response;
};

const getallbookshandler = (request, h) => {
  const searchbooks = []; // books response with only id, name, and publisher
  for (let i = 0; i < books.length; i += 1) {
    searchbooks.push({
      id: books[i].id,
      name: books[i].name,
      publisher: books[i].publisher,
    });
  }
  // request query of name, reading and finished
  const { name, reading, finished } = request.query;
  // processing query
  if (books.length >= 0) {
    const querybooks = []; // books response according to query
    // processing request based on name query
    if (name != null) {
      const nameQueryBooks = searchbooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
      const response = h.response({
        status: 'success',
        data: {
          books: nameQueryBooks,
        },
      });
      response.code(200);
      response.type('application/json');
      response.header('X-Custom', 'some-value');
      return response;
    }
    // processing request based on reading query
    if (reading != null) {
      const readingQueryBooks = books.filter((book) => Boolean(parseInt(reading, 10)) === book.reading);
      for (let i = 0; i < readingQueryBooks.length; i += 1) {
        for (let j = 0; j < books.length; j += 1) {
          if (searchbooks[j].id === readingQueryBooks[i].id) {
            querybooks.push(searchbooks[j]);
            break;
          }
        }
      }
      const response = h.response({
        status: 'success',
        data: {
          books: querybooks,
        },
      });
      response.code(200);
      response.type('application/json');
      response.header('X-Custom', 'some-value');
      return response;
    }
    // processing request based on finished query
    if (finished != null) {
      const finishedQueryBooks = books.filter((book) => Boolean(parseInt(finished, 10)) === book.finished);
      for (let i = 0; i < finishedQueryBooks.length; i += 1) {
        for (let j = 0; j < books.length; j += 1) {
          if (searchbooks[j].id === finishedQueryBooks[i].id) {
            querybooks.push(searchbooks[j]);
            break;
          }
        }
      }
      const response = h.response({
        status: 'success',
        data: {
          books: querybooks,
        },
      });
      response.code(200);
      response.type('application/json');
      response.header('X-Custom', 'some-value');
      return response;
    }
    // response without request query
    const response = h.response({
      status: 'success',
      data: {
        books: searchbooks,
      },
    });
    response.code(200);
    response.type('application/json');
    response.header('X-Custom', 'some-value');
    return response;
  }
  // empty response
  const response = h.response({
    status: 'success',
    data: {
      books: [],
    },
  });
  response.code(200);
  response.type('application/json');
  response.header('X-Custom', 'some-value');
  return response;
};

const getbookhandler = (request, h) => {
  const { bookId } = request.params;
  let isExist = false;
  let iElement = null;

  for (let i = 0; i < books.length; i += 1) {
    if (books[i].id === bookId) {
      isExist = true;
      iElement = i;
      break;
    }
  }

  if (isExist) {
    const response = h.response({
      status: 'success',
      data: {
        book: books[iElement],
      },
    });
    response.code(200);
    response.type('application/json');
    response.header('X-Custom', 'some-value');

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  response.type('application/json');
  response.header('X-Custom', 'some-value');

  return response;
};

const updatebookhandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name == null || name === '' || name === 'null') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    response.type('application/json');
    response.header('X-Custom', 'some-value');

    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    response.type('application/json');
    response.header('X-Custom', 'some-value');

    return response;
  }

  let isExist = false;
  let iElement = null;
  for (let i = 0; i < books.length; i += 1) {
    if (books[i].id === bookId) {
      isExist = true;
      iElement = i;
      break;
    }
  }
  if (!isExist) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    response.type('application/json');
    response.header('X-Custom', 'some-value');

    return response;
  }

  const updatedAt = new Date().toISOString();
  const finished = () => {
    if (readPage === pageCount) {
      return true;
    }
    return false;
  };
  try {
    books[iElement] = new Book(
      bookId,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished(),
      reading,
      books[iElement].insertedAt,
      updatedAt,
    );

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    response.type('application/json');
    response.header('X-Custom', 'some-value');

    return response;
  } catch (err) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal dimodifikasi',
    });
    response.code(500);
    response.type('application/json');
    response.header('X-Custom', 'some-value');
    return response;
  }
};

const deletebookhandler = (request, h) => {
  const { bookId } = request.params;
  let isExist = false;
  let iElement = null;

  for (let i = 0; i < books.length; i += 1) {
    if (bookId === books[i].id) {
      iElement = i;
      isExist = true;
      break;
    }
  }

  if (!isExist) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    response.type('application/json');
    response.header('X-Custom', 'some-value');
    return response;
  }
  const currentSize = books.length;
  books.splice(iElement, 1); // delete the data
  if (currentSize === books.length) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal dihapus',
    });
    response.code(500);
    response.type('application/json');
    response.header('X-Custom', 'some-value');
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  response.type('application/json');
  response.header('X-Custom', 'some-value');
  return response;
};

module.exports = {
  saveBookhandler,
  getallbookshandler,
  getbookhandler,
  updatebookhandler,
  deletebookhandler,
};
