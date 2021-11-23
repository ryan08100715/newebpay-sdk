export interface CloseInfo {
  /**
   * 請退款金額
   *
   * - 純數字不含符號。
   * - 一次刷卡請款金額需小於或等於授權金額。
   * - 一次刷卡退款金額需小於或等於請款金額。
   * - 分期付款請款金額須等於授權金額。
   * - 分期付款退款金額須等於請款金額。
   * - 紅利折抵請款金額須等於授權金額。
   * - 紅利折抵退款金額須等於請款金額。
   */
  Amt: number;
  /**
   * 商店訂單編號
   */
  MerchantOrderNo?: string;
  /**
   * 藍新金流交易序號
   */
  TradeNo?: string;
  /**
   * 選用單號類別
   *
   * 只能填數字 1 或 2
   * - 1 表示使用商店訂單編號
   * - 2 表示使用藍新金流交易單號
   */
  IndexType: number;
  /**
   * 請款或退款
   *
   * - 請款交易時請填 1
   * - 退款交易時請填2。
   */
  CloseType: number;
  /**
   * 取消請款或退款
   *
   * - 取消請款或退款交易時請填 1。
   *
   * 當傳送取消請款或退款參數時，系統將會取消該筆請款中或退款中的作業流程。
   */
  Cancel?: number;
}

export interface CloseResult {
  /**
   * 回傳狀態
   *
   * - 若請退款成功則回傳 SUCCESS。
   * - 若失敗則回傳錯誤代碼。
   */
  Status: string;
  /**
   * 回傳訊息
   *
   * 文字，敘述此次請退款訊息。
   */
  Message: string;
  /**
   * 回傳資料
   */
  Result: {
    /**
     * 藍新金流商店代號
     */
    MerchantID: string;
    /**
     * 請退款金額
     *
     * 本次交易請退款金額。
     */
    Amt: number;
    /**
     * 藍新金流交易序號
     */
    TradeNo: string;
    /**
     * 商店訂單編號
     *
     * 請退款的商店訂單編號。
     */
    MerchantOrderNo: string;
  };
}
