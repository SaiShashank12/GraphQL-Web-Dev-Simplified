const express =require('express')
const { graphqlHTTP } = require('express-graphql')
const{
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
}=require('graphql')
const { argsToArgsConfig } = require('graphql/type/definition')

const app=express()
const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const AuthorType=new GraphQLObjectType({
  name:'Author',
  description:'This represent a book of a book',
  fields:()=>({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books:{type:new GraphQLList(BookType),
        resolve : (author)=>{
          return books.filter(book=> book.authorId===author.id)
        }
    }
  })
})

const BookType=new GraphQLObjectType({
  name:'Book',
  description:'This represent a book written by a author',
  fields:()=>({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: AuthorType,
          resolve:(book)=>{
            return authors.find(author =>author.id===book.authorId)
          } }
  })
})

const rootQueryType =new GraphQLObjectType({
  name:'Query',
  description:'Root Qery',
  fields:()=>({
    book1:{
      
      type:(BookType),
      description:'Single book',
      args:{
        id:{type:GraphQLInt}
      },
      resolve:(parent,args)=>books.find(book=> book.id===args.id)
    },
    book:{
      
      type:new GraphQLList(BookType),
      description:'List of books',
      resolve:()=>books
    },
    author:{
      
      type:new GraphQLList(AuthorType),
      description:'List of authors',
      resolve:()=>authors
    },
    author1:{
      
      type: (AuthorType),
      description:'Single author',
      args:{
        id:{type:GraphQLInt}
      },
      resolve:(parent,args)=>authors.find(authors=> authors.id===args.id)
    }
    
  })
})

const RootMutationType=new GraphQLObjectType({
  name:"Mutation",
  description:'Root Mutation',
  fields:()=>({
    addBook:{

      type:BookType,
      description: 'Add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
        books.push(book)
        return book
      }


    },
    addauthor:{

      type:AuthorType,
      description: 'Add a author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name}
        authors.push(author)
        return author
      }


    }
  })
})
const schema=new GraphQLSchema({
  
  query:rootQueryType,
  mutation: RootMutationType
})
app.use(
  '/graphql',
  graphqlHTTP({
    schema:schema,
    graphiql:true
  })
)

app.listen(4000,()=>console.log('Server Running'))