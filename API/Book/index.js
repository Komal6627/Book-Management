//Initializing express router
const Router = require("express").Router();

//Database Model
const BookModel = require("../../database/book");

/*
Route                    /
Description              Get all books
Access                   PUBLIc
Parameter                None
Method                   GET
*/
Router.get("/",async(req, res) => {
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

Router.get("/is/:isbn",async(req,res)=>{

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

Router.get("/c/:category",async (req,res) =>{
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

Router.get("/lang/:language",async(req,res)=>{
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
Route                    /book/add
Description              add new book
Access                   PUBLIc
Parameter                none
Method                   POST
*/

Router.post("/add",async(req,res) =>{
    const {newBook} = req.body;
    
    const addNewBook = BookModel.create(newBook);

    return res.json({books:addNewBook, message:"book was added!"});
});


/*
Route                    /book/update/title
Description              Update book title
Access                   PUBLIc
Parameter                isbn
Method                   PUT
*/

Router.put("/update/title/:isbn",async(req, res) => {
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

Router.put("/update/author/:isbn",async (req, res) => {
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


/* Route                /book/delete
Description              delete a book
Access                   PUBLIc
Parameter                isbn
Method                   DELETE
*/

Router.delete("/delete/:isbn",async(req,res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete(
      {
        ISBN:req.params.isbn,
      }
    );
  
      // const updatedBookDatabase = database.books.filter(
      // (book) => book.ISBN !== req.params.isbn
      // );
  
  //filter will return new array
  
      // database.books = updatedBookDatabase;
      return res.json({books: updatedBookDatabase});
  });


   /* Route                /book/delete/author
Description              delete an author from a book
Access                   PUBLIc
Parameter                isbn,authorId
Method                   DELETE
*/

Router.delete("/delete/author/:isbn/:authorId", async(req,res) => {
    //Update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN : req.params.isbn,
      },
      {
        $pull:{
          author:parseInt(req.params.authorId),
        },
      },
      {
        new:true,
      }
    );
  
    // database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn){
    //       const newAuthorList =book.author.filter(
    //         (author) => author !== parseInt(req.params.authorId)
    //         );
    //       book.author = newAuthorList;
    //       return;
    //     }
    // });
  
     //Update the author database
     const updatedAuthor = await AuthorModel.findOneAndUpdate(
       {
          id:parseInt(req.params.authorId),
       },
       {
         $pull:{
           books:req.params.isbn,
         },
       },
       {
         new:true,
       }
    );
  
    // database.author.forEach((author) => {
    //   if(author.id === parseInt(req.params.authorId)){
    //     const newBookList = author.books.filter(
    //       (book) => book !== req.params.isbn
    //     );
    //     author.books = newBookList;
    //     return;
    //   }
    // });
  
    return res.json(
      {
       message:"author was deleted",
       books: updatedBook, 
       authors: updatedAuthor,
    }
    );
  
  });


  module.exports = Router;