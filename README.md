# NewebpaySDK

## Getting started

```typescript
import { NewebpaySDK } from "newebpay-sdk";

const merchantID = "";
const hashKey = "";
const hashIV = "";
const env = "test"; // test or prod

const newebpaySDK = new NewebpaySDK(merchantID, hashKey, hashIV, env);

const mpgOptions = {
  MerchantOrderNo: "202108010010",
  Amt: 100,
  ItemDesc: "絨毛娃娃",
  Email: "",
  LoginType: 0,
};

const mpgParams = newebpaySDK.mpg(mpgOptions); // 產生MPG付款參數

// mpgParams
// {
//   requestUrl: "https://.....",
//   merchantID: "merchantID",
//   tradeInfo: "tradeInfo",
//   tradeSha: "tradeSha",
//   version: "1.6",
// };
```
