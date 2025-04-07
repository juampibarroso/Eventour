package com.eventour.eventour.util;

import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Base64;

public class JwtKeyGenerator {
    public static void main(String[] args) {
        // Generar una clave segura para JWT
        SecretKey key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        String base64Key = Base64.getEncoder().encodeToString(key.getEncoded());

        // Mostrar la clave generada
        System.out.println("Nueva clave segura para JWT: " + base64Key);
    }
}
