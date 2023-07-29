package com.ssafy.howdoilook.domain.ootd.service;

import com.ssafy.howdoilook.domain.clothes.entity.Clothes;
import com.ssafy.howdoilook.domain.clothes.repository.ClothesRepository;
import com.ssafy.howdoilook.domain.clothesOotd.entity.ClothesOotd;
import com.ssafy.howdoilook.domain.clothesOotd.entity.SlotType;
import com.ssafy.howdoilook.domain.clothesOotd.repository.ClothesOotdRepository;
import com.ssafy.howdoilook.domain.ootd.dto.request.OotdSaveRequestDto;
import com.ssafy.howdoilook.domain.ootd.dto.response.ClothesTypeListDto;
import com.ssafy.howdoilook.domain.ootd.dto.response.GetOotdListDto;
import com.ssafy.howdoilook.domain.ootd.entity.Ootd;
import com.ssafy.howdoilook.domain.ootd.repository.OotdRepository;
import com.ssafy.howdoilook.domain.user.entity.User;
import com.ssafy.howdoilook.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class OotdService {

    private final OotdRepository ootdRepository;
    private final UserRepository userRepository;
    private final ClothesRepository clothesRepository;
    private final ClothesOotdRepository clothesOotdRepository;

    @Transactional
    public Long saveOotd(OotdSaveRequestDto ootdSaveRequestDto) {
        User user = userRepository.findById(ootdSaveRequestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다"));

        List<Ootd> findOotd = ootdRepository.findByUser_IdAndOrder(ootdSaveRequestDto.getUserId(), ootdSaveRequestDto.getOrder());

        if(findOotd.isEmpty()){
            Ootd ootd = ootdRepository.save(Ootd.builder().user(user).order(ootdSaveRequestDto.getOrder()).build());

            System.out.println("====여기 옴?====");
            System.out.println(ootd);

            saveClothesOotd(ootd, ootdSaveRequestDto.getTopId(), SlotType.TOP);
            saveClothesOotd(ootd, ootdSaveRequestDto.getBottomId(), SlotType.BOTTOM);
            saveClothesOotd(ootd, ootdSaveRequestDto.getShoeId(), SlotType.SHOE);
            saveClothesOotd(ootd, ootdSaveRequestDto.getAccessory1Id(), SlotType.ACCESSORY1);
            saveClothesOotd(ootd, ootdSaveRequestDto.getAccessory2Id(), SlotType.ACCESSORY2);
            saveClothesOotd(ootd, ootdSaveRequestDto.getAccessory3Id(), SlotType.ACCESSORY3);

        } else {
            ClothesOotd findClothesOotd = clothesOotdRepository.findByOotd_IdAndType(findOotd.get(0).getId(), SlotType.TOP);
            clothesOotdRepository.deleteById(findClothesOotd.getId());
            saveOotd(ootdSaveRequestDto);

        }



//        return ootd.getId();
        return 1L;
    }

    private void saveClothesOotd(Ootd ootd, Long clothesId, SlotType type) {
        if (clothesId == null) {
            return; // ID 값이 null이면 메서드 종료
        }

        System.out.println("====여기 옴2?====");

        Clothes clothes = clothesRepository.findById(clothesId).orElse(null);

        System.out.println(clothes);

        if(clothes != null) {
            ClothesOotd clothesOotd = ClothesOotd.builder()
                    .ootd(ootd)
                    .clothes(clothes)
                    .type(type)
                    .build();
            clothesOotdRepository.save(clothesOotd);
        }
    }

    public List<GetOotdListDto> findOotdList(Long userId) {

        List<GetOotdListDto> ootds = new ArrayList<>();

        List<Ootd> ootdIds = ootdRepository.findByUser_Id(userId);

        for(int i = 0; i < ootdIds.size(); i++){

            Long ootdId = ootdIds.get(i).getId();

            List<ClothesTypeListDto> topsList = ootdRepository.findOotdIdList(userId, "TOP", ootdId);
            List<ClothesTypeListDto> bottomsList = ootdRepository.findOotdIdList(userId, "BOTTOM", ootdId);
            List<ClothesTypeListDto> shoesList = ootdRepository.findOotdIdList(userId, "SHOE", ootdId);
            List<ClothesTypeListDto> ootdAccessories = ootdRepository.findOotdIdList(userId, "ACCESSORY", ootdId);
            List<ClothesTypeListDto> accessories1List = new ArrayList<>(List.of(ootdAccessories.get(0)));
            List<ClothesTypeListDto> accessories2List = new ArrayList<>(List.of(ootdAccessories.get(1)));
            List<ClothesTypeListDto> accessories3List = new ArrayList<>(List.of(ootdAccessories.get(2)));

            topsList.addAll(ootdRepository.findClothesList(userId, "TOP", ootdId));
            bottomsList.addAll(ootdRepository.findClothesList(userId, "BOTTOM", ootdId));
            shoesList.addAll(ootdRepository.findClothesList(userId, "SHOE", ootdId));
            List<ClothesTypeListDto> allAccessories = ootdRepository.findClothesList(userId, "ACCESSORY", ootdId);
            accessories1List.addAll(allAccessories);
            accessories2List.addAll(allAccessories);
            accessories3List.addAll(allAccessories);

            GetOotdListDto getOotdListDto = GetOotdListDto.builder()
                    .ootdId(ootdId)
                    .tops(topsList)
                    .bottoms(bottomsList)
                    .shoes(shoesList)
                    .accessories1(accessories1List)
                    .accessories2(accessories2List)
                    .accessories3(accessories3List)
                    .build();

            ootds.add(getOotdListDto);
        }
        return ootds;
    }
}
