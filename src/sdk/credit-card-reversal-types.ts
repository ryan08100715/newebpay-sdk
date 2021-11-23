export interface ReversalInfo {
  /**
   * 取消授權金額
   *
   * 純數字不含符號，需與授權金額相同
   */
  Amt: number;
  /**
   * 商店訂單編號
   *
   * 與藍新金流交易序號二擇一填入
   */
  MerchantOrderNo?: string;
  /**
   * 藍新金流交易序號
   *
   * 與商店訂單編號二擇一填入
   */
  TradeNo?: string;
  /**
   * 單號類別
   *
   * 只限定填數字 1 或 2
   * - 1 表示使用商店訂單編號
   * - 2 表示使用藍新金流交易單號
   */
  IndexType: number;
}

export interface ReversalResult {
  /**
   * 回傳狀態
   *
   * - 若取消授權程序成功，則回傳 SUCCESS。
   * - 若此筆交易取消授權需由金融機構批次處理，則回傳代碼：TRA20001。
   * - 若失敗則回傳錯誤代碼。
   */
  Status: string;
  /**
   * 回傳訊息
   *
   * 文字，敘述此次取消授權狀態。
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
     * 藍新金流交易序號
     *
     * 藍新金流在此筆交易成立時所產生的序號。
     */
    TradeNo: string;
    /**
     * 交易金額
     *
     * 本次交易取消授權金額，
     */
    Amt: number;
    /**
     * 商店訂單編號
     *
     * 此取消授權動作所執行的商店訂單編號。
     */
    MerchantOrderNo: string;
    /**
     * 檢核碼
     *
     * 用來檢查此次資料回傳的合法性，
     * 商戶串接時可以比對此欄位資料來檢核是否為藍新金流平台所回傳。
     */
    CheckCode: string;
  };
}
