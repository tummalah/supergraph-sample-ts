import {ApolloGateway,IntrospectAndCompose} from "@apollo/gateway";
import {ApolloServer} from "apollo-server";
const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: 'employees', url: 'http://localhost:4001' },
        { name: 'departments', url: 'http://localhost:4002' },
        {name:"projects", url: 'http://localhost:4003'}
        // ...additional subgraphs...
      ],
    }),
  });

  const server = new ApolloServer({
    gateway,
   
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`);
  });