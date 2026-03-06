package com.example.demo.dto;

public class RegisterRequest {

    private String adharno;
    private String acno;
    private String fullname;
    private String city;
    private Boolean termsAccepted;

    public Boolean getTermsAccepted() {
		return termsAccepted;
	}
	public void setTermsAccepted(Boolean termsAccepted) {
		this.termsAccepted = termsAccepted;
	}
	public String getAdharno() { return adharno; }
    public void setAdharno(String adharno) { this.adharno = adharno; }

    public String getAcno() { return acno; }
    public void setAcno(String acno) { this.acno = acno; }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}