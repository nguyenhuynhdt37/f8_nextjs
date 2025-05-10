'use client';

import { useState } from "react";


export default function PaymentButton() {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5217/api/vnpay/create`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: 10000,
                        orderInfo: `Thanh toán đơn ${Date.now()}`,
                        bankCode: null
                    }),
                }
            );
            const data = await res.json();
            const { paymentUrl } = data.data;
            console.log('res', paymentUrl);

            window.location.href = paymentUrl;
        } catch {
            alert("Không thể khởi tạo thanh toán.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handlePay} disabled={loading}>
            {loading ? "Đang khởi tạo..." : `Pay ${"10000".toLocaleString()}₫`}
        </button>
    );
}
