import { Schema, Types, model } from "mongoose";

const notesSchema = new Schema({
    userid:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    tags:{
        type:String,
        default: "General",
    },
    date:{
        type:Date,
        default: Date.now,
    }
},{timestamps:true})

const Notes = model("Notes", notesSchema)
export default Notes