package org.zerock.mallapi.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.repository.MemberRepository;
import org.zerock.mallapi.util.JWTUtil;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class APIRefreshController {
    private final MemberRepository memberRepository;

    @PostMapping("/api/member/refresh")
    public ResponseEntity<?> refresh(@RequestParam(name = "refreshToken") String refreshToken) {
        try {
            Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
            if (!"refresh".equals(claims.get("tokenType"))) {
                throw new IllegalArgumentException("Invalid token type");
            }
            Member member = memberRepository.getWithRoles((String) claims.get("email"));
            if (member == null) throw new IllegalArgumentException("Unknown member");
            MemberDTO dto = new MemberDTO(member.getEmail(), "", member.getNickname(),
                member.isSocial(), member.getMemberRoleList().stream().map(Enum::name).toList());
            Map<String, Object> accessClaims = new HashMap<>(dto.getClaims());
            accessClaims.put("tokenType", "access");
            String access = JWTUtil.generateToken(accessClaims, 10);
            long expiry = ((Number) claims.get("exp")).longValue();
            String refresh = refreshToken;
            if (expiry - System.currentTimeMillis() / 1000 < 3600) {
                refresh = JWTUtil.generateToken(Map.of("email", member.getEmail(), "tokenType", "refresh"), 1440);
            }
            return ResponseEntity.ok(Map.of("accessToken", access, "refreshToken", refresh));
        } catch (RuntimeException error) {
            return ResponseEntity.status(401).body(Map.of("error", "ERROR_REFRESH_TOKEN"));
        }
    }
}
