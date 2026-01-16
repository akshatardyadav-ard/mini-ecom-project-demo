import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,          // ✅ REQUIRED
  imports: [CommonModule],   // ✅ Needed for *ngIf, *ngFor
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  orderId = 1;       // DB order ID
  amount = 2500;     // Amount in rupees

  constructor(private paymentService: PaymentService) { }

  payNow() {
    this.paymentService.createPayment(this.orderId, this.amount).subscribe({
      next: (res) => {
        this.openRazorpay(res);
      },
      error: (err) => {
        alert('Payment order creation failed');
      },
    });
  }

  openRazorpay(data: any) {
    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      name: 'My E-Commerce',
      description: 'Order Payment',
      order_id: data.order.id,

      handler: (response: any) => {
        this.verifyPayment(response);
      },

      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999',
      },

      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  verifyPayment(response: any) {
    const payload = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    };

    this.paymentService.verifyPayment(payload).subscribe({
      next: () => {
        alert('Payment Successful 🎉');
      },
      error: () => {
        alert('Payment verification failed');
      },
    });
  }
}
