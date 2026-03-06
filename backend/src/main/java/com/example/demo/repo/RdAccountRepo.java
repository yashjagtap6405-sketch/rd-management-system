package com.example.demo.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import com.example.demo.dto.RdDashboardDTO;
import com.example.demo.entity.RdAccount;

import jakarta.persistence.LockModeType;

public interface RdAccountRepo extends JpaRepository<RdAccount, Long> {

    boolean existsByUserIdAndActiveTrue(Long userId);

    Optional<RdAccount> findByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT r FROM RdAccount r WHERE r.rid = :rdId
    """)
    Optional<RdAccount> findByIdForUpdate(@Param("rdId") Long rdId);

    @Query("""
        SELECT new com.example.demo.dto.RdDashboardDTO(
            r.rid,
            r.active,
            r.rdAmount,
            r.rdStartDate,
            r.mobile,
            r.panNo,
            r.occupation,
            u.fullname,
            u.city,
            u.acno,
            u.adharno
        )
        FROM RdAccount r
        JOIN User u ON u.userId = r.userId
        WHERE r.userId = :userId
    """)
    RdDashboardDTO findDashboardByUserId(@Param("userId") Long userId);
}