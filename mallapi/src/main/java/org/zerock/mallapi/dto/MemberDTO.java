package org.zerock.mallapi.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;

@Getter
public class MemberDTO extends User {

    private final String email;
    private final String nickname;
    private final boolean social;
    private final List<String> roleNames;

    public MemberDTO(
            String email,
            String pw,
            String nickname,
            boolean social,
            List<String> roleNames) {

        super(
            email,
            pw,
            roleNames.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList())
        );

        this.email = email;
        this.nickname = nickname;
        this.social = social;
        this.roleNames = List.copyOf(roleNames);
    }

    public Map<String, Object> getClaims() {
        Map<String, Object> claims = new HashMap<>();

        claims.put("email", email);
        claims.put("nickname", nickname);
        claims.put("social", social);
        claims.put("roleNames", roleNames);

        return claims;
    }
}