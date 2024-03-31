const { v4: uuidv4 } = require('uuid');
const Book = require('./model/Book');
const books = require('./books');
const responses = require('./responses');

const saveBookhandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name == null || name === '' || name === 'null') {
    return responses.errorResponse(h, 'fail', 400, 'Gagal menambahkan buku. Mohon isi nama buku');
  }
  if (readPage > pageCount) {
    return responses.errorResponse(h, 'fail', 400, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
  }

  const finished = () => (readPage === pageCount);
  const id = `${uuidv4()}`;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let isSuccess = false;

  books.push(new Book(id, name, year, author, summary, publisher, pageCount, readPage, finished(), reading, insertedAt, updatedAt));

  if (books[books.length - 1].id === id) {
    isSuccess = true;
  }

  if (!isSuccess) {
    return responses.errorResponse(h, 'error', 500, 'Buku gagal ditambahkan');
  }

  return responses.successResponse(h, 'success', 201, 'Buku berhasil ditambahkan', 'bookId', id);
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
      return responses.successResponse(h, 'success', 200, '', 'books', nameQueryBooks);
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
      return responses.successResponse(h, 'success', 200, '', 'books', querybooks);
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
      return responses.successResponse(h, 'success', 200, '', 'books', querybooks);
    }
    // response without request query
    return responses.successResponse(h, 'success', 200, '', 'books', searchbooks);
  }
  // empty response
  return responses.successResponse(h, 'success', 200, '', 'books', []);
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
    return responses.successResponse(h, 'success', 200, '', 'book', books[iElement]);
  }
  return responses.errorResponse(h, 'fail', 404, 'Buku tidak ditemukan');
};

const updatebookhandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name == null || name === '' || name === 'null') {
    return responses.errorResponse(h, 'fail', 400, 'Gagal memperbarui buku. Mohon isi nama buku');
  }
  if (readPage > pageCount) {
    return responses.errorResponse(h, 'fail', 400, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
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
    return responses.errorResponse(h, 'fail', 404, 'Gagal memperbarui buku. Id tidak ditemukan');
  }

  const updatedAt = new Date().toISOString();
  const finished = () => (readPage === pageCount);
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
    return responses.successResponse(h, 'success', 200, 'Buku berhasil diperbarui');
  } catch (err) {
    return responses.errorResponse(h, 'error', 500, 'Buku gagal dimofikasi');
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
    return responses.errorResponse(h, 'fail', 404, 'Buku gagal dihapus. Id tidak ditemukan');
  }
  const currentSize = books.length;
  books.splice(iElement, 1); // delete the data
  if (currentSize === books.length) {
    return responses.errorResponse(h, 'error', 500, 'Buku gagal dihapus');
  }
  return responses.successResponse(h, 'success', 200, 'Buku berhasil dihapus');
};

module.exports = {
  saveBookhandler,
  getallbookshandler,
  getbookhandler,
  updatebookhandler,
  deletebookhandler,
};
