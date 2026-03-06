package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.RdTransactionRequest;
import com.example.demo.dto.RdTransactionSummaryDTO;
import com.example.demo.entity.RdTransaction;
import com.example.demo.enums.TransactionStatus;
import com.example.demo.repo.RdTransactionRepository;

@Service
public class RdTransactionService {

    @Autowired
    private RdTransactionRepository transactionRepo;

    public RdTransaction createTransaction(RdTransactionRequest request) {

        // ============================
        // 🔥 TEMPORARY TESTING OVERRIDE
        // ============================

        // Count successful transactions already done
        long count = transactionRepo.countSuccessfulTransactions(request.getRdAccountId());

        // Next month = count + 1
        int fakeMonth = (int) count + 1;

        // Always use same year for clean output
        int fakeYear = 2025;

        LocalDate fakeDate = LocalDate.of(fakeYear, fakeMonth, 1);

        RdTransaction tx = new RdTransaction();
        tx.setRdAccountId(request.getRdAccountId());
        tx.setAmount(request.getAmount());
        tx.setTransactionDate(fakeDate);
        tx.setTransactionMonth(fakeMonth);
        tx.setTransactionYear(fakeYear);
        tx.setPaymentMode(request.getPaymentMode());
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setPenaltyAmount(BigDecimal.ZERO);

        return transactionRepo.save(tx);
    }

    public RdTransactionSummaryDTO getSummary(Long rdAccountId) {

        RdTransactionSummaryDTO dto = new RdTransactionSummaryDTO();
        dto.setTotalTransactions(
            transactionRepo.countSuccessfulTransactions(rdAccountId)
        );
        dto.setTotalAmountPaid(
            transactionRepo.totalAmountPaid(rdAccountId)
        );

        return dto;
    }

    public List<RdTransaction> getHistory(Long rdAccountId) {
        return transactionRepo.findByRdAccountIdOrderByTransactionDateDesc(rdAccountId);
    }
}