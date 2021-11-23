import { URLSearchParams } from "url";
import axios from "axios";
import { Base, MerchantInfo } from "./base";
import { ReversalInfo, ReversalResult } from "./credit-card-reversal-types";

export class CreditCardReversalSDK extends Base {
  private requestUrl: string;

  constructor(environment: "prod" | "test") {
    super();

    if (environment === "prod") {
      this.requestUrl = "https://core.newebpay.com/API/CreditCard/Cancel";
    } else {
      this.requestUrl = "https://ccore.newebpay.com/API/CreditCard/Cancel";
    }
  }

  /**
   * 信用卡取消授權
   *
   * @param merchantInfo 藍新金流商店資訊
   * @param reversalInfo 取消授權資訊
   */
  public async reversal(
    merchantInfo: MerchantInfo,
    reversalInfo: ReversalInfo
  ): Promise<ReversalResult> {
    // 交易資訊
    const postData = Object.assign({}, reversalInfo, {
      RespondType: "JSON",
      Version: "1.0",
      TimeStamp: Math.floor(Date.now() / 1000).toString(),
    });

    // AES 加密後的交易資訊
    const tradeInfo = this.generateTradeInfo(
      postData,
      merchantInfo.hashKey,
      merchantInfo.hashIV
    );

    // 請求取消授權
    const response = await axios.post(
      this.requestUrl,
      new URLSearchParams({
        MerchantID_: merchantInfo.merchantID,
        PostData_: tradeInfo,
      }).toString(),
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
   * @param reversalResult 取消授權的請求結果
   */
  public verifyCheckCode(
    merchantInfo: MerchantInfo,
    reversalResult: ReversalResult
  ): boolean {
    const str =
      `HashIV=${merchantInfo.hashIV}&` +
      `Amt=${reversalResult.Result.Amt}&` +
      `MerchantID=${merchantInfo.merchantID}&` +
      `MerchantOrderNo=${reversalResult.Result.MerchantOrderNo}&` +
      `TradeNo=${reversalResult.Result.TradeNo}&` +
      `HashKey=${merchantInfo.hashKey}`;

    const checkCode = this.sha256Encode(str).toUpperCase();

    return checkCode === reversalResult.Result.CheckCode;
  }
}
