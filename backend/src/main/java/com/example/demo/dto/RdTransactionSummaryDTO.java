package com.example.demo.dto;

import java.math.BigDecimal;

public class RdTransactionSummaryDTO {

    private long totalTransactions;
    private BigDecimal totalAmountPaid;
	public long getTotalTransactions() {
		return totalTransactions;
	}
	public void setTotalTransactions(long totalTransactions) {
		this.totalTransactions = totalTransactions;
	}
	public BigDecimal getTotalAmountPaid() {
		return totalAmountPaid;
	}
	public void setTotalAmountPaid(BigDecimal totalAmountPaid) {
		this.totalAmountPaid = totalAmountPaid;
	}

    
}
