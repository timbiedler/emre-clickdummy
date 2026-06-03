"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Country, Order, Vertical } from "@/data/types";
import type { PaymentMethodId } from "@/data/checkout";
import {
  insuranceOptions,
  servicePackages,
  warrantyOptions,
} from "@/data/checkout";
import { getAllProducts } from "@/data";
import { getProductFinance } from "@/lib/product-finance";
import { t as localizedText } from "@/lib/i18n";
import type { Language } from "@/data/types";

export interface CartLine {
  productId: string;
  quantity: number;
  warrantyId: string;
  insuranceId: string;
  servicePackageId: string;
}

export interface CheckoutDraft {
  addressId: string;
  deliveryAddressId: string;
  deliveryCountry: Country;
  requestedDeliveryDate: string;
  poNumber: string;
  paymentMethod: PaymentMethodId;
  mollieMethod?: string;
  leasingTerm: number;
  leasingDownPayment: number;
  termsAccepted: boolean;
  checkoutPath: "purchase" | "leasing" | "rfq";
}

export interface PlacedOrderMeta {
  order: Order;
  confirmationNumber: string;
  dataRoomScore: number;
  missingDocuments: number;
}

interface CommerceContextValue {
  cart: CartLine[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (productId: string, qty?: number) => void;
  updateCartLine: (productId: string, patch: Partial<CartLine>) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotals: () => {
    subtotal: number;
    serviceTotal: number;
    warrantyTotal: number;
    insuranceTotal: number;
    shipping: number;
    vat: number;
    total: number;
    leasingMonthly: number;
  };
  checkoutDraft: CheckoutDraft;
  setCheckoutDraft: (patch: Partial<CheckoutDraft>) => void;
  resetCheckoutDraft: () => void;
  checkoutStep: number;
  setCheckoutStep: (n: number) => void;
  placedOrders: PlacedOrderMeta[];
  placeOrder: (opts: {
    vertical: Vertical;
    language: Language;
    country: Country;
    companyName: string;
  }) => PlacedOrderMeta;
  financeApplications: Array<{
    id: string;
    productName: string;
    customer: string;
    amount: number;
    monthlyRate: number;
    documentStatus: string;
    createdAt: string;
  }>;
  supplierOrderQueue: Array<{
    id: string;
    productName: string;
    quantity: number;
    eta: string;
    paymentStatus: string;
    financeStatus: string;
  }>;
  dataRoomUploadProgress: number;
  simulateDataRoomUpload: () => void;
  productDetailProductId: string | null;
  openProductDetail: (id: string) => void;
  closeProductDetail: () => void;
}

const defaultDraft: CheckoutDraft = {
  addressId: "addr-1",
  deliveryAddressId: "addr-1",
  deliveryCountry: "Germany",
  requestedDeliveryDate: "",
  poNumber: "",
  paymentMethod: "invoice",
  leasingTerm: 36,
  leasingDownPayment: 0,
  termsAccepted: false,
  checkoutPath: "purchase",
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutDraft, setDraft] = useState<CheckoutDraft>(defaultDraft);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [placedOrders, setPlacedOrders] = useState<PlacedOrderMeta[]>([]);
  const [financeApplications, setFinanceApplications] = useState<
    CommerceContextValue["financeApplications"]
  >([]);
  const [supplierOrderQueue, setSupplierOrderQueue] = useState<
    CommerceContextValue["supplierOrderQueue"]
  >([]);
  const [dataRoomUploadProgress, setDataRoomUploadProgress] = useState(62);
  const [productDetailProductId, setProductDetailProductId] = useState<string | null>(null);

