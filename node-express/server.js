

const {User} = require('./models')
const {List} = require('./models')


const express = require('express')
const jwt = require('jsonwebtoken')
const SECRET = 'dsadasdasdasd'
const app = express()
app.use(express.json())
app.use((req, res, next) => {
    // 设置是否运行客户端设置 withCredentials
    // 即在不同域名下发出的请求也可以携带 cookie
    res.header("Access-Control-Allow-Credentials",true)
    // 第二个参数表示允许跨域的域名，* 代表所有域名
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
    // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})
app.get('/api/users',async(req,res)=>{
    const users = await User.find({'username': {$regex: req.query.query, $options:'i'}}).limit(Number(req.query.pagesize)).skip(Number(req.query.pagenum))
    const userss = await User.find().count()
    console.log(userss)
    res.send(users)
})//.skip('pagesize'+'total) .limit(total)
const auth = async (req,res,next)=>{
    const raw = String(req.headers.authorization).split(' ').pop()
    const {id} = jwt.verify(raw,SECRET)
    req.user = await  User.findById(id)
    next()
}
app.get('/api/profile', auth , async (req,res)=>{
    res.send(req.user)
})
app.post('/api/register',async(req,res)=>{
    const users = await User.find({'username': req.body.username});
    if(users==0){
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            mg_state: req.body.mg_state,
        })
        return  res.send({
            data:user,
            meta:{
                message:'注册成功',
                status:200
            }
        })
    }
    res.send({data:null,
        meta:{
            message:'注册失败，已存在该用户名',
            status:400
        }
    })
})
app.post('/api/login',async(req,res)=>{
    const user = await User.findOne({
        username:req.body.username
    })
    if(!user){
        return  res.send({
            data:null,
            meta:{
                message:'用户名不存在',
                status:400
            }
        })
    }
    const isPasswordValid = require('bcryptjs').compareSync(
        req.body.password,
        user.password
    )
    if(!isPasswordValid){
        return  res.send({
            data:null,
            meta:{
                message:'密码错误',
                status:400
            }
        })
    }

    const token = jwt.sign({
        id:String(user._id),
    },SECRET)
    res.send({
        user,
        token,
        meta:{
            message:'登录成功',
            status:200
        }
    })
})
app.get('/api/getList',async(req,res)=>{
    const lists = await List.find()
    console.log(res)
    res.send({
        lists,
        meta:{
            message:'获取菜单列表成功',
            status:200
        }
    })
})
app.post('/api/setList',async(req,res)=>{
    const list = await List.create({
        order: req.body.order,
        authName: req.body.authName,
        path: req.body.path,
        children: [{
            authName: req.body.children.authName,
            path: req.body.children.path
        }]
    })
    console.log(req.body)
    res.send({
        list,
        meta:{
            message:'插入菜单列表成功',
            status:200
        }
    })
})
app.put('/api/users', async (req, res) => {
    const users = await User.updateOne({"_id":req.body._id},{$set: {"mg_state": req.body.mg_state}})
    // const userss = await User.findById(req.body._id)
    const user = await User.find()
    res.send({
        user,
        meta:{
            message:'修改状态成功',
            status:200
        }
    })
    console.log(req.body)
 })
app.get('/api/selectusers', async (req, res) => {
    const users = await User.find({'_id': req.query._id })
    if(users!==null){
        res.send({
            users,
            meta:{
                message:'查询用户成功',
                status:200
            }
        })
    }
    res.send({
        data:null,
        meta:{
            message:'查询用户成功',
            status:200
        }
    })
})
app.put('/api/updateName', async (req, res) => {
    const user = await User.find({"username":req.body.username})
    if(user.length==0){
        const users = await User.updateOne({"_id":req.body._id},{$set: {"username": req.body.username}})
        res.send({
            user,
            meta:{
                message:'修改状态成功',
                status:200
            }
        })
    }
    res.send({
        data:null,
        meta:{
            message:'用户名存在修改失败',
            status:400
        }
    })
    console.log(req.body)
})
app.post('/api/delusers', async (req, res) => {
    const users = await User.findById(req.body._id)
    const user = await User.deleteOne({'_id': req.body._id })
        res.send({
            users,
            meta:{
                message:'删除用户成功',
                status:200
            }
        })
})
app.listen(3001,()=>{
    console.log('http://localhost:3001')
})
