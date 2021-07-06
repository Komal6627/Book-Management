const Router = require("express").Router();

const PublicationModel = require("../../database/publication");


/*
Route                    /publication
Description              Get all author based on books
Access                   PUBLIc
Parameter                /publications
Method                   GET
*/

Router.get("/",async(req,res)=>{
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

Router.get("/:name",async(req,res)=>{

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

Router.get("/book/:isbn",async(req,res) => {
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
Route                    /publication/add
Description              add new publication
Access                   PUBLIc
Parameter                none
Method                   POST
*/

Router.post("/add",(req,res) =>{
    const {newPublication} = req.body;

    PublicationModel.create(newPublication);

    return res.json({message:"publication was added"});
});


/* Route                /publication/update/name
Description              Update publication name using it's id 
Access                   PUBLIc
Parameter                pubId
Method                   PUT
*/

Router.put("/update/name/:pubId", async(req, res) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      {
        id:parseInt(req.params.pubId),
      },
      {
        name:req.body.pubName,
      },
      {
        new:true,
      }
    );
// database.publication.forEach((publication) => {
//   if (publication.id === parseInt(req.params.pubId)) {
//     publication.name = req.body.newPublicationName;
//     return;
//   }
// });

return res.json({ publications: updatedPublication});
});


 /* Route                /publication/update/book
Description              Update/add book for publication
Access                   PUBLIc
Parameter                isbn
Method                   PUT
*/

Router.put("/update/book/:isbn", async(req, res) => {
    // update the publication database
      const updatedPublication =await PublicationModel.findOneAndUpdate(
        {
            id:req.body.pubId,
        },
        {
          $addToSet:
          {
            books:req.params.isbn,
          },           
        },
        {
            new:true,
        }
        );

    // database.publication.forEach((publication) => {
    //   if (publication.id === req.body.pubId) {
    //     return publication.books.push(req.params.isbn);
    //   }
    // });
  
    // update the book database
      const updatedBook =await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn,
        },
        {
             publication:req.body.pubId,
        },
        {
           new:true
        }
      );
     
    // database.books.forEach((book) => {
    //   if (book.ISBN === req.params.isbn) {
    //     book.publication = req.body.pubId;
    //     return;
    //   }
    // });
  
    return res.json({
      books: updatedBook,
      publications: updatedPublication,
      message: "Successfully updated publication",
    });
  });


   /* Route                /publication/delete
Description              DELETE the publication
Access                   PUBLIc
Parameter                pubId
Method                   DELETE
*/

Router.delete("/delete/:pubId",async(req,res) => {
    const updatedPublication = await PublicationModel.findOneAndDelete(
      {
         id:req.params.pubId,
      },
    );
    // const updatedPublicationDatabase = database.publication.filter(
    // (publication) => publication.id !== parseInt(req.params.pubId)
    // );
  
    // database.publication = updatedPublicationDatabase;
    return res.json({publication: updatedPublication});
  });


  /* Route                /publication/delete/book/
Description              Delete book from publication
Access                   PUBLIc
Parameter                isbn,pubId
Method                   DELETE
*/

Router.delete("/delete/book/:isbn/:pubId",async(req, res) => {
    // update publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      {
         id:req.params.pubId,
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
    // database.publication.forEach((publication) => {
    //   if (publication.id === parseInt(req.params.pubId)) {
    //     const newBooksList = publication.books.filter(
    //       (book) => book !== req.params.isbn
    //     );
  
    //     publication.books = newBooksList;
    //     return;
    //   }
    // });
  
    // update book database
    
    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN:req.params.isbn,
      },
      {
        publication:req.params.pubId,
      },
      {
        new:true,
      }
      
    );
  
  
    // database.books.forEach((book) => {
      // if (book.ISBN === req.params.isbn) {
      //   book.publication = 0; // no publication available
      //   return;
      // }
    // });
  
    return res.json({
      message:"Book deleted successfully",
      publications: updatedPublication,
      books:updatedBook
    });
  });

  module.exports = Router;