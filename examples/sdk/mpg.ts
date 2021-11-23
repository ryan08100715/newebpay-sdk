import { MPGSDK, MerchantInfo, MPGInfo, MPGRequestInfo } from "../../src/index";

const merchantID = process.env.MERCHANT_ID!;
const hashKey = process.env.HASH_KEY!;
const hashIV = process.env.HASH_IV!;

function main() {
  // 商店資訊
  const merchantInfo: MerchantInfo = {
    merchantID: merchantID,
    hashKey: hashKey,
    hashIV: hashIV,
  };
  // 交易請求資訊
  const mpgInfo: MPGInfo = {
    MerchantOrderNo: "T211120000003",
    Amt: 100,
    ItemDesc: "測試交易",
    Email: "",
    LoginType: 0,
  };

  const mpgSDK = new MPGSDK("test");
  const mpgRequestInfo = mpgSDK.mpg(merchantInfo, mpgInfo);

  console.log(mpgRequestInfo);
  // mpgRequestInfo
  // {
  //   requestUrl: "https://.....",
  //   merchantID: "merchantID",
  //   tradeInfo: "tradeInfo",
  //   tradeSha: "tradeSha",
  //   version: "1.6",
  // };

  console.log(toHTML(mpgRequestInfo));
}
main();

function toHTML(mpgRequestInfo: MPGRequestInfo): string {
  return `
    <form id='form' style='text-align:center;' method=post action='${mpgRequestInfo.requestUrl}'>
    <input type='hidden' name='MerchantID' value='${mpgRequestInfo.merchantID}'>
    <input type='hidden' name='TradeInfo' value='${mpgRequestInfo.tradeInfo}'>
    <input type='hidden' name='TradeSha' value='${mpgRequestInfo.tradeSha}'>
    <input type='hidden' name='Version' value='${mpgRequestInfo.version}'>
    </form>
    </body>
    <script type='text/javascript'>
        form.submit();
    </script>
  `;
}
