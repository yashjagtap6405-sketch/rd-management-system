package com.example.demo.dto;



import java.math.BigDecimal;

public class RdCloseResponse {

    private Long rdId;
    private String closureType;
    private int totalDeposits;
    private BigDecimal totalDeposited;
    private BigDecimal payoutAmount;

    public RdCloseResponse(
            Long rdId,
            String closureType,
            int totalDeposits,
            BigDecimal totalDeposited,
            BigDecimal payoutAmount
    ) {
        this.rdId = rdId;
        this.closureType = closureType;
        this.totalDeposits = totalDeposits;
        this.totalDeposited = totalDeposited;
        this.payoutAmount = payoutAmount;
    }

    public Long getRdId() {
        return rdId;
    }

    public String getClosureType() {
        return closureType;
    }

    public int getTotalDeposits() {
        return totalDeposits;
    }

    public BigDecimal getTotalDeposited() {
        return totalDeposited;
    }

    public BigDecimal getPayoutAmount() {
        return payoutAmount;
    }
}