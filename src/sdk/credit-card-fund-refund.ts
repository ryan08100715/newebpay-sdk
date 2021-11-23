import { URLSearchParams } from "url";
import axios from "axios";
import { Base, MerchantInfo } from "./base";
import { CloseInfo, CloseResult } from "./credit-card-fund-refund-types";

export class CreditCardFundRefundSDK extends Base {
  private requestUrl: string;

  constructor(environment: "prod" | "test") {
    super();

    if (environment === "prod") {
      this.requestUrl = "https://core.newebpay.com/API/CreditCard/Close";
    } else {
      this.requestUrl = "https://ccore.newebpay.com/API/CreditCard/Close";
    }
  }

  /**
   * 請款 or 退款
   *
   * @param merchantInfo 藍新金流商店資訊
   * @param closeInfo 請退款資訊
   */
  public async close(
    merchantInfo: MerchantInfo,
    closeInfo: CloseInfo
  ): Promise<CloseResult> {
    // 交易資訊
    const postData = Object.assign({}, closeInfo, {
      RespondType: "JSON",
      Version: "1.1",
      TimeStamp: Math.floor(Date.now() / 1000).toString(),
    });

    // AES 加密後的交易資訊
    const tradeInfo = this.generateTradeInfo(
      postData,
      merchantInfo.hashKey,
      merchantInfo.hashIV
    );

    // 請求請退款
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
}
