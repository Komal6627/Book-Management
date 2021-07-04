require("dotenv").config();

//Frame Work
const express = require("express");
const mongoose = require("mongoose"); 

//Database
const database = require("./database/index");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialization
const booky = express();

//cofiguration
booky.use(express.json());

//Establish Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(() => console.log("Connection Established !!"));

/*
Route                    /
Description              Get all books
Access                   PUBLIc
Parameter                None
Method                   GET
*/

booky.get("/",(req, res) => {    
    return res.json({books:database.books});   
});

/*
Route                    /is
Description              Get specific based on isbn
Access                   PUBLIc
Parameter                isbn
Method                   GET
*/

booky.get("/is/:isbn",(req,res)=>{
    const getSpecificBook = database.books.filter(
      (book)=> book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0){
        return res.json({error:`NO book found for the ISBN of ${req.params.isbn}`,
    });
    }

    return res.json({book:getSpecificBook});
});

/*
Route                    /c
Description              Get specific book based on category
Access                   PUBLIc
Parameter                category
Method                   GET
*/

booky.get("/c/:category",(req,res) =>{
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );


    if(getSpecificBook.length === 0){
        return res.json({error:`NO book found for the Category of ${req.params.category}`,
    });
    }

    return res.json({book:getSpecificBook});
});

/*
Route                    /l
Description              Get specific book based on languages
Access                   PUBLIc
Parameter                language
Method                   GET
*/

booky.get("/lang/:language",(req,res)=>{
    const getSpecificBook = database.books.filter(
      (book)=> book.language === req.params.language
    );

    if(getSpecificBook.length === 0){
        return res.json({error:`NO book found for the language of ${req.params.language}`,
    });
    }

    return res.json({book:getSpecificBook});
});

/*
Route                    /author
Description              Get all authors
Access                   PUBLIc
Parameter                none
Method                   GET
*/

booky.get("/author", (req,res) => {
    return res.json({author:database.author});
});

/*
Route                    /author/name
Description              Get specific author
Access                   PUBLIc
Parameter                name
Method                   GET
*/

booky.get("/author/:name",(req,res) => {
    const getSpecificAuthor = database.author.filter(
       (author) => author.name.includes(req.params.name)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({error:`No book found of name ${req.params.name}`})
    }
    
    return res.json({author:getSpecificAuthor});
});

/*
Route                    /author/book
Description              Get all author based on books
Access                   PUBLIc
Parameter                name
Method                   GET
*/

booky.get("/author/book/:isbn",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({error:`No author found for the book of ${req.params.isbn},`});
    }

    return res.json({author:getSpecificAuthor});
});

/*
Route                    /publication
Description              Get all author based on books
Access                   PUBLIc
Parameter                /publications
Method                   GET
*/

booky.get("/publications",(req,res)=>{
    return res.json({publication:database.publication});
});

/*
Route                    /publication
Description              Get specific publication
Access                   PUBLIc
Parameter                /publications/name
Method                   GET
*/

booky.get("/publications/:name",(req,res)=>{
        const getSpecificPublication =database.publication.filter(
            (publication) =>publication.name.includes(req.params.name)
        );

        if(getSpecificPublication.length === 0){
            return res.json({error:`No publication found of this name ${res.params.name}`});
        }
        return res.json({publication:getSpecificPublication});
});

/*
Route                    /publication
Description              get list of publication based on book
Access                   PUBLIc
Parameter                /publications/book/:isbn
Method                   GET
*/

booky.get("/publications/book/:isbn",(req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if(getSpecificPublication.length === 0){
        return res.json({error:`No publication found for the book of ${req.params.isbn},`});
    }

    return res.json({publication:getSpecificPublication});
});

/*
Route                    /book/add
Description              add new book
Access                   PUBLIc
Parameter                none
Method                   POST
*/

booky.post("/book/add",(req,res) =>{
    const {newBook} = req.body;

    database.books.push(newBook);
    return res.json({books:database.books});
});

/*
Route                    /author/add
Description              add new author
Access                   PUBLIc
Parameter                none
Method                   POST
*/

booky.post("/author/add",(req,res) =>{
    const {newAuthor} = req.body;

    database.author.push(newAuthor);
    return res.json({authors:database.author});
});

booky.post("/publication/add",(req,res) =>{
    const {newPublication} = req.body;

    database.publication.push(newPublication);
    return res.json({publication:database.publication});
});

