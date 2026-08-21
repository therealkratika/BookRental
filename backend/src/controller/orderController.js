import Order from "../model/order.js";
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "book",
        populate: {
          path: "owner",
          select: "name phone email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};