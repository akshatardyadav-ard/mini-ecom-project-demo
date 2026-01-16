import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createPayment(orderId: number, amount: number) {
    return this.http.post<any>(
      `${this.API_URL}/payment/create`,
      { orderId, amount },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      }
    );
  }

  verifyPayment(data: any) {
    return this.http.post<any>(
      `${this.API_URL}/payment/verify`,
      data,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      }
    );
  }
}
