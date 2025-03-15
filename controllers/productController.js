import { Schema, model } from "mongoose";

// Product Schema
let schema = new Schema({
    pname: String,
    pdesc: String,
    price: String,
    category: String,
    pimage: String,
    pimage2: String,
    addedBy: { type: Schema.Types.ObjectId, ref: "Users" },
    pLoc: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number] },
    },
});

schema.index({ pLoc: "2dsphere" });

const Products = model("Products", schema);

// 🔹 **Search Products API**
export function search(req, res) {
    console.log("Search Query:", req.query);

    let search = req.query.search || "";
    let location = req.query.loc ? req.query.loc.split(",") : [28.6139, 77.2090]; // Default: New Delhi
    let latitude = parseFloat(location[0]);
    let longitude = parseFloat(location[1]);

    Products.find({
        $or: [
            { pname: { $regex: search, $options: "i" } }, // 🔍 Search by Product Name
            { pdesc: { $regex: search, $options: "i" } }, // 🔍 Search by Description
            { category: { $regex: search, $options: "i" } }, // 🔍 Search by Category
        ],
    })
    .then((results) => {
        res.send({ message: "success", products: results });
    })
    .catch((err) => {
        console.error("Search Error:", err);
        res.send({ message: "server err" });
    });
}

// 🔹 **Add Product API**
export function addProduct(req, res) {
    console.log("Received Files:", req.files);
    console.log("Received Body:", req.body);

    const { plat, plong, pname, pdesc, price, category, userId } = req.body;

    // Validate required fields
    if (!pname || !price || !category || !plat || !plong) {
        return res.send({ message: "Missing required fields!" });
    }

    const pimage = req.files?.pimage?.[0]?.path || "";
    const pimage2 = req.files?.pimage2?.[0]?.path || "";

    const product = new Products({
        pname,
        pdesc,
        price,
        category,
        pimage,
        pimage2,
        addedBy: userId,
        pLoc: {
            type: "Point",
            coordinates: [parseFloat(plat), parseFloat(plong)],
        },
    });

    product.save()
        .then(() => res.send({ message: "Product added successfully." }))
        .catch((err) => {
            console.error("Add Product Error:", err);
            res.send({ message: "server err" });
        });
}

// 🔹 **Get All Products API**
export function getProducts(req, res) {
    const catName = req.query.catName;
    let filter = catName ? { category: catName } : {};

    Products.find(filter)
        .then((result) => {
            res.send({ message: "success", products: result });
        })
        .catch((err) => {
            console.error("Get Products Error:", err);
            res.send({ message: "server err" });
        });
}

// 🔹 **Get Product By ID API**
export function getProductsById(req, res) {
    console.log("Requested Product ID:", req.params.pId);

    Products.findOne({ _id: req.params.pId })
        .then((result) => {
            if (result) {
                res.send({ message: "success", product: result });
            } else {
                res.send({ message: "Product Not Found" });
            }
        })
        .catch((err) => {
            console.error("Get Product By ID Error:", err);
            res.send({ message: "server err" });
        });
}

// 🔹 **Get Products Added By User**
export function myProducts(req, res) {
    const { userId } = req.body;

    Products.find({ addedBy: userId })
        .then((result) => {
            res.send({ message: "success", products: result });
        })
        .catch((err) => {
            console.error("Get My Products Error:", err);
            res.send({ message: "server err" });
        });
}
