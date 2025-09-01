package com.eventour.eventour.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMillis;

    public JwtUtil(
            @Value("${jwt.secret:a-string-secret-at-least-256-bits-long}") String secret,
            @Value("${jwt.expiration.millis:86400000}") long expirationMillis) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMillis = expirationMillis;
    }

    public String generateToken(UserDetails user) {
        String role = firstAuthority(user.getAuthorities()); // ej: ROLE_ADMIN
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .setSubject(user.getUsername())
                .addClaims(Map.of("role", role))
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String firstAuthority(Collection<? extends GrantedAuthority> auths) {
        return auths.stream().findFirst().map(GrantedAuthority::getAuthority).orElse("ROLE_USER");
    }

    public String getUsernameFromToken(String token) {
        return parser(token).getBody().getSubject();
    }

    public String getRoleFromToken(String token) {
        Object r = parser(token).getBody().get("role");
        return r == null ? null : r.toString();
    }

    public boolean validateToken(String token) {
        parser(token); // lanza si hay problema
        return true;
    }

    private Jws<Claims> parser(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    

    // dentro de la clase JwtUtil
    public UsernamePasswordAuthenticationToken getAuthentication(String token, UserDetails userDetails) {
        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
    }

}
