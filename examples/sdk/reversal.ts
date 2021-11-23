import {
  CreditCardReversalSDK,
  MerchantInfo,
  ReversalInfo,
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
  // 取消授權請求資訊
  const reversalInfo: ReversalInfo = {
    Amt: 100,
    MerchantOrderNo: "T211120000003",
    TradeNo: "測試交易",
    IndexType: 1,
  };

  const reversalSDK = new CreditCardReversalSDK("test");
  const reversalResult = await reversalSDK.reversal(merchantInfo, reversalInfo);

  console.log(reversalResult);
  console.log(reversalSDK.verifyCheckCode(merchantInfo, reversalResult));
}
main();
