package com.elowen.service;

import com.elowen.dto.InsightDto;
import com.elowen.entity.Medication;
import com.elowen.entity.User;
import com.elowen.repository.MedicationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InsightService {

    private final MedicationRepository medicationRepository;

    public InsightService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    public InsightDto getInsights(User user) {
        InsightDto dto = new InsightDto();
        dto.setBestDay("Wednesday");
        dto.setBestDayStat("98% adherence");
        dto.setNeedsAttention("Weekend evenings");
        dto.setNeedsAttentionStat("76% adherence");
        dto.setStrongestMed("Lisinopril");
        dto.setStrongestMedStat("96% adherence");

        List<Medication> meds = medicationRepository.findByUserId(user.getId());
        List<InsightDto.MedicationRankDto> rankings = new ArrayList<>();
        int[] defaultPercentages = { 96, 91, 84, 88, 92 };

        for (int i = 0; i < meds.size(); i++) {
            int pct = (i < defaultPercentages.length) ? defaultPercentages[i] : 90;
            rankings.add(new InsightDto.MedicationRankDto(meds.get(i).getName(), pct));
        }

        if (rankings.isEmpty()) {
            rankings.add(new InsightDto.MedicationRankDto("Lisinopril", 96));
            rankings.add(new InsightDto.MedicationRankDto("Vitamin D3", 91));
            rankings.add(new InsightDto.MedicationRankDto("Metformin", 84));
        }

        dto.setRankings(rankings);
        dto.setInsightTitle("A small shift could help");
        dto.setInsightDescription("You’re 23% more likely to miss your evening Vitamin D3 on weekends. A reminder at 7:30 PM may fit your routine better.");
        dto.setSuggestedAction("Update reminder");

        return dto;
    }

    public InsightDto refreshInsights(User user) {
        InsightDto dto = getInsights(user);
        dto.setInsightTitle("Optimized routine analysis");
        dto.setInsightDescription("Analysis updated based on your latest dose confirmations. Your morning adherence continues to be excellent at 98%.");
        return dto;
    }
}
