const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
const orderModel = require("../models/Order");

router.post("/add", verifyToken, async (req, res) => {
  try {
    const cart = await new orderModel(req.body);
    const savedata = await cart.save();
    res.status(201).send(savedata);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updateOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
    res.status(202).send(`product in order is deleted${deletedOrder}`);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await orderModel.find({ userId: req.params.userId });
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/find", verifyTokenAndAdmin, (req, res) => {
  try {
    const  order = orderModel.find();
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/income", verifyTokenAndAdmin, (req, res) => { 
    const productId = req.query.pid;
    const date = new Date();
    const lastmonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(date.setMonth(lastmonth.getMonth() - 1));

try{
    const income = orderModel.aggregate([
      { $match: {createdAt: {$gte: previousMonth,$lte: lastmonth},
      ...(productId && {
        products : {$elemMatch : {productId}},
      }),
    },
  },
      {
          $project: { 
            month: { $month: "$createdAt" } ,
            sales:"$amount",
          },
      },
        {
            $group: {
                id: "$month",
                total:{$sum:"$sales"}
            }
      }
    ]);
    res.status(200).send(income);
} catch (err) {
    res.status(500).send(err);
}

})

module.exports = router;
