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

booky.get("/",async(req, res) => {
  const getAllBooks = await BookModel.find();  
  return res.json(getAllBooks);   
});

/*
Route                    /is
Description              Get specific based on isbn
Access                   PUBLIc
Parameter                isbn
Method                   GET
*/

booky.get("/is/:isbn",async(req,res)=>{

    const getSpecificBook = await BookModel.findOne( {ISBN:req.params.isbn} );

    // const getSpecificBook = database.books.filter(
    //   (book)=> book.ISBN === req.params.isbn
    // );

    if(!getSpecificBook){
        return res.json({
          error:`No book found for the ISBN of ${req.params.isbn}`,
        });
    }

    return res.json({book : getSpecificBook});
});

/*
Route                    /c
Description              Get specific book based on category
Access                   PUBLIc
Parameter                category
Method                   GET
*/

booky.get("/c/:category",async (req,res) =>{
  const getSpecificBook = await BookModel.findOne({category : req.params.category});

    // const getSpecificBook = database.books.filter(
    //     (book) => book.category.includes(req.params.category)
    // );


    if(!getSpecificBook){
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

booky.get("/lang/:language",async(req,res)=>{
   const getSpecificBook = await BookModel.findOne({language : req.params.language});          

    // const getSpecificBook = database.books.filter(
    //   (book)=> book.language === req.params.language
    // );

    if(!getSpecificBook){
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

booky.get("/author", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ authors:getAllAuthors});
});

/*
Route                    /author/name
Description              Get specific author
Access                   PUBLIc
Parameter                name
Method                   GET
*/

booky.get("/author/:name",async(req,res) => {

    const getSpecificAuthor = await AuthorModel.findOne({name:req.params.name});
    // const getSpecificAuthor = database.author.filter(
    //    (author) => author.name.includes(req.params.name)
    // );

    if(!getSpecificAuthor){
        return res.json({error:`No book found of name ${req.params.name}`});
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

booky.get("/author/book/:isbn", async(req,res) => {
  const getSpecificAuthor = await AuthorModel.findOne({ books:req.params.isbn});
 

  if(!getSpecificAuthor){
      return res.json({error:`No book found of name ${req.params.isbn}`});
  }
  
  return res.json({authors : getSpecificAuthor});
});

/*
Route                    /publication
Description              Get all author based on books
Access                   PUBLIc
Parameter                /publications
Method                   GET
*/

booky.get("/publication",async(req,res)=>{
  const getAllPublication = await PublicationModel.find();
    return res.json({publication:getAllPublication});
});

/*
Route                    /publication
Description              Get specific publication
Access                   PUBLIc
Parameter                /publications/name
Method                   GET
*/

booky.get("/publication/:name",async(req,res)=>{

  const getSpecificPublication = await PublicationModel.findOne({name:req.params.name});

  if(!getSpecificPublication){
      return res.json({error:`No publication found of name ${req.params.name}`});
  }
  
  return res.json({author:getSpecificPublication});
});

/*
Route                    /publication
Description              get list of publication based on book
Access                   PUBLIc
Parameter                /publications/book/:isbn
Method                   GET
*/

booky.get("/publication/book/:isbn",async(req,res) => {
        const getSpecificPublication = await PublicationModel.findOne({books:req.params.isbn});

    // const getSpecificPublication = database.publication.filter(
    //     (publication) => publication.books.includes(req.params.isbn)
    // );

    if(!getSpecificPublication){
        return res.json({error:`No publication found for the book of ${req.params.isbn},`});
    }

    return res.json({publications:getSpecificPublication});
});

/*
Route                    /book/add
Description              add new book
Access                   PUBLIc
Parameter                none
Method                   POST
*/

booky.post("/book/add",async(req,res) =>{
    const {newBook} = req.body;
    
    const addNewBook = BookModel.create(newBook);

    return res.json({books:addNewBook, message:"book was added!"});
});

/*
Route                    /author/add
Description              add new author
Access                   PUBLIc
Parameter                none
Method                   POST
*/

booky.post("/author/add",async(req,res) =>{
    const {newAuthor} = req.body;

    AuthorModel.create(newAuthor);

    return res.json({message:"author was added"});
});

booky.post("/publication/add",(req,res) =>{
    const {newPublication} = req.body;

    PublicationModel.create(newPublication);

    return res.json({message:"publication was added"});
});

/*
Route                    /book/update/title
Description              Update book title
Access                   PUBLIc
Parameter                isbn
Method                   PUT
*/

booky.put("/book/update/title/:isbn",async(req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN : req.params.isbn,
      },
      {
        title : req.body.bookTitle,
      },
      {
        new:true,
      }
      );
  //  database.books.forEach((book) => {
  //      if (book.ISBN === req.params.isbn) {
  //       book.title = req.body.newBookTitle;
  //       return;
  //     }
  //   });
    
    return res.json({ books: updatedBook});
  });


  /*
Route                    /book/update/author
Description              Update/add new author for a book
Access                   PUBLIc
Parameter                isbn
Method                   PUT
*/

booky.put("/book/update/author/:isbn",async (req, res) => {
  // update book database

  const updatedBook =await BookModel.findOneAndUpdate(
    {
        ISBN:req.params.isbn,
    },
    {
        $addToSet:{
            author:req.body.newAuthor,
        },
    },
    {
      new:true,
    }
  );


    // database.books.forEach((book) => {
    //   if (book.ISBN === req.params.isbn) {
    //     return book.author.push(parseInt(req.params.authorId));
    //   }
    // });
  
    // update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
         id:req.body.newAuthor,
      },
      {
         $addToSet:{
           books:req.params.isbn,
         },
      },
      {
        new:true,
      }
    );
  
    // database.author.forEach((author) => {
    //   if (author.id === parseInt(req.params.authorId))
    //     return author.books.push(req.params.isbn);
    // });
  
    return res.json({ 
      books: updatedBook,
      authors: updatedAuthor,
      message:"New author was added",
     });
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

