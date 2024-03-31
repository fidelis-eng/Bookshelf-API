const { v4: uuidv4 } = require('uuid');
const Book = require('./model/Book');
const books = require('./books');

const saveBookhandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // eslint-disable-next-line eqeqeq, quotes
  if (name == null || name == "" || name == "null") {
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

  // eslint-disable-next-line max-len
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
  const { name, reading, finished } = request.query;
  if (books.length >= 0) {
    const querybooks = []; // books response according to query

    if (name != null) {
      for (let i = 0; i < books.length; i += 1) {
        const wordsName = books[i].name.toLowerCase().split(' ');
        const nameQuery = name.toLowerCase();

        for (let j = 0; j < wordsName.length; j += 1) {
          if (wordsName[j] === nameQuery) {
            querybooks.push(searchbooks[i]);
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
    if (reading != null) {
      for (let i = 0; i < books.length; i += 1) {
        // eslint-disable-next-line eqeqeq
        if (books[i].reading == reading) {
          querybooks.push(searchbooks[i]);
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
    if (finished != null) {
      for (let i = 0; i < books.length; i += 1) {
        // eslint-disable-next-line eqeqeq
        if (books[i].finished == finished) {
          querybooks.push(searchbooks[i]);
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

  // eslint-disable-next-line eqeqeq, quotes
  if (name == null || name == "" || name == "null") {
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
