const CodeBlockModel = require("../Models/CodeBlock");

const createCodeBlock = async (req, res) => {
  try {
    const { title, name, template, solution } = req.body;

    let codeBlock = await CodeBlockModel.findOne({ title });
    if (codeBlock) {
      return res.status(400).json({ message: "CodeBlock already exists" });
    }
    if (!name || !template || !solution) {
      return res.status(400).json({ message: "data is missing" });
    }

    codeBlock = new CodeBlockModel({
      title,
      name,
      template,
      solution,
    });

    await codeBlock.save();

    res
        .status(200)
        .json({ message: "CodeBlock created successfully", codeBlock });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = { createCodeBlock };