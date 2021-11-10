import { URLSearchParams } from "url";
import CryptoJS from "crypto-js";

import { MPGOptions, MPGParams } from "./newebpay-sdk-types";

export class NewebpaySDK {
  // 藍新金流串接網址
  private serverUrl = {
    test: "https://ccore.newebpay.com/MPG/mpg_gateway",
    prod: "https://core.newebpay.com/MPG/mpg_gateway",
  };
  // 串接程式版本
  private version = "1.6";
  // 商店資訊
  private merchantID: string;
  private hashKey: string;
  private hashIV: string;
  private env: "test" | "prod";

  /**
   * @param env 串接環境，test or prod
   */
  constructor(
    merchantID: string,
    hashKey: string,
    hashIV: string,
    env: "test" | "prod"
  ) {
    this.merchantID = merchantID;
    this.hashKey = hashKey;
    this.hashIV = hashIV;
    this.env = env;
  }

  /**
   * MPG(Multi Payment Gateway)
   * @param options MPG參數
   */
  public mpg(options: MPGOptions): MPGParams {
    const params = Object.assign(
      {},
      {
        MerchantID: this.merchantID,
        RespondType: "JSON",
        TimeStamp: Math.floor(Date.now() / 1000).toString(),
        Version: this.version,
      },
      options
    );

    const tradeInfo = this.generateTradeInfo(params);
    const tradeSha = this.generateTradeSha(tradeInfo);

    return {
      requestUrl: this.getRequestUrl(),
      merchantID: this.merchantID,
      tradeInfo: tradeInfo,
      tradeSha: tradeSha,
      version: this.version,
    };
  }

  /**
   * 驗證tradeInfo、tradeSha是否正確
   * @param tradeInfo 要驗證的tradeInfo
   * @param tradeSha 要核對的tradeSha
   */
  public verifyTradeSha(tradeInfo: string, tradeSha: string): boolean {
    return tradeSha === this.generateTradeSha(tradeInfo);
  }

  /**
   * 解密tradeInfo
   * @param tradeInfo 要解密的tradeInfo
   */
  public decryptTradeInfo(tradeInfo: string): any {
    const dataStr = this.aesDeCrypt(tradeInfo, this.hashKey, this.hashIV);

    return JSON.parse(dataStr);
  }

  /**
   * 根據SDK環境返回請求網址
   */
  private getRequestUrl(): string {
    return this.env === "prod" ? this.serverUrl.prod : this.serverUrl.test;
  }

  /**
   * 獲取tradeInfo
   * @param param 交易資料
   */
  private generateTradeInfo(param: { [key: string]: any }): string {
    // query string serialize
    const serializedStr = new URLSearchParams(param).toString();

    // 加密
    const tradeInfo = this.aesEncrypt(serializedStr, this.hashKey, this.hashIV);

    return tradeInfo;
  }

  /**
   * 產生 tradeSha
   * @param tradeInfo 加密後的tradeInfo
   */
  private generateTradeSha(tradeInfo: string): string {
    // 組合需編碼字串
    const needHashStr = `HashKey=${this.hashKey}&${tradeInfo}&HashIV=${this.hashIV}`;

    // 編碼
    const hashedStr = this.sha256Encode(needHashStr);

    // 轉成大寫
    return hashedStr.toUpperCase();
  }

  /**
   * AES加密
   * @param data 要加密的字串資料
   * @param key 加密金鑰
   * @param iv 加密初始向量
   */
  private aesEncrypt(data: string, key: string, iv: string): string {
    // 將輸入轉換成套件格式
    const wordArrayData = CryptoJS.enc.Utf8.parse(data);
    const wordArrayKey = CryptoJS.enc.Utf8.parse(key);
    const wordArrayIV = CryptoJS.enc.Utf8.parse(iv);

    // 加密
    const encrypted = CryptoJS.AES.encrypt(wordArrayData, wordArrayKey, {
      iv: wordArrayIV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // 轉成hex字串回傳
    return CryptoJS.format.Hex.stringify(encrypted);
  }

  /**
   * AES解密
   * @param encryptedData 要解密的16進制字串
   * @param key 解密金鑰
   * @param iv 解密初始向量
   */
  private aesDeCrypt(encryptedData: string, key: string, iv: string): string {
    // 將輸入轉換成套件格式
    const chiperParamsData = CryptoJS.format.Hex.parse(encryptedData);
    const wordArrayKey = CryptoJS.enc.Utf8.parse(key);
    const wordArrayIV = CryptoJS.enc.Utf8.parse(iv);

    // 解密
    const decrypted = CryptoJS.AES.decrypt(chiperParamsData, wordArrayKey, {
      iv: wordArrayIV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // 轉成utf8字串回傳
    return CryptoJS.enc.Utf8.stringify(decrypted);
  }

  /**
   * SHA256編碼
   * @param data 要編碼的字串
   */
  private sha256Encode(data: string): string {
    // 將輸入轉換成套件格式
    const wordArrayData = CryptoJS.enc.Utf8.parse(data);

    // sha256 編碼
    const wordArray = CryptoJS.SHA256(wordArrayData);

    // 轉成hex字串回傳
    return CryptoJS.enc.Hex.stringify(wordArray);
  }
}
