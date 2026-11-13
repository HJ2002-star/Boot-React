package org.zerock.mallapi.security.filter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.JWTUtil;
import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JWTCheckFilter extends OncePerRequestFilter {
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return request.getMethod().equals("OPTIONS")
            || path.equals("/api/member/kakao")
            || path.equals("/api/member/login")
            || path.equals("/api/member/refresh")
            || path.startsWith("/api/products/view/")
            || path.equals("/error");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        try {
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Missing bearer token");
            }
            Map<String, Object> claims = JWTUtil.validateToken(header.substring(7));
            if (!"access".equals(claims.get("tokenType"))) {
                throw new IllegalArgumentException("Invalid token type");
            }
            Object roles = claims.get("roleNames");
            if (!(roles instanceof List<?>)) throw new IllegalArgumentException("Invalid roles");
            List<String> names = ((List<?>) roles).stream().map(Object::toString).toList();
            MemberDTO member = new MemberDTO((String) claims.get("email"), "",
                (String) claims.get("nickname"), Boolean.TRUE.equals(claims.get("social")), names);
            SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(member, null, member.getAuthorities()));
        } catch (RuntimeException error) {
            SecurityContextHolder.clearContext();
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(new Gson().toJson(Map.of("error", "ERROR_ACCESS_TOKEN")));
            return;
        }
        chain.doFilter(request, response);
    }
}
