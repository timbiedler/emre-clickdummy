"use client";

import type { Language } from "@/data/types";
import { uiTranslate } from "@/locales";
import { useApp } from "@/context/app-context";

/** Checkout labels for EN/DE via locales; ZH/PL inline maps */
const zhCheckout: Record<string, string> = {
  "checkout.title": "结账",
  "checkout.cart": "购物车",
  "checkout.delivery": "配送",
  "checkout.payment": "支付",
  "checkout.review": "审核",
  "checkout.confirmation": "确认",
  "checkout.confirmed": "已确认",
  "checkout.invoice": "发票",
  "checkout.dataRoom": "数据室",
  "checkout.offer": "报价",
  "checkout.rfq": "询价",
  "checkout.upload": "上传",
  "checkout.next": "下一步",
  "checkout.back": "返回",
  "checkout.buy": "购买",
  "checkout.finance": "融资",
  "checkout.leasing": "租赁",
  "checkout.placeOrder": "提交订单",
  "checkout.addToCart": "加入购物车",
  "checkout.proceedCheckout": "去结账",
  "checkout.payByInvoice": "发票付款",
  "checkout.mollieCheckout": "Mollie 结账",
  "checkout.globalBudget": "全局预算",
  "checkout.deliveryEstimate": "预计交付",
  "checkout.documentCheck": "文件审核",
  "checkout.purchaseOrder": "采购订单号",
  "checkout.supplierConfirmation": "供应商确认",
  "checkout.viewOrder": "查看订单",
  "checkout.uploadDocuments": "上传文件",
};

const plCheckout: Record<string, string> = {
  "checkout.title": "Kasa",
  "checkout.cart": "Koszyk",
  "checkout.delivery": "Dostawa",
  "checkout.payment": "Płatność",
  "checkout.review": "Przegląd",
  "checkout.confirmation": "Potwierdzenie",
  "checkout.confirmed": "Potwierdzone",
  "checkout.invoice": "Faktura",
  "checkout.dataRoom": "Data Room",
  "checkout.offer": "Oferta",
  "checkout.rfq": "Zapytanie",
  "checkout.upload": "Prześlij",
  "checkout.next": "Dalej",
  "checkout.back": "Wstecz",
  "checkout.buy": "Kup",
  "checkout.finance": "Finansowanie",
  "checkout.leasing": "Leasing",
  "checkout.placeOrder": "Złóż zamówienie",
  "checkout.addToCart": "Dodaj do koszyka",
  "checkout.proceedCheckout": "Przejdź do kasy",
  "checkout.payByInvoice": "Płatność na fakturę",
  "checkout.mollieCheckout": "Mollie Checkout",
  "checkout.globalBudget": "Budżet globalny",
  "checkout.deliveryEstimate": "Szacowany termin dostawy",
  "checkout.documentCheck": "Weryfikacja dokumentów",
  "checkout.purchaseOrder": "Numer PO",
  "checkout.supplierConfirmation": "Potwierdzenie dostawcy",
  "checkout.viewOrder": "Zobacz zamówienie",
  "checkout.uploadDocuments": "Prześlij dokumenty",
};

export function checkoutLabel(language: Language, key: string): string {
  if (language === "zh" && key in zhCheckout) return zhCheckout[key];
  if (language === "pl" && key in plCheckout) return plCheckout[key];
  const fromLocale = uiTranslate(language, key);
  if (fromLocale !== key) return fromLocale;
  return uiTranslate("en", key) !== key ? uiTranslate("en", key) : key;
}

export function useCheckoutT() {
  const { language } = useApp();
  return (key: string) => checkoutLabel(language, key);
}
