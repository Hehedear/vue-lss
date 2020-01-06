const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/express-auth',{
    useCreateIndex: true,
    useNewUrlParser:true
})
const UserSchema = new mongoose.Schema({
    username:{type:String,unique: true },
    total:{type:String},
    pagesize:{type:String},
    mg_state:{type:Boolean},
    password:{type:String,
    set(val){
        return require('bcryptjs').hashSync(val,10)
    }
    },
})

const User = mongoose.model('User',UserSchema)
// User.db.dropCollection('users')


const ListSchema = new mongoose.Schema({
    authName:{type:String,unique: true },
    path:{type:String},
    order:{type:String},
    children:[{
        authName: {type: String},
        path: {type: String}
    }]
})
const List = mongoose.model('List',ListSchema)
module.exports = {User,List}
// List.db.dropCollection('lists')
