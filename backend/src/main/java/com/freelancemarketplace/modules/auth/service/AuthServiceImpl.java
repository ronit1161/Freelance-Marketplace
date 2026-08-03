package com.freelancemarketplace.modules.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freelancemarketplace.modules.auth.record.AuthRequestRecord;
import com.freelancemarketplace.modules.auth.record.AuthResponseRecord;
import com.freelancemarketplace.modules.user.entity.User;
import com.freelancemarketplace.modules.user.mapper.UserMapper;
import com.freelancemarketplace.modules.user.record.CreateUserRecord;
import com.freelancemarketplace.modules.user.repository.UserRepository;
import com.freelancemarketplace.security.JwtUtils;

import com.freelancemarketplace.modules.wallet.entity.Wallet;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	
	private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserMapper userMapper;
    
    @Override
    @Transactional
    public AuthResponseRecord register(CreateUserRecord dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Email is already in use");
        }
        User user = userMapper.toEntity(dto);
        user.setHashedPassword(passwordEncoder.encode(dto.hashedPassword()));
        if (user.getWallet() == null) {
            user.setWallet(new Wallet());
        }
        User savedUser = userRepository.save(user);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.hashedPassword())
        );
        String token = jwtUtils.generateToken(authentication);
        return new AuthResponseRecord(token, userMapper.toDto(savedUser));
    }
    @Override
    public AuthResponseRecord login(AuthRequestRecord dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );
        String token = jwtUtils.generateToken(authentication);
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new AuthResponseRecord(token, userMapper.toDto(user));
    }

}
