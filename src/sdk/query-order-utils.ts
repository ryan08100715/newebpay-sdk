import { BaseResult, CreditCardResult, OtherResult } from "./query-order-types";

export function isCreditCardResult(
  result: BaseResult
): result is CreditCardResult {
  return result.PaymentType === "CREDIT";
}

export function isOtherResult(result: BaseResult): result is OtherResult {
  return result.PaymentType !== "CREDIT";
}
