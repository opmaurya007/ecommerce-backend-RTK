import express, { json } from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const envFilePath = path.resolve(__dirname, "../.env");

dotenv.config({ path: "./.env" });
// const stripe = require("stripe")(
//   "sk_test_51OdtNOSJGQzVMklLCZBBIbaIQAHnzeBRKVqIQA9ZCpbONLbKyvFrwu1k3KkrVW4nTNXgKvkAaJxZQxuwZXIkf5t300ilwszS4f"
// );

app.use(json());
app.use(cors());

const port = process.env.PORT || 3000;

//checkout api
app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.dish,
        images: [product.imgdata],
      },
      unit_amount: product.price * 100,
    },
    quantity: product.qnty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.URL}/success`,
    cancel_url: `${process.env.URL}/cancel`,
  });
  res.json({ id: session.id });
});

app.listen(port, () => {
  console.log(`sever started....${port}`);
});
