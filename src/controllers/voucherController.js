const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const WooCommerce = new WooCommerceRestApi({
    url: 'https://daugoiecoex.infinityfreeapp.com',
    consumerKey: 'ck_aab60ca180bfbc19f4fb4e1d787def2db7fe91ec',
    consumerSecret: 'cs_7aa3d0eba573dea5a16a2ae68fd6effab443866e',
    version: 'wc/v3'
  });
  var FB = require('fb');
  FB.setAccessToken(process.env.FB_ACCESS_TOKEN);
  const { G4F } = require("g4f");
  const g4f = new G4F();
let renderVoucher = async(req,res)=>{
    try {
        let vouchers = await WooCommerce.get("coupons")
        res.render("voucher",{data:vouchers.data})
    } catch (error) {
        res.json({
            errCode:1,
            errMessage:error
        })
    }
}
let getVoucherDetailById = async(req,res)=>{
    try {
        WooCommerce.get(`coupons/${req.query.id}`)
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
let createVoucher = async(req,res)=>{
    try {
        const data = {
            code: req.body.name,
            discount_type: req.body.discount_type,
            amount: req.body.amount,
            description: req.body.description
          };
          
          await WooCommerce.post("coupons", data)
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error.response.data);
            });

            const messages = [
                { role: "user", content: `Công ty tôi là công ty về bán dầu gội thảo dược,giờ tôi sẽ ra mắt coupon kỉ niệm ${req.body.description} hãy viết một bài quảng cáo lên facebook, đây là code : "${req.body.name}.` }
            ];
            let apiMessage = await g4f.chatCompletion(messages);

            let response = await FB.api('me/feed', 'post', { message: apiMessage }, function (res) {
                if (!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }
                console.log('Post Id: ' + res.post_id);
            });
            console.log(response)

            return res.status(200).json({message:"success",data:"ok"})
    } catch (error) {
        res.json({
            errCode:1,
            errMessage:error
        }) 
    }
}
let  updateVoucher = async(req,res)=>{
    try {
        const data = {
            code: req.body.name,
            discount_type: req.body.discount_type,
            amount: req.body.amount,
            description: req.body.description
          };
          
          WooCommerce.put(`coupons/${req.body.id}`, data)
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error.response.data);
            });
            return res.status(200).json({message:"success",data:"ok"})

    } catch (error) {
        res.json({
            errCode:1,
            errMessage:error
        }) 
    }
}
let deleteVoucher = async(req,res)=>{
    try {
        await WooCommerce.delete(`coupons/${req.body.id}`, {
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
        res.json({
            errCode:1,
            errMessage:error
        }) 
    }
}
module.exports={
    renderVoucher,
    createVoucher,
    updateVoucher,
    getVoucherDetailById,
    deleteVoucher
}