import { MerchantInfo } from "../sdk/base";
import { MPGSDK } from "../sdk/mpg";
import { MPGInfo, MPGRequestInfo } from "../sdk/mpg-types";
import { CreditCardReversalSDK } from "../sdk/credit-card-reversal";
import {
  ReversalInfo,
  ReversalResult,
} from "../sdk/credit-card-reversal-types";
import { CreditCardFundRefundSDK } from "../sdk/credit-card-fund-refund";
import { CloseInfo, CloseResult } from "../sdk/credit-card-fund-refund-types";
import { QueryOrderSDK } from "../sdk/query-order";
import { QueryOrderInfo, QueryOrderResult } from "../sdk/query-order-types";

export class Merchant {
  private merchantInfo: MerchantInfo;
  private mpgSDK: MPGSDK;
  private reversalSDK: CreditCardReversalSDK;
  private fundRefundSDK: CreditCardFundRefundSDK;
  private queryOrderSDK: QueryOrderSDK;

  constructor(merchantInfo: MerchantInfo, environment: "prod" | "test") {
    this.merchantInfo = merchantInfo;
    this.mpgSDK = new MPGSDK(environment);
    this.reversalSDK = new CreditCardReversalSDK(environment);
    this.fundRefundSDK = new CreditCardFundRefundSDK(environment);
    this.queryOrderSDK = new QueryOrderSDK(environment);
  }

  /**
   * 多功能收款
   *
   * @param mpgInfo 收款資訊
   */
  public mpg(mpgInfo: MPGInfo): MPGRequestInfo {
    return this.mpgSDK.mpg(this.merchantInfo, mpgInfo);
  }

  /**
   * 驗證通知請求
   *
   * @param tradeInfo 回傳的 AES 加密交易資料。
   * @param tradeSha 回傳的 SHA256 加密交易資料。
   */
  public verifyTradeSha(tradeInfo: string, tradeSha: string): boolean {
    return this.mpgSDK.verifyTradeSha(this.merchantInfo, tradeInfo, tradeSha);
  }

  /**
   * 信用卡取消授權
   *
   * @param reversalInfo 取消授權資訊
   */
  public reversal(reversalInfo: ReversalInfo): Promise<ReversalResult> {
    return this.reversalSDK.reversal(this.merchantInfo, reversalInfo);
  }

  /**
   * 驗證取消授權請求結果檢核碼
   *
   * @param reversalResult 取消授權結果
   */
  public verifyReversalCheckCode(reversalResult: ReversalResult): boolean {
    return this.reversalSDK.verifyCheckCode(this.merchantInfo, reversalResult);
  }

  /**
   * 請退款
   *
   * @param closeInfo 請退款資訊
   */
  public close(closeInfo: CloseInfo): Promise<CloseResult> {
    return this.fundRefundSDK.close(this.merchantInfo, closeInfo);
  }

  /**
   * 查詢訂單資訊
   *
   * @param queryOrderInfo 訂單查詢資訊
   */
  public queryOrder(queryOrderInfo: QueryOrderInfo): Promise<QueryOrderResult> {
    return this.queryOrderSDK.queryOrder(this.merchantInfo, queryOrderInfo);
  }

  /**
   * 驗證訂單查詢請求結果檢核碼
   *
   * *請先確定查詢狀態為成功，有Result資訊，否則會報錯。
   *
   * @param queryOrderResult 訂單查詢結果
   */
  public verifyQueryOrderCheckCode(
    queryOrderResult: QueryOrderResult
  ): boolean {
    return this.queryOrderSDK.verifyCheckCode(
      this.merchantInfo,
      queryOrderResult
    );
  }
}
