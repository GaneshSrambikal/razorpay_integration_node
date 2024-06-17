import './App.css';

function App() {
  const handlePayment = async () => {
    const amount = 500;
    const currency = 'INR';
    const receiptId = '1234567890';

    const response = await fetch('http://localhost:5000/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
    });

    const data = await response.json();
    console.log('order', data);

    var option = {
      key: '',
      amount,
      currency,
      name: 'Saas Prod',
      description: 'Test Transaction',
      image: 'https://i.ibb.co/5Y3m33n/test.png',
      order_id: data.id,
      handler: async function (res) {
        console.log(res);
        const body = { ...res };
        const validateResponse = await fetch('http://localhost:5000/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const jsonRes = await validateResponse.json();

        console.log('jsonResponse', jsonRes);
      },
      prefill: {
        name: 'Saas Prod',
        email: 'sassprod@gmail.com',
        contact: '900000000',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3388cc',
      },
    };

    // eslint-disable-next-line no-undef
    var rzp1 = new Razorpay(option);
    rzp1.on('Payment failed', function (res) {
      alert(res.error.code);
    });

    rzp1.open();

    event.preventDefault();
  };

  return (
    <>
      <div className='product'>
        <h1>RazorPay Payment Gateway</h1>
        <button className='button' onClick={handlePayment}>
          Pay Now
        </button>
      </div>
    </>
  );
}

export default App;
