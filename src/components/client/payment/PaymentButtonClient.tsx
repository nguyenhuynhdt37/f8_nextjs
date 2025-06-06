'use client';

import { CreatePayment } from "@/api/axios/api";
import { useState } from "react";


export default function PaymentButtonClient() {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            const res = await CreatePayment({ courseId: 42 });
            const { paymentUrl } = res.data;
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
