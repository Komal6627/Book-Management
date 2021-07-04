let books = [
    {
        ISBN:"123Book",
        title:"Getting started with MERN",
        pubdate:"2021-07-07", 
        language:"English",
        numpage:"250",
        author:[1,2],
        publication:1,
        category:["tech","programming","education","thrillar"],
    },

    {
        ISBN:"123OneBook",
        title:"Pyhton Programming",
        pubdate:"2021-07-07", 
        language:"English",
        numpage:"250",
        author:[1,2],
        publication:[1],
        category:["tech","programming","education"],
    },

    {
        ISBN:"123TwoBook",
        title:"Getting started with Java",
        pubdate:"2021-07-07", 
        language:"English",
        numpage:"250",
        author:[1,2],
        publication:[1],
        category:["tech","programming","education","thrillar"],
    },
];

const author = [
    {
        id:1,
        name:"Komal",
        books:["123Book","123SecretBook"],
    },
    {
        id:2,
        name:"Elon Musk",
        books:["123Book"],
    },
];

const publication = [
    {
        id:1,
        name:"writex",
        books:["123Book"],
    },
    
    {
        id:2,
        name:"Technology",
        books:["123Book"],
    },

    {
        id:3,
        name:"Research",
        books:["111NB"],
    },
];

module.exports = {books, author, publication};