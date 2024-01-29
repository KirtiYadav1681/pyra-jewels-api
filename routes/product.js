const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
const ProductModel = require("../models/Product");

router.post("/add", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await new ProductModel(req.body);
    const savedata = await product.save();
    res.status(201).send(savedata);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => { 
   try {
     const updateProduct = await ProductModel.findByIdAndUpdate(
       req.params.id,
       { $set: req.body },
       { new: true }
     );
     // console.log("lov");
     res.status(200).send(updateProduct);
   } catch (err) {
     res.status(500).send(err);
   }
});

router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    res.send("product deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/find/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await ProductModel.find();
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/get/:id", async (req,res) =>{
  try{
    const product = await ProductModel.findById(req.params.id);
    res.status(200).json(product);
  }catch (err) {res.status(500).json(err)}
});

router.get("/find/limit/",  async (req, res) => {
  const qNew = req.query.new;
  const qCate = req.query.category;
  try {
    const product = qNew?
   await ProductModel.find().sort({ _id: -1 }).limit(5)
      : qCate?await ProductModel.find({categories: { $in: [qCate] }}):await ProductModel.find();

    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;
