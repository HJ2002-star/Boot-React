package org.zerock.mallapi.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.service.MemberService;
import org.zerock.mallapi.util.JWTUtil;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SocialController {
    private final MemberService memberService;

    @PostMapping("/api/member/kakao")
    public ResponseEntity<Map<String, Object>> kakao(@RequestBody Map<String, String> request) {
        MemberDTO member = memberService.getKakaoMember(request.get("code"));
        Map<String, Object> claims = new HashMap<>(member.getClaims());
        claims.put("tokenType", "access");
        String access = JWTUtil.generateToken(claims, 10);
        String refresh = JWTUtil.generateToken(Map.of("email", member.getEmail(), "tokenType", "refresh"), 1440);
        Map<String, Object> result = new HashMap<>(member.getClaims());
        result.put("accessToken", access);
        result.put("refreshToken", refresh);
        return ResponseEntity.ok().cacheControl(org.springframework.http.CacheControl.noStore()).body(result);
    }

    @PutMapping("/api/member/modify")
    public Map<String, String> modify(@RequestBody MemberModifyDTO dto, Authentication authentication) {
        memberService.modifyMember(authentication.getName(), dto);
        return Map.of("result", "modified");
    }
}
