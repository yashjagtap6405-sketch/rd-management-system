package com.example.demo.repo;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.User;




public interface UserRepo extends JpaRepository<User, Integer> {

    @Query(
        value = "SELECT * FROM users WHERE adharno = :adharno AND acno = :acno",
        nativeQuery = true
    )
    User login(
        @Param("adharno") String adharno,
        @Param("acno") String acno
    );

    boolean existsByAdharno(String adharno);
}
