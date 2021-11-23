export interface QueryOrderInfo {
  /**
   * 商店訂單編號
   */
  MerchantOrderNo: string;
  /**
   * 訂單金額
   *
   * 此次交易的總金額。
   */
  Amt: number;
  /**
   * 資料來源
   *
   * - 若為複合式商店代號(MS5 開頭) ，此欄位為必填。
   * - 複合式商店查詢請固定填入： Composite設定此參數會查詢 複合式商店旗下對應商店的訂單。
   * - 若沒有帶[Gateway]或是帶入其他參數值，則查詢一般商店代號。
   */
  Gateway?: string;
}

export interface CheckValueParams {
  hashKey: string;
  hashIV: string;
  amt: number;
  merchantID: string;
  merchantOrderNo: string;
}

export interface QueryOrderResult {
  /**
   * 回傳狀態
   *
   * - 若查詢成功則回傳 SUCCESS。
   * - 若失敗則回傳錯誤代碼。
   */
  Status: string;
  /**
   * 回傳訊息
   *
   * 文字，敘述此次交易查詢的狀態。
   */
  Message: string;
  /**
   * 回傳內容
   *
   * 若查詢成功，該筆交易詳細資訊會放到此欄位。
   */
  Result: CreditCardResult | OtherResult;
}

export interface BaseResult {
  /**
   * 藍新金流商店代號
   */
  MerchantID: string;
  /**
   * 交易金額
   *
   * 查詢此筆訂單之交易金額
   */
  Amt: number;
  /**
   * 藍新金流交易序號
   *
   * 此次執行查詢的商店訂單所對應之藍新金流交易序號
   */
  TradeNo: string;
  /**
   * 商店訂單編號
   *
   * 此次執行查詢的商店訂單編號
   */
  MerchantOrderNo: string;
  /**
   * 支付狀態
   *
   * - 0=未付款
   * - 1=付款成功
   * - 2=付款失敗
   * - 3=取消付款
   */
  TradeStatus: string;
  /**
   * 支付方式
   *
   * - CREDIT=信用卡付款
   * - VACC=銀行 ATM 轉帳付款
   * - WEBATM=網路銀行轉帳付款
   * - BARCODE=超商條碼繳費
   * - CVS=超商代碼繳費
   */
  PaymentType: string;
  /**
   * 交易建立時間
   *
   * 藍新金流接收到此筆交易資料的時間。
   *
   * 回傳格式為：2014-06-2516:43:49
   */
  CreateTime: string;
  /**
   * 支付完成時間
   *
   * 藍新金流接收到此筆交易付款完成資訊的時間。
   *
   * 回傳格式為：2014-06-2516:43:49
   */
  PayTime: string;
  /**
   * 檢核碼
   *
   * 用來檢查此次資料回傳的合法性，
   * 商店查詢時可以比對此欄位資料，檢核是否為藍新金流平台所回傳。
   */
  CheckCode: string;
  /**
   * 預計撥款日
   *
   * 預計撥款的時間。
   *
   * 回傳格式為：2014-06-2516:43:49
   */
  FundTime: string;
  /**
   * 實際交易商店代號
   *
   * *此參數限複合式商店的交易回傳使用
   *
   * 實際交易藍新金流金流特店或閘道特店之商店代號。
   */
  ShopMerchantID?: string;
}

export interface CreditCardResult extends BaseResult {
  /**
   * 金融機構回應碼
   *
   * 由金融機構所回應的回應碼
   */
  RespondCode: string;
  /**
   * 授權碼
   *
   * 由金融機構所回應的授權碼
   */
  Auth: string;
  /**
   * ECI
   *
   * - 3D 回傳值 eci=1,2,5,6，代表為 3D 交易。
   * - 若交易送至金融機構授權時已是失敗狀態，則本欄位的值會以空值回傳。
   */
  ECI: string;
  /**
   * 請款金額
   *
   * 此筆交易設定的請款金額
   */
  CloseAmt: number;
  /**
   * 請款狀態
   *
   * - 0=未請款
   * - 1=等待提送請款至收單機構
   * - 2=請款處理中
   * - 3=請款完成
   */
  CloseStatus: string;
  /**
   * 可退款餘額
   *
   * - 若此筆交易未發動退款，則本欄位回傳值為可退款金額。
   * - 若此筆交易已發動退款，則本欄位回傳值為可退款餘額。
   */
  BackBalance: string;
  /**
   * 退款狀態
   *
   * - 0=未退款
   * - 1=等待提送退款至收單機構
   * - 2=退款處理中
   * - 3=退款完成
   */
  BackStatus: string;
  /**
   * 授權結果訊息
   *
   * 文字，銀行回覆此次信用卡授權結果狀態。
   */
  RespondMsg: string;
  /**
   * 分期-期別
   *
   * 信用卡分期交易期別。
   */
  Inst: string;
  /**
   * 分期-首期金額
   *
   * 信用卡分期交易首期金額。
   */
  InstFirst: string;
  /**
   * 分期-每期金額
   *
   * 信用卡分期交易每期金額。
   */
  InstEach: string;
  /**
   * 交易類別
   *
   * 依據此筆交易之信用卡類別回傳相對應的參數
   * - CREDIT = 台灣發卡機構核發之信用卡
   * - FOREIGN = 國外發卡機構核發之卡
   * - NTCB = 國民旅遊卡
   * - UNIONPAY = 銀聯卡
   * - APPLEPAY = ApplePay
   * - GOOGLEPAY = GooglePay
   * - SAMSUNGPAY = SamsungPay
   */
  PaymentMethod: string;
  /**
   * 信用卡前 6 碼
   */
  Card6No: string;
  /**
   * 信用卡後 4 碼
   */
  Card4No: string;
  /**
   * 收單金融機構
   *
   * 收單金融機構英文代碼與中文名稱對應如下：
   * - ［Esun］: 玉山銀行
   * - ［Taishin］: 台新銀行
   * - ［CTBC］: 中國信託銀行
   * - ［NCCC］: 聯合信用卡中心
   * - ［CathayBK］: 國泰世華銀行
   * - ［Citibank］：花旗銀行
   * - ［UBOT］:聯邦銀行
   * - ［SKBank］:新光銀行
   * - ［Fubon］:富邦銀行
   * - ［FirstBank］:第一銀行
   */
  AuthBank: string;
}

export interface OtherResult extends BaseResult {
  /**
   * 付款資訊
   *
   * - 付款方式為超商代碼(CVS)時，此欄位為超商繳款代碼。
   * - 付款方式為條碼(BARCODE)時，此欄位為繳款條碼，此欄位會將三段條碼資訊用逗號”,”組合後回傳。
   * - 付款方式為 ATM 轉帳時，此欄位為金融機構的轉帳帳號，括號內為金融機構代碼，例：(031)1234567890。
   */
  PayInfo: string;
  /**
   * 繳費有效期限
   *
   * 格式為 Y-m-d H:i:s 。
   *
   * 例：2014-06-29 23:59:59。
   */
  ExpireDate: string;
}
