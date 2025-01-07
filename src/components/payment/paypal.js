"use client";
import { updatePremiumAction } from "@/actions/updatePremium";
import { useToast } from "@/hooks/use-toast";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

export default function PaypalButton({ setIsPaymentDialog }) {
    const router = useRouter();
    const { toast } = useToast();
    const paypalOptions = {
        "client-id": "AWiD1Rm6-XDJayPFvLaxqDLFnTiKsFsjgWBswXG7H1VDSHwS03g2dsoK0fJenoPV2lr-D0UOr0mMD0KZ",
        currency: "USD",
    };

    return (
        <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
                style={{
                    layout: "vertical",
                    color: "black",
                    shape: "rect",
                    label: "pay",
                }}
                fundingSource="card"
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: "500.00",
                                },
                                description: "Premium Blog Description",
                            },
                        ],
                    });
                }}
                onApprove={async (data, actions) => {
                    try {
                        const details = await actions.order.capture();
                        console.log(details, "onApprove");

                        const result = await updatePremiumAction(details);
                        console.log(details, result, "onApprove1");

                        if (result.success) {
                            router.push("/");
                            setIsPaymentDialog(false);
                        } else {
                            throw new Error("Failed to update subscription");
                        }
                    } catch (e) {
                        console.error("Error occured while payment! Please try again", e);
                        toast({
                            title: "Error",
                            description: "Error occured while payment! Please try again",
                            variant: "destructive",
                        });
                    }
                }}
                onError={(err) => {
                    console.error("Error occured while payment! Please try again");
                    toast({
                        title: "Error",
                        description: "Error occured while payment! Please try again",
                        variant: "destructive",
                    });
                }}
            />
        </PayPalScriptProvider>
    );
}