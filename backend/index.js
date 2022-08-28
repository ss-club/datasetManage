const mongoose = require("mongoose")
const express = require("express")
const { expressjwt: jwt } = require("express-jwt")

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))


//jwt鉴权
app.use(
    jwt({
      secret: "smartmore",
      algorithms: ["HS256"],      
    }).unless({ path: ["/api/login"] })
  );
const indexRouter = require("./routers")
app.use('/', indexRouter) 


mongoose.connect("mongodb+srv://ss:ad193608@cluster0.ogpdcz5.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser: true})
    .then(()=> {
        console.log("数据库连接成功");
        app.listen("5000", () => {
            console.log("服务器启动成功,请访问http://localhost:5000")
        })
    })
    .catch((err) => {
        console.log(err)
    })