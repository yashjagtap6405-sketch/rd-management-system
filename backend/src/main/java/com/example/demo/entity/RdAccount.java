package com.example.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;

@Entity
@Table(name = "rd_account")
public class RdAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rid;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String mobile;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(nullable = false)
    private String gender;

    @Column(name = "rd_start_date", nullable = false)
    private LocalDate rdStartDate;

    @Column(name = "rd_amount", nullable = false)
    private BigDecimal rdAmount;

    @Column(name = "pan_no", nullable = false)
    private String panNo;

    @Column(nullable = false)
    private String occupation;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "closed_date")
    private LocalDate closedDate;

    @Column(name = "payout_amount")
    private BigDecimal payoutAmount;

    @Column(name = "closure_type")
    private String closureType;

    // ⭐ NEW FIELDS (correct)
    @Column(name = "last_maturity_payout")
    private BigDecimal lastMaturityPayout;

    @Column(name = "last_payout_date")
    private LocalDate lastPayoutDate;

    // ===================== GETTERS & SETTERS =====================

    public Long getRid() { return rid; }
    public void setRid(Long rid) { this.rid = rid; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getRdStartDate() { return rdStartDate; }
    public void setRdStartDate(LocalDate rdStartDate) { this.rdStartDate = rdStartDate; }

    public BigDecimal getRdAmount() { return rdAmount; }
    public void setRdAmount(BigDecimal rdAmount) { this.rdAmount = rdAmount; }

    public String getPanNo() { return panNo; }
    public void setPanNo(String panNo) { this.panNo = panNo; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDate getClosedDate() { return closedDate; }
    public void setClosedDate(LocalDate closedDate) { this.closedDate = closedDate; }

    public BigDecimal getPayoutAmount() { return payoutAmount; }
    public void setPayoutAmount(BigDecimal payoutAmount) { this.payoutAmount = payoutAmount; }

    public String getClosureType() { return closureType; }
    public void setClosureType(String closureType) { this.closureType = closureType; }

    // ⭐ Corrected getter/setter names
    public BigDecimal getLastMaturityPayout() { return lastMaturityPayout; }
    public void setLastMaturityPayout(BigDecimal lastMaturityPayout) { this.lastMaturityPayout = lastMaturityPayout; }

    public LocalDate getLastPayoutDate() { return lastPayoutDate; }
    public void setLastPayoutDate(LocalDate lastPayoutDate) { this.lastPayoutDate = lastPayoutDate; }
}