import { NewebpaySDK } from "./newebpay-sdk";
import { MPGParams, MPGOptions } from "./newebpay-sdk-types";

function main() {
  const merchantID = "";
  const hashKey = "";
  const hashIV = "";
  const env = "test"; // test or prod

  const mpgOptions: MPGOptions = {
    MerchantOrderNo: "202108010010",
    Amt: 100,
    ItemDesc: "絨毛娃娃",
    Email: "",
    LoginType: 0,
  };

  const newebpaySDK = new NewebpaySDK(merchantID, hashKey, hashIV, env);
  const mpgParams = newebpaySDK.mpg(mpgOptions); // 產生MPG付款參數
  console.log(toHTML(mpgParams));
}
main();

function toHTML(mpgParams: MPGParams): string {
  return `
    <form id='form' style='text-align:center;' method=post action='${mpgParams.requestUrl}'>
    <input type='hidden' name='MerchantID' value='${mpgParams.merchantID}'>
    <input type='hidden' name='TradeInfo' value='${mpgParams.tradeInfo}'>
    <input type='hidden' name='TradeSha' value='${mpgParams.tradeSha}'>
    <input type='hidden' name='Version' value='${mpgParams.version}'>
    </form>
    </body>
    <script type='text/javascript'>
        form.submit();
    </script>
  `;
}
