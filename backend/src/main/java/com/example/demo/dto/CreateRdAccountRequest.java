package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateRdAccountRequest {

    private String address;
    private String mobile;
    private LocalDate dob;
    private String gender;
    private LocalDate rdStartDate;
    private BigDecimal rdAmount;
    private String panNo;
    private String occupation;
    
 // getters & setters
    
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public LocalDate getDob() {
		return dob;
	}
	public void setDob(LocalDate dob) {
		this.dob = dob;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public LocalDate getRdStartDate() {
		return rdStartDate;
	}
	public void setRdStartDate(LocalDate rdStartDate) {
		this.rdStartDate = rdStartDate;
	}
	public BigDecimal getRdAmount() {
		return rdAmount;
	}
	public void setRdAmount(BigDecimal rdAmount) {
		this.rdAmount = rdAmount;
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

    
}