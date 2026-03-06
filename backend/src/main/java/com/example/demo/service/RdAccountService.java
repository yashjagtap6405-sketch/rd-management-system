package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CreateRdAccountRequest;
import com.example.demo.dto.RdCloseResponse;
import com.example.demo.dto.RdDashboardDTO;
import com.example.demo.dto.LoanEligibilityDTO;
import com.example.demo.entity.RdAccount;
import com.example.demo.entity.RdTransaction;
import com.example.demo.enums.TransactionStatus;
import com.example.demo.repo.RdAccountRepo;
import com.example.demo.repo.RdTransactionRepository;

import jakarta.transaction.Transactional;

@Service
public class RdAccountService {

    @Autowired
    private RdAccountRepo rdRepo;

    @Autowired
    private RdTransactionRepository txRepo;

    // CREATE RD
    public RdAccount createRdAccount(Long userId, CreateRdAccountRequest req) {

        if (rdRepo.existsByUserIdAndActiveTrue(userId)) {
            throw new RuntimeException("Active RD already exists for user");
        }

        RdAccount rd = new RdAccount();
        rd.setUserId(userId);
        rd.setAddress(req.getAddress());
        rd.setMobile(req.getMobile());
        rd.setDob(req.getDob());
        rd.setGender(req.getGender());
        rd.setRdStartDate(LocalDate.now());
        rd.setRdAmount(req.getRdAmount());
        rd.setPanNo(req.getPanNo());
        rd.setOccupation(req.getOccupation());

        return rdRepo.save(rd);
    }

    // DASHBOARD
    public RdDashboardDTO getDashboardByUserId(Long userId) {
        return rdRepo.findDashboardByUserId(userId);
    }

    // CLOSE RD
    @Transactional
    public RdCloseResponse closeRdAccountByRdId(Long rdId) {

        RdAccount rd = rdRepo.findByIdForUpdate(rdId)
                .orElseThrow(() -> new RuntimeException("RD account not found"));

        if (!rd.getActive()) {
            throw new RuntimeException("This RD is already closed");
        }

        List<RdTransaction> deposits =
                txRepo.findByRdAccountIdAndStatus(rd.getRid(), TransactionStatus.SUCCESS);

        if (deposits.isEmpty()) {
            throw new RuntimeException("Cannot close — no deposits made");
        }

        int depositCount = deposits.size();

        BigDecimal totalDeposited = deposits.stream()
                .map(RdTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal payout;
        String closureType;

        if (depositCount < 12) {
            payout = totalDeposited.multiply(BigDecimal.valueOf(0.50));
            closureType = "PREMATURE";
        } else {
            BigDecimal interest = totalDeposited.multiply(BigDecimal.valueOf(0.14));
            payout = totalDeposited.add(interest);
            closureType = "MATURED";
        }

        rd.setActive(false);
        rd.setClosedDate(LocalDate.now());
        rd.setPayoutAmount(payout);
        rd.setClosureType(closureType);

        rdRepo.save(rd);

        return new RdCloseResponse(
                rd.getRid(),
                closureType,
                depositCount,
                totalDeposited,
                payout
        );
    }

    // MATURITY PAYOUT + RESET CYCLE
    @Transactional
    public RdCloseResponse getMaturityPayoutOnly(Long rdId) {

        RdAccount rd = rdRepo.findByIdForUpdate(rdId)
                .orElseThrow(() -> new RuntimeException("RD not found"));

        if (!rd.getActive()) {
            throw new RuntimeException("RD is closed. Cannot generate payout.");
        }

        List<RdTransaction> deposits =
                txRepo.findByRdAccountIdAndStatus(rd.getRid(), TransactionStatus.SUCCESS);

        if (deposits.size() < 12) {
            throw new RuntimeException("Minimum 12 deposits required for maturity payout.");
        }

        BigDecimal totalDeposited = deposits.stream()
                .map(RdTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal interest = totalDeposited.multiply(BigDecimal.valueOf(0.14));
        BigDecimal payout = totalDeposited.add(interest);

        rd.setLastMaturityPayout(payout);
        rd.setLastPayoutDate(LocalDate.now());

        txRepo.deleteAllByRdAccountId(rd.getRid());

        rd.setRdStartDate(LocalDate.now());
        rd.setActive(true);

        rdRepo.save(rd);

        return new RdCloseResponse(
                rd.getRid(),
                "MATURITY_PAYOUT",
                deposits.size(),
                totalDeposited,
                payout
        );
    }

    // ⭐ NEW — LOAN ELIGIBILITY
    public LoanEligibilityDTO checkLoanEligibility(Long rdId) {

        RdAccount rd = rdRepo.findById(rdId)
                .orElseThrow(() -> new RuntimeException("RD account not found"));

        if (!rd.getActive()) {
            throw new RuntimeException("Loan not available on closed RD account");
        }

        List<RdTransaction> deposits =
                txRepo.findByRdAccountIdAndStatus(rdId, TransactionStatus.SUCCESS);

        int depositCount = deposits.size();

        if (depositCount < 6) {

            return new LoanEligibilityDTO(
                    false,
                    null,
                    null,
                    "Minimum 6 deposits required for loan eligibility"
            );
        }

        BigDecimal totalDeposited = deposits.stream()
                .map(RdTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal minLoan = totalDeposited.multiply(BigDecimal.valueOf(0.60));
        BigDecimal maxLoan = totalDeposited.multiply(BigDecimal.valueOf(0.80));

        return new LoanEligibilityDTO(
                true,
                minLoan,
                maxLoan,
                "You are eligible for RD secured loan"
        );
    }
}