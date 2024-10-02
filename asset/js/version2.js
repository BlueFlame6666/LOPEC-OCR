import {keywordList,grindingFilter,arkFilter,engravingImg,dealerAccessoryFilter,elixirFilter,cardPointFilter} from './filter.js';

let keywordFilter = keywordList;


// key
import { config } from '../../config.js';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let shuffledApiKeys = shuffleArray([...config.apiKeys]);
let currentKeyIndex = 0;

function getNextApiKey() {

    if (currentKeyIndex >= shuffledApiKeys.length) {
        shuffledApiKeys = shuffleArray([...config.apiKeys]);
        currentKeyIndex = 0;
    }

    const key = atob(shuffledApiKeys[currentKeyIndex]);
    currentKeyIndex++;
    return key;
}

async function getCharacterProfile(inputName) {
    const characterName = document.getElementById(inputName).value;
    let url = `https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(characterName)}`;
    console.log('Request URL:', url);

    let options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'bearer ' + getNextApiKey()
        }
    };

fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
    
        
        
        // 호출api모음
        let characterImage = data.ArmoryProfile.CharacterImage //캐릭터 이미지
        let characterLevel = data.ArmoryProfile.CharacterLevel //캐릭터 레벨
        let characterNickName = data.ArmoryProfile.CharacterName //캐릭터 닉네임
        let characterClass = data.ArmoryProfile.CharacterClassName //캐릭터 직업
        
        
        let serverName = data.ArmoryProfile.ServerName //서버명
        let itemLevel = data.ArmoryProfile.ItemMaxLevel //아이템레벨
        let guildNullCheck = data.ArmoryProfile.GuildName //길드명
        function guildName(){
            if(guildNullCheck == null){
                return("없음")
            }else{
                return(guildNullCheck)
            }
        }
        let titleNullCheck = data.ArmoryProfile.Title //칭호명
        function titleName(){
            if(titleNullCheck == null){
                return("없음")
            }else{
                return(titleNullCheck)
            }
        }
        
        let townName = data.ArmoryProfile.TownName //영지명
        
        


        // -----------------------계산식 함수 호출하기-----------------------------
        // -----------------------계산식 함수 호출하기-----------------------------
        // -----------------------계산식 함수 호출하기-----------------------------




        // --아크패시브 활성화 딜러 계산식--

        console.log(data)
        let characterPoint = 0

        // 캐릭터 레벨 기본 전투력값
        function characterCal(level){

            // 기본 레벨 점수식
            let defaultPoint = (level-50)*2000

            // 추가 점수식
            if(level<55){
             characterPoint = defaultPoint
            }else if(level<60){
             characterPoint = defaultPoint + 20000
            }else if(level<65){
             characterPoint = defaultPoint + 40000
            }else if(level<70){
             characterPoint = defaultPoint + 60000
            }else if(level<99){
             characterPoint = defaultPoint + 100000
            }

            // 캐릭터 레벨 최종점수
            return characterPoint
        }
        console.log(characterCal(characterLevel))


        // armorEquipment 무기 레벨 전투력값
        let weaponLevel = data.ArmoryEquipment

        // 무기 레벨 최종점수
        let weaponPoint = 0
        function weaponCal(){
            weaponLevel.forEach(function(arry,idx){
                if(arry.Type == "무기"){
                    let weaponString = JSON.parse(arry.Tooltip).Element_001.value.leftStr2
                    let weaponNum = Number(weaponString.replace(/<[^>]*>/g, '').replace(/\([^)]*\)/g, '').replace(/\D/g, '').trim())

                    console.log()

                    if(weaponNum < 1580){
                        // console.log("1580미만")
                        weaponPoint = (weaponNum-50)*100
                    }else if(weaponNum >= 1580 && weaponNum < 1735){
                        // console.log("1580이상 1735미만")
                        weaponPoint = 153000 + (weaponNum-1580)*200
                    }else if(weaponNum == 1735 && !(arry.Grade == "에스더")){
                        // console.log("레벨 1735 에스더 아님")
                        weaponPoint = (153000 + (weaponNum-1580)*200)+50000
                    }else if(weaponNum >= 1735 && weaponNum <= 1764){
                        // console.log("1735이상 1764이하 에스더 등급")
                        weaponPoint = (153000 + (weaponNum-1580)*200)+100000
                    }
                    else if(weaponNum >= 1765){
                        // console.log("weaponNum >= 1765")
                        weaponPoint = (153000 + (weaponNum-1580)*200)+200000
                    }

                }
                return weaponPoint
            })
            return weaponPoint
            
        }
        weaponCal()
        // console.log(weaponCal())


        // 방어구 레벨 최종점수

        let armorPoint = 0;

        function armorCal(){
            weaponLevel.forEach(function(arry){
                let weaponString = JSON.parse(arry.Tooltip).Element_001.value.leftStr2
                let weaponNum = Number(weaponString.replace(/<[^>]*>/g, '').replace(/\([^)]*\)/g, '').replace(/\D/g, '').trim())


                



                
                if(arry.Type == "투구"){
                    if(weaponNum < 1580){
                        // console.log("투구 1580미만")
                        armorPoint += ((weaponNum-50)*100)*0.2
                    }else if(weaponNum >= 1580){
                        // console.log("투구 1580이상")
                        armorPoint += (153000 + (weaponNum-1580)*200)*0.2
                    }    
                }else if(arry.Type == "상의"){
                    if(weaponNum < 1580){
                        // console.log("상의 1580미만")
                        armorPoint += ((weaponNum-50)*100)*0.2
                    }else if(weaponNum >= 1580){
                        // console.log("상의 1580이상")
                        armorPoint += (153000 + (weaponNum-1580)*200)*0.2
                    }
                }else if(arry.Type == "하의"){
                    if(weaponNum < 1580){
                        // console.log("하의 1580미만")
                        armorPoint += ((weaponNum-50)*100)*0.2
                    }else if(weaponNum >= 1580){
                        // console.log("하의 1580이상")
                        armorPoint += (153000 + (weaponNum-1580)*200)*0.2
                    }
                }else if(arry.Type == "장갑"){
                    if(weaponNum < 1580){
                        // console.log("장갑 1580미만")
                        armorPoint += ((weaponNum-50)*100)*0.2
                    }else if(weaponNum >= 1580){
                        // console.log("장갑 1580이상")
                        armorPoint += (153000 + (weaponNum-1580)*200)*0.2
                    }
                }else if(arry.Type == "어깨"){
                    if(weaponNum < 1580){
                        // console.log("어깨 1580미만")
                        armorPoint += ((weaponNum-50)*100)*0.2
                    }else if(weaponNum >= 1580){
                        // console.log("어깨 1580이상")
                        armorPoint += (153000 + (weaponNum-1580)*200)*0.2
                    }
                }
                return armorPoint
            })
            return armorPoint
        }
        // console.log(armorCal())




        // 아크패시브 최종 포인트
        let arkPoint = 0

        function arkBonus(arkArry,arkName){
            if(arkArry < 72 && arkName == "진화"){
                return arkArry*400
            }else if(arkArry > 71 && arkArry < 84 && arkName == "진화"){
                return arkArry*400 + 50000
            }else if(arkArry < 96 && arkName == "진화"){
                return arkArry*400 + 300000
            }else if(arkArry < 108 && arkName == "진화"){
                return arkArry*400 + 345000
            }else if(arkArry < 120 && arkName == "진화"){
                return arkArry*400 + 390000
            }else if(arkArry < 999 && arkName == "진화"){
                return arkArry*400 + 500000
            }else if(arkArry < 80 && arkName == "깨달음"){
                return arkArry*500
            }else if(arkArry > 79 && arkArry < 88 && arkName == "깨달음"){
                return arkArry*500 + 80000
            }else if(arkArry < 999 && arkName == "깨달음"){
                return arkArry*500 + 150000
            }
        }



        function arkCal(){
            let arkPointArry = data.ArkPassive.Points
            arkPointArry.forEach(function(arry){
                // console.log(arry)
                if(arry.Name == "진화"){
                    // console.log("진화"+arkBonus(arry.Value, arry.Name)+"포인트")
                    arkPoint += arkBonus(arry.Value, arry.Name)

                }else if(arry.Name == "깨달음"){
                    // console.log("깨달음"+arkBonus(arry.Value, arry.Name)+"포인트")
                    arkPoint += arkBonus(arry.Value, arry.Name)

                }else if(arry.Name == "도약"){
                    // console.log("도약"+arry.Value*750+"포인트")
                    arkPoint += arry.Value*750
                }
            })
            return arkPoint
        }
        if(data.ArkPassive.IsArkPassive == true){
            arkCal()
        }
        // console.log(arkPoint)

        // 악세서리 최종 포인트


        let accessoryGrade = []


        // 악세서리 상중하 추출 필터
        function accessoryCheck(accessoryOption){
            dealerAccessoryFilter.forEach(function(filterArry){
                // console.log(accessoryOption)

                if(accessoryOption.includes(filterArry.split(":")[0])){
                    // console.log(filterArry.split(":")[1])
                    return accessoryGrade.push( filterArry.split(":")[1])
                }
            })
            return accessoryGrade
        }
        
        
        // 악세서리 추출 필터 실행함수
        function accessoryCal(){
            weaponLevel.forEach(function(arry){
                try{
                    let accessoryName = JSON.parse(arry.Tooltip).Element_005.value.Element_001
                    // console.log(accessoryName)
                    accessoryCheck(accessoryName)
                }catch{}
            })
        }
        accessoryCal()

        
        // 배열 3개 단위로 나누기 함수
        function splitArrayIntoChunks(array, chunkSize) {
            const result = [];
            for (let i = 0; i < array.length; i += chunkSize) {
                result.push(array.slice(i, i + chunkSize));
            }
            return result;
        }
        let chunkSize = Math.ceil(accessoryGrade.length / (accessoryGrade.length/3));
        accessoryGrade = splitArrayIntoChunks(accessoryGrade, chunkSize);
        
        
        // 배열 3개(1세트) 점수 검사
        function normalTml(e){
            if(e == "Zlow"|| e == "Zmiddle" || e == "Zhigh"){
                return 0
            }else if(e == "SPhigh"){
                return 40000
            }else if(e =="SPmiddle"){
                return 15000
            }else if(e == "SPlow"){
                return 5000
            }else if(e == "PUBhigh"){
                return 6000
            }else if(e == "PUBmiddle"){
                return 3000
            }else if(e == "PUBlow"){
                return 1500
            }
        }
        function spTml(spVal,pubVal){
            if(spVal == 2 && pubVal == 0){
                return 80000
            }else if(spVal == 1 && pubVal == 2){
                return 50000
            }else if(spVal == 2 && pubVal == 1){
                return 150000
            }else{
                return 0
            }
        }

        function spOptionCheck(e){
            return e == "SPhigh"
        }
        function pubOptionCheck(e){
            return e == "PUBhigh"
        }

        let accessoryPoint = 0;

        // console.log(accessoryGrade)
        accessoryGrade.forEach(function(arry, index){
            // console.log(arry)
            arry.forEach(function(tmlArry){
                // normalTml(tmlArry)
                accessoryPoint += normalTml(tmlArry)
                // console.log(normalTml(tmlArry))
            })
            let spNum = arry.filter(spOptionCheck).length
            let pubNum = arry.filter(pubOptionCheck).length
            
            return accessoryPoint += spTml(spNum,pubNum)
        })
        // console.log(accessoryPoint)
        
        
        
        
        // 엘릭서 계산식 최종포인트(딜러)


        // 엘릭서 레벨 추출
        function elixirKeywordCheck(e){ 
            let elixirValString = data.ArmoryEquipment[e].Tooltip;
            
            
            const matchedKeywordsWithContext = keywordFilter.flatMap(keyword => {
                const index = elixirValString.indexOf(keyword);
                if (index !== -1) {
                  const endIndex = Math.min(index + keyword.length + 4, elixirValString.length);
                  return [elixirValString.slice(index, endIndex).replace(/<[^>]*>/g, '')];
                }
                return [];
            });


            // span태그로 반환
            let elixirSpan =[]
            let i           
            for(i = 0 ; i < matchedKeywordsWithContext.length ; i++){
                elixirSpan.push(matchedKeywordsWithContext[i])
            }
            return(elixirSpan)
            
        }

        let elixirData = []
        // 엘릭서 인덱스 번호 검사
        data.ArmoryEquipment.forEach(function(arry,idx){
            elixirKeywordCheck(idx).forEach(function(elixirArry,idx){
                elixirData.push({name:">"+elixirArry.split("Lv.")[0],level:elixirArry.split("Lv.")[1]})
            })
        })
        
        function elixirFilterVal(optionGrade,level){ // 옵션 분류명, 레벨
            if(optionGrade == "pub" && level == 5){
                return level*1500+7500
            }else if(optionGrade == "pub"){
                return level*1500
            }else if(optionGrade == "sp"){
                return level*1000
            }else if(optionGrade == "sp1"&&level == 5){
                return level*4000+20000
            }else if(optionGrade == "sp1"){
                return level*4000
            }else if(optionGrade == "sp2"&&level == 5){
                return level*3500+17500
            }else if(optionGrade == "sp2"){
                return level*3500
            }else{
                return 0
            }
        }


        let elixirPoint = 0
        let elixirLevel = 0




        elixirData.forEach(function(arry){

            // console.log((arry.name))
            // console.log(arry.level)

            
            

            elixirFilter.forEach(function(filterArry){
                if(arry.name == filterArry.split(":")[0]){
                    // elixirFilterVal(filterArry.split(":")[1],arry.level)

                    // console.log("엘릭레벨:"+arry.level+"엘릭서명:"+arry.name+",엘릭서 점수:"+elixirFilterVal(filterArry.split(":")[1],arry.level))
                    elixirLevel += Number(arry.level)
                    elixirPoint += elixirFilterVal(filterArry.split(":")[1],arry.level)
                }else{
                    // console.log("asdasd")
                }
            })
        })
        // console.log(elixirLevel)


        // 회심,달인 2개 존재시 가산점

        let doubleCheck = ["회심","달인","강맹","칼날방패","선봉대","행운"]
        function containsTwoHoesim(data,doubleString) {
            let count = data.filter(item => item.name.includes(doubleString)).length;
            return count === 2;
        }
        // console.log(elixirData)

        // console.log(containsTwoHoesim(elixirData)); // true
        doubleCheck.forEach(function(arry){
            if(containsTwoHoesim(elixirData,arry) && elixirLevel >= 50){
                // console.log("가산점 100000")
                elixirPoint += 100000
            }else if(containsTwoHoesim(elixirData,arry) && elixirLevel >= 40){
                // console.log("가산점 80000")
                elixirPoint += 80000
            }else if(containsTwoHoesim(elixirData,arry) && elixirLevel >= 35){
                // console.log("가산점 50000")
                elixirPoint += 50000
            }
        })
        // console.log("엘릭서 최종 점수:"+elixirPoint)



        // 보석 최종점수

        let gemsPoint = 0;
        try{
            data.ArmoryGem.Gems.forEach(function(arry){
                // console.log(arry.Level)
                if(arry.Name.includes("멸화")||arry.Name.includes("홍염")){
                    gemsPoint += arry.Level*2250
                    // console.log("멸화or홍염:"+gemsPoint)
                }else if(arry.Name.includes("겁화")||arry.Name.includes("작열")){
                    gemsPoint += (arry.Level+2)*2250*1.1
                    // console.log("겁화or작열:"+gemsPoint)
                }
                
                // 보석 10레벨 보너스 가산점
                if(arry.Level == 10){
                    // console.log("보석 보너스 가산점")
                    gemsPoint += 7500
                }
            })    
        }catch{

        }
        // console.log(gemsPoint)



        // 각인점수 최종점수(비활성화/활성화)
        let setPoint = 0

        let engravingPoint = 0 //각인 점수
        let arkDisable = data.ArmoryEngraving.Effects
        let arkAble = data.ArmoryEngraving.ArkPassiveEffects
        let arkLevel = 0
        if(!(arkDisable == null)){//아크패시브 비활성화
            setPoint += 300000
            arkDisable.forEach(function(arry){
                arkLevel = Number(arry.Name.replace(/\D/g, ''))
                engravingPoint += arkLevel*11000
            })
        }else if(!(arkAble == null)){//아크패시브 활성화
            arkAble.forEach(function(arry){
                if(arry.Grade.includes("전설")){
                    engravingPoint += Math.round(20000 * (1.6 ** arry.Level))
                }else if(arry.Grade.includes("유물")){
                    engravingPoint += Math.round(35220 * (1.6 ** arry.Level))
                }else{
                    engravingPoint += Math.round(5000 * (1.6 ** arry.Level))
                }
            })
        }
        // console.log(engravingPoint)
        

        // 초월 점수 계산식

        let hyperPoint = 0;
        let hyperArmoryLevel = 0;
        let hyperWeaponLevel = 0;

        function hyperCalcFnc(e){
            let hyperStr = data.ArmoryEquipment[e].Tooltip;


            const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
            const hyperMatch = hyperStr.match(regex);

            try{
                let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
                hyperReplace = hyperReplace.replace(/\s+/g, ',')
                let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
                // console.log(hyperArry)
                hyperPoint += Number(hyperArry[3])*3750 + Number(hyperArry[1]*7500)
                return Number(hyperArry[3])
                
                // return Number(hyperArry[3])*3750 + Number(hyperArry[1]*7500)
                
            }catch{
                return 0
            }
        }

        data.ArmoryEquipment.forEach(function(arry,idx){
            if(arry.Type == "무기"){
                hyperWeaponLevel += hyperCalcFnc(idx)
            }else{
                hyperArmoryLevel += hyperCalcFnc(idx)
            }
        })


        // 무기 20성 이상 가산점
        if(hyperWeaponLevel >= 20){
            hyperPoint += 37500
        }
        // 방어구 75성 이상 가산점
        if(hyperArmoryLevel >= 100){
            hyperPoint += 37500
        }else if(hyperArmoryLevel >= 75){
             
            hyperPoint += 22500
        }


        // console.log("무기:"+hyperWeaponLevel+"성")
        // console.log("방어구:"+hyperArmoryLevel+"성")
        // console.log("초월 합산 총점:"+hyperPoint+"점")


        // 카드 점수 계산

        cardPointFilter
        let cardPoint = 0
        let cardLevel = 0
          

        // 카드 장착유무 확인
        if(!(data.ArmoryCard == null)){
            data.ArmoryCard.Effects.forEach(function(arry){
                let lastCardName = arry.Items[arry.Items.length - 1].Name
                lastCardName.replace(/\s*\d+세트(?:\s*\((\d+)각.*?\))?/g, function(match, p1) {
                    cardLevel = Number(p1)
                }).trim();

                // console.log(cardLevel);
                cardPointCheck(lastCardName,cardLevel)
            })
        }else{
        // 특정카드 점수 계산기(단일)
        }
        function cardPointCheck(cardName,level){
            cardPointFilter.forEach(function(arry){
                if(cardName.includes(arry.split(":")[0]) && arry.split(":")[1] == 1){
                    cardPoint = level*3660
                }else if(cardName.includes(arry.split(":")[0]) && arry.split(":")[1] == 2){
                    cardPoint = level*6700
                }
            })
        }

        // console.log(data.ArmoryCard)
        let cardFilter = ['세 우마르가 오리라',"라제니스의 운명"]
        let comboCardString = JSON.stringify(data.ArmoryCard.Effects)
        let comboFilter = comboCardString.includes(cardFilter[0])&&comboCardString.includes(cardFilter[1])
        // 특정카드 조합 계산기(복수)
        if(data.ArmoryCard.Effects.length > 1 && comboFilter){
            cardPoint = 201000
        }

        // console.log(cardPoint)


        // 어빌리티스톤 점수 계산식(아크패시브 활성화/비활성화) 

        let abilityStonePoint = 0;
        let abilityLevel = 0;
        if(!(data.ArmoryEngraving.ArkPassiveEffects == null)){
            abilityStonePoint += abilityStoneCalc()
        }else{
            
        }
        
        function abilityStoneCalc(){
            let result = 0
            data.ArmoryEngraving.ArkPassiveEffects.forEach(function(arry){
                if(!(arry.AbilityStoneLevel == null)){

                    if(arry.AbilityStoneLevel == 1){
                        result += 10000
                    }else if(arry.AbilityStoneLevel == 2){
                        result += 20000
                    }else if(arry.AbilityStoneLevel == 3){
                        result += 35000
                    }else if(arry.AbilityStoneLevel == 4){
                        result += 50000
                    }

                    abilityLevel += arry.AbilityStoneLevel
                }
            })
            return result
        }
        if(abilityLevel >= 8){
            abilityStonePoint += 160000
        }else if(abilityLevel >= 7){
            abilityStonePoint += 140000
        }else if(abilityLevel >= 6){
            abilityStonePoint += 120000
        }else if(abilityLevel >= 5){
            abilityStonePoint += 100000
        }

        // console.log(abilityStonePoint)


        


        // characterPoint,weaponPoint,arkPoint,accessoryPoint,elixirPoint,gemsPoint,engravingPoint,hyperPoint,cardPoint,abilityStonePoint
        // ---------------------스펙포인트 총합 계산---------------------
        let specPoint = 0;
       
        // console.log(characterPoint+'전투포인트')
        // console.log(weaponPoint+'장비포인트')
        // console.log(arkPoint+'진화깨달음도약포인트')
        // console.log(accessoryPoint+'악세서리포인트')
        // console.log(elixirPoint+'엘릭서포인트')
        // console.log(gemsPoint+'보석포인트')
        // console.log(engravingPoint+'각인포인트')
        // console.log(hyperPoint+'초월포인트')
        // console.log(cardPoint+'카드포인트')
        // console.log(abilityStonePoint+'스톤포인트')
        // console.log(setPoint+'세트포인트')

        specPoint = characterPoint+
                    weaponPoint+
                    arkPoint+
                    accessoryPoint+
                    elixirPoint+
                    gemsPoint+
                    engravingPoint+
                    hyperPoint+
                    cardPoint+
                    abilityStonePoint+
                    setPoint

        console.log(specPoint+"스펙포인트")


        // -----------------------계산식 함수 끝-----------------------------------
        // -----------------------계산식 함수 끝-----------------------------------
        // -----------------------계산식 함수 끝-----------------------------------
        // HTML코드

        // 프로필



        // 카드

        let cardEff
        let cardStr
        let cardSet

        function cardNull(){
            if(data.ArmoryCard == null){

            }else{
                cardEff = data.ArmoryCard.Effects
                cardStr = JSON.stringify(cardEff)
                cardSet = cardStr.includes(cardFilter[0])&&cardStr.includes(cardFilter[1])
            }
        }
        
        // let cardFilter = ['세 우마르가 오리라',"라제니스의 운명"]
        cardNull()
        


        // 카드 복수 여부 체크
        function cardArryCheckFnc(){
            if(!(cardEff.length == 1)){
                return "2개이상"
            }
        }
        // console.log(cardEff[0].Items.length)
        
        let etcCardArry = ""

        function cardArryFnc(){
            try{
                if(cardEff.length == 1){

                    let cardLength = cardEff[0].Items.length
                    let cardName = cardEff[0].Items[cardLength-1].Name
                    let cardNameVal =  cardName.replace(/\s*\d+세트(?:\s*\((\d+)각.*?\))?/g, function(match, p1) {
                        return p1 ? ` (${p1}각)` : '';
                    }).trim();
                    
                    return`
                    <li class="tag-item">
                        <p class="tag radius">카드</p>
                        <span class="name">${cardNameVal}</span>
                    </li>`
    
                }else if(cardArryCheckFnc() == "2개이상" && cardSet){
                    
                    return `
                    <li class="tag-item">
                        <p class="tag radius">카드</p>
                        <span class="name">세우라제</span>
                    </li>`
                }else{
                    cardEff.forEach(function(arry,index){
                        let cardName = arry.Items[arry.Items.length - 1].Name;
                        let cardNameList = cardName.replace(/\s*\d+세트(?:\s*\((\d+)각.*?\))?/g, function(match, p1) {
                            return p1 ? ` (${p1}각)` : '';
                        }).trim();
    
                        
                        return etcCardArry += 
                        `<li class="tag-item">
                            <p class="tag radius invisible${index}">카드</p>
                            <span class="name">${cardNameList} </span>
                        </li>`
                    })
                    return etcCardArry
                }
            }catch{
                return`
                <li class="tag-item">
                    <p class="tag radius invisible">카드</p>
                    <span class="name">없음</span>
                </li>`
            }
        }
    



        // let groupProfile = 
        // `<div class="group-profile">        
        //     <div class="img-area shadow">
        //         <img id="character-image" src="${characterImage}" alt="프로필 이미지">
        //         <p class="level" id="character-level">Lv.${characterLevel}</p>
        //         <p class="name" id="character-nickname">${characterNickName}</p>
        //         <p class="class" id="character-class">${characterClass}</p>
        //     </div>
        //     <ul class="tag-list shadow">
        //         ${tagItemFnc("서버",serverName)}
        //         ${tagItemFnc("레벨",itemLevel)}
        //         ${tagItemFnc("길드",guildName())}
        //         ${tagItemFnc("칭호",titleName())}
        //         ${tagItemFnc("영지",townName)}
        //         ${cardArryFnc()}
        //     </ul>
        // </div>`


        // 정보
        function tagItemFnc(a,b){ //("태그명","태그내용")
            return `
            <li class="tag-item">
                <p class="tag radius">${a}</p>
                <span class="name">${b}</span>
            </li>`; 
        }









        // function tagCardFnc(){
        //     return`
        //     <li class="tag-item">
        //         <p class="tag radius">카드</p>
        //         <div class="name-box>
        //             <span class="name">${cardArryFnc()} </span>
        //         </div>
        //     </li>`
        // }



        // groupInfo 영역


        // 아크패시브 활성화의 경우
        // console.log(data.ArmoryEngraving)
        let arkPassiveEffects = data.ArmoryEngraving.ArkPassiveEffects
        let disableArkPassive = data.ArmoryEngraving.Effects
        function arkGradeCheck(idx){
            try{
                switch (idx.Grade) {
                    case "유물":
                        return "orange";
                    case "전설":
                        return "yellow";
                    case "영웅":
                        return "puple"
                    default:
                        return "unknown";
                }    
            }catch(err){
                console.log(err)
                return "unknown";
            }
        }
        function arkNullCheck(checkVal){
            if(checkVal == null){
                return "unknown"
            }else if(checkVal == -1){
                return "red"
            }
        }
        function arkMinusCheck(checkVal){
            if(checkVal < 0){
                return "LV."+Math.abs(checkVal)
            }else if(checkVal == null){
                return ""
            }else if(checkVal>0){
                return "LV."+checkVal
            }
        }


        function engravingBox(){

            let engravingResult = ""
            if(!(arkPassiveEffects == null)){
                // console.log(arkPassiveEffects)
                arkPassiveEffects.forEach(function(arry, idx){
                    // console.log(arkGradeCheck(arry))
    
    
                    engravingImg.forEach(function(filterArry){
                        let engravingInput = filterArry.split("^")[0]
                        let engravingOutput = filterArry.split("^")[1]
    
                        if(arry.Name.includes(engravingInput)){
    
                            return engravingResult += `
                            <div class="engraving-box">
                                <img src="${engravingOutput}" class="engraving-img" alt="">
                                <span class="engraving-name">${arry.Name}</span>
                                <div class="relic-ico engraving-ico ${arkGradeCheck(arry)}"></div>
                                <span class="grade ${arkGradeCheck(arry)}">X ${arry.Level}</span>
                                <div class="ability-ico engraving-ico ${arkNullCheck(arry.AbilityStoneLevel)}"></div>
                                <span class="ability-level">${arkMinusCheck(arry.AbilityStoneLevel)}</span>
                            </div>`
                        }
                    })
                })
                return engravingResult    
            }else{
                disableArkPassive.forEach(function(arry){
                    // console.log(arry)
                    return engravingResult +=`
                        <div class="engraving-box">
                            <img src="${arry.Icon}" class="engraving-img" alt="">
                            <span class="engraving-name">${arry.Name}</span>
                        </div>`
                })
                return engravingResult    
            }
        }






        // group-info HTML
        let groupInfo = 
        `<div class="group-info">
            <div class="spec-area shadow">
                <p class="title">스펙 포인트</p>
                <img src="./asset/image/esther.png" alt="">
                <span class="spec-point">${specPoint.toLocaleString()}</span>
                <div class="extra-info">
                    <p class="detail-info">세부정보</p>
                    <p class="text">전투레벨 : ${characterPoint.toLocaleString()}</p>
                    <p class="text">장비 :  ${weaponPoint.toLocaleString()}</p>
                    <p class="text">아크패시브 :  ${arkPoint.toLocaleString()}</p>
                    <p class="text">T4 악세서리 :  ${accessoryPoint.toLocaleString()}</p>
                    <p class="text">세트장비 :  ${setPoint.toLocaleString()}</p>
                    <p class="text">엘릭서 :  ${elixirPoint.toLocaleString()}</p>
                    <p class="text">보석 : ${gemsPoint.toLocaleString()}</p>
                    <p class="text">각인 : ${engravingPoint.toLocaleString()}</p>
                    <p class="text">초월 : ${hyperPoint.toLocaleString()}</p>
                    <p class="text">카드 : ${cardPoint.toLocaleString()}</p>
                    <p class="text">어빌리티 스톤 : ${abilityStonePoint.toLocaleString()}</p>
                </div>
                <span class="extra-btn" id="extra-btn"></span>
            </div>
            <div class="engraving-area shadow">
                ${engravingBox()}
            </div>
        </div>`
            



        

        // 보석

        let gemImage = data.ArmoryGem.Gems //보석이미지

        
        // null값 체크하기
        function nullCheck(checkVal, trueVal, falseVal){
            if(checkVal == null || checkVal == undefined){
                return(falseVal)
            }else{
                return(trueVal)
            }
        }


        
        function gemBox(e){

            return`
            <div class="gem-box radius ${
                (() => {
                    try{
                        return nullCheck(gemImage,gradeCheck(gemImage[e]),"빈값")
                    }catch{
                        return nullCheck(gemImage,true,"empty")
                    }
                })()
            }">
            <img src="
            ${
                (() => {
                    // gemImage[e]가 없는 값일 경우 오류가 생겨 try문을 사용
                    try{
                        return nullCheck(gemImage,gemImage[e].Icon,"빈값")//gemImage[e].Icon가 있을경우 실행됨
                    }catch{
                        return nullCheck(gemImage,true,"https://via.placeholder.com/44")//위의gemImage[e].Icon가 없을경우 실행됨
                    }
                })()
            }
            " alt="">
            <span class="level">
            ${
                (() => {
                    try{
                        return nullCheck(gemImage,gemImage[e].Level," ")
                    }catch{
                        return nullCheck(gemImage,true,"N")
                    }
                })()
            }</span>
            </div>`
        }
        
        // 보석 아이콘의 개수만큼 자동 추가
        let gemArea = '<div class="gem-area shadow">';
        try{
            for (let i = 0; i < gemImage.length; i++) {
                gemArea += gemBox(i);
            }     
        }catch{
            for (let i = 0; i < 12; i++) {
                gemArea += gemBox(i);
            }     
        }
        // for (let i = 0; i < gemImage.length; i++) {
        //     gemArea += gemBox(i);
        // }     
        gemArea += '</div>';





        // 장비티어

        let armorEquipment = data.ArmoryEquipment //착용장비목록
        

        function equipTierSet(e){
            let equipTier = armorEquipment[e].Tooltip;
            let equipTierSliceStart = equipTier.indexOf('(티어 ') + 1
            let equipTierSliceEnd = equipTier.indexOf(')')
    
            let equipTierSlice = equipTier.substring(equipTierSliceStart,equipTierSliceEnd)
    
            let equipTierNum = equipTierSlice.slice(3,4);

            return(equipTierNum)
            // console.log(equipTierNum)
        }
        // 착용장비 품질
        function qualityValSet(e){
            let qualityValJson = JSON.parse(armorEquipment[e].Tooltip)
            let qualityVal = qualityValJson.Element_001.value.qualityValue;
            if(qualityVal == -1 ){
                return``
            }else{
                return qualityVal
            }

            return(qualityVal)
            // console.log(qualityVal)
        }

        // 상급재련 수치
        function reforgeValSet(e){
            let reforgeValJson = JSON.parse(armorEquipment[e].Tooltip)
            let reforgeVal = reforgeValJson.Element_005.value

            
            if (typeof reforgeVal === 'string' && reforgeVal.includes("상급 재련")) {
                // console.log("상급 재련이 포함되어 있습니다.");
                let reforgeValArry = reforgeVal.match(/\d+/g); // 숫자를 찾는 정규 표현식
                let reforgeValLastNum = reforgeValArry.length
                // console.log(reforgeValArry[reforgeValLastNum-1]); 
                return("X"+reforgeValArry[reforgeValLastNum-1])//상급재련 값
                
            } else {
                // console.log("상급 재련이 포함되어 있지 않습니다.");
                return("")
            }
           
        }


        // 태그명
        function tagValSet(e){
            let tagValCheck = JSON.parse(armorEquipment[e].Tooltip)
            let tagVal = tagValCheck.Element_010?.value?.firstMsg;

            if(tagVal){
                // console.log("태그가 있습니다.")
                let extractedTag = tagVal.replace(/<[^>]*>/g, '').trim();
                return(extractedTag)
            }else{
                // console.log("태그가 없습니다.")
                return("")
            }

        }


        // 엘릭서
        // 엘릭서 키워드 lv추출
        function elixirVal(e){ 
            let elixirValJson = JSON.parse(armorEquipment[e].Tooltip);
            
            const elixirValString = JSON.stringify(elixirValJson);
            
            const matchedKeywordsWithContext = keywordFilter.flatMap(keyword => {
                const index = elixirValString.indexOf(keyword);
                if (index !== -1) {
                  const endIndex = Math.min(index + keyword.length + 4, elixirValString.length);
                  return [elixirValString.slice(index, endIndex).replace(/<[^>]*>/g, '')];
                }
                return [];
            });
            

            // span태그로 반환
            let elixirSpan =""
            let i           
            for(i = 0 ; i < matchedKeywordsWithContext.length ; i++){
                elixirSpan +=
                `<span class="elixir radius">${matchedKeywordsWithContext[i]}</span>`
            }
            return(elixirSpan)
        }



        


        // 초월

        let hyperImg = `<img src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_transcendence.png" alt="꽃모양 아이콘">`
        
        function hyperWrap(e){
            let hyperValJson = JSON.parse(armorEquipment[e].Tooltip);
            let hyperStr = JSON.stringify(hyperValJson)


            const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
            const hyperMatch = hyperStr.match(regex);

            try{
                let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
                hyperReplace = hyperReplace.replace(/\s+/g, ',')
                let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
                return`
                <div class="hyper-wrap">
                    <span class="hyper">${hyperImg}${hyperArry[3]}</span>
                    <span class="level">${hyperArry[1]}단계</span>
                    </div>`
            }catch{
                return""
            }
        }







        // 장비 


        function gradeCheck(idx){
            try{
                switch (idx.Grade) {
                    case "고대":
                        return "ultra-background";
                    case "유물":
                        return "rare-background";
                    case "전설":
                        return "common-background";
                    case "영웅":
                        return "hero-background"
                    default:
                        return "unknown";
                }    
            }catch(err){
                console.log(err)
                return "unknown";
            }
        }


        let armorEmpty = `
        <li class="armor-item">
            <div class="img-box radius">
                <img src="https://via.placeholder.com/42x42" alt="정보를 불러오지 못함">
            </div>
            <div class="text-box">
            </div>
        </li>
        `
        let i

        // console.log(armorEquipment)
        // 장비 슬롯 검사
        function equipmentCheck(checkEquip){
            for(i=0 ; i < armorEquipment.length + 1 ; i++){
                try{
                    if(armorEquipment[i].Type == checkEquip){
                        return armorItem(i);
                    }    
                }catch{
                    return armorEmpty
                }
            }
        }



        function progress(idx){
            if(idx <= 9){
                return "common-progressbar"
            }else if(idx <= 29){
                return "uncommon-progressbar"
            }else if(idx <= 69){
                return "rare-progressbar"
            }else if(idx <= 89){
                return "epic-progressbar"
            }else if(idx <= 99){
                return "legendary-progressbar"
            }else if(idx == 100){
                return "mythic-progressbar"
            }else{
                return 'unknown'
            }
        }


        function armorItem(e){



            return`
            <li class="armor-item">
                <div class="img-box radius ${gradeCheck(armorEquipment[e])}">
                    <img src="${armorEquipment[e].Icon}" alt="착용장비프로필">
                    <span class="tier">T${equipTierSet(e)}</span>
                    <span class="progress ${progress(qualityValSet(e))}">${qualityValSet(e)}</span>
                </div>
                <div class="text-box">

                    <div class="name-wrap">
                        <span class="tag">${tagValSet(e)}</span>
                        <span class="armor-name">${armorEquipment[e].Name} ${reforgeValSet(e)}</span>
                    </div>

                    <div class="elixir-wrap">
                        ${elixirVal(e)}
                    </div>
                    ${hyperWrap(e)}
                </div>
            </li>`
        }




        // 장신구

        // 부위별 장신구 확인
        let accessoryEmpty = `
        <li class="accessory-item">
            <div class="img-box radius">
                <img src="https://via.placeholder.com/42" alt="">
            </div>
            <div class="option-box">
            </div>
        </li>`

        function equipmentCheckAcc(checkEquip){
            for(i=0 ; i < armorEquipment.length + 1 ; i++){
                try{
                    if(armorEquipment[i].Type == checkEquip){
                        return accessoryItem(i);
                    }    
                }catch{
                    return accessoryEmpty
                }
            }
        }
        function equipmentCheckAccDouble(checkEquip){
            for(i=0 ; i < armorEquipment.length + 1 ; i++){
                try{
                    if(armorEquipment[i].Type == checkEquip){
                        return accessoryItem(i+1);
                    }    
                }catch{
                    return accessoryEmpty
                }
            }
        }


        // 장신구 티어 확인 함수
        function accessoryTierFnc(e){
            let accessoryTier = JSON.parse(armorEquipment[e].Tooltip);
            let accessoryTierSlice = accessoryTier.Element_001.value.leftStr2.replace(/<[^>]*>|아이템|티어|\s/g, '');

            return(accessoryTierSlice)
        }
                
        function accessoryItem(e){ 


            return`<li class="accessory-item">
                <div class="img-box radius ${gradeCheck(armorEquipment[e])}">
                    <img src="${armorEquipment[e].Icon}" alt="">
                    <span class="tier">T${accessoryTierFnc(e)}</span>
                    <span class="progress ${progress(qualityValSet(e))}">${qualityValSet(e)}</span>
                </div>
                ${accessoryOptionBox(e)}
            </li>`
        }





        // 장신구(버프디버프)
        function accessoryOptionBox(e){
            return`
            <div class="option-box">
                ${accessoryVal(e)}
                ${buffVal(e)}
            </div>`
        }

        // 상중하 판별 필터
        // 악세서리 스텟


        let grindingFilterMtl = grindingFilter.map(item => item.split(':'));
        // console.log(grindingFilterMtl[0])
        function accessoryVal(e){
            let accessoryJson = JSON.parse(armorEquipment[e].Tooltip);
            try{
                let accessoryOptionVal = accessoryJson.Element_005.value.Element_001;
                let accessorySplitVal = accessoryOptionVal.split("<BR>");
                
                // console.log(accessorySplitVal[0].replace(/<[^>]*>/g, ''))
                // console.log(grindingFilterMtl[i][0])

                function qualityCheck(q){
                    if (accessorySplitVal[q]) {
                        for(i=0; i<grindingFilterMtl.length +1; i++){
                            if(accessorySplitVal[q].replace(/<[^>]*>/g, '') === grindingFilterMtl[i][0]){
                                // console.log(grindingFilterMtl[i][1])
                                return grindingFilterMtl[i][1];
                            }
                        }
                    }
                    return null;
                }
                function getGrade(level) {
                    switch(level) {
                      case 'high':
                        return '상';
                      case 'middle':
                        return '중';
                      case 'low':
                        return '하';
                      default:
                        return '알 수 없음';
                    }
                  }
                if(accessorySplitVal[1] == undefined){
                    return`
                    <div class="option-wrap">
                        <span class="option">${accessorySplitVal[0]}</span>
                    </div>`
                }else if(accessorySplitVal[2] == undefined){
                    return`
                    <div class="option-wrap">
                        <span class="option">${accessorySplitVal[0]}</span>
                        <span class="option">${accessorySplitVal[1]}</span>
                    </div>`
                }else{
                    return`
                    <div class="text-box">
                        <div class="grinding-wrap">
                            <span class="quality ${qualityCheck(0)}">${getGrade(qualityCheck(0))}</span>
                            <span class="option">${accessorySplitVal[0]}</span>
                        </div>
                        <div class="grinding-wrap">
                            <span class="quality ${qualityCheck(1)}">${getGrade(qualityCheck(1))}</span>
                            <span class="option">${accessorySplitVal[1]}</span>
                        </div>
                        <div class="grinding-wrap">
                            <span class="quality ${qualityCheck(2)}">${getGrade(qualityCheck(2))}</span>
                            <span class="option">${accessorySplitVal[2]}</span>
                        </div>
                    </div>
                    `

                }
                }catch(err){
                    console.log(err)
                return `<span class="option">${armorEquipment[e].Name}</span>`
            }
        }



        
        // 버프 스텟
        function buffVal(e){
            let buffJson = JSON.parse(armorEquipment[e].Tooltip);

            try{
                let buffVal1 = buffJson.Element_006.value.Element_000.contentStr.Element_000.contentStr.replace(/[\[\]]|<[^>]*>|활성도|[+]/g, '');
                let buffVal2 = buffJson.Element_006.value.Element_000.contentStr.Element_001.contentStr.replace(/[\[\]]|<[^>]*>|활성도|[+]/g, '');
                let buffVal3 = buffJson.Element_006.value.Element_000.contentStr.Element_002.contentStr.replace(/[\[\]]|<[^>]*>|활성도|[+]/g, '');
    
                return`
                <div class="buff-wrap">
                    <span class="buff">${buffVal1}</span>
                    <span class="buff">${buffVal2}</span>
                    <span class="buff minus">${buffVal3}</span>
                </div>
                `
            }catch{
                return``
            }
        }


        // 장비장신구 합치기
        let armorWrap = 
        `<div class="armor-wrap">
            <div class="armor-area shadow">
                <ul class="armor-list">
                    ${equipmentCheck("투구")}
                    ${equipmentCheck("어깨")}
                    ${equipmentCheck("상의")}
                    ${equipmentCheck("하의")}
                    ${equipmentCheck("장갑")}
                    ${equipmentCheck("무기")}
                </ul>
            </div>
            <div class="accessory-area shadow">
                <ul class="accessory-list">
                    ${equipmentCheckAcc("목걸이")}
                    ${equipmentCheckAcc("귀걸이")}
                    ${equipmentCheckAccDouble("귀걸이")}
                    ${equipmentCheckAcc("반지")}
                    ${equipmentCheckAccDouble("반지")}
                    ${equipmentCheckAcc("어빌리티 스톤")}
                </ul>
            </div>
        </div>`


                    
        

        // 아크패시브 타이틀 wrap
        let evolutionImg ='https://pica.korlark.com/2018/obt/assets/images/common/game/ico_arkpassive_evolution.png'
        let enlightenmentImg ='https://pica.korlark.com/2018/obt/assets/images/common/game/ico_arkpassive_enlightenment.png'
        let leapImg ='https://pica.korlark.com/2018/obt/assets/images/common/game/ico_arkpassive_leap.png?502a2419e143bd895b66'
        function arkPassiveValue(e){
            let arkPassiveVal = data.ArkPassive.Points[e].Value
            return arkPassiveVal
        }
        let arkTitleWrap = 
        `
        <div class="ark-title-wrap">
            <div class="title-box evolution">
                <span class="tag">진화</span>
                <span class="title">${arkPassiveValue(0)}</span>
            </div>
            <div class="title-box enlightenment">
                <span class="tag">깨달음</span>
                <span class="title">${arkPassiveValue(1)}</span>
            </div>
            <div class="title-box leap">
                <span class="tag">도약</span>
                <span class="title">${arkPassiveValue(2)}</span>
            </div>
        </div>`


        // 아크패시브 리스트 wrap
        
        // console.log(data.ArkPassive.Effects)
        let enlightenment =[]
        let evolution =[]
        let leap =[]
        data.ArkPassive.Effects.forEach(function(arkArry){
            if(arkArry.Name == 'enlightenment'){
                enlightenment.push(arkArry)
            }else if(arkArry.Name == 'evolution'){
                evolution.push(arkArry)
            }else if(arkArry.Name == 'leap'){
                leap.push(arkArry)
            }
        })
        // console.log(enlightenment)
        // console.log(evolution)
        // console.log(leap)


        
        // // 아크패시브 아이콘, 이름, 

        function arkNameArry(arkName){
            let arkItem =""
            arkName.map(function(arkNameArry){
                // 아크이름 남기기
                let arkName = arkNameArry.Description.replace(/<[^>]*>/g, '').replace(/.*티어 /, '')
                arkItem += 
                `
                <li class="ark-item">
                    <div class="img-box">
                        <span class="tier">${arkNameArry.Description.replace(/.*?(\d)티어.*/, '$1')}</span>
                        <img src="${arkNameArry.Icon}" alt="">
                    </div>
                    <div class="text-box">
                        <span class="name">${arkName}</span>
                    </div>
                </li>
                `
            });
            return arkItem;
        }



        function arkJob(){
            let arkResult =""
            try{
                arkFilter.forEach(function(arry){
                    let arkInput = arry.split(":")[0];
                    let arkOutput = arry.split(":")[1];
                    
                    // console.log(arkInput)
                    if(arkNameArry(enlightenment).includes(arkInput)){
                        arkResult = arkOutput
                        return arkResult
                    }
                })                
            }catch(err){
                console.log(err)
            }
            return arkResult
        }


        let groupProfile = 
        `<div class="group-profile">        
            <div class="img-area shadow">
                <img id="character-image" src="${characterImage}" alt="프로필 이미지">
                <p class="level" id="character-level">Lv.${characterLevel}</p>
                <p class="name" id="character-nickname">${characterNickName}</p>
                <p class="class" id="character-class">${arkJob()}${characterClass}</p>
            </div>
            <ul class="tag-list shadow">
                ${tagItemFnc("서버",serverName)}
                ${tagItemFnc("레벨",itemLevel)}
                ${tagItemFnc("길드",guildName())}
                ${tagItemFnc("칭호",titleName())}
                ${tagItemFnc("영지",townName)}
                ${cardArryFnc()}
            </ul>
        </div>`



        // 아크패시브 리스트 wrap HTML
        let arkListWrap =
        `<div class="ark-list-wrap">
            <ul class="ark-list evolution">
                ${arkNameArry(evolution)}
            </ul>
            <ul class="ark-list enlightenment">
                ${arkNameArry(enlightenment)}
            </ul>
            <ul class="ark-list leap">
                ${arkNameArry(leap)}
            </ul>
        </div>`

        // console.log(arkNameArry(enlightenment))
        

        // 아크패시브
        // let arkArea = 
        // `<div class="ark-area shadow">
        //     ${arkTitleWrap}
        //     ${arkListWrap}
        // </div>`
                
        function arkArea(){
            if(data.ArkPassive.IsArkPassive == true){
                return`
                <div class="ark-area shadow">
                ${arkTitleWrap}
                ${arkListWrap}
                </div>`
            }else{
                return `
                <div class="ark-area shadow">
                <p class="ark-false">아크패시브 비활성화</p>
                </div>`
            }
        }
        
        
        // 장비칸 HTML 합치기
        let groupEquip = 
        `<div class="group-equip">`
        groupEquip += gemArea
        groupEquip += armorWrap
        groupEquip += arkArea()
        groupEquip += '</div>';
        
        
        
        
        
        
        
        // 최종 HTML합치기
        let scInfoHtml;
        scInfoHtml = groupProfile;
        scInfoHtml += groupInfo;
        scInfoHtml += groupEquip;
        
        
        
        // 최종 HTML렌더어링
        document.getElementById("sc-info").innerHTML = scInfoHtml
        
        



        // 스펙포인트 on/off 버튼 실행
        specBtn()
    })
    .catch((error) => console.error('Fetch error:', error))
    .finally(() => {
        isRequesting = false;
    });
}


