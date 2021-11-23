import {
  Merchant,
  MerchantInfo,
  MPGInfo,
  MPGRequestInfo,
  ReversalInfo,
  CloseInfo,
  QueryOrderInfo,
  queryOrderUtils,
} from "../../src/index";

const merchantID = process.env.MERCHANT_ID!;
const hashKey = process.env.HASH_KEY!;
const hashIV = process.env.HASH_IV!;

// 商店資訊
const merchantInfo: MerchantInfo = {
  merchantID: merchantID,
  hashKey: hashKey,
  hashIV: hashIV,
};

const merchant = new Merchant(merchantInfo, "test");

function mpg() {
  // 交易請求資訊
  const mpgInfo: MPGInfo = {
    MerchantOrderNo: "T211120000005",
    Amt: 100,
    ItemDesc: "測試交易",
    Email: "",
    LoginType: 0,
  };

  const mpgRequestInfo = merchant.mpg(mpgInfo);
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

async function reversal() {
  // 取消授權請求資訊
  const reversalInfo: ReversalInfo = {
    Amt: 100,
    MerchantOrderNo: "T211120000005",
    TradeNo: "測試交易",
    IndexType: 1,
  };

  const reversalResult = await merchant.reversal(reversalInfo);

  console.log(reversalResult);
  console.log(merchant.verifyReversalCheckCode(reversalResult));
}

async function close() {
  // 請退款請求資訊
  const closeInfo: CloseInfo = {
    Amt: 100,
    MerchantOrderNo: "T211120000005",
    IndexType: 1,
    CloseType: 2,
  };

  const closeResult = await merchant.close(closeInfo);

  console.log(closeResult);
}

async function queryOrder() {
  // 查詢訂單請求資訊
  const queryOrderInfo: QueryOrderInfo = {
    Amt: 100,
    MerchantOrderNo: "T211120000005",
  };

  const queryOrderResult = await merchant.queryOrder(queryOrderInfo);

  console.log(queryOrderResult);
  console.log(merchant.verifyQueryOrderCheckCode(queryOrderResult));

  if (queryOrderUtils.isCreditCardResult(queryOrderResult.Result)) {
    console.log("信用卡支付結果");
  }

  if (queryOrderUtils.isOtherResult(queryOrderResult.Result)) {
    console.log("非信用卡支付結果");
  }
}
