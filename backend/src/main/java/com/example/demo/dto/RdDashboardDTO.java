package com.example.demo.dto;



import java.math.BigDecimal;
import java.time.LocalDate;

public class RdDashboardDTO {

    private Long rid;
    private Boolean active;
    private BigDecimal rdAmount;
    private LocalDate rdStartDate;

    private String mobile;
    private String panNo;
    private String occupation;

    private String fullName;
    private String city;
    private String acno;
    private String adharno;

    public RdDashboardDTO(
            Long rid,
            Boolean active,
            BigDecimal rdAmount,
            LocalDate rdStartDate,
            String mobile,
            String panNo,
            String occupation,
            String fullName,
            String city,
            String acno,
            String adharno
    ) {
        this.rid = rid;
        this.active = active;
        this.rdAmount = rdAmount;
        this.rdStartDate = rdStartDate;
        this.mobile = mobile;
        this.panNo = panNo;
        this.occupation = occupation;
        this.fullName = fullName;
        this.city = city;
        this.acno = acno;
        this.adharno = adharno;
    }

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public BigDecimal getRdAmount() {
		return rdAmount;
	}

	public void setRdAmount(BigDecimal rdAmount) {
		this.rdAmount = rdAmount;
	}

	public LocalDate getRdStartDate() {
		return rdStartDate;
	}

	public void setRdStartDate(LocalDate rdStartDate) {
		this.rdStartDate = rdStartDate;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getPanNo() {
		return panNo;
	}

	public void setPanNo(String panNo) {
		this.panNo = panNo;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getAcno() {
		return acno;
	}

	public void setAcno(String acno) {
		this.acno = acno;
	}

	public String getAdharno() {
		return adharno;
	}

	public void setAdharno(String adharno) {
		this.adharno = adharno;
	}

    
}