window.getCharacterProfile = getCharacterProfile;
// 검색시 스크립트 작동
let nickName = document.getElementById("nick-name")
let scInput = document.getElementById("container")
let scInfo = document.querySelector(".sc-info")
let headerInput = document.getElementById("header-input")




nickName.addEventListener("keydown",function(e){
    // console.log(e.code)
    if(e.code === 'Enter'){
        // getCharacterNames()
        
        headerInput.classList.add("on")
        scInput.classList.remove("on")
        nickName.classList.remove("on")
        scInfo.classList.add("on")
        
        setTimeout(getCharacterProfile("nick-name"),1000000)
    }
})
headerInput.addEventListener("keydown",function(e){
    if(e.code === 'Enter'){
        // getCharacterNames()
        
        setTimeout(getCharacterProfile("header-input"),1000000)
    }
})





// 헤더 입력 필드에 이벤트 리스너 추가
headerInput.addEventListener("keydown", handleSearch);







// 검색시 헤더 검색창 띄우기
// let headerBtn = document.getElementById("header-input").classList.add("on")





// 스펙포인트 더보기 버튼
specBtn()
function specBtn(){
    document.getElementById("extra-btn").addEventListener("click",function(){
        let specAreaClass = document.getElementsByClassName("spec-area")[0].classList
        console.log(specAreaClass)
        if(specAreaClass.contains("on")){
            specAreaClass.remove('on')
        }else{
            specAreaClass.add('on')
        }
    })    
}

// export{getCharacterProfile}
