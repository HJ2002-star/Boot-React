package org.zerock.mallapi.util;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JWTUtil {

    private static SecretKey signingKey() {
        String secret = System.getenv("MALL_JWT_SECRET");

        if (secret == null
                || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                "MALL_JWT_SECRET은 UTF-8 기준 32바이트 이상이어야 합니다."
            );
        }

        return Keys.hmacShaKeyFor(
            secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public static String generateToken(
            Map<String, Object> claims,
            int minutes) {

        Map<String, Object> payload = new HashMap<>(claims);
        payload.remove("iat");
        payload.remove("exp");
        payload.remove("nbf");

        Instant now = Instant.now();

        return Jwts.builder()
            .setHeaderParam("typ", "JWT")
            .setClaims(payload)
            .setIssuedAt(Date.from(now))
            .setExpiration(
                Date.from(now.plus(minutes, ChronoUnit.MINUTES))
            )
            .signWith(signingKey())
            .compact();
    }

    public static Map<String, Object> validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(signingKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (ExpiredJwtException e) {
            throw new CustomJWTException("Expired");
        } catch (JwtException | IllegalArgumentException e) {
            throw new CustomJWTException("Invalid");
        }
    }
}