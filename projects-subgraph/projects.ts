import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
type project= {id:string, department_id:string,department_name: string ,project_name: string, employees: string[]}
type employee= {id:string,job_title: string , employee_name: string}
const projects : project[] = [
  { id: "1000", department_id:"100",department_name: "Finance",project_name:"Cybersource", employees: ["1"] },
  { id: "1001",department_id:"101", department_name: "O2C",project_name:"Regulatory", employees: ["2"] },
  { id: "1003",department_id:"102", department_name: "ERP Platform", project_name: "JDE9.2 Upgrade",employees: ["3"] },
];

const typeDefs = gql`
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0",
        import: ["@key", "@shareable","@provides","@external"])
  type Query {
    Projects: [Project]
  }

  type Project @key(fields: "id") {
    id: ID!
    project_name: String
    in_department: Department 
    employees: [Employee]
   
    
  }
  type Department @key(fields: "id"){
      id: ID!
       
    
      
  }

  type Employee @key(fields: "id"){
      id: ID!
      workingInProject: Project
  }
type Query {
    DepartmentbyProjectName: [Department!]! 
}

`;

const resolvers = {

  Query: {
    Projects(): project[] {
      return projects;
    },
    DepartmentbyProjectName(){
        return projects.map(p=>{return {id:p.department_id,department_name: p.department_name}})
    }
  },
  Project: {
   
    
    employees(project: project){
      

      return project.employees.map(e=>{ return { __typename:"Employee" , id:e}})
    },
    in_department(project: project){
      return  { __typename:"Department" , id:project.department_id}
    },

   

   
  },
  
  Employee: {
    workingInProject(employee: employee){
      
     return  projects.find(p=> p.employees.find(e=>e==employee.id))
          
          
    }
  },
  
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

server.listen(4003).then(({ url }) => {
  console.log(`🚀 Projects service ready at ${url}`);
});