/*
Route                    /book/update/title
Description              Update book title
Access                   PUBLIc
Parameter                isbn
Method                   PUT
*/

booky.put("/book/update/title/:isbn", (req, res) => {
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        book.title = req.body.newBookTitle;
        return;
      }
    });
    
    return res.json({ books: database.books });
  });


  /*
Route                    /book/update/author
Description              Update/add new author for a book
Access                   PUBLIc
Parameter                isbn
Method                   PUT
*/

booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
    // update book database
  
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        return book.author.push(parseInt(req.params.authorId));
      }
    });
  
    // update author database
  
    database.author.forEach((author) => {
      if (author.id === parseInt(req.params.authorId))
        return author.books.push(req.params.isbn);
    });
  
    return res.json({ books: database.books, author: database.author });
  });
  
/*
Route                    /author/update/name
Description              Update author name using it's id 
Access                   PUBLIc
Parameter                authorId
Method                   PUT
*/

booky.put("/author/update/name/:authorId", (req, res) => {
    database.author.forEach((author) => {
      if (author.id === parseInt(req.params.authorId)) {
        author.name = req.body.newAuthorName;
        return;
      }
    });
  
    return res.json({ author: database.author});
  });

 /* Route                /publication/update/name
Description              Update publication name using it's id 
Access                   PUBLIc
Parameter                pubId
Method                   PUT
*/

booky.put("/publication/update/name/:pubId", (req, res) => {
    database.publication.forEach((publication) => {
      if (publication.id === parseInt(req.params.pubId)) {
        publication.name = req.body.newPublicationName;
        return;
      }
    });
  
    return res.json({ publications: database.publication});
  });



 /* Route                /publication/update/book
Description              Update/add book for publication
Access                   PUBLIc
Parameter                isbn
Method                   PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publication.forEach((publication) => {
      if (publication.id === req.body.pubId) {
        return publication.books.push(req.params.isbn);
      }
    });
  
    // update the book database
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        book.publication = req.body.pubId;
        return;
      }
    });
  
    return res.json({
      books: database.books,
      publications: database.publications,
      message: "Successfully updated publication",
    });
  });

  
 /* Route                /book/delete
Description              delete a book
Access                   PUBLIc
Parameter                isbn
Method                   DELETE
*/

booky.delete("/book/delete/:isbn",(req,res) => {
    const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
    );

//filter will return new array

    database.books = updatedBookDatabase;
    return res.json({books:database.books});
});


 /* Route                /book/delete/author
Description              delete an author from a book
Access                   PUBLIc
Parameter                isbn,authorId
Method                   DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book database
  database.books.forEach((book) => {
      if(book.ISBN === req.params.isbn){
        const newAuthorList =book.author.filter(
          (author) => author !== parseInt(req.params.authorId)
          );
        book.author = newAuthorList;
        return;
      }
  });

   //Update the author database
  database.author.forEach((author) => {
    if(author.id === parseInt(req.params.authorId)){
      const newBookList = author.books.filter(
        (book) => book !== req.params.isbn
      );
      author.books = newBookList;
      return;
    }
  });

  return res.json({
    message:"author was deleted",
    book: database.books, 
    author: database.author
  });

});

 /* Route                /author/delete
Description              Delete an author
Access                   PUBLIc
Parameter                authorId
Method                   DELETE
*/

booky.delete("/author/delete/:authorId",(req,res) => {
  const updatedAuthorDatabase = database.author.filter(
  (author) => author.id !== parseInt(req.params.authorId)
  );

//filter will return new array

  database.author =  updatedAuthorDatabase ;
  return res.json({author: updatedAuthorDatabase});
});

 /* Route                /publication/delete
Description              DELETE the publication
Access                   PUBLIc
Parameter                pubId
Method                   DELETE
*/

booky.delete("/publication/delete/:pubId",(req,res) => {
  const updatedPublicationDatabase = database.publication.filter(
  (publication) => publication.id !== parseInt(req.params.pubId)
  );

  database.publication = updatedPublicationDatabase;
  return res.json({publication: updatedPublicationDatabase});
});

 /* Route                /publication/delete/book/
Description              Delete book from publication
Access                   PUBLIc
Parameter                isbn,pubId
Method                   DELETE
*/

booky.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  // update publication database
  database.publication.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  // update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; // no publication available
      return;
    }
  });

  return res.json({
    books: database.books,
    publication: database.publication,
  });
});


booky.listen(3240, () => console.log("Hey sever is running🙂"));

