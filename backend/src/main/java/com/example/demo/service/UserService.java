package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;


import com.example.demo.repo.UserRepo;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    // LOGIN
    public User login(LoginRequest request) {

        User user = repo.login(
                request.getAdharno(),
                request.getAcno()
        );

        if (user == null) {
            return null;
        }

        // BLOCK LOGIN IF TERMS NOT ACCEPTED
        if (!Boolean.TRUE.equals(user.getTermsAccepted())) {
            throw new RuntimeException("Terms and Conditions not accepted");
        }

        return user;
    }

    // REGISTRATION
    public User register(RegisterRequest request) {

        // TERMS CHECK (MANDATORY)
        if (request.getTermsAccepted() == null || !request.getTermsAccepted()) {
            throw new RuntimeException("Terms and Conditions must be accepted");
        }

        // DUPLICATE AADHAAR CHECK
        if (repo.existsByAdharno(request.getAdharno())) {
            throw new RuntimeException("Aadhaar already registered");
        }

        User user = new User();
        user.setAdharno(request.getAdharno());
        user.setAcno(request.getAcno());
        user.setFullname(request.getFullname());
        user.setCity(request.getCity());

        // USE REQUEST VALUE (NOT HARDCODED)
        user.setTermsAccepted(request.getTermsAccepted());

        return repo.save(user);
    }
}