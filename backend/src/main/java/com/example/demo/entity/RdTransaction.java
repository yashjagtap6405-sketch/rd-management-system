package com.example.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.example.demo.enums.PaymentMode;
import com.example.demo.enums.TransactionStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "rd_transaction",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"rd_account_id", "transaction_month", "transaction_year"}
        )
    },
    indexes = {
        @Index(name = "idx_rd_tx_account", columnList = "rd_account_id"),
        @Index(name = "idx_rd_tx_status", columnList = "status")
    }
)
public class RdTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tid;

    @Column(name = "rd_account_id", nullable = false)
    private Long rdAccountId;

    /**
     * Monthly RD amount paid (principal only)
     * Penalty is stored separately
     */
    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate transactionDate;

    /**
     * Month for which RD is paid (1–12)
     * Used to enforce one-payment-per-month rule
     */
    @Column(nullable = false)
    private Integer transactionMonth;

    @Column(nullable = false)
    private Integer transactionYear;

    /**
     * SUCCESS  -> valid RD deposit
     * PENALTY  -> late penalty collected
     * FAILED   -> rejected transaction (not counted)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    /**
     * Late payment penalty
     * NEVER included in RD maturity or refund
     */
    @Column(nullable = false)
    private BigDecimal penaltyAmount;

    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;

    /**
     * UPI ref / cash receipt number
     * Optional but audit-safe
     */
    private String referenceId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // ================= getters & setters =================

    public Long getTid() {
        return tid;
    }

    public void setTid(Long tid) {
        this.tid = tid;
    }

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

    public PaymentMode getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(PaymentMode paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}