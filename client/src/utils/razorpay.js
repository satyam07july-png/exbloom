// Dynamic loader for Razorpay checkout script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initiates Razorpay checkout flow
export const handleRazorpayPayment = async ({
  customerData,
  cartItems,
  totalAmount,
  onSuccess,
  onError,
}) => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    onError('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  try {
    // 1. Create order on server
    const orderRes = await fetch('/api/payment/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount,
        customer: customerData,
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok || !orderData.success) {
      throw new Error(orderData.error || 'Failed to create payment order');
    }

    const { order, key, dbOrderId } = orderData;

    // 2. Open Razorpay modal
    const options = {
      key: key,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'NEXBLOOM Audio Co.',
      description: `Payment for ${cartItems.length} items`,
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=200&q=80',
      order_id: order.id.startsWith('order_mock_') ? undefined : order.id,
      prefill: {
        name: customerData.name,
        email: customerData.email,
        contact: customerData.phone,
      },
      notes: {
        address: `${customerData.address}, ${customerData.city}`,
        dbOrderId: dbOrderId,
      },
      theme: {
        color: '#f59e0b', // Amber-500
      },
      handler: async function (response) {
        try {
          // 3. Verify payment signature on server
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || order.id,
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || '',
              dbOrderId: dbOrderId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            onSuccess(verifyData.order || { ...order, dbOrderId, paymentId: response.razorpay_payment_id });
          } else {
            onError(verifyData.error || 'Payment verification failed');
          }
        } catch (err) {
          onError('Error while verifying payment. Please contact support.');
        }
      },
      modal: {
        ondismiss: function () {
          onError('Payment window closed by user.');
        },
      },
    };

    // If in mock mode (placeholder keys), simulate a fast mock popup for dev verification
    if (order.id.startsWith('order_mock_')) {
      const confirmed = window.confirm(
        `[NEXBLOOM Dev Test Mode]\n\nRazorpay keys are currently in Test/Sandbox mode.\nAmount: ₹${totalAmount}\n\nClick OK to simulate Successful Payment, or Cancel to simulate Failure.`
      );
      if (confirmed) {
        const verifyRes = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: order.id,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: 'test_signature_nexbloom',
            dbOrderId: dbOrderId,
          }),
        });
        const verifyData = await verifyRes.json();
        onSuccess(verifyData.order || { id: order.id, dbOrderId });
      } else {
        onError('Payment cancelled.');
      }
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      onError(response.error.description || 'Payment Failed');
    });
    rzp.open();
  } catch (err) {
    onError(err.message || 'Payment initiation error');
  }
};
