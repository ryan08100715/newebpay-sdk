import { Base, MerchantInfo } from "./base";
import { MPGInfo, MPGRequestInfo } from "./mpg-types";

export class MPGSDK extends Base {
  private requestUrl: string;
  private version = "1.6";

  constructor(environment: "prod" | "test") {
    super();

    if (environment === "prod") {
      this.requestUrl = "https://core.newebpay.com/MPG/mpg_gateway";
    } else {
      this.requestUrl = "https://ccore.newebpay.com/MPG/mpg_gateway";
    }
  }

  /**
   * 多功能收款
   *
   * @param merchantInfo 藍新金流商店資訊
   * @param mpgInfo 收款資訊
   */
  public mpg(merchantInfo: MerchantInfo, mpgInfo: MPGInfo): MPGRequestInfo {
    // 交易資訊
    const tradeInfoData = Object.assign({}, mpgInfo, {
      MerchantID: merchantInfo.merchantID,
      RespondType: "JSON",
      TimeStamp: Math.floor(Date.now() / 1000).toString(),
      Version: this.version,
    });

    // AES 加密後的交易資訊
    const tradeInfo = this.generateTradeInfo(
      tradeInfoData,
      merchantInfo.hashKey,
      merchantInfo.hashIV
    );

    // SHA256 加密後的交易資訊
    const tradeSha = this.generateTradeSha(
      tradeInfo,
      merchantInfo.hashKey,
      merchantInfo.hashIV
    );

    return {
      requestUrl: this.requestUrl,
      merchantID: merchantInfo.merchantID,
      tradeInfo: tradeInfo,
      tradeSha: tradeSha,
      version: this.version,
    };
  }

  /**
   * 驗證交易通知請求
   *
   * @param merchantInfo 藍新金流商店資訊
   * @param tradeInfo 回傳的 AES 加密交易資料。
   * @param tradeSha 回傳的 SHA256 加密交易資料。
   */
  public verifyTradeSha(
    merchantInfo: MerchantInfo,
    tradeInfo: string,
    tradeSha: string
  ): boolean {
    const _tradeSha = this.generateTradeSha(
      tradeInfo,
      merchantInfo.hashKey,
      merchantInfo.hashIV
    );

    return _tradeSha === tradeSha;
  }
}
