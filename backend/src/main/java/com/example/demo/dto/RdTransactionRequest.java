package com.example.demo.dto;

import java.math.BigDecimal;

import com.example.demo.enums.PaymentMode;

public class RdTransactionRequest {

    private Long rdAccountId;
    private BigDecimal amount;
    private PaymentMode paymentMode;
	public Long getRdAccountId() {
		return rdAccountId;
	}
	public void setRdAccountId(Long rdAccountId) {
		this.rdAccountId = rdAccountId;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public PaymentMode getPaymentMode() {
		return paymentMode;
	}
	public void setPaymentMode(PaymentMode paymentMode) {
		this.paymentMode = paymentMode;
	}

    
}