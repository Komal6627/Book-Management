const Router = require("express").Router();

const AuthorModel = require("../../database/author");


/*
Route                    /author
Description              Get all authors
Access                   PUBLIc
Parameter                none
Method                   GET
*/

Router.get("/", async (req,res) => {
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

Router.get("/:name",async(req,res) => {

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

Router.get("/book/:isbn", async(req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({ books:req.params.isbn});
   
  
    if(!getSpecificAuthor){
        return res.json({error:`No book found of name ${req.params.isbn}`});
    }
    
    return res.json({authors : getSpecificAuthor});
  });


  /*
Route                    /author/add
Description              add new author
Access                   PUBLIc
Parameter                none
Method                   POST
*/

Router.post("/add",async(req,res) =>{
    const {newAuthor} = req.body;

    AuthorModel.create(newAuthor);

    return res.json({message:"author was added"});
});


/*
Route                    /author/update/name
Description              Update author name using it's id 
Access                   PUBLIc
Parameter                authorId
Method                   PUT
*/

Router.put("/update/name/:authorId",async (req, res) => {
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
          id:parseInt(req.params.authorId),
      },
      {
          name:req.body.authorName,
      },
      {
          new:true
      }
    );
    // database.author.forEach((author) => {
    //   if (author.id === parseInt(req.params.authorId)) {
    //     author.name = req.body.newAuthorName;
    //     return;
    //   }
    // });
  
    return res.json({ authors:updatedAuthor});
  });


  /* Route                /author/delete
Description              Delete an author
Access                   PUBLIc
Parameter                authorId
Method                   DELETE
*/

Router.delete("/delete/:authorId",async(req,res) => {
    const updatedAuthor = await AuthorModel.findOneAndDelete(
      {
        id:parseInt(req.params.authorId),
      }
    );
  // const updatedAuthorDatabase = database.author.filter(
  // (author) => author.id !== parseInt(req.params.authorId)
  // );

//filter will return new array

  // database.author =  updatedAuthorDatabase ;
  return res.json({authors: updatedAuthor});
});

module.exports = Router;