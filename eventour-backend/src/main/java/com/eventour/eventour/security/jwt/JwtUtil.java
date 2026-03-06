package com.eventour.eventour.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    // 24 hs por ejemplo (ajustá a tu gusto)
    private static final long EXP_MS = 24L * 60 * 60 * 1000;

    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + EXP_MS);

        // Notar que en el token guardamos el subject y, opcionalmente, un claim "role" informativo.
        // La autorización REAL sale de la DB vía UserDetailsService.
        String firstRole = userDetails.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority()) // e.g. ROLE_ADMIN
                .orElse("ROLE_USER");

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", firstRole)   // informativo
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getAllClaimsFromToken(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Claims c = getAllClaimsFromToken(token);
            return c.getExpiration() != null && c.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    public UsernamePasswordAuthenticationToken getAuthentication(String token, UserDetails userDetails) {
    // No leas "role" del token para armar authorities.
    // Usá las del usuario real (DB): ROLE_ADMIN, etc.
    return new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities()
    );
}
    

}
