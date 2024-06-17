// const express = require('express')
// const cors = require('cors')
// const RazorPay = require('razorpay')
// const crypto = require('crypto')
// require('dotenv').config()

import express from 'express';
import cors from 'cors';
import RazorPay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello');
});
//Order
app.post('/order', async (req, res) => {
  try {
    const razorpay = new RazorPay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!req.body) {
      return res.status(400).send('Bad Request');
    }

    const options = req.body;

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(400).send('Bad Request');
    }

    res.send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Payment validate
app.post('/validate', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);

  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

  const digest = sha.digest('hex');

  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: 'Transaction is not validate' });
  }

  res.json({ msg: 'Transition is legit!', orderId: razorpay_payment_id });
});

app.listen(process.env.PORT, () => {
  console.log('Listening at PORT', process.env.PORT);
});
