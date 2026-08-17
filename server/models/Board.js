const mongoose=require('mongoose')

const boardSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    

}, {timestamps:true})
const Board= mongoose.model('Board',boardSchema)
module.exports=Board