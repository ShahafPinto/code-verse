const mongoose = require("mongoose");

const codeBlockSchema = new mongoose.Schema(
  {title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    unique: true,
  },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
      unique: true,
    }, 
    template: { type: String, required: true, minlength: 10, maxlength: 1000 },
    solution: {
      type: String,
      required: true,
      minlength: 10, 
      maxlength: 1000
    }
  },
  { timestamps: true }
); 

const codeBlockModel = mongoose.model("CodeBlock", codeBlockSchema);

module.exports = codeBlockModel;
