package org.zerock.mallapi.service;

import java.util.Map;
import java.util.UUID;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.MemberRole;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.repository.MemberRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public MemberDTO getKakaoMember(String code) {
        String clientId = System.getenv("KAKAO_REST_API_KEY");
        String clientSecret = System.getenv("KAKAO_CLIENT_SECRET");
        if (clientId == null || clientId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "카카오 서버 키가 설정되지 않았습니다.");
        }
        if (code == null || code.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "인가 코드가 없습니다.");
        }
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(10000);
        RestTemplate rest = new RestTemplate(factory);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", clientId);
        form.add("redirect_uri", "http://localhost:3000/member/kakao");
        form.add("code", code);
        if (clientSecret != null && !clientSecret.isBlank()) form.add("client_secret", clientSecret);
        try {
            Map<?, ?> token = rest.postForObject("https://kauth.kakao.com/oauth/token",
                new HttpEntity<>(form, headers), Map.class);
            if (token == null || !(token.get("access_token") instanceof String)) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "카카오 토큰 응답이 올바르지 않습니다.");
            }
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth((String) token.get("access_token"));
            Map<?, ?> user = rest.exchange("https://kapi.kakao.com/v2/user/me", HttpMethod.GET,
                new HttpEntity<>(userHeaders), Map.class).getBody();
            if (user == null || !(user.get("id") instanceof Number)) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "카카오 회원 정보를 확인할 수 없습니다.");
            }
            Long kakaoId = ((Number) user.get("id")).longValue();
            Member member = memberRepository.findByKakaoId(kakaoId).orElse(null);
            if (member == null) {
                String email = "kakao" + kakaoId + "@social.local";
                Object accountObj = user.get("kakao_account");
                if (accountObj instanceof Map<?, ?> account
                        && Boolean.TRUE.equals(account.get("is_email_valid"))
                        && Boolean.TRUE.equals(account.get("is_email_verified"))
                        && account.get("email") instanceof String actualEmail
                        && !memberRepository.existsById(actualEmail)) {
                    email = actualEmail;
                }
                member = Member.builder().email(email).kakaoId(kakaoId)
                    .pw(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .nickname("소셜회원").social(true).build();
                member.addRole(MemberRole.USER);
                memberRepository.save(member);
            }
            return toDTO(member);
        } catch (RestClientResponseException error) {
            String providerCode = "UNKNOWN";
            try {
                Map<?, ?> details = new com.google.gson.Gson().fromJson(error.getResponseBodyAsString(), Map.class);
                Object value = details.get("error_code");
                if (value == null) value = details.get("error");
                if (value != null) providerCode = value.toString().replaceAll("[^a-zA-Z0-9_-]", "");
            } catch (RuntimeException ignored) { }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "카카오 인증 오류: " + providerCode + " (HTTP " + error.getStatusCode().value() + "). 로그인 화면에서 다시 시작하세요.");
        }
    }

    @Override
    public void modifyMember(String authenticatedEmail, MemberModifyDTO dto) {
        if (dto.getEmail() != null && !authenticatedEmail.equals(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 정보만 수정할 수 있습니다.");
        }
        if (dto.getPw() == null || dto.getPw().length() < 8 || dto.getPw().length() > 64
                || dto.getPw().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호는 8~64자, UTF-8 72바이트 이내로 입력하세요.");
        }
        if (dto.getNickname() == null || dto.getNickname().isBlank() || dto.getNickname().length() > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "닉네임은 1~30자로 입력하세요.");
        }
        Member member = memberRepository.findById(authenticatedEmail).orElseThrow();
        member.changePw(passwordEncoder.encode(dto.getPw()));
        member.changeNickname(dto.getNickname().trim());
        member.changeSocial(false);
        memberRepository.save(member);
    }

    private MemberDTO toDTO(Member member) {
        return new MemberDTO(member.getEmail(), "", member.getNickname(), member.isSocial(),
            member.getMemberRoleList().stream().map(Enum::name).toList());
    }
}
