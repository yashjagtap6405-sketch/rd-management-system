package com.example.demo.cntrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CreateRdAccountRequest;
import com.example.demo.dto.RdCloseResponse;
import com.example.demo.dto.RdDashboardDTO;
import com.example.demo.dto.LoanEligibilityDTO;
import com.example.demo.entity.RdAccount;
import com.example.demo.service.RdAccountService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/rd")
@CrossOrigin(origins = "*")
public class RdAccountController {

    @Autowired
    private RdAccountService service;

    // CREATE RD
    @PostMapping("/create/{userId}")
    public ResponseEntity<RdAccount> create(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody CreateRdAccountRequest req
    ) {
        return ResponseEntity.status(201).body(service.createRdAccount(userId, req));
    }

    // DASHBOARD DATA
    @GetMapping("/user/{userId}")
    public ResponseEntity<RdDashboardDTO> getByUser(
            @PathVariable("userId") Long userId
    ) {
        return ResponseEntity.ok(service.getDashboardByUserId(userId));
    }

    // CLOSE RD (MATURED or PREMATURE)
    @PostMapping("/{rdId}/close")
    public ResponseEntity<RdCloseResponse> closeRd(
            @PathVariable("rdId") Long rdId
    ) {
        return ResponseEntity.ok(service.closeRdAccountByRdId(rdId));
    }

    // GET MATURITY PAYOUT
    @PostMapping("/{rdId}/payout")
    public ResponseEntity<RdCloseResponse> getPayout(
            @PathVariable("rdId") Long rdId
    ) {
        return ResponseEntity.ok(service.getMaturityPayoutOnly(rdId));
    }

    // ⭐ NEW — LOAN ELIGIBILITY CHECK
    @GetMapping("/{rdId}/loan-eligibility")
    public ResponseEntity<LoanEligibilityDTO> checkLoanEligibility(
            @PathVariable("rdId") Long rdId
    ) {
        return ResponseEntity.ok(service.checkLoanEligibility(rdId));
    }
}