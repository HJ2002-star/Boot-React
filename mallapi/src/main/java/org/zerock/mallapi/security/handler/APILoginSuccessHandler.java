package org.zerock.mallapi.security.handler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.JWTUtil;

import com.google.gson.Gson;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class APILoginSuccessHandler
        implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        MemberDTO member = (MemberDTO) authentication.getPrincipal();

        Map<String, Object> accessClaims =
            new HashMap<>(member.getClaims());

        accessClaims.put("tokenType", "access");

        Map<String, Object> refreshClaims = new HashMap<>();
        refreshClaims.put("email", member.getEmail());
        refreshClaims.put("tokenType", "refresh");

        String accessToken = JWTUtil.generateToken(accessClaims, 10);
        String refreshToken = JWTUtil.generateToken(refreshClaims, 1440);

        Map<String, Object> result = new HashMap<>(member.getClaims());
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write(new Gson().toJson(result));
    }
}