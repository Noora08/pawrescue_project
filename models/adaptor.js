const mongoose = require("mongoose");

const adaptorSchema = mongoose.Schema({

  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName:{
    type:String,
    required:true
  },
  reportInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    min: 0
  },
  contactNo: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  
  
    block: {
      type: String
    },city: {
      type: String
    }, state: {
      type: String,
    }
  ,

  experience: {
    type: Number,
    min: 0,
  },
  petTypesHandled: {
    type: [String],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, 
  },
});

const Adaptor = mongoose.model("Adaptor", adaptorSchema);

module.exports = Adaptor
