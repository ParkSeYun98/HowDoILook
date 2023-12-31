package com.ssafy.howdoilook.domain.user.dto.request;

import com.ssafy.howdoilook.domain.user.entity.ClosetAccess;
import com.ssafy.howdoilook.domain.user.entity.Gender;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserUpdateRequestDto {

    private String name;

    private String nickname;

    private Gender gender;

    private int age;

    private ClosetAccess closetAccess;

    @Builder
    public UserUpdateRequestDto(String name, String nickname, Gender gender, int age, ClosetAccess closetAccess) {
        this.name = name;
        this.nickname = nickname;
        this.gender = gender;
        this.age = age;
        this.closetAccess = closetAccess;
    }
}
