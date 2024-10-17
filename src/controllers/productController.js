const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const WooCommerce = new WooCommerceRestApi({
    url: 'https://daugoiecoex.infinityfreeapp.com',
    consumerKey: 'ck_aab60ca180bfbc19f4fb4e1d787def2db7fe91ec',
    consumerSecret: 'cs_7aa3d0eba573dea5a16a2ae68fd6effab443866e',
    version: 'wc/v3'
  });
  require('dotenv').config()
  var FB = require('fb');
  FB.setAccessToken(process.env.FB_ACCESS_TOKEN);
  const { G4F } = require("g4f");
  const g4f = new G4F();


let renderHome = async(req,res)=>{
    let data = await getAllProductFromWoo();
    res.render("home",{data:data})
}

let getAllProductFromWoo  = async(req,res) => {
    try {
        const response = await WooCommerce.get("products");
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error; 
    }
}
let createNewProductFromWoo = async(req,res)=>{
    console.log('data',req.body)
    let data = {
        name: req.body.name,
        type: "simple",
        regular_price:req.body.price,
        description: req.body.description,
        short_description: req.body.short_description,
        stock_quantity:req.body.stock_quantity,
        manage_stock: true,
        categories: [
          {
            id: req.body.categories
          }
        ],
        images: [
          {
            src:req.body.img_src
          },
        ]
    };
    await WooCommerce.post("products", data)
    .then((response) => {
        console.log(response);
        res.json({
            errCode:0,
            errMessage:"Create successfully"
        })
    })
    .catch((error) => {
        console.log(error.response.data.message)
        res.json({
            errCode:1,
            errMessage:error.response.data.message
        })
    });
}
let getProductDetail = async(req,res)=>{
    try {
        WooCommerce.get(`products/${req.query.id}`)
        .then((response) => {
            return res.json({
                errCode:0,
                data:response.data
            })
        })
        .catch((error) => {
            console.log(error.response.data);
        });
    } catch (error) {
        console.log(error.response.data);
        throw error; 
    }
}
let updateProduct = async(req,res)=>{
    try {
        console.log(req.body)
        let data = {
            name: req.body.name,
            regular_price:req.body.price,
            description: req.body.description,
            short_description: req.body.short_description,
            stock_quantity:req.body.stock_quantity,
            categories: [
              {
                id: 2
              }
            ],
            images: [
              {
                src:req.body.img_src
              },
            ]
        };
        await WooCommerce.put(`products/${req.body.id}`, data)
        .then((response) => {
            console.log(response.data);
            res.json({
                errCode:0,
                errMessage:"Update successfully"
            })
        })
        .catch((error) => {
            console.log('error update',error.response.data);
            res.json({
                errCode:1,
                errMessage:error.response.data.message
            })
        });
    } catch (error) {
        console.log(error.response.data);
        throw error; 
    }
}
let deleteProduct = async(req,res)=>{
    try {
        await WooCommerce.delete(`products/${req.body.id}`, {
            force: true
          })
            .then((response) => {
              console.log(response.data);
              res.json({
                errCode:0,
                errMessage:"Update successfully"
            })
            })
            .catch((error) => {
              console.log(error.response.data);
              res.json({
                errCode:1,
                errMessage:error.response.data.message
            })
            });
    } catch (error) {
        console.log(error.response.data);
        throw error; 
    }
}
let webhookProductCreate = async(req,res)=>{
    try {
        let webhookSecret = req.headers['x-webhook-secret'];
        console.log('secret:', webhookSecret);
        const productData = req.body;
        let nameProduct = req.body.name;
        let linkProduct = req.body.permalink;
        let descriptionProduct = req.body.description;
        let shortDescriptionProduct = req.body.short_description;
        let priceProduct = req.body.price;
        let imProduct = req.body.images[0].src;
        const messages = [
            { role: "user", content: `Công ty tôi là công ty về bán dầu gội thảo dược , sản phẩm mới là ${nameProduct} với lời mô tả là ${descriptionProduct} , là một nhân viên marketing , hãy viết cho tôi nội dung bài đăng mới lên facebook để quảng cáo sản phẩm mới này .`}
        ];
        let apiMessage = await g4f.chatCompletion(messages)
        let response = await FB.api('me/photos', 'post', { url: imProduct, caption: apiMessage }, function (res) {
            if(!res || res.error) {
              console.log(!res ? 'error occurred' : res.error);
              return;
            }
            console.log('Post Id: ' + res.post_id);
        });
        res.status(200).json({ success: 'success', message: response });

    } catch (error) {
        console.error('error',error);
        res.status(500).json({ success: false, message: error.message });

    }
}
module.exports={
    renderHome,
    getAllProductFromWoo,
    createNewProductFromWoo,
    getProductDetail,
    updateProduct,
    deleteProduct,
    webhookProductCreate
}