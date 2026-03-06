package com.example.demo.repo;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.RdTransaction;
import com.example.demo.enums.TransactionStatus;

public interface RdTransactionRepository extends JpaRepository<RdTransaction, Long> {

    /**
     * Used ONLY for history screens
     * Never use this for business calculations
     */
    List<RdTransaction> findByRdAccountIdOrderByTransactionDateDesc(Long rdAccountId);

    /**
     * 🔴 CRITICAL FOR CLOSE RD
     * Fetches ONLY successful RD deposits
     * Used to:
     * - count deposits
     * - calculate refund / interest
     */
    @Query("""
        SELECT t
        FROM RdTransaction t
        WHERE t.rdAccountId = :rdAccountId
          AND t.status = :status
        ORDER BY t.transactionYear, t.transactionMonth
    """)
    List<RdTransaction> findByRdAccountIdAndStatus(
            @Param("rdAccountId") Long rdAccountId,
            @Param("status") TransactionStatus status
    );

    /**
     * Used for dashboard numbers ONLY
     * Do NOT rely on this for Close RD logic
     */
    @Query("""
        SELECT COUNT(t)
        FROM RdTransaction t
        WHERE t.rdAccountId = :rdAccountId
          AND t.status = 'SUCCESS'
    """)
    long countSuccessfulTransactions(@Param("rdAccountId") Long rdAccountId);

    /**
     * Used for dashboard display ONLY
     * NEVER for payout calculation
     */
    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM RdTransaction t
        WHERE t.rdAccountId = :rdAccountId
          AND t.status = 'SUCCESS'
    """)
    BigDecimal totalAmountPaid(@Param("rdAccountId") Long rdAccountId);
    
    
    @Modifying
    @Query("DELETE FROM RdTransaction t WHERE t.rdAccountId = :rdId")
    void deleteAllByRdAccountId(@Param("rdId") Long rdId);
}