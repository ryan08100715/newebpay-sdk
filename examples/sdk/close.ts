import {
  CreditCardFundRefundSDK,
  MerchantInfo,
  CloseInfo,
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
  // 請退款請求資訊
  const closeInfo: CloseInfo = {
    Amt: 100,
    MerchantOrderNo: "T211120000002",
    IndexType: 1,
    CloseType: 1,
  };

  const fundReFundSDK = new CreditCardFundRefundSDK("test");
  const closeResult = await fundReFundSDK.close(merchantInfo, closeInfo);

  console.log(closeResult);
}
main();
