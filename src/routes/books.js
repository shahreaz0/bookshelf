const router = require("express").Router();
const Book = require("../models/Book");

// GET --> /books --> Shows All books
// POST --> /books --> Create books
// GET --> /books/new --> Show create book form
// GET --> /books/new --> Show individual book in details
// PUT --> /books/:id/ --> Edit books
// GET --> /books/:id/edit --> Show edit book form
// DELETE --> /books/:id/ --> Delete book

module.exports = router;
