import {
  QueryOrderSDK,
  MerchantInfo,
  QueryOrderInfo,
  queryOrderUtils,
} from "../../src/index";

const merchantID = process.env.MERCHANT_ID!;
const hashKey = process.env.HASH_KEY!;
const hashIV = process.env.HASH_IV!;

async function main() {
  // 商店資訊
  const merchantInfo: MerchantInfo = {
    merchantID: merchantID,
    hashKey: hashKey,
    hashIV: hashIV,
  };
  // 查詢訂單請求資訊
  const queryOrderInfo: QueryOrderInfo = {
    Amt: 100,
    MerchantOrderNo: "T211120000003",
  };

  const queryOrderSDK = new QueryOrderSDK("test");
  const queryOrderResult = await queryOrderSDK.queryOrder(
    merchantInfo,
    queryOrderInfo
  );

  console.log(queryOrderResult);
  console.log(queryOrderSDK.verifyCheckCode(merchantInfo, queryOrderResult));

  if (queryOrderUtils.isCreditCardResult(queryOrderResult.Result)) {
    console.log("信用卡支付結果");
  }

  if (queryOrderUtils.isOtherResult(queryOrderResult.Result)) {
    console.log("非信用卡支付結果");
  }
}
main();
