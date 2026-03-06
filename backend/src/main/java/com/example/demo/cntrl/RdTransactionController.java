package com.example.demo.cntrl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RdTransactionRequest;
import com.example.demo.dto.RdTransactionResponse;
import com.example.demo.dto.RdTransactionSummaryDTO;
import com.example.demo.entity.RdTransaction;
import com.example.demo.service.RdTransactionService;

@RestController
@RequestMapping("/api/rd/transaction")
@CrossOrigin
public class RdTransactionController {

    @Autowired
    private RdTransactionService service;

    @PostMapping
    public ResponseEntity<RdTransactionResponse> create(
            @RequestBody RdTransactionRequest request) {

        RdTransaction tx = service.createTransaction(request);

        RdTransactionResponse res = new RdTransactionResponse();
        res.setTid(tx.getTid());
        res.setAmount(tx.getAmount());
        res.setTransactionDate(tx.getTransactionDate());
        res.setTransactionMonth(tx.getTransactionMonth());
        res.setTransactionYear(tx.getTransactionYear());
        res.setStatus(tx.getStatus());
        res.setPenaltyAmount(tx.getPenaltyAmount());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/summary/{rdAccountId}")
    public RdTransactionSummaryDTO summary(@PathVariable ("rdAccountId")Long rdAccountId) {
        return service.getSummary(rdAccountId);
    }

    @GetMapping("/history/{rdAccountId}")
    public List<RdTransaction> history(@PathVariable ("rdAccountId") Long rdAccountId) {
        return service.getHistory(rdAccountId);
    }
}