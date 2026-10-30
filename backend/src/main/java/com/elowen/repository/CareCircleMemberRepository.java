package com.elowen.repository;

import com.elowen.entity.CareCircleMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CareCircleMemberRepository extends JpaRepository<CareCircleMember, Long> {
    List<CareCircleMember> findByUserId(Long userId);
    Optional<CareCircleMember> findByIdAndUserId(Long id, Long userId);
}
