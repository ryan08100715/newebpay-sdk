import { URLSearchParams } from "url";
import axios from "axios";
import { Base, MerchantInfo } from "./base";
import {
  QueryOrderInfo,
  CheckValueParams,
  QueryOrderResult,
} from "./query-order-types";

export class QueryOrderSDK extends Base {
  private requestUrl: string;

  constructor(environment: "prod" | "test") {
    super();

    if (environment === "prod") {
      this.requestUrl = "https://core.newebpay.com/API/QueryTradeInfo";
    } else {
      this.requestUrl = "https://ccore.newebpay.com/API/QueryTradeInfo";
    }
  }

  /**
   * 查詢訂單資訊
   *
   * @param merchantInfo 藍新金流商店資訊
   * @param queryOrderInfo 訂單查詢資訊
   */
  public async queryOrder(
    merchantInfo: MerchantInfo,
    queryOrderInfo: QueryOrderInfo
  ): Promise<QueryOrderResult> {
    // 產生檢查碼
    const checkValue = this.generateCheckValue({
      hashKey: merchantInfo.hashKey,
      hashIV: merchantInfo.hashIV,
      amt: queryOrderInfo.Amt,
      merchantID: merchantInfo.merchantID,
      merchantOrderNo: queryOrderInfo.MerchantOrderNo,
    });

    // 交易資訊
    const postData = Object.assign({}, queryOrderInfo, {
      MerchantID: merchantInfo.merchantID,
      Version: "1.2",
      RespondType: "JSON",
      CheckValue: checkValue,
      TimeStamp: Math.floor(Date.now() / 1000).toString(),
    });

    const response = await axios.post(
      this.requestUrl,
      new URLSearchParams(postData as any).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        responseType: "json",
      }
    );

    return response.data;
  }

  /**
   * 驗證請求結果檢核碼
   *
   * @param merchantInfo 藍新金流商店資訊
   * @param queryOrderResult 查詢結果
   */
  public verifyCheckCode(
    merchantInfo: MerchantInfo,
    queryOrderResult: QueryOrderResult
  ): boolean {
    if (!queryOrderResult.Result) throw new Error("Result not found");

    const str =
      `HashIV=${merchantInfo.hashIV}&` +
      `Amt=${queryOrderResult.Result.Amt}&` +
      `MerchantID=${merchantInfo.merchantID}&` +
      `MerchantOrderNo=${queryOrderResult.Result.MerchantOrderNo}&` +
      `TradeNo=${queryOrderResult.Result.TradeNo}&` +
      `HashKey=${merchantInfo.hashKey}`;

    const checkCode = this.sha256Encode(str).toUpperCase();

    return checkCode === queryOrderResult.Result.CheckCode;
  }

  private generateCheckValue(params: CheckValueParams) {
    const str = `IV=${params.hashIV}&Amt=${params.amt}&MerchantID=${params.merchantID}&MerchantOrderNo=${params.merchantOrderNo}&Key=${params.hashKey}`;

    const checkValue = this.sha256Encode(str);

    return checkValue.toUpperCase();
  }
}
