const User = require("../model/userModel");
const Order = require("../model/orderModel");
const tryCatch = require("../utils/tryCatch");
const appError = require("http-errors");

const createSslOrder = tryCatch(async (req, res, next) => {
  const orderData = req.body;
  const priceInfo = JSON.parse(orderData.priceInfo);
  const products = JSON.parse(orderData.products);
  const formData = orderData.formData;
  const area = JSON.parse(formData.area);
  const city = JSON.parse(formData.city);
  const disc = JSON.parse(formData.disc);

  let totalPrice = priceInfo.offerPrice;
  let totalQuantity = priceInfo.quantity;
  let totalDiscount = priceInfo.discount;
  let deliveryFee = priceInfo.shippingCost;

  const data = {
    priceInfo: priceInfo,
    products: products,
    userId: req.body.userId,
    phone: formData.phone,
    name: formData.name,
    email: formData.email,
    area: area.area_name,
    city: disc.city_name,
    address: formData.address,
    city_id: disc.city_id,
    zone_id: city.zone_id,
    area_id: area.area_id,
    note: formData.note,
    paymentMethod: "SSL",
  };
  let productOrder;
  try {
    if (orderData.userId !== "") {
      const user = await User.findById(orderData.userId);
      if (!user) {
        return next(appError(404, "User not found"));
      }

      productOrder = {
        ...data,
        price: totalPrice,
        quantity: totalQuantity,
        discount: totalDiscount,
        deliveryFee: deliveryFee,
        activeUser: {
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      };
    } else {
      productOrder = {
        ...data,
        price: totalPrice,
        quantity: totalQuantity,
        discount: totalDiscount,
        deliveryFee: deliveryFee,
      };
    }

    const newOrder = new Order(productOrder);
    const saveNewOrder = await newOrder.save();

    if (!saveNewOrder) {
      return next(appError(400, "Order was not placed"));
    }

    req.order = saveNewOrder;
    next();
  } catch (error) {
    if (error.response) {
      return res.status(400).json({ error: error.response.data });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = createSslOrder;
