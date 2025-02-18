// const authOrderModel = require('../../models/authOrder')
// const customerOrder = require('../../models/customerOrder')
// const cardModel = require('../../models/cardModel')
// const myShopWallet = require('../../models/myShopWallet')
// const sellerWallet = require('../../models/sellerWallet')
const {
  mongo: { ObjectId },
} = require("mongoose");
const { responseReturn } = require("../../utils/response");

const moment = require("moment");
const ownerModel = require("../../models/ownerModel");
const staffModel = require("../../models/staffModel");
const draftModel = require("../../models/draftModel");
const partyModel = require("../../models/partyModel");
const orderModel = require("../../models/orderModel");
const serviceModel = require("../../models/serviceModel");
const transactionModel = require("../../models/transactionModel");
const productModel = require("../../models/productModel");
const purchaseModel = require("../../models/purchaseModel");
const inventoryModel = require("../../models/inventoryModel");
class orderController {
  purchase_confirm = async (req, res) => {
    const { id } = req;
    const { companyId } = await ownerModel.findById(id);
    const { name } = await ownerModel.findById(id);
    const {
      cartItems,
      totalAmount,
      totalQuantity,
      party,
      value,
      description,
      branch,
    } = req.body;
    // console.log(branch);
    if (value?.startDate) {
      var tempDate = moment(value.startDate).format();
    } else {
      var tempDate = moment(Date.now()).format();
    }
    const credit_party = await partyModel.findById(party);
    const debit_party = await partyModel.find({
      accountType: "Purchase_Account",
      companyId: companyId,
    });
    const UniqueId = Date.now().toString(36).toUpperCase();

    try {
      const transaction = await transactionModel.create({
        transactionNo: UniqueId,
        companyId: new ObjectId(companyId),
        branchId: branch.toString(),
        debit: debit_party[0],
        credit: credit_party,
        generatedBy: name,
        transactionType: "Purchase",
        description: description ? description : "Its purchase transaction",
        balance: totalAmount,
        date: tempDate,
      });
      const purchase = await purchaseModel.create({
        purchaseNo: UniqueId,
        transactionId: transaction.id,
        companyId: new ObjectId(companyId),
        branchId: branch.toString(),
        purchaseForm: credit_party,
        generatedBy: name,
        cartItems,
        totalAmount,
        totalQuantity,
        date: tempDate,
      });

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const product = await productModel.findById(item.id);
        for (let j = 0; j < item.sn.length; j++) {
          const serial = item.sn[j];
          product.serial.push(serial);
        }
        product.purchase_price =
          (product.purchase_price * product.stock + item.price) /
          (product.stock + item.quantity);
        product.stock += item.quantity;

        await product.save({ validateBeforeSave: false });
      }
      responseReturn(res, 201, {
        purchase,
        message: "Purchased Confirmed",
      });

      debit_party[0].balance =
        Number(debit_party[0].balance) + Number(totalAmount);
      await debit_party[0].save();
      credit_party.balance = Number(credit_party.balance) - Number(totalAmount);
      await credit_party.save();
    } catch (error) {
      console.log(error.message);
    }
  };

  get_purchases = async (req, res) => {
    const { id } = req;
    const { companyId } = await ownerModel.findById(id);
    try {
      const purchases = await purchaseModel
        .find({
          companyId: companyId,
        })
        .sort({ date: -1 })
        .populate("purchaseForm");
      const totalPurchases = await purchaseModel
        .find({
          companyId: companyId,
        })
        .countDocuments();
      responseReturn(res, 200, {
        purchases,
        totalPurchases,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  get_purchase = async (req, res) => {
    const { purchaseId } = req.params;

    console.log(purchaseId);

    try {
      const purchase = await purchaseModel
        .findById(purchaseId)
        .populate("purchaseForm");
      responseReturn(res, 200, {
        purchase,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  place_order = async (req, res) => {
    const { id, role } = req;
    const {
      cartItems,
      totalAmount,
      totalQuantity,
      discount,
      payment,
      party,
      value,
      paid,
      due,
      branch,
      description,
    } = req.body;
    console.log(description);
    if (role === "staff") {
      var { branchId } = await staffModel.findById(id);
      var { companyId } = await staffModel.findById(id);
      var { name } = await staffModel.findById(id);
    } else {
      var { companyId } = await ownerModel.findById(id);
      var branchId = branch?.toString();
      var { name } = await ownerModel.findById(id);
    }
    if (value?.startDate) {
      var tempDate = moment(value.startDate).format();
    } else {
      var tempDate = moment(Date.now()).format();
    }
    const credit_party = await partyModel.find({
      accountType: "Sales_Account",
      companyId: companyId,
    });
    const discount_party = await partyModel.find({
      accountType: "Discount",
      companyId: companyId,
    });
    const debit_party = await partyModel.findById(party);
    if (payment !== "Due") {
      var payment_mode = await partyModel.find({
        accountType: payment,
        companyId: companyId,
      });
    }

    const UniqueId = Date.now().toString(36).toUpperCase();
    const order_no = await orderModel.find().sort({ $natural: -1 }).limit(1);
    if (order_no[0]?.orderNo === undefined) {
      var newOrderId = Number(200001);
    } else {
      var newOrderId = Number(order_no[0]?.orderNo) + 1;
    }
    try {
      if (paid === 0) {
        if (discount > 0) {
          const transaction = await transactionModel.create({
            transactionNo: UniqueId,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            debit: debit_party,
            credit: credit_party[0],
            generatedBy: name,
            balance: totalAmount - discount,
            date: tempDate,
          });
          const transaction2 = await transactionModel.create({
            transactionNo: UniqueId,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            debit: discount_party[0],
            credit: credit_party[0],
            generatedBy: name,
            balance: discount,
            date: tempDate,
          });
          const order = await orderModel.create({
            orderNo: newOrderId,
            transactionId: transaction.id,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            party: debit_party,
            generatedBy: name,
            cartItems,
            totalAmount,
            totalQuantity,
            discount,
            payment,
            paid,
            due,
            description,
            date: tempDate,
          });
          for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const product = await productModel.findById(item.id);

            product.stock -= item.quantity;
            product.count += item.quantity;
            product.serial = product.serial.filter(
              (data) => !item.serial.includes(data)
            );

            await product.save({ validateBeforeSave: false });
          }
          responseReturn(res, 201, {
            order,
            message: "Order placed successfully",
          });
        } else {
          const transaction = await transactionModel.create({
            transactionNo: UniqueId,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            debit: debit_party,
            credit: credit_party[0]._id,
            generatedBy: name,
            balance: totalAmount,
            date: tempDate,
          });
          const order = await orderModel.create({
            orderNo: newOrderId,
            transactionId: transaction.id,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            generatedBy: name,
            cartItems,
            totalAmount,
            totalQuantity,
            discount,
            payment,
            party: debit_party,
            paid,
            due,
            date: tempDate,
            description,
          });

          for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const product = await productModel.findById(item.id);

            product.stock -= item.quantity;
            product.count += item.quantity;
            console.log(item.serial);
            product.serial = product.serial.filter(
              (data) => !item.serial.includes(data)
            );

            await product.save({ validateBeforeSave: false });
          }
          responseReturn(res, 201, {
            order,
            message: "Order placed successfully",
          });
        }
        debit_party.balance =
          Number(debit_party.balance) + Number(totalAmount - discount - paid);
        await debit_party.save();
        payment_mode[0].balance =
          Number(payment_mode[0].balance) + Number(paid);
        await payment_mode[0].save();
        discount_party[0].balance =
          Number(discount_party[0].balance) + Number(discount);
        await discount_party[0].save();
        credit_party[0].balance =
          Number(credit_party[0].balance) - Number(totalAmount);
        await credit_party[0].save();
      } else {
        if (discount > 0) {
          const transaction = await transactionModel.create({
            transactionNo: UniqueId,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            debit: debit_party,
            credit: credit_party[0],
            generatedBy: name,
            balance: totalAmount - discount,
            date: tempDate,
          });
          const transaction2 = await transactionModel.create({
            transactionNo: UniqueId,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            debit: discount_party[0],
            credit: credit_party[0],
            generatedBy: name,
            balance: discount,
            date: tempDate,
          });
          const transaction3 = await transactionModel.create({
            transactionNo: UniqueId,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            debit: payment_mode[0],
            credit: debit_party,
            generatedBy: name,
            balance: paid,
            date: tempDate,
          });
          const order = await orderModel.create({
            orderNo: newOrderId,
            transactionId: transaction.id,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            party: debit_party,
            generatedBy: name,
            cartItems,
            totalAmount,
            totalQuantity,
            discount,
            payment,
            paid,
            due,
            description,
            date: tempDate,
          });
          for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const product = await productModel.findById(item.id);

            product.stock -= item.quantity;
            product.count += item.quantity;
            product.serial = product.serial.filter(
              (data) => !item.serial.includes(data)
            );

            await product.save({ validateBeforeSave: false });
          }
          responseReturn(res, 201, {
            order,
            message: "Order placed successfully",
          });
        } else {
          const transaction = await transactionModel.create({
            transactionNo: UniqueId,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            debit: debit_party,
            credit: credit_party[0]._id,
            generatedBy: name,
            balance: totalAmount,
            date: tempDate,
          });
          const transaction2 = await transactionModel.create({
            transactionNo: UniqueId,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            debit: payment_mode[0],
            credit: debit_party,
            generatedBy: name,
            balance: paid,
            date: tempDate,
          });
          const order = await orderModel.create({
            orderNo: newOrderId,
            transactionId: transaction.id,
            companyId: new ObjectId(companyId),
            branchId: branchId,
            party: debit_party,
            generatedBy: name,
            cartItems,
            totalAmount,
            totalQuantity,
            discount,
            payment,
            paid,
            due,
            description,
            date: tempDate,
          });

          for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const product = await productModel.findById(item.id);

            product.stock -= item.quantity;
            product.count += item.quantity;
            product.serial = product.serial.filter(
              (data) => !item.serial.includes(data)
            );
            await product.save({ validateBeforeSave: false });
          }
          responseReturn(res, 201, {
            order,
            message: "Order placed successfully",
          });
        }
        debit_party.balance =
          Number(debit_party.balance) + Number(totalAmount - discount - paid);
        await debit_party.save();
        payment_mode[0].balance =
          Number(payment_mode[0].balance) + Number(paid);
        await payment_mode[0].save();
        discount_party[0].balance =
          Number(discount_party[0].balance) + Number(discount);
        await discount_party[0].save();
        credit_party[0].balance =
          Number(credit_party[0].balance) - Number(totalAmount);
        await credit_party[0].save();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  get_company_orders = async (req, res) => {
    const { id } = req;
    const { companyId } = await ownerModel.findById(id);
    try {
      const orders = await orderModel
        .find({
          companyId: companyId,
        })
        .sort({ createdAt: -1 })
        .populate("party");
      const totalOrders = await orderModel
        .find({
          companyId: companyId,
        })
        .countDocuments();

      responseReturn(res, 200, {
        orders,
        totalOrders,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  get_branch_orders = async (req, res) => {
    const { id } = req;
    const { branchId } = await staffModel.findById(id);
    try {
      const orders = await orderModel
        .find({
          branchId: branchId,
        })
        .sort({ createdAt: -1 });
      const totalOrders = await orderModel
        .find({
          branchId: branchId,
        })
        .countDocuments();

      responseReturn(res, 200, {
        orders,
        totalOrders,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  make_draft = async (req, res) => {
    const { id, role } = req;
    const {
      cartItems,
      totalAmount,
      totalQuantity,
      discount,
      payment,
      party,
      value,
      paid,
      due,
      branch,
    } = req.body;
    if (role === "staff") {
      var { branchId } = await staffModel.findById(id);
      var { companyId } = await staffModel.findById(id);
      var { name } = await staffModel.findById(id);
    } else {
      var { companyId } = await ownerModel.findById(id);
      var branchId = branch.toString();
      var { name } = await ownerModel.findById(id);
    }

    if (value?.startDate) {
      var tempDate = moment(value.startDate).format();
    } else {
      var tempDate = moment(Date.now()).format();
    }
    try {
      const draft = await draftModel.create({
        companyId: new ObjectId(companyId),
        branchId: branchId,
        generatedBy: name,
        party: party,
        cartItems,
        totalAmount,
        totalQuantity,
        discount,
        payment,
        paid,
        due,
        date: tempDate,
      });
      responseReturn(res, 201, {
        message: "Draft order successfully",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  get_company_drafts = async (req, res) => {
    const { id } = req;
    const { companyId } = await ownerModel.findById(id);
    try {
      const drafts = await draftModel
        .find({
          companyId: companyId,
        })
        .sort({ createdAt: -1 })
        .populate("party");
      const totalDrafts = await draftModel
        .find({
          companyId: companyId,
        })
        .countDocuments();

      responseReturn(res, 200, {
        drafts,
        totalDrafts,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
  get_branch_drafts = async (req, res) => {
    const { id } = req;
    const { branchId } = await staffModel.findById(id);
    try {
      const drafts = await draftModel
        .find({
          branchId: branchId,
        })
        .sort({ createdAt: -1 });
      const totalDrafts = await draftModel
        .find({
          branchId: branchId,
        })
        .countDocuments();

      responseReturn(res, 200, {
        drafts,
        totalDrafts,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
  get_draft = async (req, res) => {
    const { draftId } = req.params;
    try {
      const draft = await draftModel.findById(draftId);
      responseReturn(res, 200, {
        draft,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  remove_draft = async (req, res) => {
    const { draftId } = req.params;
    try {
      await draftModel.findByIdAndDelete(draftId);
      responseReturn(res, 200, {
        message: "Draft Cleared!",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_customer_databorad_data = async (req, res) => {
    const { userId } = req.params;

    try {
      const recentOrders = await customerOrder
        .find({
          customerId: new ObjectId(userId),
        })
        .limit(5);
      const pendingOrder = await customerOrder
        .find({
          customerId: new ObjectId(userId),
          delivery_status: "pending",
        })
        .countDocuments();
      const totalOrder = await customerOrder
        .find({
          customerId: new ObjectId(userId),
        })
        .countDocuments();
      const cancelledOrder = await customerOrder
        .find({
          customerId: new ObjectId(userId),
          delivery_status: "cancelled",
        })
        .countDocuments();
      responseReturn(res, 200, {
        recentOrders,
        pendingOrder,
        cancelledOrder,
        totalOrder,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_orders = async (req, res) => {
    const { customerId, status } = req.params;

    try {
      let orders = [];
      if (status !== "all") {
        orders = await customerOrder.find({
          customerId: new ObjectId(customerId),
          delivery_status: status,
        });
      } else {
        orders = await customerOrder.find({
          customerId: new ObjectId(customerId),
        });
      }
      responseReturn(res, 200, {
        orders,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_company_order = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await orderModel.findById(orderId).populate("party");
      responseReturn(res, 200, {
        order,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_order = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await orderModel.findById(orderId).populate("party");
      responseReturn(res, 200, {
        order,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_admin_orders = async (req, res) => {
    let { page, parPage, searchValue } = req.query;
    page = parseInt(page);
    parPage = parseInt(parPage);
    const skipPage = parPage * (page - 1);

    try {
      if (searchValue) {
      } else {
        const orders = await customerOrder
          .aggregate([
            {
              $lookup: {
                from: "authororders",
                localField: "_id",
                foreignField: "orderId",
                as: "suborder",
              },
            },
          ])
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });

        const totalOrder = await customerOrder.aggregate([
          {
            $lookup: {
              from: "authororders",
              localField: "_id",
              foreignField: "orderId",
              as: "suborder",
            },
          },
        ]);

        responseReturn(res, 200, { orders, totalOrder: totalOrder.length });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  get_admin_order = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await customerOrder.aggregate([
        {
          $match: { _id: new ObjectId(orderId) },
        },
        {
          $lookup: {
            from: "authororders",
            localField: "_id",
            foreignField: "orderId",
            as: "suborder",
          },
        },
      ]);
      responseReturn(res, 200, { order: order[0] });
    } catch (error) {
      console.log("get admin order " + error.message);
    }
  };

  admin_order_status_update = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      await customerOrder.findByIdAndUpdate(orderId, {
        delivery_status: status,
      });
      responseReturn(res, 200, { message: "Order status updated" });
    } catch (error) {
      console.log("get admin order status error " + error.message);
      responseReturn(res, 500, { message: "internal server error" });
    }
  };

  get_seller_orders = async (req, res) => {
    const { sellerId } = req.params;
    let { page, parPage, searchValue } = req.query;
    page = parseInt(page);
    parPage = parseInt(parPage);

    const skipPage = parPage * (page - 1);

    try {
      if (searchValue) {
      } else {
        const orders = await authOrderModel
          .find({
            sellerId,
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalOrder = await authOrderModel
          .find({
            sellerId,
          })
          .countDocuments();
        responseReturn(res, 200, { orders, totalOrder });
      }
    } catch (error) {
      console.log("get seller order error " + error.message);
      responseReturn(res, 500, { message: "internal server error" });
    }
  };

  get_seller_order = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await authOrderModel.findById(orderId);

      responseReturn(res, 200, { order });
    } catch (error) {
      console.log("get admin order " + error.message);
    }
  };

  seller_order_status_update = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      await authOrderModel.findByIdAndUpdate(orderId, {
        delivery_status: status,
      });
      responseReturn(res, 200, { message: "Order status updated" });
    } catch (error) {
      console.log("get admin order status error " + error.message);
      responseReturn(res, 500, { message: "internal server error" });
    }
  };

  order_confirm = async (req, res) => {
    const { orderId } = req.params;
    try {
      await customerOrder.findByIdAndUpdate(orderId, {
        payment_status: "paid",
        delivery_status: "pending",
      });
      await authOrderModel.updateMany(
        { orderId: new ObjectId(orderId) },
        {
          payment_status: "paid",
          delivery_status: "pending",
        }
      );
      const cuOrder = await customerOrder.findById(orderId);

      const auOrder = await authOrderModel.find({
        orderId: new ObjectId(orderId),
      });

      const time = moment(Date.now()).format("l");

      const splitTime = time.split("/");

      await myShopWallet.create({
        amount: cuOrder.price,
        month: splitTime[0],
        year: splitTime[2],
      });

      for (let i = 0; i < auOrder.length; i++) {
        await sellerWallet.create({
          sellerId: auOrder[i].sellerId.toString(),
          amount: auOrder[i].price,
          manth: splitTime[0],
          year: splitTime[2],
        });
      }

      responseReturn(res, 200, { message: "success" });
    } catch (error) {
      console.log(error.message);
    }
  };

  make_service = async (req, res) => {
    const { id, role } = req;
    const { serviceProduct, description, party, branch } = req.body;
    if (role === "staff") {
      var { branchId } = await staffModel.findById(id);
      var { companyId } = await staffModel.findById(id);
      var { name } = await staffModel.findById(id);
    } else {
      var { companyId } = await ownerModel.findById(id);
      var branchId = branch.toString();
      var { name } = await ownerModel.findById(id);
    }
    const tempDate = moment(Date.now()).format();
    const service_no = await serviceModel
      .find()
      .sort({ $natural: -1 })
      .limit(1);
    if (service_no[0]?.serviceNo === undefined) {
      var newServiceId = Number(200001);
    } else {
      var newServiceId = Number(service_no[0]?.serviceNo) + 1;
    }
    try {
      const data = await serviceModel.create({
        serviceNo: newServiceId,
        companyId: new ObjectId(companyId),
        branchId: branchId,
        generatedBy: name,
        party: party,
        product: serviceProduct,
        problem: description,
        date: tempDate,
      });
      const service = await serviceModel.findById(data._id).populate("party");
      responseReturn(res, 201, {
        message: "Service received successfully",
        service,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_company_services = async (req, res) => {
    const { id } = req;
    const { companyId } = await ownerModel.findById(id);
    try {
      const services = await serviceModel
        .find({
          companyId: companyId,
        })
        .sort({ createdAt: -1 })
        .populate("party");
      const totalServices = await serviceModel
        .find({
          companyId: companyId,
        })
        .countDocuments();

      responseReturn(res, 200, {
        services,
        totalServices,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
  get_company_service = async (req, res) => {
    const { serviceId } = req.params;

    try {
      const service = await serviceModel.findById(serviceId).populate("party");
      responseReturn(res, 200, {
        service,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  get_branch_services = async (req, res) => {
    const { id } = req;
    const { branchId } = await staffModel.findById(id);
    try {
      const services = await serviceModel
        .find({
          branchId: branchId,
        })
        .sort({ createdAt: -1 })
        .populate("party");
      const totalServices = await serviceModel
        .find({
          branchId: branchId,
        })
        .countDocuments();

      responseReturn(res, 200, {
        services,
        totalServices,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  update_status = async (req, res) => {
    const { serviceId, status, station } = req.body;
    const updateDate = moment(Date.now()).format();
    try {
      await serviceModel.findByIdAndUpdate(serviceId, {
        status,
        station,
        updateDate,
      });
      const service = await serviceModel.findById(serviceId).populate("party");
      responseReturn(res, 200, {
        service,
        message: "Updated service info successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new orderController();
