package com.elowen.service;

import com.elowen.dto.CareCircleRequest;
import com.elowen.entity.CareCircleMember;
import com.elowen.entity.User;
import com.elowen.repository.CareCircleMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareCircleService {

    private final CareCircleMemberRepository careCircleMemberRepository;

    public CareCircleService(CareCircleMemberRepository careCircleMemberRepository) {
        this.careCircleMemberRepository = careCircleMemberRepository;
    }

    public List<CareCircleMember> getMembers(User user) {
        return careCircleMemberRepository.findByUserId(user.getId());
    }

    public CareCircleMember addMember(User user, CareCircleRequest req) {
        CareCircleMember member = new CareCircleMember(
                user,
                req.getName(),
                req.getRelationship() != null ? req.getRelationship() : "Family member · Missed dose alerts",
                req.getStatus() != null ? req.getStatus() : "Active",
                req.getEmail(),
                req.getPhone()
        );
        return careCircleMemberRepository.save(member);
    }

    public void deleteMember(User user, Long id) {
        CareCircleMember member = careCircleMemberRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Care circle member not found"));
        careCircleMemberRepository.delete(member);
    }
}
