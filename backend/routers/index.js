const express = require("express")
const router = express.Router()
const md5 = require("md5")
const UserModel = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const PicSetsModel = require("../models/picSets")
const multiparty = require("multiparty")
const fs = require("fs")
const path = require("path")
const { buffer } = require("buffer")
const busboy = require('busboy');
const multer = require('multer')

const dir = path.join(__dirname, "../static/files")
// const upload = multer({ dest: dir })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dir)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })

router.post('/api/upload', upload.single('a_file'), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any    
    console.log(req.body.body)
    console.log(req.body.body[1]);
    const obj = {}
//    for(let [item,value] of req.body.body) {
//     console.log(item);
//     console.log(value);
//    }
});
    
router.post("/api/upload",(req,res) => {
    const form = new multiparty.Form()
    // let count = 0
    // form.on('part', function(part) {
    //     // You *must* act on the part by reading it
    //     // NOTE: if you want to ignore it, just call "part.resume()"
    //     console.log(part);
    //     if (part.filename === undefined) {
    //       // filename is not defined when this is a field and not a file
    //       console.log('got field named ' + part.name);
    //       // ignore field's content
    //       part.resume();
    //     }
      
    //     if (part.filename !== undefined) {
    //       // filename is defined when this is a file
    //       count++;
    //       console.log('got file named ' + part.name);
    //       // ignore file's content here
    //       part.resume();
    //     }      
    //     part.on('error', function(err) {
    //       // decide what to do
    //       console.log(err);
    //     });
    //   });
    console.log(1);
    form.parse(req,(err,fields,file) => {
        console.log(fields);
        console.log(fields.body)
        console.log(JSON.stringify(fields.body[0]))
        console.log(JSON.stringify(fields.body[0][0]));
        const obj = {}
        // fields.body[0][0].forEach((value,key) => {
        //     obj[key] = value
        // });
        try {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir)
            const buffer = fs.readFileSync(fields.formData.path)
            const ws = fs.createWriteStream(`${dir}/smartmore`)
            ws.write(buffer)
            ws.close()
            res.send("切片上传成功")
        } catch (error) {
            console.error(error)
            res.status(500).send(`切片上传失败`)
        }
    })
    res.send("hello")
})

//登录
router.post("/api/login",(req,res)=> {    
    // console.log(req.body);
    const {username, password} = req.body
    UserModel.findOne({username,password: md5(password)})
        .then((user) => {
            if(user) {
                const token = jwt.sign(
                    {
                        username: user.username 
                    },
                    "smartmore",
                    {
                        expiresIn: "48h"
                    }
                )
                user._doc.token = token
                // console.log(user._doc);
                res.send({status:0, data: user})
            } else {
                res.send({status:1 ,data: "账号或密码错误"})
            }
        })
        .catch((err) => {
            console.log(err)
            res.send({status: 1, data: "登录异常，请重试"})
        })
    
})

//个人信息查询
router.get("/api/roles/personal",(req,res) => {
    const {_id} = req.query
    UserModel.findOne({_id: _id})
        .then((data) => {
            // console.log(data);
            res.send({status: 0,data: data})
        })
        .catch((err) => {
            console.log(err);
        })
})

//个人信息修改
router.post("/api/roles/updatePersonal",(req,res) => {
    const {personal, username, notes, revise, password1, password2} = req.body
    if(revise === "info") {
        UserModel.findOneAndUpdate({_id: personal["_id"]},{username:username, notes:notes})
        .then((data) => {
            console.log(data);
            res.send({status: 0, data: data})
            
        })
        .catch((err) => {
            console.log(err);
            res.send({status: 1, data: err})
        })
    } else {
        UserModel.findOne({_id: personal["_id"]})
        .then((data) => {
            console.log("密码修改");
            console.log(data);
            console.log(md5(password1));
            if(data.password === md5(password1)) {
               return UserModel.findOneAndUpdate({_id: personal["_id"]},{password: md5(password2)})
            }       
        })
        .then((data) => {
            console.log(data);
            res.send({status: 0, data: data})
            
        })
        .catch((err) => {
            console.log(err);
            res.send({status: 1, data: err})
        })
    }
    
})

//新增角色
router.post("/api/roles/add",(req,res) => {
    const {username, role, createRole, notes} = req.body
    console.log(req.body);
    UserModel.findOne({username})
        .then((user) => {
            if(user) {
                // console.log(user);
                res.send({status: 1, data: "此用户已存在"})
                return new Promise(() => {
                })
            }
            else {
                return UserModel.create({username,password: md5("smartmore"), role, createRole, notes, createdOn: Date.now()})
            }
        })
        .then((user) => {
            res.send({status: 0,data: user})
        })
        .catch((err) => {
            console.log("新增角色错误",err)
            res.send({status: 1, data: "新增角色出错,请重试"})
        })
})

//个人创建角色查询
router.get("/api/roles/list",(req,res) => {
    const {createRole} = req.query
    UserModel.find({createRole: createRole})
        .then((data) => {
            // console.log(data);
            res.send({status: 0,data: data})
        })
        .catch((err) => {
            console.log(err);
        })
})

//角色删除
router.post("/api/roles/delete",(req,res) => {
    const {_id} = req.body
    UserModel.deleteOne({_id})
        .then((data) => {
            // console.log(data);
            res.send({status: 0})
        })
        .catch((err) => {
            console.log(err);
            res.send("删除出现错误")
        })
})

//角色更新
router.post("/api/roles/update",(req,res) => {
    const {_id, username, role, notes} = req.body
    UserModel.findOneAndUpdate({_id},{username:username, role:role, notes:notes})
        .then((data) => {
            // console.log(data);
            res.send({status: 0, data: data})
            
        })
        .catch((err) => {
            console.log(err);
            res.send({status: 1, data: err})
        })
})


//图片集
//新增图片集
router.post("/api/picSets/add",(req,res) => {
    const {picsetName, createRole, notes} = req.body
    console.log(req.body);
    PicSetsModel.findOne({picsetName})
        .then((user) => {
            if(user) {
                console.log(user);
                res.send({status: 1, data: "此名称已存在"})
                return new Promise(() => {
                })
            }
            else {
                return PicSetsModel.create({picsetName,  createRole, notes, createdOn: Date.now()})
            }
        })
        .then((user) => {
            console.log(user);
            res.send({status: 0,data: user})
        })
        .catch((err) => {
            console.log("新增数据集错误",err)
            res.send({status: 1, data: "新增数据集出错,请重试"})
        })
})

//图片集查询
router.get("/api/picSets/list",(req,res) => {
    const {createRole} = req.query
    console.log(req.query);
    PicSetsModel.find({createRole: createRole})
        .then((data) => {
            console.log(data);
            res.send({status: 0,data: data})
        })
        .catch((err) => {
            console.log(err);
        })
})

//图片集删除
router.post("/api/picSets/delete",(req,res) => {
    const {_id} = req.body
    PicSetsModel.deleteOne({_id})
        .then((data) => {
            console.log(data);
            res.send({status: 0})
        })
        .catch((err) => {
            console.log(err);
            res.send("删除出现错误")
        })
})

//图片集更新
router.post("/api/picSets/update",(req,res) => {
    const {_id, picsetName, notes} = req.body
    console.log(_id, picsetName, notes);
    PicSetsModel.findOneAndUpdate({_id},{picsetName: picsetName, notes:notes})
        .then((data) => {
            console.log(data);
            res.send({status: 0, data: data})
            
        })
        .catch((err) => {
            console.log(err);
            res.send({status: 1, data: err})
        })
})

//文件上传

module.exports = router