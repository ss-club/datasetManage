const mongoose = require("mongoose")
const md5 = require("md5")

const userSchema  = new mongoose.Schema({
    username: {type: String, require: true},
    password: {type: String, require: true},
    role: {type: String, require: true},
    createRole: {type: String, require: true},
    notes: String,
    createdOn: Number,
    id: String
})

const UserModel = mongoose.model('users', userSchema)
UserModel.findOne({username: 'admin'}).then(user => {
    if(!user) {
      UserModel.create({username: 'admin', password: md5('admin'), role: "admin"})
              .then(user => {
                console.log('初始化用户: 用户名: admin 密码为: admin',"角色:admin")
              })
    }
  })
module.exports = UserModel