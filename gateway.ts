import {ApolloGateway,IntrospectAndCompose} from "@apollo/gateway";
import {ApolloServer} from "apollo-server";
const springbootDGS= [
  // for subgraphs in springboot 
  { name: 'employees', url: 'http://localhost:8080/graphql' },
{ name: 'departments', url: 'http://localhost:8081/graphql' },
{name:"projects", url: 'http://localhost:8082/graphql'}
  // ...additional subgraphs...
];
const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: springbootDGS,
    }),
  });

  const server = new ApolloServer({
    gateway,
   
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`);
  });