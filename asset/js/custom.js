import {
    keywordList,
    grindingFilter,
    arkFilter,
    bangleJobFilter,
    engravingImg,
    dealerAccessoryFilter,
    elixirFilter,
    cardPointFilter,
    bangleFilter,
} from './filter.js';
import {skeleton} from './skeleton.js';

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

let isRequesting = false;

async function getCharacterProfile(inputName){
    if (isRequesting) {
        return;
    }
    isRequesting = true; 
    let url = 'https://developer-lostark.game.onstove.com/armories/characters/'+document.getElementById(inputName).value
    let options = {
        method: 'GET',
        headers: {
            accept : 'application/json',    
            authorization : 'bearer ' + getNextApiKey()
        }
    };
    fetch(url, options)
    .then((response) => response.json())
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



        // ----------------------------------------------------------------------
        // --------------------------------서포터 함수----------------------------

        let enlightenmentCheck =[]
        let enlightenmentArry = []
        data.ArkPassive.Effects.forEach(function(arkArry){
            if(arkArry.Name == 'enlightenment'){
                enlightenmentCheck.push(arkArry)
            }
        })
        // console.log(enlightenmentCheck)


        function supportArkLeft(arkName){
            let result = []
            arkName.map(function(arkNameArry){
                // 아크이름 남기기
                let arkName = arkNameArry.Description.replace(/<[^>]*>/g, '').replace(/.*티어 /, '')
                enlightenmentArry.push(arkName)
            });
        }
        supportArkLeft(enlightenmentCheck)
        // console.log(enlightenmentArry)

        // 직업명 단축이름 출력
        function supportCheck(){
            let arkResult =""
            try{
                arkFilter.forEach(function(arry){
                    let arkInput = arry.split(":")[0];
                    let arkOutput = arry.split(":")[1];
                    
                    // console.log(arkInput)

                    enlightenmentArry.forEach(function(supportCheckArry){
                        if(supportCheckArry.includes(arkInput)){
                            arkResult = arkOutput
                            return arkResult
                        }
                    })
                })
            }catch(err){
                console.log(err)
            }
            return arkResult
        }

        // 직업명 풀네임 출력
        function jobCheck(){
            let arkResult =""
            try{
                arkFilter.forEach(function(arry){
                    let arkInput = arry.split(":")[0];
                    
                    enlightenmentArry.forEach(function(supportCheckArry){
                        if(supportCheckArry.includes(arkInput)){
                            arkResult = arkInput
                            return arkResult
                        }
                    })
                })
            }catch(err){
                console.log(err)
            }
            return arkResult
        }


        // 3티어 서폿 구분
        function supportLowTierCheck(){
            let result = null
            if(!(data.ArmoryEngraving == null) && !(data.ArmoryEngraving.Effects == null)){
                data.ArmoryEngraving.Effects.forEach(function(engravingArry){
                    let name = engravingArry.Name.replace(/Lv.*/, "").trim()
                    bangleJobFilter.forEach(function(jobArry){
                        if(name == jobArry.job && jobArry.class == "support"){
                            result = "3티어 서폿"
                            return result
                        }
                    })
                })
            }    
            return result
        }

// Lieam
        console.log(supportLowTierCheck())

        if(supportCheck() == "서폿"){
            
        }else if(supportLowTierCheck() == "3티어 서폿"){
            
        }



        // --------------------------------서포터 끗------------------------------
        // ----------------------------------------------------------------------






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

        characterCal(data.ArmoryProfile.CharacterLevel)

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
                        weaponPoint = 153000 + (weaponNum-1580)*800*4
                    }else if(weaponNum == 1735 && !(arry.Grade == "에스더")){
                        // console.log("레벨 1735 에스더 아님")
                        weaponPoint = (153000 + (weaponNum-1580)*800*4)+30000
                    }else if(weaponNum >= 1735 && weaponNum <= 1764){
                        // console.log("1735이상 1764이하 에스더 등급")
                        weaponPoint = (153000 + (weaponNum-1580)*800*4)+50000
                    }
                    else if(weaponNum >= 1765){
                        // console.log("weaponNum >= 1765")
                        weaponPoint = (153000 + (weaponNum-1580)*800*4)+110000
                    }

                }
                return weaponPoint
            })
            return weaponPoint
            
        }
        weaponCal()
        //console.log(weaponCal())


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
                        armorPoint += (153000 + (weaponNum-1580)*800*4)*0.16
                    }    
                }else if(arry.Type == "상의"){
                    if(weaponNum < 1580){
                        // console.log("상의 1580미만")
                        armorPoint += ((weaponNum-50)*100)*0.2
                    }else if(weaponNum >= 1580){
                        // console.log("상의 1580이상")
                        armorPoint += (153000 + (weaponNum-1580)*800*4)*0.16
                    }
                }else if(arry.Type == "하의"){
                    if(weaponNum < 1580){
                        // console.log("하의 1580미만")
                        armorPoint += ((weaponNum-50)*100)*0.2
                    }else if(weaponNum >= 1580){
                        // console.log("하의 1580이상")
                        armorPoint += (153000 + (weaponNum-1580)*800*4)*0.16
                    }
                }else if(arry.Type == "장갑"){
                    if(weaponNum < 1580){
                        // console.log("장갑 1580미만")
                        armorPoint += ((weaponNum-50)*100)*0.2
                    }else if(weaponNum >= 1580){
                        // console.log("장갑 1580이상")
                        armorPoint += (153000 + (weaponNum-1580)*800*4)*0.16
                    }
                }else if(arry.Type == "어깨"){
                    if(weaponNum < 1580){
                        // console.log("어깨 1580미만")
                        armorPoint += ((weaponNum-50)*100)*0.2
                    }else if(weaponNum >= 1580){
                        // console.log("어깨 1580이상")
                        armorPoint += (153000 + (weaponNum-1580)*800*4)*0.16
                    }
                }
                return armorPoint
            })
            return armorPoint
        }
        armorCal()
    //    console.log(armorCal())




        // 아크패시브 최종 포인트
        let arkPoint = 0

        function arkBonus(arkArry,arkName){
            if(arkArry < 72 && arkName == "진화"){
                return arkArry*500
            }else if(arkArry > 71 && arkArry < 84 && arkName == "진화"){
                return arkArry*600 + 50000
            }else if(arkArry < 96 && arkName == "진화"){
                return arkArry*600 + 180000
            }else if(arkArry < 108 && arkName == "진화"){
                return arkArry*600 + 225000
            }else if(arkArry < 120 && arkName == "진화"){
                return arkArry*600 + 270000
            }else if(arkArry < 999 && arkName == "진화"){
                return arkArry*600 + 330000
            }else if(arkArry < 80 && arkName == "깨달음"){
                return arkArry*700
            }else if(arkArry > 79 && arkArry < 88 && arkName == "깨달음"){
                return arkArry*700 + 280000
            }else if(arkArry < 999 && arkName == "깨달음"){
                return arkArry*700 + 330000
            }else if(arkArry < 50 && arkName == "도약"){
                return arkArry*800
            }else if(arkArry > 59 && arkName == "도약"){
                return arkArry*800 + 57000
            }else if(arkArry > 49 && arkName == "도약"){
                return arkArry*800 + 42000
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
                    arkPoint += arkBonus(arry.Value, arry.Name)
                }
            })
            return arkPoint
        }
        if(data.ArkPassive.IsArkPassive == true){
            arkCal()
        }


        // console.log(arkPoint)

        // 악세서리 최종 포인트

        let accessoryPoint = 0;
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

        // 딜러
        function normalTmlDealer(e){
            if(e == "Zlow"|| e == "Zmiddle" || e == "Zhigh"){
                return 0
            }else if(e == "SPhigh"|| e == "Duelhigh"){
                return 55000
            }else if(e =="SPmiddle"|| e == "Duelmiddle"){
                return 33900
            }else if(e == "SPlow"|| e == "Duellow"){
                return 12600
            }else if(e == "PUBhigh"|| e == "DuelPubhigh"){
                return 11000
            }else if(e == "PUBmiddle"|| e == "DuelPubmiddle"){
                return 5500
            }else if(e == "PUBlow"|| e == "DuelPublow"){
                return 2340
            }else{
                return 0
            }
        }
        function spTmlDealer(spVal,pubVal){
            if(spVal == 1 && pubVal == 2){
                return 1000
            }else if(spVal == 2 && pubVal == 0){
                return 3000
            }else if(spVal == 2 && pubVal == 1){
                return 5000
            }else{
                return 0
            }
        }


        // 서폿
        function normalTmlSupport(e){
            if(e == "Zlow"|| e == "Zmiddle" || e == "Zhigh"){
                return 0
            }else if(e == "SupportSPhigh"|| e == "Duelhigh"){
                return 88000
            }else if(e =="SupportSPmiddle"|| e == "Duelmiddle"){
                return 45000
            }else if(e == "SupportSPlow"|| e == "Duellow"){
                return 21000
            }else if(e == "DuelPubhigh"|| e == "Supporthigh"){
                return 19000
            }else if(e == "DuelPubmiddle"|| e == "Supportmiddle"){
                return 9500
            }else if(e == "DuelPublow"|| e == "Supportlow"){
                return 4500
            }else{
                return 0
            }
        }
        function spTmlSupport(spVal,pubVal){
            if(spVal == 1 && pubVal == 2){
                return 1000
            }else if(spVal == 2 && pubVal == 0){
                return 3000
            }else if(spVal == 2 && pubVal == 1){
                return 5000
            }else{
                return 0
            }
        }

       
        if(supportCheck().trim() == "서폿"){ //서포터일 경우
            accessoryGrade.forEach(function(arry, index){
                // console.log("서폿적용중")
                arry.forEach(function(tmlArry){
                    // normalTml(tmlArry)
                    accessoryPoint += normalTmlSupport(tmlArry)
                })
                let spNum = arry.filter((item => item === "SupportSPhigh")).length
                let pubNum = arry.filter(item => item === "Supporthigh" || item === "DuelPubhigh").length
                
                return accessoryPoint += spTmlSupport(spNum,pubNum)
            })
    
        }else{ //딜러일 경우
            accessoryGrade.forEach(function(arry, index){
                arry.forEach(function(tmlArry){
                    accessoryPoint += normalTmlDealer(tmlArry)
                })
                let spNum = arry.filter((item => item === "SPhigh" || item === "Duelhigh")).length
                let pubNum = arry.filter(item => item === "PUBhigh" || item === "DuelPubhigh").length
                
                return accessoryPoint += spTmlDealer(spNum,pubNum)
            })
    
        }





        // console.log(accessoryGrade)
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

        let doubleCheck = []
        let elixirFilterVal
        // console.log(supportCheck())
        if(supportCheck().trim() == "서폿"){ //4티어 서포터일 경우
            function elixirSupportVal(optionGrade,level){ // 옵션 분류명, 레벨
                if((optionGrade == "DuelPub"|| optionGrade == "SupPub") && level == 5){
                    return level*4000+1500
                }else if(optionGrade == "Duelpub"){
                    return level*4000
                }else if(optionGrade == "Sup1"&&level == 5){
                    return level*10500+15000
                }else if(optionGrade == "Sup1"){
                    return level*10500
                }else if(optionGrade == "Sup2"&&level == 5){
                    return level*5500+15000
                }else if(optionGrade == "Sup2"){
                    return level*5500
                }else if(optionGrade == "Sup3"&&level == 5){
                    return level*9300+12500
                }else if(optionGrade == "Sup3"){
                    return level*9300
                }else{
                    return 0
                }
            }

            elixirFilterVal = elixirSupportVal
            doubleCheck = ["선각자","진군","신념"]
            
        }else if(supportLowTierCheck() == "3티어 서폿"){ //3티어 서폿일 경우
            function elixirDealerVal(optionGrade,level){ // 옵션 분류명, 레벨
                if((optionGrade == "DuelPub"|| optionGrade == "SupPub") && level == 5){
                    return level*4000+1500
                }else if(optionGrade == "Duelpub"){
                    return level*4000
                }else if(optionGrade == "Sup1"&&level == 5){
                    return level*10500+15000
                }else if(optionGrade == "Sup1"){
                    return level*10500
                }else if(optionGrade == "Sup2"&&level == 5){
                    return level*5500+15000
                }else if(optionGrade == "Sup2"){
                    return level*5500
                }else if(optionGrade == "Sup3"&&level == 5){
                    return level*9300+12500
                }else if(optionGrade == "Sup3"){
                    return level*9300
                }else{
                    return 0
                }
            }
            
            elixirFilterVal = elixirDealerVal
            doubleCheck = ["선각자","진군","신념"]
            
        }else{ // 딜러일 경우 
            function elixirDealerVal(optionGrade,level){ // 옵션 분류명, 레벨
                if((optionGrade == "pub"|| optionGrade == "DuelPub") && level == 5){
                    return level*4000+1500
                }else if(optionGrade == "pub"|| optionGrade == "DuelPub"){
                    return level*4000
                }else if(optionGrade == "sp"){
                    return level*2500
                }else if(optionGrade == "sp1"&&level == 5){
                    return level*10500+15000
                }else if(optionGrade == "sp1"){
                    return level*10500
                }else if(optionGrade == "sp2"&&level == 5){
                    return level*9300+12500
                }else if(optionGrade == "sp2"){
                    return level*9300
                }else{
                    return 0
                }
            }

            elixirFilterVal = elixirDealerVal
            doubleCheck = ["회심","달인 (","강맹","칼날방패","선봉대","행운"]
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
                }
            })
        })
        // console.log(elixirLevel)


        // 회심,달인 2개 존재시 가산점

        function containsTwoHoesim(data,doubleString) {
            let count = data.filter(item => item.name.includes(doubleString)).length;
            return count === 2;
        }
        
        // console.log(containsTwoHoesim(elixirData)); // true
        doubleCheck.forEach(function(arry){
            if(containsTwoHoesim(elixirData,arry) && elixirLevel >= 50){
                // console.log("레벨합계"+elixirLevel+"가산점 100000")
                elixirPoint += 110000
            }else if(containsTwoHoesim(elixirData,arry) && elixirLevel >= 40){
                // console.log("레벨합계"+elixirLevel+"가산점 105000")
                elixirPoint += 105000
            }else if(containsTwoHoesim(elixirData,arry) && elixirLevel >= 35){
                // console.log("레벨합계"+elixirLevel+"가산점 85000")
                elixirPoint += 85000
            }
        })
        // console.log("엘릭서 최종 점수:"+elixirPoint)



        // 보석 최종점수

        let gemsPoint = 0;
        try{
            data.ArmoryGem.Gems.forEach(function(arry){
                // console.log(arry.Level)
                if(arry.Name.includes("멸화")||arry.Name.includes("홍염")){
                    gemsPoint += arry.Level*3750
                    // console.log("멸화or홍염:"+gemsPoint)
                }else if(arry.Name.includes("겁화")||arry.Name.includes("작열")){
                    gemsPoint += (arry.Level+2)*3750*1.6
                    // console.log("겁화or작열:"+gemsPoint)
                }
                
                // 보석 10레벨 보너스 가산점
                if(arry.Level == 8){
                    // console.log("보석 보너스 가산점")
                    gemsPoint += 23000
                }else if(arry.Level == 9){
                    gemsPoint += 40000
                }else if(arry.Level == 10){
                    gemsPoint += 50500
                }

                // if(arry.Name.includes("10레벨 겁화")||arry.Name.includes("10레벨 작열")){
                //     gemsPoint += 30000
                // }

            })    
        }catch{

        }
        // console.log(gemsPoint)



        // 각인점수 최종점수(비활성화/활성화)
        let setPoint = 0

        let engravingPoint = 0 //각인 점수
        let arkLevel = 0
        // console.log(!(data.ArmoryEngraving == null))
        if(!(data.ArmoryEngraving == null)){
            let arkAble = data.ArmoryEngraving.ArkPassiveEffects
            let arkDisable = data.ArmoryEngraving.Effects
            if(!(arkDisable == null)){//아크패시브 비활성화
                setPoint += 300000
                arkDisable.forEach(function(arry){
                    arkLevel = Number(arry.Name.replace(/\D/g, ''))
                    engravingPoint += arkLevel*11000
                })
            }else if(!(arkAble == null)){//아크패시브 활성화
                arkAble.forEach(function(arry){
                    if(arry.Grade.includes("전설")){
                        engravingPoint += Math.round(97000 * (1.13 ** (arry.Level+1)))
                    }else if(arry.Grade.includes("유물")){
                        engravingPoint += Math.round(126800 * (1.13 ** (arry.Level+1)))
                    }else{
                        engravingPoint += Math.round(10000 * (1.13 ** (arry.Level+1)))
                    }
                })
            }
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
                hyperPoint += Number(hyperArry[3])*1600 + Number(hyperArry[1]*3400)
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
            hyperPoint += 53900
        }
        // 방어구 75성 이상 가산점
        if(hyperArmoryLevel >= 100){
            hyperPoint += 33500
        }else if(hyperArmoryLevel >= 75){
             
            hyperPoint += 20500
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
                    if(isNaN(cardLevel)){
                        cardLevel = 0;
                    }
                    // console.log(cardLevel)
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
                    cardPoint = level*2220
                }else if(cardName.includes(arry.split(":")[0]) && arry.split(":")[1] == 2){
                    cardPoint = level*6500
                }
            })
        }

        // console.log(data.ArmoryCard)
        let cardFilter = ['세 우마르가 오리라',"라제니스의 운명"]
        // let comboCardString 
        // let comboFilter
        if(!(data.ArmoryCard == null)){
            let comboCardString = JSON.stringify(data.ArmoryCard.Effects)
            let comboFilter = comboCardString.includes(cardFilter[0])&&comboCardString.includes(cardFilter[1])
            if(data.ArmoryCard.Effects.length > 1 && comboFilter){
                cardPoint = 195000
            }
        }
        // 특정카드 조합 계산기(복수)

        // console.log(cardPoint)


        // 어빌리티스톤 점수 계산식(아크패시브 활성화/비활성화) 

        let abilityStonePoint = 0;
        let abilityLevel = 0;
        if(!(data.ArmoryEngraving == null)){

            if(!(data.ArmoryEngraving.ArkPassiveEffects == null)){
                abilityStonePoint += abilityStoneCalc()
            }
        }
        
        function abilityStoneCalc(){
            let result = 0
            data.ArmoryEngraving.ArkPassiveEffects.forEach(function(arry){
                if(!(arry.AbilityStoneLevel == null)){

                    if(arry.AbilityStoneLevel == 1){
                        result += 10000
                    }else if(arry.AbilityStoneLevel == 2){
                        result += 15000
                    }else if(arry.AbilityStoneLevel == 3){
                        result += 25000
                    }else if(arry.AbilityStoneLevel == 4){
                        result += 30000
                    }

                    abilityLevel += arry.AbilityStoneLevel
                }
            })
            return result
        }
        if(abilityLevel >= 8){
            abilityStonePoint += 50000
        }else if(abilityLevel >= 7){
            abilityStonePoint += 30000
        }else if(abilityLevel >= 6){
            abilityStonePoint += 20000
        }else if(abilityLevel >= 5){
            abilityStonePoint += 10000
        }

        // console.log(abilityStonePoint)





        // 악세서리 팔찌 가산점 (20240928추가함)
        let banglePoint = 0
        let bangleOptionArry = [];
        let bangeleStatsUse = [];
        let statsPercent = 0
        let bangleSpecialStats = ["힘","민첩","지능"]

        let filterTierCheck

        if(supportCheck().trim() == "서폿" || supportLowTierCheck() == "3티어 서폿"){ //서포터일 경우
            function bangleSupportPoint(tier){
                // 접두사 z = 무효 / Sp = 서폿용 / P = 더 높은 점수 / L = 낮은 점수 /
                if(false){banglePoint += 0}
                else if(tier == "SpPlow1"){banglePoint += 80000}
                else if(tier == "SpPlow2"){banglePoint += 90000}
                else if(tier == "SpPmiddle"){banglePoint += 100000}
                else if(tier == "SpPhigh"){banglePoint += 110000}
                else if(tier == "SpMlow1"){banglePoint += 60000}
                else if(tier == "SpMlow2"){banglePoint += 70000}
                else if(tier == "SpMmiddle"){banglePoint += 90000}
                else if(tier == "SpMhigh"){banglePoint += 98000}
                else if(tier == "SpLlow1"||tier == "DuelPlow1"||tier == "Duellow1"||tier == "DuelLlow1"){banglePoint += 43000}
                else if(tier == "SpLlow2"||tier == "DuelPlow1"||tier == "Duellow1"||tier == "DuelLlow1"){banglePoint += 48000}
                else if(tier == "SpLmiddle"||tier == "DuelPlow1"||tier == "Duelmiddle"||tier == "DuelLlmiddle"){banglePoint += 55000}
                else if(tier == "SpLhigh"||tier == "DuelPlow1"||tier == "Duelhigh"||tier == "DuelLhigh"){banglePoint += 60000}
                else if(tier == "Splow1"){banglePoint += 8000}
                else if(tier == "Splow2"){banglePoint += 10000}
                else if(tier == "Spmiddle"){banglePoint += 12000}
                else if(tier == "Sphigh"){banglePoint += 15000}
                else{banglePoint += 0}
            }
            filterTierCheck = bangleSupportPoint
            bangeleStatsUse = ["특화", "신속"]
            statsPercent = 340

        }else{ // 딜러일 경우 
            function bangleDealerPoint(tier){
                // 접두사 z = 무효 / Sp = 서폿용 / P = 더 높은 점수 / L = 낮은 점수 /
                if(false){banglePoint += 0}
                else if(tier == "Plow1"||tier ==  "Plow1"){banglePoint += 80000}
                else if(tier == "Plow2"||tier ==  "DuelPlow2"){banglePoint += 90000}
                else if(tier == "Pmiddle"||tier ==  "DuelPmiddle"){banglePoint += 100000}
                else if(tier == "Phigh"||tier ==  "DuelPhigh"){banglePoint += 110000}
                else if(tier == "low1"||tier ==  "Duellow1"){banglePoint += 55000}
                else if(tier == "low2"||tier == "Duellow2"){banglePoint += 60000}
                else if(tier == "middle"||tier ==  "Duelmiddle"){banglePoint += 68000}
                else if(tier == "high"||tier ==  "Duelhigh"){banglePoint += 75000}
                else if(tier == "Llow1"||tier ==  "DuelLlow1"){banglePoint += 45000}
                else if(tier == "Llow2"||tier ==  "DuelLlow2"){banglePoint += 50000}
                else if(tier == "Lmiddle"||tier ==  "DuelLmiddle"){banglePoint += 58000}
                else if(tier == "Lhigh"||tier ==  "DuelLhigh"){banglePoint += 62000}
                else{banglePoint += 0}
            }

            filterTierCheck = bangleDealerPoint
            bangeleStatsUse = ["치명", "특화", "신속"];
            statsPercent = 290
        }





        data.ArmoryEquipment.forEach(function(arry){
            if(arry.Type == "팔찌"){
                let bangleTier = JSON.parse(arry.Tooltip).Element_001.value.leftStr2.replace(/<[^>]*>/g, '').replace(/\D/g, '')
                let bangleTool = JSON.parse(arry.Tooltip).Element_004.value.Element_001
                
                // console.log("팔찌내용"+bangleTool)
                bangleTierFnc(bangleTier,bangleTool)
                bangleArryFnc(bangleOptionArry)
            }
        })


        // 팔찌 티어 검사 후 옵션 배열저장
        function bangleTierFnc(bangle,bangleTool){
            if(bangle == 3){
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
                
            }else if(bangle == 4){
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
        // console.log(bangleOptionArry)


        function bangleArryFnc(bangleArry){
            bangleArry.forEach(function(arry,bangleIdx){

                // 팔찌 옵션 상중하에 따른 점수
                bangleFilter.forEach(function(filterArry){

                    if(filterArry.name == arry){
                        if(bangleArry[bangleIdx+1] == filterArry.option){
                            filterTierCheck(filterArry.tier)
                            // console.log(filterArry.tier)
                        }else if(filterArry.option == null){
                            filterTierCheck(filterArry.tier)
                            // console.log(filterArry.tier)
                        }

                    }
                    
                })


                // 치명 특화 신속 스텟 팔찌 점수 부여
                bangeleStatsUse.forEach(function(statsArry) {

                    let regex = new RegExp(`${statsArry} \\+\\d+`);
                    // console.log(statsArry+":"+regex.test(optionArry))
    
                    if(regex.test(arry)){
                        // console.log(arry)
                        let statsNumber = arry.replace(/\D/g, '');
                        banglePoint += statsNumber*statsPercent

                    }
                });
                


                
                bangleSpecialStats.forEach(function(statsArry){
                    let regex = new RegExp(`${statsArry} \\+\\d+`);
                    if(regex.test(arry)){
                        let val = arry.replace(/\D/g, '')
                        // console.log(val)
                        // console.log(Math.round(bangleSpStats(val)))
                        banglePoint += Math.round(bangleJobSpStats(val)) //3티어 힘민지 점수
                        banglePoint += Math.round(bangleSpStats(val)) //4티어 힘민지 점수
                    }
                });
                
                // 직업별 힘,민첩,지능 점수     
                function bangleSpStats(spStatsVal){
                    let result = 0
                    bangleJobFilter.forEach(function(jobArry){
                        
                        if(jobCheck() == jobArry.job && jobArry.tier == 4){
                            let pow = (jobArry.option == "pow")
                            let dex = (jobArry.option == "dex")
                            let int = (jobArry.option == "int")
                            if(pow){
                                console.log(spStatsVal)
                                result = spStatsVal*1.5
                            }else if(dex){
                                result = spStatsVal*1.5
                            }else if(int){
                                result = spStatsVal*1.5
                            }else{
                                result = 0
                            }
                        }else{
                            result = 0
                        }
                    })
                    return result

                }
            })

        }
        
        
        // 3티어 캐릭터 힘,민첩,지능 팔찌점수
        function bangleJobSpStats(spStatsVal){
            if(!(data.ArmoryEngraving == null)&& !(data.ArmoryEngraving.Effects == null)){
                let flag = 0;
                let result = 0
                data.ArmoryEngraving.Effects.forEach(function(engravingArry){
                    let name = engravingArry.Name.replace(/Lv.*/, "").trim()
                    bangleJobFilter.forEach(function(jobArry){
                        if(name == jobArry.job && jobArry.tier == 3 && flag == 0){
                            flag += 1
                            // console.log("각인 직업 : "+jobArry.job)
                            let pow = (jobArry.option == "pow")
                            let dex = (jobArry.option == "dex")
                            let int = (jobArry.option == "int")
                            if(pow){
                                result = spStatsVal*1.5
                            }else if(dex){
                                result = spStatsVal*1.5
                            }else if(int){
                                result = spStatsVal*1.5
                            }else{
                                result = 0
                            }
                        }else{
                            result += 0
                        }
                    })
                })
                return result
            }else {
                return 0;
            }
        }


        // console.log("팔찌점수:"+banglePoint)







        


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
        // console.log("팔찌점수:"+banglePoint)


        specPoint = characterPoint+
                    armorPoint+
                    weaponPoint+
                    arkPoint+
                    accessoryPoint+
                    elixirPoint+
                    gemsPoint+
                    engravingPoint+
                    hyperPoint+
                    cardPoint+
                    abilityStonePoint+
                    setPoint+
                    banglePoint

        //console.log(specPoint+"스펙포인트")


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

        
        
        let arkPassiveEffects = null
        let disableArkPassive = []
        if(!(data.ArmoryEngraving == null)){
            arkPassiveEffects = data.ArmoryEngraving.ArkPassiveEffects
            disableArkPassive = data.ArmoryEngraving.Effects
        }

        function engravingBox(){

            let engravingResult = ""
            if(!(data.ArmoryEngraving == null)){
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
                                    <div class="relic-ico engraving-ico ${arkGradeCheck(arry)}"></div>
                                    <span class="grade ${arkGradeCheck(arry)}">X ${arry.Level}</span>
                                    <span class="engraving-name">${arry.Name}</span>
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
            }else{
                return engravingResult = "각인 미장착"
            }
        }



        // group-info 점수별 등급 아이콘

        let gradeIco = ""
        let gradeInfo = ""

        if(specPoint < 2000000){ //브론즈
            gradeIco="./asset/image/bronze.png"
            gradeInfo = "브론즈 티어"
        }else if(specPoint >= 2000000 && specPoint < 3200000){ //실버
            gradeInfo = "실버 티어"
            gradeIco="./asset/image/silver.png"
        }else if(specPoint >= 3200000 && specPoint < 4200000){ //골드
            gradeInfo = "골드 티어"
            gradeIco="./asset/image/gold.png"
        }else if(specPoint >= 4200000 && specPoint < 5200000){ //다이아
            gradeInfo = "다이아몬드 티어"
            gradeIco="./asset/image/diamond.png"
        }else if(specPoint >= 5200000 && specPoint < 6200000){ //마스터
            gradeInfo = "마스터 티어"
            gradeIco="./asset/image/master.png"
        }else if(specPoint >= 6200000){ //에스더
            gradeInfo = "에스더 티어"
            gradeIco="./asset/image/esther.png"
        }




        // group-info HTML
        let groupInfo = 
        `<div class="group-info">
            <div class="spec-area shadow">
                <p class="title">스펙 포인트</p>
                <div class="tier-box">
                    <img src="${gradeIco}" alt="">
                    <p class="tier-info">${gradeInfo}</p>
                </div>
                <span class="spec-point">${specPoint.toLocaleString()}</span>
                <div class="extra-info">
                    <p class="detail-info">세부정보</p>
                    <p class="text">전투레벨 : ${characterPoint.toLocaleString()}</p>
                    <p class="text">장비 :  ${(weaponPoint+armorPoint).toLocaleString()}</p>
                    <p class="text">아크패시브 :  ${arkPoint.toLocaleString()}</p>
                    <p class="text">T4 악세서리 :  ${accessoryPoint.toLocaleString()}</p>
                    <p class="text">세트장비 :  ${setPoint.toLocaleString()}</p>
                    <p class="text">엘릭서 :  ${elixirPoint.toLocaleString()}</p>
                    <p class="text">보석 : ${gemsPoint.toLocaleString()}</p>
                    <p class="text">각인 : ${engravingPoint.toLocaleString()}</p>
                    <p class="text">초월 : ${hyperPoint.toLocaleString()}</p>
                    <p class="text">팔찌 : ${banglePoint.toLocaleString()}</p>
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
                        return nullCheck(gemImage,true,"./asset/image/skeleton-img.png")//위의gemImage[e].Icon가 없을경우 실행됨
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
                return armorEquipment[e].Grade
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
            <div class="img-box radius skeleton">
                <img src="./asset/image/skeleton-img.png" alt="정보를 불러오지 못함">
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
            }else if(idx == "고대"){
                return "mythic-progressbar"
            }else if(idx == "유물"){
                return "relics-progressbar"
            }else if(idx == "영웅"){
                return "legendary-progressbar"
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




        // 장비 최하단 초월 엘릭서 요약 표시

        let elixirDouble = ["회심","달인 (","강맹","칼날방패","선봉대","행운","선각자","진군","신념"]
        let elixirDoubleVal

        function elixirDoubleCheck(){
            let result
            elixirDouble.forEach(function(elixirDoubleArry){
                result = elixirData.filter(item => item.name.includes(elixirDoubleArry)).length;
                if(result >= 2){
                    elixirDoubleVal = elixirDoubleArry
                }else{
                }
            })
        }
        elixirDoubleCheck()


        function nameWrap(){
            if(!(elixirDoubleVal == undefined) && elixirLevel >= 35 && elixirLevel < 40){
                return `
                    <div class="name-wrap">
                        ${elixirDoubleVal.replace(/\(/g, "").trim()} 1단계
                    </div>`
            }else if(!(elixirDoubleVal == undefined) && elixirLevel >= 40){
                return `
                    <div class="name-wrap">
                        ${elixirDoubleVal.replace(/\(/g, "").trim()} 2단계
                    </div>`
    
            }else{
                return `
                    <div class="name-wrap">
                        비활성화
                    </div>`
            }    
        }

        
        let hyperSum = hyperWeaponLevel+hyperArmoryLevel

        function elixirProgressGrade(){
            if(elixirLevel < 35){
                return "common"
            }else if(elixirLevel < 40){
                return "epic"
            }else if(elixirLevel < 50){
                return "legendary"
            }else if(elixirLevel < 999){
                return "mythic"
            }
        }
        
        function hyperProgressGrade(){
            if(hyperSum < 100){
                return "common"
            }else if(hyperSum < 120){
                return "epic"
            }else if(hyperSum < 126){
                return "legendary"
            }else if(hyperSum < 999){
                return "mythic"
            }
        }


        let armorEtc = `
            <li class="armor-item">
                <div class="img-box radius ultra-background">
                    <img src="./asset/image/elixir.png" alt="">
                    <span class="progress ${elixirProgressGrade()}-progressbar">${elixirLevel}</span>
                </div>
                <div class="text-box">
                    <div class="name-wrap">
                        엘릭서
                    </div>
                    ${nameWrap()}
                </div>
                <div class="img-box radius ultra-background">
                    <img src="./asset/image/hyper.png" alt="">
                    <span class="progress ${hyperProgressGrade()}-progressbar">${hyperSum}</span>
                </div>
                <div class="text-box">
                    <div class="name-wrap">
                        초월
                    </div>
                    <div class="name-wrap">
                        평균 ${(hyperSum/6).toFixed(1)}단계
                    </div>
                </div>
            </li>`
        ;





        // 장신구

        // 부위별 장신구 확인
        let accessoryEmpty = `
        <li class="accessory-item">
            <div class="img-box radius skeleton">
                <img src="./asset/image/skeleton-img.png" alt="">
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


            return`
            <li class="accessory-item">
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



        // 팔찌 HTML

        let bangleStats = ["치명","특화","신속","제압","인내","숙련"]
        let bangleOptionWrap = "" //.option-wrap
        let bangleOption = "" //.option
        let bangleTmlWrap = "" //.grinding-wrap
        let bangleTextbox = "" //.text-box

        
        function bangleCheck(){
            let result = ""
            data.ArmoryEquipment.forEach(function(arry,idx){
                if(arry.Type == "팔찌"){
                    let bangleTier = JSON.parse(arry.Tooltip).Element_001.value.leftStr2.replace(/<[^>]*>/g, '').replace(/\D/g, '')
                    result = 
                    `<li class="accessory-item">
                        <div class="img-box radius ${gradeCheck(data.ArmoryEquipment[idx])}">
                            <img src="${arry.Icon}" alt="">
                            <span class="tier">T${bangleTier}</span>
                            <span class="progress ${progressColor(arry.Grade)}-progressbar">${arry.Grade}</span>
                        </div>
                        <div class="option-box">
                            ${bangleOptionWrap}
                            ${bangleTextbox}
                        </div>
                    </li>`
                }
            })
            return result
        }
        // console.log(bangleOptionArry)

        bangleOptionArry.forEach(function(optionArry,optionIndex){

            // 일반 스텟 표시
            bangleStats.forEach(function(statsArry){
                let regex = new RegExp(`${statsArry} \\+\\d+`);
                // console.log(statsArry+":"+regex.test(optionArry))

                if(regex.test(optionArry)){
                    bangleOption += `<span class="option">${optionArry.match(regex)[0]}</span>`
                    bangleOptionWrap = `
                    <div class="option-wrap">
                        ${bangleOption}
                    </div>`
                }

            })

            // 특수 스텟 표시
            bangleSpecialStats.forEach(function(specialStatsArry){
                let regex = new RegExp(`${specialStatsArry} \\+\\d+`);
                
                if(regex.test(optionArry)){
                    let tml ="", tmlClass ="", val = optionArry.replace(/\D/g, '')
                    if(val >= 6400 && val <= 12160){
                        tml = "하", tmlClass ="low"
                    }else if(val > 12160 && val <= 14080){
                        tml = "중", tmlClass ="middle"
                    }else if(val > 14080 && val <= 16000){
                        tml = "상", tmlClass ="high"
                    }else if(val >= 0){
                        tml = "하", tmlClass ="low"
                    }
                    console.log()
                    bangleTmlWrap += `
                    <div class="grinding-wrap">
                        <span class="quality ${tmlClass}">
                            ${tml}
                        </span>
                        <span class="option">
                            ${optionArry}
                        </span>
                    </div>
                    `;
        
                    bangleTextbox = `
                    <div class="text-box">
                        ${bangleTmlWrap}
                    </div>
                    `;

                }
            })




            // 문장형 옵션 표시
            bangleFilter.forEach(function(filterArry){
                if(optionArry == filterArry.name && bangleOptionArry[optionIndex+1] == filterArry.option){

                    
                    bangleTmlWrap += `
                    <div class="grinding-wrap">
                        <span class="quality ${filterArry.tier.replace(/[0-9]/g, '')}">
                            ${bangleTierCheck(filterArry.tier)}
                        </span>
                        <span class="option">
                            ${bangleFilterInitialCheck(filterArry.initial,filterArry.name)}
                        </span>
                    </div>
                    `;
        
                    bangleTextbox = `
                    <div class="text-box">
                        ${bangleTmlWrap}
                    </div>
                    `;
                }else if(optionArry == filterArry.name && filterArry.option == null){
                    bangleTmlWrap += `
                    <div class="grinding-wrap">
                        <span class="quality ${filterArry.tier.replace(/[0-9]/g, '')}">
                            ${bangleTierCheck(filterArry.tier)}
                        </span>
                        <span class="option">
                            ${bangleFilterInitialCheck(filterArry.initial,filterArry.option)}
                        </span>
                    </div>
                    `;
        
                    bangleTextbox = `
                    <div class="text-box">
                        ${bangleTmlWrap}
                    </div>
                    `;

                }

            })



        })
        // console.log(bangleTextbox)

        function bangleFilterNullCheck(option){
            if(!(option == null)){
                return option
            }else{
                return ""
            }
        }
        // 팔찌 상중하 축약어 표시하기
        function bangleFilterInitialCheck(initial,name){
            if(!(initial == undefined)){
                return initial
            }else{
                return name
            }
        }



        // 팔찌 상중하 체크
        function bangleTierCheck(tier){
            // 접두사 z = 무효 / Sp = 서폿용 / P = 더 높은 점수 / L = 낮은 점수 
            


            let tierName = {
                low1: "하",
                low2: "하",
                middle: "중",
                high: "상",

                zlow1:"하",
                zlow2:"하",
                zmiddle:"중",
                zhigh:"상",

                Duellow1:"하",
                Duellow2:"하",
                Duelmiddle:"중",
                Duelhigh:"상",

                SpPlow1:"하",
                SpPlow2:"하",
                SpPmiddle:"중",
                SpPhigh:"상",

                SpMlow1:"하",
                SpMlow2:"하",
                SpMmiddle:"중",
                SpMhigh:"상",

                SpLlow1:"하",
                SpLlow2:"하",
                SpLmiddle:"중",
                SpLhigh:"상",

                Splow1:"하",
                Splow2:"하",
                Spmiddle:"중",
                Sphigh:"상",

                Plow1:"하",
                Plow2:"하",
                Pmiddle:"중",
                Phigh:"상",

                Llow1:"하",
                Llow2:"하",
                Lmiddle:"중",
                Lhigh:"상",
                
                DuelPlow1:"하",
                DuelPlow2:"하",
                DuelPmiddle:"중",
                DuelPhigh:"상",

                Duellow1:"하",
                Duellow2:"하",
                Duelmiddle:"중",
                Duelhigh:"상",

                DuelLlow1:"하",
                DuelLlow2:"하",
                DuelLmiddle:"중",
                DuelLhigh:"상",
            };
            return tierName[tier]
        }

        // 유물 고대 띠 이미지
        function progressColor(tier){
            if(tier == "고대"){
                return "mythic"
            }else if(tier == "유물"){
                return "relics"
            }else if(tier == "영웅"){
                return "legendary"
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
                    ${armorEtc}
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
                    ${bangleCheck()}
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




        // 모바일 검색영역

        
        
        
        


        // group-profile HTML
        let groupProfile = 
        `
        <div class="group-profile">        
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
let mainInput = document.getElementById("nick-name")
let scInput = document.getElementById("container")
let scInfo = document.querySelector(".sc-info")
let headerInput = document.getElementById("header-input")
let mobileInput = document.getElementsByClassName("sc-mobile-search")[0]
let loadingFlag = 0;

mainInput.addEventListener("keydown",function(e){
    // console.log(e.code)
    if(e.keyCode == 13 && loadingFlag == 0){
        // getCharacterNames()
        
        headerInput.classList.add("on")
        scInput.classList.remove("on")
        mainInput.classList.remove("on")
        scInfo.classList.add("on")
        mobileInput.classList.add("on")
        loadingFlag = 1;
        setTimeout(function() {
            getCharacterProfile("nick-name");
            loadingFlag = 0;
            console.log(loadingFlag)
        }, 1000);

    }
    return false
})
headerInput.addEventListener("keydown",function(e){
    if(e.keyCode == 13 && loadingFlag == 0){
        // getCharacterNames()
        console.log("검색중")
        
        document.getElementById("sc-info").innerHTML = skeleton
        loadingFlag = 1;
        setTimeout(function() {
            loadingFlag = 0;
            getCharacterProfile("header-input");
        }, 1000);
    }
    return false
})

mobileInput.addEventListener("keydown",function(e){
    if(e.keyCode == 13 && loadingFlag == 0){
        document.getElementById("sc-info").innerHTML = skeleton
        loadingFlag = 1;
        setTimeout(function() {
            loadingFlag = 0;
            getCharacterProfile('mobile-input');
        }, 1000);
    }
    return false
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
