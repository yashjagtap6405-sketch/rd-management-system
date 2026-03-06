package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.demo.enums.TransactionStatus;

public class RdTransactionResponse {

    private Long tid;
    private BigDecimal amount;
    private LocalDate transactionDate;
    private Integer transactionMonth;
    private Integer transactionYear;
    private TransactionStatus status;
    private BigDecimal penaltyAmount;
	public Long getTid() {
		return tid;
	}
	public void setTid(Long tid) {
		this.tid = tid;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public LocalDate getTransactionDate() {
		return transactionDate;
	}
	public void setTransactionDate(LocalDate transactionDate) {
		this.transactionDate = transactionDate;
	}
	public Integer getTransactionMonth() {
		return transactionMonth;
	}
	public void setTransactionMonth(Integer transactionMonth) {
		this.transactionMonth = transactionMonth;
	}
	public Integer getTransactionYear() {
		return transactionYear;
	}
	public void setTransactionYear(Integer transactionYear) {
		this.transactionYear = transactionYear;
	}
	public TransactionStatus getStatus() {
		return status;
	}
	public void setStatus(TransactionStatus status) {
		this.status = status;
	}
	public BigDecimal getPenaltyAmount() {
		return penaltyAmount;
	}
	public void setPenaltyAmount(BigDecimal penaltyAmount) {
		this.penaltyAmount = penaltyAmount;
	}

    
}
