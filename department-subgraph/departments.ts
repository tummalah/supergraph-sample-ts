import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
type department= {id:string,department_name: string , employees: string[]}
type employee= {id:string,job_title: string , employee_name: string}
const departments : department[] = [
  { id: "100", department_name: "Finance", employees: ["1"] },
  { id: "101", department_name: "O2C", employees: ["2"] },
  { id: "103", department_name: "ERP Platform", employees: ["3"] },
];

const typeDefs = gql`
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0",
        import: ["@key", "@shareable"])
  type Query {
    Departments: [Department]
  }

  type Department @key(fields: "id") {
    id: ID!
    department_name: String @shareable
    employees: [Employee]
   
    
  }

  type Employee @key(fields: "id"){
      id: ID!
      belongsIn: Department
  }
`;

const resolvers = {

  Query: {
    Departments(): department[] {
      return departments;
    },
  },
  Department: {
    __resolveReference(department: department) {
      return departments.find(d => d.id === department.id);
    },
    
    employees(department: department){
      console.log(department )

      return department.employees.map(e=>{console.log(e); return { __typename:"Employee" , id:e}})
    }
   
  },
  
  Employee: {
    belongsIn(employee: employee){
      
     return  departments.find(d=> d.employees.find(e=>e==employee.id))
          
          
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Departments service ready at ${url}`);
});