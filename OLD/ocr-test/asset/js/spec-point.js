import 'https://code.jquery.com/jquery-3.6.0.min.js';



/* **********************************************************************************************************************
    * name		             :	 import filter
    * description	         : 	 필요한 필터 및 함수 import
    * keywordList            :   엘릭서 부위별 레벨 추출용 키워드 필터
    * elixirFilter           :   엘릭서 총합 레벨 계산을 위한 필터
    * elixirCalFilter        :   엘릭서 옵션별 수치 필터
    * arkFilter              :   2차 전직 (아크패시브) 구분용 필터
    * engravingCalFilter     :   무효 각인 필터
    * calAccessoryFilter     :   악세서리 옵션별 수치 필터
    * bangleFilter           :   팔찌 옵션 필터
    * engravingCheckFilter   :   각인 옵션 필터
    * stoneCheckFilter       :   어빌리티스톤 옵션 필터
    * classGemFilter         :   직업별 보석 딜 지분율 필터
    * insertLopecCharacters  :   캐릭터 DB 저장용 함수
    *********************************************************************************************************************** */
    import {
        keywordList,
        elixirFilter,
        elixirCalFilter,
        arkFilter,
        engravingCalFilter,
        calAccessoryFilter,
        bangleFilter,
        engravingCheckFilter,
        stoneCheckFilter,
        classGemFilter,
    } from '/asset/filter/filter.js';
    
    import { 
        insertLopecCharacters 
    } from '/asset/js/character.js'


/* **********************************************************************************************************************
    * name		        :	import
    * description	    : 	필요한 필터 및 함수 import
    *********************************************************************************************************************** */
//   api 동작 스크립트
let isRequesting = false;

// 4티어 스펙포인트
export let highTierSpecPointObj = {

    // 딜러
    dealerAttackPowResult: 0, // 공격력
    dealerTotalStatus: 0, // 치특신 합계
    dealerEngResult: 0, // 각인 효율
    dealerEvloutionResult: 0, // 진화 효율
    dealerEnlightResult: 0, // 깨달음 효율
    dealerLeapResult: 0, // 도약 효율
    dealerBangleResult: 0, // 팔찌 효율

    // 서포터
    supportStigmaResult: 0, // 낙인력
    supportAllTimeBuff: 0, // 상시버프
    supportFullBuff: 0, //풀버프
    supportEngBonus: 0, //각인 보너스
    supportgemsCoolAvg: 0, // 보석 쿨감
    supportCarePowerResult: 0, // 케어력
    supportBangleResult: 0, // 팔찌효율

    supportSpecPoint: 0,     // 서폿 최종 스펙포인트
    dealerlastFinalValue: 0, // 딜러 최종 스펙포인트
    completeSpecPoint: 0, // 통합된 최종 스펙포인트
}


// 등급 아이콘
export let gradeObj = {
    ico: "image",
    info: "info",
    lowTier: "",
}


// 2차전직명
export let userSecondClass = "";

// search.php 모든 html
export let searchHtml = '';

