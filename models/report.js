const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    animalType:{
        type:String,
        required:true,
        enum: ['cat', 'dog', 'bird', 'rabbit' ]
    },
    state:{
        type:String,
        required:true,
        enum: ['capital', 'muharraq', 'northern', 'southern' ]
    },
    city:{
        type:String,
        required:true
    },
    locationURL:{
        type:String,
        required:true

    },
    foundCondition:{
        type:String,
        required:true,
        enum: ['good', 'injured', 'lost', 'orphans', 'abandoned' ]
    },
    currentCondition:{
        type:String,
        required:true,
        enum: ['good', 'injured', 'lost', 'orphans', 'abandoned' ]
    },
    severity: {
        type: String,
        enum: ['not injured', 'mild', 'moderate', 'severe'], 
        // required: true
    },
    reportedBy :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
      },
      description:{
        type:String
      }



})

const Report = mongoose.model("Report", reportSchema)

module.exports = Report