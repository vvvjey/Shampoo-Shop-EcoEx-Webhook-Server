const lark = require('@larksuiteoapi/node-sdk');
const client = new lark.Client({
	appId: 'cli_a6c413f70239902f',
	appSecret: 'N0XyxAslf1zLBR7RyTzhzduT5AsSZhhN',
});
let handleCF7ToLarkSuite = async(req,res)=>{
    try {
        console.log('req.body',req.body);
        const response = await client.bitable.appTableRecord.create({
            path: {
                app_token: process.env.LARK_APP_TOKEN || "MBIBbaiqna1IK5sHHw1lW3OogHe",
                table_id: process.env.LARK_TABLE_ID || "tbljEcZIEfNtN9jn",
            },
            data: {
                fields: {
                    "message": req.body.message,
                    "name": req.body.name,
                    "phoneNumber": req.body.phoneNumber,
                    "email":req.body.email
                }
            },
        }, lark.withUserAccessToken(process.env.AUTHORIZATION));
        console.log('Successfully created record:', response);
        return res.status(200).json({mess:"success",response})
    } catch (error) {
        console.error('Error creating record for item', error);
        
    }
}
module.exports = {
    handleCF7ToLarkSuite
}