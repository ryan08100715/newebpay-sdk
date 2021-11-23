import { URLSearchParams } from "url";
import CryptoJS from "crypto-js";

export interface MerchantInfo {
  /**
   * 藍新金流商店代號
   */
  merchantID: string;
  /**
   * 藍新金流商店 API 串接金鑰 Hash Key
   */
  hashKey: string;
  /**
   * 藍新金流商店 API 串接金鑰 Hash IV
   */
  hashIV: string;
}

export abstract class Base {
  /**
   * 獲取tradeInfo
   * @param param 交易資料
   */
  protected generateTradeInfo(
    param: { [key: string]: any },
    hashKey: string,
    hashIV: string
  ): string {
    // query string serialize
    const serializedStr = new URLSearchParams(param).toString();

    // 加密
    const tradeInfo = this.aesEncrypt(serializedStr, hashKey, hashIV);

    return tradeInfo;
  }

  /**
   * 產生 tradeSha
   * @param tradeInfo 加密後的tradeInfo
   */
  protected generateTradeSha(
    tradeInfo: string,
    hashKey: string,
    hashIV: string
  ): string {
    // 組合需編碼字串
    const needHashStr = `HashKey=${hashKey}&${tradeInfo}&HashIV=${hashIV}`;

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
  protected aesEncrypt(data: string, key: string, iv: string): string {
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
  protected aesDeCrypt(encryptedData: string, key: string, iv: string): string {
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
  protected sha256Encode(data: string): string {
    // 將輸入轉換成套件格式
    const wordArrayData = CryptoJS.enc.Utf8.parse(data);

    // sha256 編碼
    const wordArray = CryptoJS.SHA256(wordArrayData);

    // 轉成hex字串回傳
    return CryptoJS.enc.Hex.stringify(wordArray);
  }
}
