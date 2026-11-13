package org.zerock.mallapi.service;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;
public interface MemberService {
    MemberDTO getKakaoMember(String code);
    void modifyMember(String authenticatedEmail, MemberModifyDTO dto);
}