export function getCharacterProfile(inputName, callback) {
    if (isRequesting) {
        return;
    }
    isRequesting = true;


    async function callApiKey() {
        const response = await fetch('https://lucky-sea-34dd.tassardar6-c0f.workers.dev/');
        const api = await response.json();
        // console.log(api);
        return api; // 필요한 API 키를 반환
    }



    async function useApiKey() {
        let apiKey = await callApiKey();
        apiKey = apiKey.apiKey

        let url = `https://developer-lostark.game.onstove.com/armories/characters/${inputName}`;
        let options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: `bearer ${apiKey}`
            }
        };

            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);


            // 호출api모음
            let characterImage = data.ArmoryProfile.CharacterImage //캐릭터 이미지
            let characterLevel = data.ArmoryProfile.CharacterLevel //캐릭터 레벨
            let characterNickName = data.ArmoryProfile.CharacterName //캐릭터 닉네임
            let characterClass = data.ArmoryProfile.CharacterClassName //캐릭터 직업


            let serverName = data.ArmoryProfile.ServerName //서버명
            let itemLevel = data.ArmoryProfile.ItemMaxLevel //아이템레벨
            let guildNullCheck = data.ArmoryProfile.GuildName //길드명
            function guildName() {
                if (guildNullCheck == null) {
                    return ("없음")
                } else {
                    return (guildNullCheck)
                }
            }
            let titleNullCheck = data.ArmoryProfile.Title //칭호명
            function titleName() {
                if (titleNullCheck == null) {
                    return ("없음")
                } else {
                    return (titleNullCheck)
                }
            }



            // -----------------------계산식 함수 호출하기-----------------------------
            // -----------------------계산식 함수 호출하기-----------------------------
            // -----------------------계산식 함수 호출하기-----------------------------



            // ----------------------------------------------------------------------
            // --------------------------------서포터 함수----------------------------

            let enlightenmentCheck = []
            let enlightenmentArry = []
            data.ArkPassive.Effects.forEach(function (arkArry) {
                if (arkArry.Name == '깨달음') {
                    enlightenmentCheck.push(arkArry)
                }
            })
            // console.log(enlightenmentArry)


            function supportArkLeft(arkName) {
                let result = []
                arkName.map(function (arkNameArry) {
                    // 아크이름 남기기
                    let arkName = arkNameArry.Description.replace(/<[^>]*>/g, '').replace(/.*티어 /, '')
                    enlightenmentArry.push(arkName)
                });
            }
            supportArkLeft(enlightenmentCheck)
            // console.log(enlightenmentArry)

            // 직업명 단축이름 출력
            function supportCheck() {
                let arkResult = ""
                try {
                    arkFilter.forEach(function (arry) {
                        let arkInput = arry.name;
                        let arkOutput = arry.initial;

                        // console.log(arkInput)

                        enlightenmentArry.forEach(function (supportCheckArry) {
                            if (supportCheckArry.includes(arkInput) && data.ArkPassive.IsArkPassive) {
                                arkResult = arkOutput
                                return arkResult
                            }
                        })
                    })
                } catch (err) {
                    console.log(err)
                }
                return arkResult
            }


            userSecondClass = supportCheck()

            // console.log(supportCheck())

            // 직업명 풀네임 출력
            function jobCheck() {
                let arkResult = ""
                try {
                    arkFilter.forEach(function (arry) {
                        let arkInput = arry.name;

                        enlightenmentArry.forEach(function (supportCheckArry) {
                            if (supportCheckArry.includes(arkInput)) {
                                arkResult = arkInput
                                return arkResult
                            }
                        })
                    })
                } catch (err) {
                    console.log(err)
                }
                return arkResult
            }

            // --------------------------------서포터 끗------------------------------
            // ----------------------------------------------------------------------



            let cardFilter = ['세 우마르가 오리라', "라제니스의 운명"]
            // let comboCardString 
            // let comboFilter
            if (!(data.ArmoryCard == null)) {
                let comboCardString = JSON.stringify(data.ArmoryCard.Effects)
                let comboFilter = comboCardString.includes(cardFilter[0]) && comboCardString.includes(cardFilter[1])
            }


            // --아크패시브 활성화 딜러 계산식--


            // 악세서리 팔찌 가산점 (20240928추가함)
            let banglePoint = 0
            let bangleOptionArry = [];
            let bangeleStatsUse = [];
            let statsPercent = 0
            let bangleSpecialStats = ["힘", "민첩", "지능", "체력"]

            data.ArmoryEquipment.forEach(function (arry) {
                if (arry.Type == "팔찌") {
                    let bangleTier = JSON.parse(arry.Tooltip).Element_001.value.leftStr2.replace(/<[^>]*>/g, '').replace(/\D/g, '')
                    let bangleTool = JSON.parse(arry.Tooltip).Element_004.value.Element_001
                    bangleTierFnc(bangleTier, bangleTool)
                    bangleArryFnc(bangleOptionArry)
                }
            })


            // 팔찌 티어 검사 후 옵션 배열저장
            function bangleTierFnc(bangle, bangleTool) {
                if (bangle == 3) {
                    let regex = />([^<]+)</g;
                    let regexEnd = />([^<]*)$/;
                    let matches;

                    while ((matches = regex.exec(bangleTool)) !== null) {
                        // console.log(matches[1])
                        bangleOptionArry.push(matches[1].trim());
                    }
                    if ((matches = regexEnd.exec(bangleTool)) !== null) {
                        bangleOptionArry.push(matches[1].trim());
                    }

                } else if (bangle == 4) {
                    let regex = />([^<]+)</g;
                    let regexEnd = />([^<]*)$/;
                    let matches;

                    while ((matches = regex.exec(bangleTool)) !== null) {
                        // console.log(matches[1])
                        bangleOptionArry.push(matches[1].trim());
                    }
                    if ((matches = regexEnd.exec(bangleTool)) !== null) {
                        bangleOptionArry.push(matches[1].trim());
                    }
                }
            }

            // -----------------------계산식 함수 끝-----------------------------------
            // -----------------------계산식 함수 끝-----------------------------------
            // -----------------------계산식 함수 끝-----------------------------------


            // ---------------------------NEW 계산식 Ver 2.0---------------------------
            // ---------------------------NEW 계산식 Ver 2.0---------------------------
            // ---------------------------NEW 계산식 Ver 2.0---------------------------






            let defaultObj = {
                attackPow: 0,
                baseAttackPow: 0,
                criticalChancePer: 0,
                addDamagePer: 0,
                criticalDamagePer: 200,
                moveSpeed: 14,
                atkSpeed: 14,
                skillCool: 0,
                special: 0,
                haste: 0,
                crit: 0,
                weaponAtk: 0,
                hp: 0,
            }

            data.ArmoryProfile.Stats.forEach(function (statsArry) {
                if (statsArry.Type == "공격력") {
                    defaultObj.attackPow = Number(statsArry.Value)
                } else if (statsArry.Type == "치명") {
                    let regex = />(\d+(\.\d+)?)%/;
                    defaultObj.criticalChancePer = Number(statsArry.Tooltip[0].match(regex)[1])
                    defaultObj.crit = Number(statsArry.Value)
                } else if (statsArry.Type == "신속") {
                    let atkMoveSpeed = statsArry.Tooltip[0].match(/>(\d+(\.\d+)?)%<\/font>/)[1]
                    let skillCool = statsArry.Tooltip[2].match(/>(\d+(\.\d+)?)%<\/font>/)[1]
                    defaultObj.atkSpeed += Number(atkMoveSpeed)
                    defaultObj.moveSpeed += Number(atkMoveSpeed)
                    defaultObj.skillCool = Number(skillCool)
                    defaultObj.haste = Number(statsArry.Value)
                } else if (statsArry.Type == "특화") {
                    defaultObj.special = Number(statsArry.Value)
                } else if (statsArry.Type == "최대 생명력") {
                    defaultObj.hp = Number(statsArry.Value)
                }
            })

            data.ArmoryEquipment.forEach(function (equip) {
                if (equip.Type == "무기") {
                    let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue
                    defaultObj.addDamagePer += 10 + 0.002 * (quality) ** 2
                }
            })

            // 무기 공격력
            data.ArmoryEquipment.forEach(function (weapon) {
                if (weapon.Type == "무기") {
                    const regex = /무기 공격력\s*\+(\d+)/;
                    defaultObj.weaponAtk = Number(weapon.Tooltip.match(regex)[1])
                }
            })


            // baseAttckPow(기본 공격력 stats)
            data.ArmoryProfile.Stats.forEach(function (stats) {
                if (stats.Type == "공격력") {
                    const regex = />(\d+)</
                    defaultObj.baseAttackPow += Number(stats.Tooltip[1].match(regex)[1])
                }
            })



            // 직업별 기본점수
            let jobObj = {
                criticalChancePer: 0,
                criticalDamagePer: 0,
                moveSpeed: 0,
                atkSpeed: 0,
                skillCool: 0,
                atkPer: 0,
                stigmaPer: 0,

                finalDamagePer: 1,
                criFinalDamagePer: 1,
            }

            arkFilter.forEach(function (filterArry) {

                let plusArry = []
                let perArry = []

                objExtrudeFnc(jobObj, plusArry, perArry)

                plusArry.forEach(function (plusAttr) {
                    if (filterArry.initial == supportCheck() && !(filterArry[plusAttr] == undefined)) {
                        jobObj[plusAttr] = filterArry[plusAttr]
                    }
                })
                perArry.forEach(function (percent) {
                    if (filterArry.initial == supportCheck() && !(filterArry[percent] == undefined)) {
                        jobObj[percent] = (filterArry[percent] / 100) + 1
                    }

                })

            })

            function objExtrudeFnc(object, plus, percent) {
                Object.keys(object).forEach(function (objAttr) {
                    if (object[objAttr] == 0) {
                        plus.push(objAttr);
                    } else if (object[objAttr] == 1) {
                        percent.push(objAttr);
                    }
                })
            }

            // 악세서리 옵션별 점수
            let accObj = {
                addDamagePer: 0,
                finalDamagePer: 1,
                weaponAtkPlus: 0,
                weaponAtkPer: 0,
                atkPlus: 0,
                atkPer: 0,
                criticalChancePer: 0,
                criticalDamagePer: 0,
                stigmaPer: 0,
                atkBuff: 0,
                damageBuff: 0,

                enlightPoint: 0,

                carePower: 1,
            }


            function equimentCalPoint() {
                data.ArmoryEquipment.forEach(function (equipArry) {
                    let accOption
                    try {
                        accOption = JSON.parse(equipArry.Tooltip).Element_005.value.Element_001
                        accessoryFilterFnc(accOption)
                    }
                    catch { }

                })
            }


            equimentCalPoint()
            function accessoryFilterFnc(accessoryOption) {
                calAccessoryFilter.forEach(function (filterArry) {
                    let optionCheck = accessoryOption.includes(filterArry.name)
                    if (optionCheck && filterArry.attr == "AddDamagePer") { //추가 피해 %
                        accObj.addDamagePer += filterArry.value
                    } else if (optionCheck && filterArry.attr == "FinalDamagePer") { //에게 주는 피해가 %
                        accObj.finalDamagePer += (filterArry.value / 100)
                    } else if (optionCheck && filterArry.attr == "WeaponAtkPlus") { //무기 공격력 +
                        accObj.weaponAtkPlus += filterArry.value
                    } else if (optionCheck && filterArry.attr == "WeaponAtkPer") { //무기 공격력 %
                        accObj.weaponAtkPer += filterArry.value
                    } else if (optionCheck && filterArry.attr == "AtkPlus") { //공격력 +
                        accObj.atkPlus += filterArry.value
                    } else if (optionCheck && filterArry.attr == "AtkPer") { //공격력 %   
                        accObj.atkPer += filterArry.value
                    } else if (optionCheck && filterArry.attr == "CriticalChancePer") { //치명타 적중률 %
                        accObj.criticalChancePer += filterArry.value
                    } else if (optionCheck && filterArry.attr == "CriticalDamagePer") { //치명타 피해 %
                        accObj.criticalDamagePer += filterArry.value
                    } else if (optionCheck && filterArry.attr == "StigmaPer") { //낙인력 %
                        accObj.stigmaPer += filterArry.value
                    } else if (optionCheck && filterArry.attr == "AtkBuff") { //아군 공격력 강화 %
                        accObj.atkBuff += filterArry.value
                    } else if (optionCheck && filterArry.attr == "DamageBuff") { //아군 피해량 강화 %
                        accObj.damageBuff += filterArry.value
                    } else if (optionCheck && filterArry.attr == "CarePower") { // 아군 보호막, 회복 강화 %
                        accObj.carePower += filterArry.value
                    }
                })
            }

            accObj.finalDamagePer *= ((accObj.criticalChancePer * 0.684) / 100 + 1)
            //console.log("치적 적용"+accObj.finalDamagePer)
            accObj.finalDamagePer *= ((accObj.criticalDamagePer * 0.3625) / 100 + 1)
            //console.log (accObj.criticalDamagePer)
            //console.log("치적,치피 적용"+accObj.finalDamagePer)
            accObj.finalDamagePer *= ((accObj.weaponAtkPer * 0.4989) / 100 + 1)
            //console.log("치적,치피,무공퍼 적용" + accObj.finalDamagePer)
            accObj.finalDamagePer *= ((accObj.atkPer * 0.9246) / 100 + 1)
            //console.log(accObj)


            // 악세 깨달음 포인트
            data.ArmoryEquipment.forEach(function (arry) {
                let regex = /"([^"]*)"/g;
                let matches = [];
                let match;
                if (/목걸이|귀걸이|반지/.test(arry.Type)) {
                    while ((match = regex.exec(arry.Tooltip)) !== null) {             // ""사이값 추출
                        matches.push(match[1]);
                    }
                    let enlightStr = matches.filter(item => /깨달음/.test(item));     // 깨달음 포인트값 추출
                    accObj.enlightPoint += Number(enlightStr[0]?.match(/\d+/)[0]);
                }
            })


            // 팔찌
            let bangleObj = {
                atkPlus: 0,
                atkPer: 0,
                weaponAtkPlus: 0,
                criticalDamagePer: 0,
                criticalChancePer: 0,
                addDamagePer: 0,
                moveSpeed: 0,
                atkSpeed: 0,
                skillCool: 0,
                atkBuff: 0,
                atkBuffPlus: 0,
                damageBuff: 0,

                crit: 0,
                special: 0,
                haste: 0,

                str: 0,
                dex: 0,
                int: 0,

                weaponAtkPer: 1,
                finalDamagePer: 1,
                finalDamagePerEff: 1,
                criFinalDamagePer: 1,
            }

            bangleOptionArry.forEach(function (realBangleArry, realIdx) {

                let plusArry = ['atkPlus', 'atkPer', 'weaponAtkPlus', 'criticalDamagePer', 'criticalChancePer', 'addDamagePer', 'moveSpeed', 'atkSpeed', "skillCool", 'atkBuff', 'damageBuff', 'atkBuffPlus']
                let perArry = ['weaponAtkPer', 'finalDamagePer', 'criFinalDamagePer', 'finalDamagePerEff']
                let statsArry = ["치명:crit", "특화:special", "신속:haste", "힘:str", "민첩:dex", "지능:int"];

                statsArry.forEach(function (stats) {
                    let regex = new RegExp(`${stats.split(":")[0]}\\s*\\+\\s*(\\d+)`);
                    if (regex.test(realBangleArry)) {

                        // console.log(realBangleArry.match(regex)[1])
                        bangleObj[stats.split(":")[1]] += Number(realBangleArry.match(regex)[1]);

                    }

                })


                bangleFilter.forEach(function (filterArry) {

                    if (realBangleArry == filterArry.name && bangleOptionArry[realIdx + 1] == filterArry.option && filterArry.secondCheck == null) {
                        typeCheck(filterArry)

                    } else if (realBangleArry == filterArry.name && filterArry.option == null && filterArry.secondCheck == null) {
                        typeCheck(filterArry)

                    } else if (realBangleArry == filterArry.name && bangleOptionArry[realIdx + 1] == filterArry.option && bangleOptionArry[realIdx + 2] != filterArry.secondCheck) {
                        typeCheck(filterArry)

                    }

                })
                function typeCheck(validValue) {
                    plusArry.forEach(function (value) {
                        if (!(validValue[value] == undefined)) {

                            bangleObj[value] += validValue[value]
                            // console.log(value+" : "+bangleObj[value])
                        }
                    })
                    perArry.forEach(function (value) {
                        if (!(validValue[value] == undefined)) {
                            // console.log(value+" : "+ bangleObj[value])
                            bangleObj[value] *= (validValue[value] / 100) + 1
                        }
                    })
                }
            })
            // console.log(bangleObj)



            // 초월
            let hyperPoint = 0;
            let hyperArmoryLevel = 0;
            let hyperWeaponLevel = 0;

            function hyperCalcFnc(e) {
                let hyperStr = data.ArmoryEquipment[e].Tooltip;


                const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
                const hyperMatch = hyperStr.match(regex);

                try {
                    let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
                    hyperReplace = hyperReplace.replace(/\s+/g, ',')
                    let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
                    hyperPoint += Number(hyperArry[3]) * 1600 + Number(hyperArry[1] * 3400)
                    return Number(hyperArry[3])
                } catch {
                    return 0
                }
            }

            data.ArmoryEquipment.forEach(function (arry, idx) {
                if (arry.Type == "무기") {
                    hyperWeaponLevel += hyperCalcFnc(idx)
                } else {
                    hyperArmoryLevel += hyperCalcFnc(idx)
                }
            })

            let hyperSum = hyperWeaponLevel + hyperArmoryLevel

            let hyperObj = {
                atkPlus: 0,
                weaponAtkPlus: 0,
                atkBuff: 0,
                stigmaPer: 0,


                str: 0,
                dex: 0,
                int: 0,

                finalDamagePer: 1,

            }


            // hyperObj객체에 무언가 영향을 미침 원인 해명 필요
            data.ArmoryEquipment.forEach(function (equip, equipIdx) {

                // function hyperInfoFnc(e ,parts){
                let hyperStr = data.ArmoryEquipment[equipIdx].Tooltip;

                const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
                const hyperMatch = hyperStr.match(regex);

                try {
                    let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
                    hyperReplace = hyperReplace.replace(/\s+/g, ',')
                    let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
                    // console.log(hyperArry)
                    headStarCal(hyperArry[3], equip.Type)
                    shoulderStarCal(hyperArry[3], equip.Type)
                    shirtStarCal(hyperArry[3], equip.Type)
                    pantsStarCal(hyperArry[3], equip.Type)
                    gloveStarCal(hyperArry[3], equip.Type)
                    weaponStarCal(hyperArry[3], equip.Type)
                } catch { }
                // }

                // hyperInfoFnc(equipIdx, equip.Type)
            })


            function hyperStageCalc(e) {
                let hyperStr = data.ArmoryEquipment[e].Tooltip;


                const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
                const hyperMatch = hyperStr.match(regex);

                try {
                    let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
                    hyperReplace = hyperReplace.replace(/\s+/g, ',')
                    let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
                    return Number(hyperArry[1])

                    // return Number(hyperArry[3])*3750 + Number(hyperArry[1]*7500)

                } catch {
                    return 0
                }
            }


            let armoryListArry = ["투구", "상의", "하의", "장갑", "어깨"]
            data.ArmoryEquipment.forEach(function (equip, equipIdx) {
                if (equip.Type == "무기") {

                    let n = hyperStageCalc(equipIdx)
                    hyperObj.weaponAtkPlus += 280 * n + 20 * (n ** 2)
                    // console.log(equip.Type + "초월 단계 " + n )
                    // console.log("무공 초월 "+ ( 280*n + 20*(n**2) ))
                }
                armoryListArry.forEach(function (armoryList) {
                    if (equip.Type == armoryList) {

                        let n = hyperStageCalc(equipIdx)
                        // console.log(equip.Type + "초월 단계 " + n )
                        // console.log(equip.Type+" 초월 "+" : "+ ( 560*n + 40*(n**2) ))
                        hyperObj.str += 560 * n + 40 * (n ** 2)
                        hyperObj.dex += 560 * n + 40 * (n ** 2)
                        hyperObj.int += 560 * n + 40 * (n ** 2)
                    }
                })
            })




            // 투구 N성
            function headStarCal(value, parts) {
                let check = (parts == "투구")
                if (value >= 20 && check) {

                    hyperObj.atkBuff += hyperSum * 0.04
                    hyperObj.atkPlus += hyperSum * 6
                    hyperObj.weaponAtkPlus += hyperSum * 14
                    hyperObj.str += hyperSum * 55
                    hyperObj.dex += hyperSum * 55
                    hyperObj.int += hyperSum * 55
                } else if (value >= 15 && check) {
                    hyperObj.atkBuff += hyperSum * 0.03
                    hyperObj.weaponAtkPlus += hyperSum * 14
                    hyperObj.str += hyperSum * 55
                    hyperObj.dex += hyperSum * 55
                    hyperObj.int += hyperSum * 55
                } else if (value >= 10 && check) {
                    hyperObj.atkBuff += hyperSum * 0.02
                    hyperObj.str += hyperSum * 55
                    hyperObj.dex += hyperSum * 55
                    hyperObj.int += hyperSum * 55
                } else if (value >= 5 && check) {
                    atkBuff += hyperSum * 0.01
                }
            }

            // 어깨 N성
            function shoulderStarCal(value, parts) {
                let check = (parts == "어깨")
                if (value >= 20 && check) {
                    hyperObj.atkBuff += 3
                    hyperObj.weaponAtkPlus += 3600

                } else if (value >= 15 && check) {
                    hyperObj.atkBuff += 2
                    hyperObj.weaponAtkPlus += 2400
                } else if (value >= 10 && check) {
                    hyperObj.atkBuff += 1
                    hyperObj.weaponAtkPlus += 1200
                } else if (value >= 5 && check) {
                    hyperObj.atkBuff += 1
                    hyperObj.weaponAtkPlus += 1200
                }
            }
            // 상의 N성
            function shirtStarCal(value, parts) {
                let check = (parts == "상의")
                if (value >= 20 && check) {
                    hyperObj.weaponAtkPlus += 7200
                } else if (value >= 15 && check) {
                    hyperObj.weaponAtkPlus += 4000
                } else if (value >= 10 && check) {
                    hyperObj.weaponAtkPlus += 2000
                } else if (value >= 5 && check) {
                    hyperObj.weaponAtkPlus += 2000
                }
            }
            // 하의 N성
            function pantsStarCal(value, parts) {
                let check = (parts == "하의")
                if (value >= 20 && check) {
                    hyperObj.atkBuff += 6
                    hyperObj.finalDamagePer *= (1.5 / 100) + 1
                } else if (value >= 15 && check) {
                    hyperObj.atkBuff += 3
                } else if (value >= 10 && check) {
                    hyperObj.atkBuff += 1.5

                }
            }
            // 하의 N성
            function gloveStarCal(value, parts) {
                let check = (parts == "장갑")
                if (value >= 20 && check) {
                    hyperObj.str += 12600
                    hyperObj.dex += 12600
                    hyperObj.int += 12600
                    hyperObj.atkBuff += 3
                } else if (value >= 15 && check) {
                    hyperObj.str += 8400
                    hyperObj.dex += 8400
                    hyperObj.int += 8400
                    hyperObj.atkBuff += 2
                } else if (value >= 10 && check) {
                    hyperObj.str += 4200
                    hyperObj.dex += 4200
                    hyperObj.int += 4200
                    hyperObj.atkBuff += 1
                } else if (value >= 5 && check) {
                    hyperObj.str += 4200
                    hyperObj.dex += 4200
                    hyperObj.int += 4200
                    hyperObj.atkBuff += 1
                }
            }
            // 무기 N성
            function weaponStarCal(value, parts) {
                let check = (parts == "무기")
                if (value >= 20 && check) {
                    hyperObj.atkPlus += 3525
                    hyperObj.stigmaPer += 8
                    hyperObj.atkBuff += 2
                } else if (value >= 15 && check) {
                    hyperObj.atkPlus += 2400
                    hyperObj.stigmaPer += 4
                    hyperObj.atkBuff += 2
                } else if (value >= 10 && check) {
                    hyperObj.atkPlus += 1600
                    hyperObj.stigmaPer += 2
                    hyperObj.atkBuff += 2
                } else if (value >= 5 && check) {
                    hyperObj.atkPlus += 800
                    hyperObj.stigmaPer += 2
                }
            }



            // 투구, 상의, 하의, 장갑, 어깨, 악세 힘민지 구하기
            function armorStatus() {
                let result = 0;
                data.ArmoryEquipment.forEach(function (armor) {

                    if (/^(투구|상의|하의|장갑|어깨|목걸이|귀걸이|반지|)$/.test(armor.Type)) {


                        let firstExtract = armor.Tooltip.match(/>([^<]+)</g).map(match => match.replace(/[><]/g, ''))
                        let secondExtract = firstExtract.filter(item => item.match(/^(힘|민첩|지능) \+\d+$/));
                        let thirdExtract = secondExtract[0].match(/\d+/)[0]
                        result += Number(thirdExtract)

                    }


                })
                return result

            }

            console.log(hyperObj)


            // 각인
            let engObj = {
                finalDamagePer: 1,
                atkPer: 0,
                engBonusPer: 1,
                carePower: 1,
                utilityPower: 1,
            }


            // 4티어 각인 모든 옵션 값 계산(무효옵션 하단 제거)
            engravingCheckFilter.forEach(function (checkArry) {
                if (!(data.ArmoryEngraving == null) && !(data.ArmoryEngraving.ArkPassiveEffects == null)) {
                    data.ArmoryEngraving.ArkPassiveEffects.forEach(function (realEngArry) {
                        if (checkArry.name == realEngArry.Name && checkArry.grade == realEngArry.Grade && checkArry.level == realEngArry.Level) {


                            engCalMinus(checkArry.name, checkArry.finalDamagePer, checkArry.criticalChancePer, checkArry.criticalDamagePer, checkArry.atkPer, checkArry.atkSpeed, checkArry.moveSpeed, checkArry.carePower, checkArry.utilityPower, checkArry.engBonusPer)

                            engObj.finalDamagePer = (engObj.finalDamagePer * (checkArry.finalDamagePer / 100 + 1));
                            engObj.engBonusPer = (engObj.engBonusPer * (checkArry.engBonusPer / 100 + 1));
                            engObj.atkPer = (engObj.atkPer + checkArry.atkPer);
                            engObj.carePower = (engObj.carePower + checkArry.carePower);
                            stoneCalc(realEngArry.Name, checkArry.finalDamagePer)
                        }
                    })
                }


            })

            // 무효옵션 값 제거4티어만 해당
            function engCalMinus(name, finalDamagePer, criticalChancePer, criticalDamagePer, atkPer) {
                engravingCalFilter.forEach(function (FilterArry) {
                    if (FilterArry.job == supportCheck()) {
                        FilterArry.block.forEach(function (blockArry) {
                            if (blockArry == name) {
                                engObj.finalDamagePer = (engObj.finalDamagePer / (finalDamagePer / 100 + 1));
                                engObj.atkPer = (engObj.atkPer - atkPer);
                            }
                        })
                    }
                })
            }


            // 어빌리티스톤(곱연산 제거 후 곱연산+어빌리티스톤 적용)
            function stoneCalc(name, minusVal) {
                function notZero(num) {
                    if (num == 0) {
                        return 1;
                    } else {
                        return num / 100 + 1
                    }
                }
                data.ArmoryEngraving.ArkPassiveEffects.forEach(function (stoneArry) {
                    stoneCheckFilter.forEach(function (filterArry) {

                        if (stoneArry.AbilityStoneLevel == filterArry.level && stoneArry.Name == filterArry.name && stoneArry.Name == name) {
                            engObj.finalDamagePer = (engObj.finalDamagePer) / notZero(minusVal) //퐁트라이커기준 저주받은 인형(돌맹이) 제거값
                            engObj.finalDamagePer = (engObj.finalDamagePer * (notZero(minusVal) + filterArry.finalDamagePer / 100));
                            engObj.engBonusPer = (engObj.engBonusPer * (notZero(minusVal) + filterArry.engBonusPer / 100));
                            engObj.atkPer = (engObj.atkPer + filterArry.atkPer);
                        }
                    })

                })
            }

            // 엘릭서

            let elixirObj = {
                atkPlus: 0,
                atkBuff: 0,
                weaponAtkPlus: 0,
                criticalDamagePer: 0,
                criticalChancePer: 0,
                criFinalDamagePer: 1,
                addDamagePer: 0,
                atkPer: 0,
                finalDamagePer: 1,
                carePower: 0,
                str: 0,
                dex: 0,
                int: 0,
            }

            // 엘릭서 레벨 추출
            function elixirKeywordCheck(e) {
                let elixirValString = data.ArmoryEquipment[e].Tooltip;


                const matchedKeywordsWithContext = keywordList.flatMap(keyword => {
                    const index = elixirValString.indexOf(keyword);
                    if (index !== -1) {
                        const endIndex = Math.min(index + keyword.length + 4, elixirValString.length);
                        return [elixirValString.slice(index, endIndex).replace(/<[^>]*>/g, '')];
                    }
                    return [];
                });


                // span태그로 반환
                let elixirSpan = []
                let i
                for (i = 0; i < matchedKeywordsWithContext.length; i++) {
                    elixirSpan.push(matchedKeywordsWithContext[i])
                }
                return (elixirSpan)

            }

            let elixirData = []
            // 엘릭서 인덱스 번호 검사
            data.ArmoryEquipment.forEach(function (arry, idx) {
                elixirKeywordCheck(idx).forEach(function (elixirArry, idx) {
                    elixirData.push({ name: ">" + elixirArry.split("Lv.")[0], level: elixirArry.split("Lv.")[1] })
                })
            })

            elixirData.forEach(function (realElixir) {
                // console.log(realElixir.name)

                elixirCalFilter.forEach(function (filterArry) {
                    if (realElixir.name == filterArry.name && !(filterArry.atkPlus == undefined)) {

                        elixirObj.atkPlus += filterArry.atkPlus[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirAtkPlus)

                    } else if (realElixir.name == filterArry.name && !(filterArry.weaponAtkPlus == undefined)) {

                        elixirObj.weaponAtkPlus += filterArry.weaponAtkPlus[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirWeaponAtkPlus)

                    } else if (realElixir.name == filterArry.name && !(filterArry.criticalDamage == undefined)) {

                        elixirObj.criticalDamagePer += filterArry.criticalDamagePer[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirCriticalDamage)

                    } else if (realElixir.name == filterArry.name && !(filterArry.addDamagePer == undefined)) {

                        elixirObj.addDamagePer += filterArry.addDamagePer[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirAddDamagePer)

                    } else if (realElixir.name == filterArry.name && !(filterArry.atkPer == undefined)) {

                        elixirObj.atkPer += filterArry.atkPer[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirAtkPer)

                    } else if (realElixir.name == filterArry.name && !(filterArry.finalDamagePer == undefined)) {
                        // console.log(realElixir.name)

                        elixirObj.finalDamagePer *= filterArry.finalDamagePer[realElixir.level - 1] / 100 + 1
                        // console.log(realElixir.name+" : " + elixirFinalDamagePer)

                    } else if (realElixir.name == filterArry.name && !(filterArry.str == undefined)) {

                        elixirObj.str += filterArry.str[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + filterArry.stats[realElixir.level - 1])

                    } else if (realElixir.name == filterArry.name && !(filterArry.dex == undefined)) {

                        elixirObj.dex += filterArry.dex[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + filterArry.dex[realElixir.level - 1])

                    } else if (realElixir.name == filterArry.name && !(filterArry.int == undefined)) {

                        elixirObj.int += filterArry.int[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + filterArry.stats[realElixir.level - 1])

                    } else if (realElixir.name == filterArry.name && !(filterArry.atkBuff == undefined)) {

                        elixirObj.atkBuff += filterArry.atkBuff[realElixir.level - 1]

                    } else if (realElixir.name == filterArry.name && !(filterArry.carePower == undefined)) {

                        elixirObj.carePower += filterArry.carePower[realElixir.level - 1]
                    }

                })
            })

            elixirCalFilter.forEach(function (arr) {

                // console.log("> 추가 피해 " == arr.name && !(arr.finalDamagePer == undefined))
                // console.log(arr.name)
                // console.log(arr.finalDamagePer)
            })


            // 더블엘릭서 N단계별 점수
            // let doubleElixirArry = ["회심","달인 (","강맹","칼날방패","선봉대"]
            // elixirData
            // containsTwoWord(data,doubleString)
            // elixirLevel



            let elixirLevel = 0



            elixirData.forEach(function (arry) {
                elixirFilter.forEach(function (filterArry) {
                    if (arry.name == filterArry.split(":")[0]) {
                        // console.log("엘릭레벨:"+arry.level+"엘릭서명:"+arry.name+",엘릭서 점수:"+elixirFilterVal(filterArry.split(":")[1],arry.level))
                        elixirLevel += Number(arry.level)
                    } else {
                    }
                })
            })

            function containsTwoWord(data, doubleString) {
                let count = data.filter(item => item.name.includes(doubleString)).length;
                return count === 2;
            }


            function doubleElixir() {
                if (containsTwoWord(elixirData, "회심") && elixirLevel >= 40) {
                    elixirObj.criFinalDamagePer *= 1.12
                    elixirObj.finalDamagePer *= 1.12
                } else if (containsTwoWord(elixirData, "회심") && elixirLevel >= 35) {
                    elixirObj.criFinalDamagePer *= 1.06
                    elixirObj.finalDamagePer *= 1.06
                } else if (containsTwoWord(elixirData, "달인 (") && elixirLevel >= 40) {
                    elixirObj.criticalChancePer += 7
                    elixirObj.finalDamagePer *= 1.12
                } else if (containsTwoWord(elixirData, "달인 (") && elixirLevel >= 35) {
                    elixirObj.criticalChancePer += 7
                    elixirObj.finalDamagePer *= 1.06
                } else if (containsTwoWord(elixirData, "강맹") && elixirLevel >= 40) {
                    elixirObj.finalDamagePer *= 1.08
                } else if (containsTwoWord(elixirData, "강맹") && elixirLevel >= 35) {
                    elixirObj.finalDamagePer *= 1.04
                } else if (containsTwoWord(elixirData, "칼날방패") && elixirLevel >= 40) {
                    elixirObj.finalDamagePer *= 1.08
                } else if (containsTwoWord(elixirData, "칼날방패") && elixirLevel >= 35) {
                    elixirObj.finalDamagePer *= 1.04
                } else if (containsTwoWord(elixirData, "선봉대") && elixirLevel >= 40) {
                    defaultObj.attackPow *= 1.03
                    elixirObj.finalDamagePer *= 1.12
                } else if (containsTwoWord(elixirData, "선봉대") && elixirLevel >= 35) {
                    defaultObj.attackPow *= 1.03
                    elixirObj.finalDamagePer *= 1.06
                } else if (containsTwoWord(elixirData, "선각자") && elixirLevel >= 40) {
                    elixirObj.atkBuff += 14
                } else if (containsTwoWord(elixirData, "선각자") && elixirLevel >= 35) {
                    elixirObj.atkBuff += 8
                } else if (containsTwoWord(elixirData, "신념") && elixirLevel >= 40) {
                    elixirObj.atkBuff += 14
                } else if (containsTwoWord(elixirData, "신념") && elixirLevel >= 35) {
                    elixirObj.atkBuff += 8
                } else if (containsTwoWord(elixirData, "진군") && elixirLevel >= 40) {
                    elixirObj.atkBuff += 6
                } else if (containsTwoWord(elixirData, "진군") && elixirLevel >= 35) {
                    elixirObj.atkBuff += 0
                }
            }
            doubleElixir()


            // console.log(elixirObj)

            let gemsCool = 0;
            let gemsCoolCount = 0;


            if (!(data.ArmoryGem.Gems == null)) {
                data.ArmoryGem.Gems.forEach(function (arry) {
                    if (arry.Name.includes("10레벨 작열")) {
                        gemsCool += 24
                        gemsCoolCount += 1
                    } else if (arry.Name.includes("9레벨 작열")) {
                        gemsCool += 22
                        gemsCoolCount += 1
                    } else if (arry.Name.includes("8레벨 작열") || arry.Name.includes("10레벨 홍염")) {
                        gemsCool += 20
                        gemsCoolCount += 1
                    } else if (arry.Name.includes("7레벨 작열") || arry.Name.includes("9레벨 홍염")) {
                        gemsCool += 18
                        gemsCoolCount += 1
                    } else if (arry.Name.includes("6레벨 작열") || arry.Name.includes("8레벨 홍염")) {
                        gemsCool += 16
                        gemsCoolCount += 1
                    } else if (arry.Name.includes("5레벨 작열") || arry.Name.includes("7레벨 홍염")) {
                        gemsCool += 14
                        gemsCoolCount += 1
                    } else if (arry.Name.includes("4레벨 작열") || arry.Name.includes("6레벨 홍염")) {
                        gemsCool += 12
                        gemsCoolCount += 1
                    } else if (arry.Name.includes("3레벨 작열") || arry.Name.includes("5레벨 홍염")) {
                        gemsCool += 10
                        gemsCoolCount += 1
                    } else if (arry.Name.includes("2레벨 작열") || arry.Name.includes("4레벨 홍염")) {
                        gemsCool += 8
                        gesmCoolCount += 1
                    } else if (arry.Name.includes("1레벨 작열") || arry.Name.includes("3레벨 홍염")) {
                        gemsCool += 6
                        gemsCoolCount += 1
                    }
                })
            } else {
                gemsCool = 1
                gemsCoolCount = 1
            }
            // console.log(gemsCool)
            let gemsCoolAvg = ((gemsCool / gemsCoolCount)).toFixed(1)



            // 아크패시브

            let arkPassiveArry = [];
            let arkObj = {
                skillCool: 0,
                evolutionDamage: 0,
                enlightenmentDamage: 0,
                leapDamage: 0,
                criticalChancePer: 0,
                moveSpeed: 0,
                atkSpeed: 0,
                stigmaPer: 0,
                criticalDamagePer: 0,
                evolutionBuff: 0,
                enlightenmentBuff: 0,
                weaponAtk: 1,
            }

            data.ArkPassive.Effects.forEach(function (arkArry) {
                const regex = /<FONT.*?>(.*?)<\/FONT>/g;
                let match;
                while ((match = regex.exec(arkArry.Description)) !== null) {
                    const text = match[1];
                    const levelMatch = text.match(/(.*) Lv\.(\d+)/);
                    if (levelMatch) {
                        const name = levelMatch[1];
                        const level = parseInt(levelMatch[2], 10);
                        arkPassiveArry.push({ name, level });

                    }
                }
            });
            // console.log(arkPassiveArry);

            arkPassiveArry.forEach(function (ark) {
                arkCalFilter.forEach(function (filter) {
                    if (ark.name == filter.name && ark.level == filter.level) {
                        arkAttrCheck(filter)
                    }
                })
            })

            function arkAttrCheck(validValue) {
                let arkAttr = ['skillCool', 'evolutionDamage', 'criticalChancePer', 'moveSpeed', 'atkSpeed', 'stigmaPer', 'criticalDamagePer', 'evolutionBuff']
                arkAttr.forEach(function (attrArry) {
                    if (!(validValue[attrArry] == undefined) && data.ArkPassive.IsArkPassive) {
                        arkObj[attrArry] += validValue[attrArry];
                    }
                })
            }



            // 아크패시브 수치 계산
            function arkPassiveValue(e) {
                let arkPassiveVal = data.ArkPassive.Points[e].Value
                return arkPassiveVal
            }



            if (arkPassiveValue(0) >= 120) { // arkPassiveValue(0) == 진화수치

                arkObj.evolutionDamage += 1.45

            } else if (arkPassiveValue(0) >= 105) {

                arkObj.evolutionDamage += 1.35

            } else if (arkPassiveValue(0) >= 90) {

                arkObj.evolutionDamage += 1.30

            } else if (arkPassiveValue(0) >= 80) {

                arkObj.evolutionDamage += 1.25

            } else if (arkPassiveValue(0) >= 70) {

                arkObj.evolutionDamage += 1.20

            } else if (arkPassiveValue(0) >= 60) {

                arkObj.evolutionDamage += 1.15

            } else if (arkPassiveValue(0) >= 50) {

                arkObj.evolutionDamage += 1.10

            } else if (arkPassiveValue(0) >= 40) {

                arkObj.evolutionDamage += 1
            }



            if (arkPassiveValue(1) >= 100) { // arkPassiveValue(1) == 깨달음수치

                arkObj.enlightenmentDamage += 1.42
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 98) {

                arkObj.enlightenmentDamage += 1.40
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 97) {

                arkObj.enlightenmentDamage += 1.37
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 96) {

                arkObj.enlightenmentDamage += 1.37
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 95) {

                arkObj.enlightenmentDamage += 1.36
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 94) {

                arkObj.enlightenmentDamage += 1.36
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 93) {

                arkObj.enlightenmentDamage += 1.35
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 92) {

                arkObj.enlightenmentDamage += 1.35
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 90) {

                arkObj.enlightenmentDamage += 1.34
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 88) {

                arkObj.enlightenmentDamage += 1.33
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 86) {

                arkObj.enlightenmentDamage += 1.28
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 84) {

                arkObj.enlightenmentDamage += 1.27
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 82) {

                arkObj.enlightenmentDamage += 1.26
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 80) {

                arkObj.enlightenmentDamage += 1.25
                arkObj.enlightenmentBuff += 1.33

            } else if (arkPassiveValue(1) >= 78) {

                arkObj.enlightenmentDamage += 1.18
                arkObj.enlightenmentBuff += 1.32

            } else if (arkPassiveValue(1) >= 76) {

                arkObj.enlightenmentDamage += 1.17
                arkObj.enlightenmentBuff += 1.31

            } else if (arkPassiveValue(1) >= 74) {

                arkObj.enlightenmentDamage += 1.16
                arkObj.enlightenmentBuff += 1.30

            } else if (arkPassiveValue(1) >= 72) {

                arkObj.enlightenmentDamage += 1.15
                arkObj.enlightenmentBuff += 1.29

            } else if (arkPassiveValue(1) >= 64) {

                arkObj.enlightenmentDamage += 1.13
                arkObj.enlightenmentBuff += 1.28

            } else if (arkPassiveValue(1) >= 56) {

                arkObj.enlightenmentDamage += 1.125
                arkObj.enlightenmentBuff += 1.27

            } else if (arkPassiveValue(1) >= 48) {

                arkObj.enlightenmentDamage += 1.12
                arkObj.enlightenmentBuff += 1.26

            } else if (arkPassiveValue(1) >= 40) {

                arkObj.enlightenmentDamage += 1.115
                arkObj.enlightenmentBuff += 1.25

            } else if (arkPassiveValue(1) >= 32) {

                arkObj.enlightenmentDamage += 1.11
                arkObj.enlightenmentBuff += 1.24

            } else if (arkPassiveValue(1) >= 24) {

                arkObj.enlightenmentDamage += 1.10
                arkObj.enlightenmentBuff += 1.23

            } else {
                arkObj.enlightenmentDamage += 1
            }


            if (arkPassiveValue(2) >= 70) { // arkPassiveValue(2) == 도약 수치

                arkObj.leapDamage += 1.15

            } else if (arkPassiveValue(2) >= 68) {

                arkObj.leapDamage += 1.14

            } else if (arkPassiveValue(2) >= 66) {

                arkObj.leapDamage += 1.13

            } else if (arkPassiveValue(2) >= 64) {

                arkObj.leapDamage += 1.12

            } else if (arkPassiveValue(2) >= 62) {

                arkObj.leapDamage += 1.11

            } else if (arkPassiveValue(2) >= 60) {

                arkObj.leapDamage += 1.10

            } else if (arkPassiveValue(2) >= 50) {

                arkObj.leapDamage += 1.05

            } else if (arkPassiveValue(2) >= 40) {

                arkObj.leapDamage += 1.03

            } else {
                arkObj.leapDamage += 1
            }





            let gemObj = {
                atkBuff: 0,
                damageBuff: 0,
            }



            // 보석4종 레벨별 비율
            let gemPerObj = [
                { name: "겁화", level1: 8, level2: 12, level3: 16, level4: 20, level5: 24, level6: 28, level7: 32, level8: 36, level9: 40, level10: 44 },
                { name: "멸화", level1: 3, level2: 6, level3: 9, level4: 12, level5: 15, level6: 18, level7: 21, level8: 24, level9: 30, level10: 40 },
                { name: "홍염", level1: 2, level2: 4, level3: 6, level4: 8, level5: 10, level6: 12, level7: 14, level8: 16, level9: 18, level10: 20 },
                { name: "작열", level1: 6, level2: 8, level3: 10, level4: 12, level5: 14, level6: 16, level7: 18, level8: 20, level9: 22, level10: 24 },
            ]




            let gemSkillArry = [];
            let specialClass;

            // 유저가 착용중인 보석,스킬 배열로 만들기

            if (data.ArmoryGem.Gems != null) {
                data.ArmoryGem.Gems.forEach(function (gem) {

                    data.ArmoryProfile.CharacterClassName

                    let regex = />([^<]*)</g;
                    let match;
                    let results = [];
                    while ((match = regex.exec(gem.Tooltip)) !== null) {
                        results.push(match[1]);
                    }


                    results.forEach(function (toolTip, idx) {

                        toolTip = toolTip.replace(/"/g, '');

                        if (toolTip.includes(data.ArmoryProfile.CharacterClassName) && /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")) {

                            let etcGemValue = results[idx + 2].substring(0, results[idx + 2].indexOf('"'))
                            let gemName;
                            let level = null;
                            if (results[1].match(/홍염|작열|멸화|겁화/) != null) {
                                gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                                level = Number(results[1].match(/(\d+)레벨/)[1])
                            } else {
                                gemName = "기타보석"
                            }
                            // let obj = { name: results[idx+1], gem: gemName, level : level};
                            let obj = { skill: results[idx + 1], name: gemName, level: level };
                            gemSkillArry.push(obj)

                        } else if (!(toolTip.includes(data.ArmoryProfile.CharacterClassName)) && /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")) {  // 자신의 직업이 아닌 보석을 장착중인 경우

                            //console.log(toolTip)
                            let gemName;
                            let level = null;
                            if (results[1].match(/홍염|작열|멸화|겁화/) != null) {
                                gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                                level = Number(results[1].match(/(\d+)레벨/)[1])
                            } else {
                                gemName = "기타보석"
                            }
                            let obj = { skill: "직업보석이 아닙니다", name: gemName, level: level };
                            gemSkillArry.push(obj)

                        }

                    })

                })

            }


            // console.log(gemSkillArry)


            if (true) {

                let per = "홍염|작열";
                let dmg = "겁화|멸화";



                function skillCheck(arr, ...nameAndGem) {
                    for (let i = 0; i < nameAndGem.length; i += 2) {
                        const name = nameAndGem[i];
                        const gemPattern = nameAndGem[i + 1];
                        const regex = new RegExp(gemPattern);
                        const found = arr.some(item => item.skill === name && regex.test(item.name));
                        if (!found) return false;
                    }
                    return true;
                }
                function classCheck(className) {
                    return supportCheck() == className;
                }



                if (classCheck("전태") && skillCheck(gemSkillArry, "버스트 캐넌", dmg)) {
                    specialClass = "버캐 채용 전태";
                } else if (classCheck("세맥") && !skillCheck(gemSkillArry, "환영격", dmg)) {
                    specialClass = "5멸 세맥";
                } else if (classCheck("핸건") && skillCheck(gemSkillArry, "데스파이어", dmg)) {
                    specialClass = "7멸 핸건";
                } else if (classCheck("포강") && skillCheck(gemSkillArry, "에너지 필드", per)) {
                    specialClass = "에필 포강";
                } else if (classCheck("환류") && skillCheck(gemSkillArry, "종말의 날", dmg)) {
                    specialClass = "데이터 없음";
                } else if (classCheck("환류") && !skillCheck(gemSkillArry, "인페르노", dmg)) {
                    specialClass = "6딜 환류";
                } else if (classCheck("질풍") && !skillCheck(gemSkillArry, "여우비 스킬", dmg)) {
                    specialClass = "5멸 질풍";
                } else if (classCheck("그믐") && !skillCheck(gemSkillArry, "소울 시너스", dmg)) {
                    specialClass = "데이터 없음";
                } else if (classCheck("광기") && !skillCheck(gemSkillArry, "소드 스톰", dmg) && !skillCheck(gemSkillArry, "마운틴 크래쉬", dmg)) {
                    specialClass = "6겁 광기";
                } else if (classCheck("광기") && !skillCheck(gemSkillArry, "소드 스톰", dmg)) {
                    specialClass = "7겁 광기";
                } else if (classCheck("포식") && !skillCheck(gemSkillArry, "페이탈 소드", dmg)) {
                    specialClass = "크블 포식";
                } else if (classCheck("피메") && !skillCheck(gemSkillArry, "대재앙", dmg)) {
                    specialClass = "6M 피메";
                } else if (classCheck("잔재") && skillCheck(gemSkillArry, "블리츠 러시", dmg)) {
                    specialClass = "슈차 잔재";
                } else if (classCheck("억제") && !skillCheck(gemSkillArry, "피어스 쏜", dmg)) {
                    specialClass = "데이터 없음";
                } else if (classCheck("야성") || classCheck("두동") || classCheck("환각") || classCheck("서폿") || classCheck("진실된 용맹") || classCheck("심판자") || classCheck("회귀")) {
                    specialClass = "데이터 없음";
                } else {
                    specialClass = supportCheck();
                }

            }
            // console.log("보석전용 직업 : ",specialClass)


            gemSkillArry.forEach(function (gemSkill, idx) {

                let realClass = classGemFilter.filter(item => item.class == specialClass);

                if (realClass.length == 0) {
                    gemSkillArry[idx].skillPer = "none"
                } else {

                    let realSkillPer = realClass[0].skill.filter(item => item.name == gemSkill.skill);

                    if (realSkillPer[0] != undefined) {
                        gemSkillArry[idx].skillPer = realSkillPer[0].per;
                    } else {
                        gemSkillArry[idx].skillPer = "none";
                    }
                }
            })


            // 직업별 보석 지분율 필터
            let classGemEquip = classGemFilter.filter(function (filterArry) {
                return filterArry.class == specialClass;
            })
            //console.log(classGemEquip)

            function gemCheckFnc() {
                try {





                    // console.log(classGemEquip)
                    let realGemValue = classGemEquip[0].skill.map(skillObj => {

                        let matchValue = gemSkillArry.filter(item => item.skill == skillObj.name);
                        if (!(matchValue.length == 0)) {
                            // console.log(matchValue)
                            return {
                                name: skillObj.name,
                                per: skillObj.per,
                                gem: matchValue,
                            }
                        }
                    }).filter(Boolean);

                    // console.log(realGemValue)
                    // gemPerObj.name == realGemValue.name && realGemValue.gem.match(/멸화|겁화/g)[0];


                    let coolGemTotal = 0;
                    let count = 0;

                    gemSkillArry.forEach(function (gemListArry) {
                        if (gemListArry.name == "홍염" || gemListArry.name == "작열") {
                            let perValue = gemPerObj.filter(item => gemListArry.name == item.name);
                            // console.log(perValue[0][`level${gemListArry.level}`]);

                            coolGemTotal += perValue[0][`level${gemListArry.level}`];
                            count++;
                        }
                    })

                    let averageValue = count > 0 ? coolGemTotal / count : 0;



                    // console.log("평균값 : "+averageValue)

                    let etcAverageValue;
                    let dmgGemTotal = 0;
                    let dmgCount = 0;

                    // console.log(gemList)
                    if (specialClass == "데이터 없음") {
                        gemSkillArry.forEach(function (gemListArry) {
                            if (gemListArry.name == "멸화" || gemListArry.name == "겁화") {
                                let perValue = gemPerObj.filter(item => gemListArry.name == item.name);
                                // console.log(perValue[0][`level${gemListArry.level}`]);

                                dmgGemTotal += perValue[0][`level${gemListArry.level}`];
                                dmgCount++;
                            }
                        })

                        etcAverageValue = dmgCount > 0 ? dmgGemTotal / dmgCount : 0;
                    } else {
                        etcAverageValue = 1;
                    }



                    // 실제 유저가 장착한 보석의 딜 비율을 가져오는 함수
                    function getLevels(gemPerObj, skillArray) {
                        let result = [];


                        skillArray.forEach(skill => {
                            if (skill.per != "etc") {
                                skill.gem.forEach(gem => {
                                    let gemObj = gemPerObj.find(gemPerObj => gemPerObj.name == gem.name && (gem.name == "겁화" || gem.name == "멸화"));
                                    if (!(gemObj == undefined)) {
                                        let level = gemObj[`level${gem.level}`];
                                        result.push({ skill: skill.name, gem: gem.name, per: level, skillPer: skill.per });
                                    }
                                });
                            } else if (skill.per == "etc") {
                                skill.gem.forEach(gem => {
                                    let gemObj = gemPerObj.find(gemPerObj => gemPerObj.name == gem.name && (gem.name == "겁화" || gem.name == "멸화"));
                                    if (!(gemObj == undefined)) {
                                        let level = gemObj[`level${gem.level}`];
                                        result.push({ skill: skill.name, gem: gem.name, per: level, skillPer: etcValue / etcLength });
                                    }
                                });
                            }
                        });
                        return result;
                    }
                    // console.log(getLevels(gemPerObj, realGemValue))
                    let gemValue = getLevels(gemPerObj, realGemValue).reduce((gemResultValue, finalGemValue) => {
                        return gemResultValue + finalGemValue.per * finalGemValue.skillPer
                    }, 0)


                    // special skill Value 값 계산식
                    function specialSkillCalc() {
                        let result = 0;
                        classGemEquip[0].skill.forEach(function (skill) {
                            if (skill.per != "etc") {
                                result += skill.per;
                            }
                        })
                        return 1 / result
                    }


                    // 홍염,작열 평균레벨
                    return {
                        specialSkill: specialSkillCalc(),
                        originGemValue: gemValue,
                        gemValue: (gemValue * specialSkillCalc()) / 100 + 1,
                        gemAvg: averageValue,
                        etcAverageValue: etcAverageValue / 100 + 1,
                    }
                } catch (error) {
                    console.log(error)
                    return {
                        specialSkill: 1,
                        originGemValue: 1,
                        gemValue: 1,
                        gemAvg: 0,
                        etcAverageValue: 1,
                    }

                }
            }
            // gemCheckFnc() // <==보석 딜지분 최종값
            //console.log(gemCheckFnc())

            // 원정대 힘민지
            let expeditionStats = Math.floor((data.ArmoryProfile.ExpeditionLevel - 1) / 2) * 5 + 5






            // "천상의 축복" > atkBuff 
            // "천상의 연주" > atkBuff
            // "묵법 : 해그리기" > atkBuff

            // "신성의 오라" > damageBuff
            // "세레나데 스킬" > damageBuff
            // "음양 스킬" > damageBuff




            // 서폿용 보석 스킬명, 스킬수치 구하기

            if (!(data.ArmoryGem.Gems == null) && supportCheck() == "서폿") {

                data.ArmoryGem.Gems.forEach(function (gem) {
                    let atkBuff = ['천상의 축복', '천상의 연주', '묵법 : 해그리기']
                    let damageBuff = ['신성의 오라', '세레나데 스킬', '음양 스킬']
                    let gemInfo = JSON.parse(gem.Tooltip)
                    let type = gemInfo.Element_000.value
                    let level
                    if (!(gemInfo.Element_004.value == null)) {
                        level = gemInfo.Element_004.value.replace(/\D/g, "")
                    }
                    let skill
                    if (!(gemInfo.Element_006.value.Element_001 == undefined)) {
                        skill = gemInfo.Element_006.value.Element_001.match(/>([^<]+)</)[1]
                    }

                    atkBuff.forEach(function (buffSkill) {
                        if (skill == buffSkill && type.includes("겁화")) {
                            gemObj.atkBuff += Number(level)
                        }
                    })

                    damageBuff.forEach(function (buffSkill) {
                        if (skill == buffSkill && type.includes("겁화")) {
                            gemObj.damageBuff += Number(level)
                        }
                    })

                })
            }




            // 추가 기본공격력 총합
            function gemAttackBonus() {
                let regex = /:\s*([\d.]+)%/
                if (!(data.ArmoryGem.Effects.Description == "")) {
                    return Number(data.ArmoryGem.Effects.Description.match(regex)[1])
                } else {
                    return 0
                }
            }
            function abilityAttackBonus() {
                let result = 0
                data.ArmoryEquipment.forEach(function (equip) {
                    if (equip.Type == "어빌리티 스톤") {
                        let regex = /기본 공격력\s\+([0-9.]+)%/;
                        if (regex.test(equip.Tooltip)) {
                            result = Number(equip.Tooltip.match(regex)[1]);
                            return result
                        }

                    }
                })
                return result
            }



            // 전설/영웅 아바타 힘민지
            function avatarStats() {

                let result;

                const validTypes = ["무기 아바타", "머리 아바타", "상의 아바타", "하의 아바타"];
                const seenTypes = new Set();
                let bonusTotal = 0;
                let hasTopBottomLegendary = false;

                if (data.ArmoryAvatars != null) {
                    data.ArmoryAvatars.forEach(item => {
                        if ((item.Type === "상의 아바타" || item.Type === "하의 아바타") && item.Grade === "전설") {
                            hasTopBottomLegendary = true;
                        }
                    });
                    data.ArmoryAvatars.forEach(item => {
                        const isTopBottomAvatar = item.Tooltip.includes("상의&하의 아바타");
                        if (validTypes.includes(item.Type) && !seenTypes.has(item.Type)) {
                            if (isTopBottomAvatar && !hasTopBottomLegendary) {
                                bonusTotal += 2;
                                seenTypes.add(item.Type);
                            } else if (item.Grade === "전설") {
                                bonusTotal += 2;
                                seenTypes.add(item.Type);
                            } else if (item.Grade === "영웅" && !seenTypes.has(item.Type)) {
                                bonusTotal += 1;
                                seenTypes.add(item.Type);
                            }
                        }
                    });

                    result = bonusTotal / 100 + 1;
                } else {

                    result = 1;
                }

                return result
            }
            // console.log(avatarStats()) <= 전설/영웅 아바타 스텟

            let karmaPoint = (arkPassiveValue(1) - (data.ArmoryProfile.CharacterLevel - 50) - accObj.enlightPoint - 14)
            if (karmaPoint >= 6) {
                arkObj.weaponAtk = 1.021
            } else if (karmaPoint >= 5) {
                arkObj.weaponAtk = 1.017
            } else if (karmaPoint >= 4) {
                arkObj.weaponAtk = 1.013
            } else if (karmaPoint >= 3) {
                arkObj.weaponAtk = 1.009
            } else if (karmaPoint >= 2) {
                arkObj.weaponAtk = 1.005
            } else if (karmaPoint >= 1) {
                arkObj.weaponAtk = 1.001
            } else {
                arkObj.weaponAtk = 1
            }

            // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
            // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
            // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
            let attackBonus = ((gemAttackBonus() + abilityAttackBonus()) / 100) + 1 // 기본 공격력 증가(보석, 어빌리티 스톤)
            let attackPowResult = (defaultObj.attackPow).toFixed(0) // 최종 공격력 (아드 등 각인 포함된)
            let criticalDamageResult = (defaultObj.criticalDamagePer + engObj.criticalDamagePer + accObj.criticalDamagePer + bangleObj.criticalDamagePer + arkObj.criticalDamagePer + elixirObj.criticalDamagePer + jobObj.criticalDamagePer) //치명타 피해량
            let criticalFinalResult = (jobObj.criFinalDamagePer * elixirObj.criFinalDamagePer) // 치명타시 적에게 주는 피해
            let evolutionDamageResult = (arkObj.evolutionDamage) //진화형 피해
            let addDamageResult = ((defaultObj.addDamagePer + accObj.addDamagePer + elixirObj.addDamagePer) / 100) + 1 // 추가 피해
            let finalDamageResult = ((jobObj.finalDamagePer * engObj.finalDamagePer * accObj.finalDamagePer * hyperObj.finalDamagePer * addDamageResult * elixirObj.finalDamagePer)).toFixed(2) // 적에게 주는 피해
            let enlightResult = arkObj.enlightenmentDamage // 깨달음 딜증
            let enlightBuffResult = arkObj.enlightenmentBuff
            let weaponAtkResult = ((defaultObj.weaponAtk + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus) * accObj.weaponAtkPer)
            let bangleStatValue = ((bangleObj.str + bangleObj.dex + bangleObj.int) * 0.00011375) / 100 + 1

            let totalStat = (armorStatus() + expeditionStats + hyperObj.str + elixirObj.str + elixirObj.dex + elixirObj.int + bangleObj.str + bangleObj.dex + bangleObj.int) * avatarStats() // 최종 힘민지 계산값
            let totalWeaponAtk = ((defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * arkObj.weaponAtk) // 최종 무공 계산값
            let totalWeaponAtk2 = ((defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * (arkObj.weaponAtk + (accObj.weaponAtkPer / 100))) // 최종 무공 계산값

            let totalAtk0 = (Math.sqrt((totalStat * totalWeaponAtk) / 6))
            let totalAtk1 = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * attackBonus
            let totalAtk2 = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * (((accObj.atkPer + elixirObj.atkPer) === 0 ? 1 : (accObj.atkPer + elixirObj.atkPer)) / 100 + 1) * attackBonus
            let totalAtk3 = ((Math.sqrt((totalStat * totalWeaponAtk2) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * (((accObj.atkPer + elixirObj.atkPer) === 0 ? 1 : (accObj.atkPer + elixirObj.atkPer)) / 100 + 1) * attackBonus

            let gemsCoolValue = (1 / (1 - (gemCheckFnc().gemAvg) / 100) - 1) + 1

            let bangleCriticalFinalResult = (jobObj.criFinalDamagePer * elixirObj.criFinalDamagePer * bangleObj.criFinalDamagePer) // 치명타시 적에게 주는 피해
            let bangleAddDamageResult = ((defaultObj.addDamagePer + accObj.addDamagePer + elixirObj.addDamagePer) / 100) + 1 // 추가 피해
            let bangleFinalDamageResult = (engObj.finalDamagePer * accObj.finalDamagePer * hyperObj.finalDamagePer * bangleAddDamageResult * bangleObj.finalDamagePer * elixirObj.finalDamagePer) // 적에게 주는 피해

            let minusHyperStat = (armorStatus() + expeditionStats + elixirObj.str + elixirObj.dex + elixirObj.int + bangleObj.str + bangleObj.dex + bangleObj.int) * avatarStats()
            let minusHyperWeaponAtk = ((defaultObj.weaponAtk + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * arkObj.weaponAtk)
            let minusHyperAtk = ((Math.sqrt((minusHyperStat * minusHyperWeaponAtk) / 6)) + (elixirObj.atkPlus)) * attackBonus
            let minusHyperFinal = (engObj.finalDamagePer * accObj.finalDamagePer * bangleAddDamageResult * bangleObj.finalDamagePer * elixirObj.finalDamagePer)

            let minusElixirStat = (armorStatus() + expeditionStats + hyperObj.str + bangleObj.str + bangleObj.dex + bangleObj.int) * avatarStats()
            let minusElixirWeaponAtk = ((defaultObj.weaponAtk + hyperObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * arkObj.weaponAtk)
            let minusElixirAtk = ((Math.sqrt((minusElixirStat * minusElixirWeaponAtk) / 6)) + (hyperObj.atkPlus)) * attackBonus
            let minusElixirFinal = (engObj.finalDamagePer * accObj.finalDamagePer * hyperObj.finalDamagePer * bangleAddDamageResult * bangleObj.finalDamagePer)

            let minusBangleStat = (armorStatus() + expeditionStats + hyperObj.str + elixirObj.str + elixirObj.dex + elixirObj.int) * avatarStats()
            let minusBangleWeaponAtk = ((defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus) * arkObj.weaponAtk)
            let minusBangleWeaponAtk2 = ((defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus) * (arkObj.weaponAtk + (accObj.weaponAtkPer / 100)))

            let minusBangleAtk = ((Math.sqrt((minusBangleStat * minusBangleWeaponAtk) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * attackBonus
            let minusBangleAtk2 = ((Math.sqrt((minusBangleStat * minusBangleWeaponAtk2) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * (((accObj.atkPer + elixirObj.atkPer) === 0 ? 1 : (accObj.atkPer + elixirObj.atkPer)) / 100 + 1) * attackBonus
            let minusBangleFinal = (engObj.finalDamagePer * accObj.finalDamagePer * hyperObj.finalDamagePer * bangleAddDamageResult * elixirObj.finalDamagePer)
            let bangleAtkValue = ((totalAtk3 - minusBangleAtk2) / minusBangleAtk2) + 1


            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1차 환산 공격력////   
            let finalValue = (totalAtk1 * criticalFinalResult * finalDamageResult * evolutionDamageResult * enlightResult * (((defaultObj.crit + defaultObj.haste + defaultObj.special - bangleObj.crit - bangleObj.haste - bangleObj.special) / 100 * 1) / 100 + 1))
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1차 환산 공격력////




            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 포함 환산////
            let bangleFinalValue = (totalAtk1 * criticalFinalResult * bangleFinalDamageResult * evolutionDamageResult * enlightResult * (((defaultObj.crit + defaultObj.haste + defaultObj.special) / 100 * 1) / 100 + 1))
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 포함 환산////



            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 딜증율////
            let bangleEff = ((((bangleFinalValue - finalValue) / finalValue) + 1) * (bangleObj.finalDamagePerEff) * bangleStatValue * 1.03).toFixed(4)
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 딜증율////


            /////////////////////////////////////////////////////////////특성 포함 최종 환산 공격력////////////////////////////////////////////////////////////////////////////////////////////////////////   
            let lastFinalValue = ((totalAtk1) * evolutionDamageResult * bangleFinalDamageResult * enlightResult * arkObj.leapDamage * gemCheckFnc().gemValue * gemCheckFnc().etcAverageValue * gemsCoolValue * bangleStatValue * (((defaultObj.crit + defaultObj.haste + defaultObj.special) / 100 * 2) / 100 + 1 + 0.3))
            /////////////////////////////////////////////////////////////특성 포함 최종 환산 공격력////////////////////////////////////////////////////////////////////////////////////////////////////////

            let minusHyperValue = ((minusHyperAtk) * evolutionDamageResult * minusHyperFinal * enlightResult * arkObj.leapDamage * gemCheckFnc().gemValue * gemCheckFnc().etcAverageValue * gemsCoolValue * bangleStatValue * (((defaultObj.crit + defaultObj.haste + defaultObj.special) / 100 * 2) / 100 + 1 + 0.3))
            let hyperValue = ((lastFinalValue - minusHyperValue) / lastFinalValue * 100).toFixed(2)
            //console.log("초월 효율" + hyperValue)

            let minusElixirValue = ((minusElixirAtk) * evolutionDamageResult * minusElixirFinal * enlightResult * arkObj.leapDamage * gemCheckFnc().gemValue * gemCheckFnc().etcAverageValue * gemsCoolValue * bangleStatValue * (((defaultObj.crit + defaultObj.haste + defaultObj.special) / 100 * 2) / 100 + 1 + 0.3))
            let elixirValue = ((lastFinalValue - minusElixirValue) / lastFinalValue * 1.1 * 100).toFixed(2)
            //console.log("엘릭서 효율" + elixirValue)

            let minusBangleValue = ((minusBangleAtk) * evolutionDamageResult * minusBangleFinal * enlightResult * arkObj.leapDamage * gemCheckFnc().gemValue * gemCheckFnc().etcAverageValue * gemsCoolValue * bangleStatValue * (((defaultObj.crit + defaultObj.haste + defaultObj.special - bangleObj.crit - bangleObj.haste - bangleObj.special) / 100 * 2) / 100 + 1 + 0.3))
            let bangleValue = (((1 * bangleAtkValue * bangleObj.finalDamagePer * (((bangleObj.crit + bangleObj.haste + bangleObj.special) / 100 * 2.55) / 100 + 1)) - 1) * 100).toFixed(2)
            //console.log("팔찌 효율" + bangleValue)


            function formatNumber(num) {
                if (num >= 10000) {
                    let formatted = (num / 10000).toFixed(1);
                    return formatted.endsWith('.0') ? formatted.slice(0, -2) + '만' : formatted + '만';
                }
                return num.toString();
            }


            // armorStatus() 장비 힘민지
            // expeditionStats 원정대 힘민지

            // let baseAttackStats = ( (data.ArmoryProfile.CharacterLevel - 9) * 8.86 + 54 )








            //////////////////////////////////////// 서폿 공증 계산식 ////////////////////////////////////////
            let supportTotalWeaponAtk = ((defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * (arkObj.weaponAtk + (accObj.weaponAtkPer / 100))) // 서폿 무공 계산값
            let totalAtk4 = (Math.sqrt((totalStat * supportTotalWeaponAtk) / 6)) * attackBonus

            let finalStigmaPer = ((jobObj.stigmaPer * ((accObj.stigmaPer + arkObj.stigmaPer + hyperObj.stigmaPer) / 100 + 1)).toFixed(1)) // 낙인력

            let atkBuff = (1 + ((accObj.atkBuff + elixirObj.atkBuff + hyperObj.atkBuff + bangleObj.atkBuff + gemObj.atkBuff) / 100)) // 아공강 
            let finalAtkBuff = (totalAtk4 * 0.15 * atkBuff) // 최종 공증

            let damageBuff = (accObj.damageBuff + bangleObj.damageBuff + gemObj.damageBuff) / 100 + 1 // 아피강
            let hyperBuff = (10 * ((accObj.damageBuff + bangleObj.damageBuff) / 100 + 1)) / 100 + 1 // 초각성


            let statDamageBuff = ((defaultObj.special + defaultObj.haste) * 0.015) / 100 + 1 // 특화 신속
            let finalDamageBuff = (13 * damageBuff * statDamageBuff) / 100 + 1 // 최종 피증

            let evolutionBuff = (arkObj.evolutionBuff / 100) // 진화형 피해 버프

            let beforeBuff = ((150000 ** 1.095) * 1.7 * (5.275243 ** 1.01) * 1.4 * 1.1 * 1.80978) // 가상의 딜러
            let afterBuff = ((((150000 + finalAtkBuff) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.4 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035 * (bangleObj.atkBuffPlus / 100 + 1)
            let afterFullBuff = ((((150000 + finalAtkBuff) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.4 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035 * (bangleObj.atkBuffPlus / 100 + 1) * finalDamageBuff * hyperBuff

            let allTimeBuffPower = ((afterBuff - beforeBuff) / beforeBuff) * 100
            let fullBuffPower = ((afterFullBuff - beforeBuff) / beforeBuff) * 100



            // 4티어 서폿 최종 스펙포인트1
            let supportSpecPoint = (fullBuffPower ** 2.546) * 20 * enlightBuffResult * arkObj.leapDamage * engObj.engBonusPer * ((1 / (1 - gemsCoolAvg / 100) - 1) + 1)

            let supportTotalWeaponAtkMinusBangle = ((defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus) * (arkObj.weaponAtk + (accObj.weaponAtkPer / 100)))
            let totalAtk5 = (Math.sqrt((totalStat * supportTotalWeaponAtkMinusBangle) / 6)) * attackBonus

            let atkBuffMinusBangle = (1 + ((accObj.atkBuff + elixirObj.atkBuff + hyperObj.atkBuff + gemObj.atkBuff) / 100)) // 팔찌 제외 아공강
            let finalAtkBuffMinusBangle = (totalAtk5 * 0.15 * atkBuffMinusBangle) // 팔찌 제외 최종 공증

            let damageBuffMinusBangle = (accObj.damageBuff + gemObj.damageBuff) / 100 + 1 // 팔찌 제외 아피강
            let hyperBuffMinusBangle = (10 * ((accObj.damageBuff) / 100 + 1)) / 100 + 1 // 팔찌 제외 초각성

            let statDamageBuffMinusBangle = ((defaultObj.special + defaultObj.haste - bangleObj.special - bangleObj.haste) * 0.015) / 100 + 1 // 팔찌 제외 스탯
            let finalDamageBuffMinusBangle = (13 * damageBuffMinusBangle * statDamageBuffMinusBangle) / 100 + 1 // 팔찌 제외 최종 피증


            let afterBuffMinusBangle = ((((150000 + finalAtkBuffMinusBangle) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.36 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035
            let afterFullBuffMinusBangle = ((((150000 + finalAtkBuffMinusBangle) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.36 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035 * finalDamageBuffMinusBangle * hyperBuffMinusBangle

            let allTimeBuffPowerMinusBangle = ((afterBuffMinusBangle - beforeBuff) / beforeBuff) * 100
            let fullBuffPowerMinusBangle = ((afterFullBuffMinusBangle - beforeBuff) / beforeBuff) * 100

            let supportSpecPointMinusBangle = (fullBuffPowerMinusBangle ** 2.526) * 21 * enlightBuffResult * arkObj.leapDamage * engObj.engBonusPer * ((1 / (1 - gemsCoolAvg / 100) - 1) + 1)
            let supportBangleEff = ((fullBuffPower - fullBuffPowerMinusBangle) / fullBuffPowerMinusBangle * 100)
            //+ 1 * (bangleObj.special*0.01/100+1) * (bangleObj.haste*0.01/100+1)) * 100 - 100

            //console.log ( supportSpecPointMinusBangle )
            //console.log("팔찌 효율" + ((fullBuffPower)))
            //console.log("특화 효율" + (bangleObj.special*0.045/100+1))
            //console.log("신속 효율" + (bangleObj.haste*0.045/100+1))

            //////////////////////////////////////// 서폿 케어력 계산식 ////////////////////////////////////////


            let carePower = (engObj.carePower / 100 + 1) * (accObj.carePower / 100 + 1) * (elixirObj.carePower / 100 + 1)
            let finalCarePower = (defaultObj.hp * 0.3) * (engObj.carePower / 100 + 1) * (accObj.carePower / 100 + 1) * (elixirObj.carePower / 100 + 1)









            //console.log("각인 케어력 : " + engObj.carePower)
            //console.log("악세 케어력 : " + accObj.carePower)
            //console.log("엘릭서 케어력 : " + elixirObj.carePower)
            // console.log("엘릭서 : " , elixirObj)



            //console.log("아공강 총합 : " + atkBuff)
            //console.log("낙인력 : "+finalStigmaPer + "%")
            //console.log("기준 딜러 버프 전 : " + beforeBuff)
            //console.log("기준 딜러 버프 후 : " + afterBuff )


            // export용 4티어 스펙포인트 값 저장

            // 딜러
            highTierSpecPointObj.dealerAttackPowResult = totalAtk1
            highTierSpecPointObj.dealerTotalStatus = (defaultObj.crit + defaultObj.haste + defaultObj.special)
            highTierSpecPointObj.dealerEngResult = (engObj.finalDamagePer * 100 - 100)
            highTierSpecPointObj.dealerEvloutionResult = ((evolutionDamageResult - 1) * 100)
            highTierSpecPointObj.dealerEnlightResult = ((enlightResult - 1) * 100)
            highTierSpecPointObj.dealerLeapResult = ((arkObj.leapDamage - 1) * 100)
            highTierSpecPointObj.dealerBangleResult = (bangleEff * 100 - 100)

            // 서폿
            highTierSpecPointObj.supportStigmaResult = finalStigmaPer
            highTierSpecPointObj.supportAllTimeBuff = allTimeBuffPower
            highTierSpecPointObj.supportFullBuff = fullBuffPower
            highTierSpecPointObj.supportEngBonus = ((engObj.engBonusPer - 1) * 100)
            highTierSpecPointObj.supportgemsCoolAvg = gemsCoolAvg
            highTierSpecPointObj.supportCarePowerResult = ((finalCarePower / 280000) * 100)
            highTierSpecPointObj.supportBangleResult = supportBangleEff


            // 최종 스펙 포인트
            highTierSpecPointObj.dealerlastFinalValue = lastFinalValue //딜러 스펙포인트
            highTierSpecPointObj.supportSpecPoint = supportSpecPoint //서폿 스펙포인트

            // console.log(highTierSpecPointObj)



            // 스펙포인트 db저장 통합
            if (!(supportCheck() == "서폿")) {   // 딜러
                highTierSpecPointObj.completeSpecPoint = lastFinalValue
            } else if (supportCheck() == "서폿") {
                highTierSpecPointObj.completeSpecPoint = supportSpecPoint
            }
            highTierSpecPointObj.supportSpecPoint = isNaN(highTierSpecPointObj.supportSpecPoint) ? 0 : highTierSpecPointObj.supportSpecPoint;


            // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
            // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
            // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------



            // ---------------------------DB저장---------------------------
            // ---------------------------DB저장---------------------------
            // ---------------------------DB저장---------------------------










            // 유저 api 데이터 저장 
            // insertLopecApis( inputName, JSON.stringify(data) )


            // 검색로그저장

            // 유저 캐릭터 정보
            function insertCharacter() {
                let level = data.ArmoryProfile.CharacterLevel
                let image = data.ArmoryProfile.CharacterImage
                let server = data.ArmoryProfile.ServerName
                let itemLevel = parseFloat(data.ArmoryProfile.ItemMaxLevel.replace(/,/g, ''))
                // console.log(itemLevel);
                let guild = data.ArmoryProfile.GuildName
                let title = data.ArmoryProfile.Title
                let classFullName = supportCheck() + " " + data.ArmoryProfile.CharacterClassName
                let version = 20250224

                insertLopecCharacters(
                    inputName,                                  // 닉네임
                    level,                                      // 캐릭터 레벨
                    classFullName,                              // 직업 풀네임
                    image,                                      // 프로필 이미지
                    server,                                     // 서버
                    itemLevel,                                  // 아이템 레벨
                    guild,                                      // 길드
                    title,                                      // 칭호
                    highTierSpecPointObj.dealerlastFinalValue,  // 딜러 통합 스펙포인트
                    highTierSpecPointObj.supportSpecPoint,       // 서폿 통합 스펙포인트
                    allTimeBuffPower,                           // 상시버프
                    fullBuffPower,                              // 풀버프
                    version,                                    // 현재 버전
                )
            }

            insertCharacter()


            if (callback) {
                const now = new Date();
                const formattedDate = now.getFullYear() +
                String(now.getMonth() + 1).padStart(2, '0') +
                String(now.getDate()).padStart(2, '0') +
                String(now.getHours()).padStart(2, '0') +
                String(now.getMinutes()).padStart(2, '0') +
                String(now.getSeconds()).padStart(2, '0');

                const profileResult = {
                    itemLevel: parseFloat(data.ArmoryProfile.ItemMaxLevel.replace(/,/g, '')),                              // 아이템 레벨  
                    characterClass: supportCheck() + " " + data.ArmoryProfile.CharacterClassName,                     // 직업명
                    totalSum: (highTierSpecPointObj.dealerlastFinalValue).toFixed(0),     // 딜러 점수
                    totalSumSupport: (highTierSpecPointObj.supportSpecPoint).toFixed(0),  // 서포터 점수
                    isSupport: supportCheck() == "서폿",         // 서포터 여부
                    regDate: formattedDate             // 등록 일시
                };
                
                callback(profileResult);
            }
        }

        useApiKey()
        .catch(err => console.log(err))
        .finally(() => {
            isRequesting = false;
        });
    }