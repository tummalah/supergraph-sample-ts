import { ApolloServer, gql } from "apollo-server";

import { buildSubgraphSchema } from "@apollo/subgraph";
type employee= {id:string,job_title: string , employee_name: string}
const employees = [
  { id: "1", job_title: "Finance Architect", employee_name: "Krishna" },
  { id: "2", job_title: "O2C Architect", employee_name: "Vijay" },
  { id: "3", job_title: "ERP Platforms Manager", employee_name: "Ravi" },
];

const typeDefs = gql`
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0",
        import: ["@key", "@shareable"])
  type Query {
    Employees: [Employee]
  }

  type Employee @key(fields: "id") {
    id: ID!
    job_title: String
    employee_name: String
  }
`;

const resolvers = {
  Query: {
    Employees(): employee[] {
      return employees;
    },
  },
  Employee: {
    __resolveReference(employee: employee) {
      return employees.find(c => c.id === employee.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Employees service ready at ${url}`);
});