  const setCheckoutDraft = useCallback((patch: Partial<CheckoutDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const resetCheckoutDraft = useCallback(() => {
    setDraft(defaultDraft);
    setCheckoutStep(1);
  }, []);

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + qty } : l
        );
      }
      return [
        ...prev,
        {
          productId,
          quantity: qty,
          warrantyId: "w-std",
          insuranceId: "i-none",
          servicePackageId: "s-basic",
        },
      ];
    });
    setCartOpen(true);
  }, []);

  const updateCartLine = useCallback((productId: string, patch: Partial<CartLine>) => {
    setCart((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, ...patch } : l))
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(
    () => cart.reduce((s, l) => s + l.quantity, 0),
    [cart]
  );

  const cartTotals = useCallback(() => {
    const products = getAllProducts();
    let subtotal = 0;
    let serviceTotal = 0;
    let warrantyTotal = 0;
    let insuranceTotal = 0;
    let leasingMonthly = 0;

    for (const line of cart) {
      const p = products.find((x) => x.id === line.productId);
      if (!p) continue;
      const tier =
        p.priceTiers.filter((t) => line.quantity >= t.minQty).pop()?.price ?? p.price;
      subtotal += tier * line.quantity;
      const fin = getProductFinance({ ...p, price: tier });
      leasingMonthly += fin.leasingRateMonthly * line.quantity;
    }

    const { warrantyOptions: wOpts, insuranceOptions: iOpts, servicePackages: sOpts } = {
      warrantyOptions,
      insuranceOptions,
      servicePackages,
    };
    for (const line of cart) {
      const w = wOpts.find((o) => o.id === line.warrantyId);
      const i = iOpts.find((o) => o.id === line.insuranceId);
      const s = sOpts.find((o) => o.id === line.servicePackageId);
      warrantyTotal += (w?.monthlyCost ?? 0) * line.quantity;
      insuranceTotal += (i?.monthlyCost ?? 0) * line.quantity;
      serviceTotal += (s?.monthlyCost ?? 0) * line.quantity;
    }

    const shipping = subtotal > 10000 ? 0 : 149;
    const vat = Math.round((subtotal + shipping) * 0.19);
    const total = subtotal + shipping + vat;
    leasingMonthly += serviceTotal + warrantyTotal + insuranceTotal;

    return {
      subtotal,
      serviceTotal,
      warrantyTotal,
      insuranceTotal,
      shipping,
      vat,
      total,
      leasingMonthly,
    };
  }, [cart]);

  const placeOrder = useCallback(
    (opts: {
      vertical: Vertical;
      language: Language;
      country: Country;
      companyName: string;
    }): PlacedOrderMeta => {
      const products = getAllProducts();
      const line = cart[0];
      const product = line ? products.find((p) => p.id === line.productId) : null;
      const totals = cartTotals();
      const orderId = `ord-${String(1000 + placedOrders.length + 1)}`;
      const isFinance =
        checkoutDraft.paymentMethod === "leasing" ||
        checkoutDraft.paymentMethod === "financing" ||
        checkoutDraft.paymentMethod === "finetrading";

      const order: Order = {
        id: orderId,
        vertical: opts.vertical,
        buyerId: "buy-01",
        supplierId: product?.supplierId ?? "sup-01",
        status: "processing",
        paymentStatus: isFinance ? "financed" : checkoutDraft.paymentMethod === "invoice" ? "pending" : "paid",
        amount: totals.total,
        carrier: "DHL",
        trackingNumber: `DHL${Date.now().toString().slice(-9)}`,
        eta: product
          ? new Date(Date.now() + product.deliveryDays * 86400000).toISOString().slice(0, 10)
          : "2026-07-15",
        createdAt: new Date().toISOString().slice(0, 10),
        items: cart.reduce((s, l) => s + l.quantity, 0),
        country: opts.country,
        productName: product ? localizedText(product.name, opts.language) : "Multi-item order",
        productId: product?.id,
        quantity: line?.quantity,
        paymentMethod: checkoutDraft.paymentMethod,
        financeMethod: isFinance ? checkoutDraft.paymentMethod : undefined,
        leasingMonthly: isFinance ? totals.leasingMonthly : undefined,
        buyerCompany: opts.companyName,
        poNumber: checkoutDraft.poNumber || undefined,
        documentStatus: isFinance ? `${dataRoomUploadProgress}% ready` : undefined,
        financeStatus: isFinance ? "under_review" : undefined,
        fromCheckout: true,
      };

      const meta: PlacedOrderMeta = {
        order,
        confirmationNumber: `CF-${orderId.toUpperCase()}`,
        dataRoomScore: dataRoomUploadProgress,
        missingDocuments: isFinance ? Math.max(0, 7 - Math.floor(dataRoomUploadProgress / 15)) : 0,
      };

      setPlacedOrders((prev) => [meta, ...prev]);
      setSupplierOrderQueue((prev) => [
        {
          id: orderId,
          productName: order.productName ?? "Order",
          quantity: order.items,
          eta: order.eta,
          paymentStatus: order.paymentStatus,
          financeStatus: order.financeStatus ?? "n/a",
        },
        ...prev,
      ]);

      if (isFinance) {
        setFinanceApplications((prev) => [
          {
            id: `fa-${orderId}`,
            productName: order.productName ?? "Equipment",
            customer: opts.companyName,
            amount: totals.total,
            monthlyRate: totals.leasingMonthly,
            documentStatus: `${dataRoomUploadProgress}% uploaded`,
            createdAt: order.createdAt,
          },
          ...prev,
        ]);
      }

      clearCart();
      return meta;
    },
    [cart, cartTotals, checkoutDraft, placedOrders.length, dataRoomUploadProgress, clearCart]
  );

  const simulateDataRoomUpload = useCallback(() => {
    setDataRoomUploadProgress((p) => Math.min(100, p + 12));
  }, []);

  const openProductDetail = useCallback((id: string) => setProductDetailProductId(id), []);
  const closeProductDetail = useCallback(() => setProductDetailProductId(null), []);

  return (
    <CommerceContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateCartLine,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotals,
        checkoutDraft,
        setCheckoutDraft,
        resetCheckoutDraft,
        checkoutStep,
        setCheckoutStep,
        placedOrders,
        placeOrder,
        financeApplications,
        supplierOrderQueue,
        dataRoomUploadProgress,
        simulateDataRoomUpload,
        productDetailProductId,
        openProductDetail,
        closeProductDetail,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be used within CommerceProvider");
  return ctx;
}
