const express = require('express')
const { buildSchema } = require('graphql')
const {graphqlHTTP} = require('express-graphql')

// 构建schema，这里定义查询的语句和类型
const schema = buildSchema(
`
    type Query {
      Company(position: String): [Company]
      Employees: [Employee]
    }

    type Company {
      name: String
      position: String
      Employees: Int
      Project: [Project]
    }
    type Employee {
      name: String
      ID: Int
      sex: String
      ProjectTeam: String
    }
    type ALlProject {
      project: [Project]
    }
    type Project {
      name: String
    }
    type Mutation  {
      updateCompany(name: String!, position: String!, employees:Int!):Company
    }


`
)

const allCompany = [
  {
    name: 'dingdong',
    position: 'china',
    Employees: 43123,
    Project: [{
      name: 'wms'
    },{
      name: 'mes'
    },{
      name: 'qms'
    }]
  },
  {
    name: 'google',
    position: 'usa',
    Employees: 80000,
    Project: [{
      name: 'flutter'
    },{
      name: 'chrome'
    },{
      name: 'galass'
    }]
  },
  {
    name: 'apple',
    position: 'usa',
    Employees: 100000,
    Project: [{
      name: 'iphine'
    },{
      name: 'imac'
    },{
      name: 'safari'
    }]
  },
  {
    name: 'huawei',
    position: 'china',
    Employees: 43123
  },
]

// 定义查询所对应的 resolver，也就是查询对应的处理器
const root = {
  Company: (position) => {
    console.log('position', position);

    if (!position.position || position.position === '') {
      return allCompany
    }
    return allCompany.filter(e => {
      return e.position === position.position
    })
  },
  Employees: () => {
    return [
      {
        name: 'ming',
        ID: 1,
        sex: 'male',
        ProjectTeam: 'wms',
        company: 'dingdong'
      },
      {
        name: 'mary',
        ID: 2,
        sex: 'female',
        ProjectTeam: 'mes',
        company: 'dingdong'
      },
      {
        name: 'lisi',
        ID: 1,
        sex: 'male',
        ProjectTeam: 'iphone',
        company: 'apple'
      },
      {
        name: 'lisi',
        ID: 1,
        sex: 'male',
        ProjectTeam: 'chrome',
        company: 'google'
      }
    ] 
    },

  updateCompany: (info) => {

    console.log('updateCompany',info);

    const index = allCompany.findIndex(item => {
      return item.name === info.name
    })
    if (index === -1) {
      return 'no result'
    }
    const company = allCompany[index]
    company.position = info.position
    company.Employees = info.employees
    console.log('查询到的公司结果', company);
    return company
  }
}

const app = express()


// 将路由转发给 graphqlHTTP 处理
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
