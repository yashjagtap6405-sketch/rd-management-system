package com.example.demo.dto;



import java.math.BigDecimal;

public class LoanEligibilityDTO {

    private boolean eligible;
    private BigDecimal minLoanAmount;
    private BigDecimal maxLoanAmount;
    private String message;

    public LoanEligibilityDTO(
            boolean eligible,
            BigDecimal minLoanAmount,
            BigDecimal maxLoanAmount,
            String message
    ) {
        this.eligible = eligible;
        this.minLoanAmount = minLoanAmount;
        this.maxLoanAmount = maxLoanAmount;
        this.message = message;
    }

    public boolean isEligible() {
        return eligible;
    }

    public BigDecimal getMinLoanAmount() {
        return minLoanAmount;
    }

    public BigDecimal getMaxLoanAmount() {
        return maxLoanAmount;
    }

    public String getMessage() {
        return message;
    }
}
