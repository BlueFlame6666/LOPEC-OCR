
import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import {
    keywordList,
    grindingFilter,
    arkFilter,
    bangleJobFilter,
    engravingImg,
    engravingCalFilter,
    dealerAccessoryFilter,
    calAccessoryFilter,
    elixirFilter,
    cardPointFilter,
    bangleFilter,
    engravingCheckFilter,
    stoneCheckFilter,
    elixirCalFilter,
    arkCalFilter,
    engravingCheckFilterLowTier,
    classGemFilter,
} from './filter.js';

// const express = require('express')
// const cors = require('cors')
// const fetch = require('node-fetch');


const app = express()


// const corsOptions = {
//     origin: ['https://your-domain.com/', 'http://localhost:3000/'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// };

// app.use(cors(corsOptions));
   

app.use(cors())



app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', function (req, res) {
    res.send('Hello World')
})
app.get('/:value', function (req, res) {

    let { value } = req.params



    const url = `https://developer-lostark.game.onstove.com/armories/characters/${value}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LOSTARK_API_KEY}`
        }
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                console.log('Status:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json().then(data => ({
                status: response.status,
                data: data
            }));
        })
        .then(({ status, data }) => {

            // console.log('Status:', status);
            console.log( "response 데이터 : " + data)




            // 3티어 스펙포인트
            let lowTierSpecPointObj = {
                characterPoint: 0,
                armorPoint: 0,
                weaponPoint: 0,
                arkPoint: 0,
                accessoryPoint: 0,
                elixirPoint: 0,
                gemsPoint: 0,
                engravingPoint: 0,
                hyperPoint: 0,
                cardPoint: 0,
                abilityStonePoint: 0,
                setPoint: 0,
                banglePoint: 0,
                specPoint: 0,
            }

            // 4티어 스펙포인트
            let highTierSpecPointObj = {


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


                // 서폿 최종 스펙포인트
                supportSpecPoint: 0,
                // 딜러 최종 스펙포인트
                dealerlastFinalValue: 0,

                // 통합된 최종 스펙포인트
                completeSpecPoint: 0,
            }


            // 등급 아이콘
            let gradeObj = {
                ico: "image",
                info: "info",
                og: "",
                lowTier: "",
            }


            // 2차전직명
            let userSecondClass = "";




            // search.php 모든 html
            let searchHtml = '';



        
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
                if(arkArry.Name == '깨달음'){
                    enlightenmentCheck.push(arkArry)
                }
            })
            // console.log(enlightenmentArry)
    
    
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
    
    
            // 3티어 캐릭터 각인 추출
            let engArryLowTier = []
            if(!data.ArkPassive.IsArkPassive && !(data.ArmoryEngraving == null)){
                data.ArmoryEngraving.Effects.forEach(function(realEng){
                    engArryLowTier.push(realEng.Name.replace(/Lv\. \d+/g, '').trim())
                })
            }
            engArryLowTier = engArryLowTier.reverse() //낮은 레벨 순서로 저장됨
            // console.log(engArryLowTier)
    
            // 직업명 단축이름 출력
            function supportCheck(){
                let arkResult =""
                try{
                    arkFilter.forEach(function(arry){
                        let arkInput = arry.name;
                        let arkOutput = arry.initial;
                        
                        // console.log(arkInput)
    
                        enlightenmentArry.forEach(function(supportCheckArry){
                            if(supportCheckArry.includes(arkInput)&&data.ArkPassive.IsArkPassive){
                                arkResult = arkOutput
                                return arkResult
                            }
                        })
    
                        engArryLowTier.forEach(function(realEng){
                            if(realEng == arkInput){
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
    
    
            userSecondClass = supportCheck()
            
            // console.log(supportCheck())
    
            // 직업명 풀네임 출력
            function jobCheck(){
                let arkResult =""
                try{
                    arkFilter.forEach(function(arry){
                        let arkInput = arry.name;
                        
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
    
    
            if(supportCheck() == "서폿"){
                
            }else if(supportLowTierCheck() == "3티어 서폿"){
                
            }
    
    
    
            // --------------------------------서포터 끗------------------------------
            // ----------------------------------------------------------------------
    
    
    
    
    
    
            // --아크패시브 활성화 딜러 계산식--
    
            console.log(data)
            // console.log(data.ArmoryProfile.CharacterName)
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
            //  console.log(armorCal())
    
    
    
    
    
    
    
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
                    return arkArry*800 + 77000
                }else if(arkArry > 49 && arkName == "도약"){
                    return arkArry*800 + 52000
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
                
                
                const matchedKeywordsWithContext = keywordList.flatMap(keyword => {
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
    
            function containsTwoWord(data,doubleString) {
                let count = data.filter(item => item.name.includes(doubleString)).length;
                return count === 2;
            }
            
    
            // console.log(containsTwoWord(elixirData)); // true
            doubleCheck.forEach(function(arry){
                if(containsTwoWord(elixirData,arry) && elixirLevel >= 50){
                    // console.log("레벨합계"+elixirLevel+"가산점 100000")
                    elixirPoint += 110000
                }else if(containsTwoWord(elixirData,arry) && elixirLevel >= 40){
                    // console.log("레벨합계"+elixirLevel+"가산점 105000")
                    elixirPoint += 105000
                }else if(containsTwoWord(elixirData,arry) && elixirLevel >= 35){
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
                    if(arry.Level == 6){
                        // console.log("보석 보너스 가산점")
                        gemsPoint += 4000
                    }else if(arry.Level == 7){
                        gemsPoint += 19750
                    }else if(arry.Level == 8){
                        gemsPoint += 22000
                    }else if(arry.Level == 9){
                        gemsPoint += 40000
                    }else if(arry.Level == 10){
                        gemsPoint += 52500
                    }
    
                    if(arry.Name.includes("10레벨 겁화")||arry.Name.includes("10레벨 작열")){
                        gemsPoint += 5000
                    }
    
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
            let bangleSpecialStats = ["힘","민첩","지능","체력"]
    
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
                    else if(tier == "Flow1"){banglePoint += 11000}
                    else if(tier == "Flow2"){banglePoint += 13000}
                    else if(tier == "Fmiddle"){banglePoint += 15000}
                    else if(tier == "Fhigh"){banglePoint += 18000}
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
    
    
    
            // 3티어 스펙포인트 최종값
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
            
    
            // ---------------------------NEW 계산식 Ver 2.0---------------------------
            // ---------------------------NEW 계산식 Ver 2.0---------------------------
            // ---------------------------NEW 계산식 Ver 2.0---------------------------
    
    
    
    
            
    
            let defaultObj = {
                attackPow:0,
                baseAttackPow:0,
                criticalChancePer:0,
                addDamagePer:0,
                criticalDamagePer:200,
                moveSpeed:14,
                atkSpeed:14,
                skillCool:0,
                special:0,
                haste:0,
                crit:0,
                weaponAtk:0,
                hp:0,
            }
            
            data.ArmoryProfile.Stats.forEach(function(statsArry){
                if(statsArry.Type == "공격력"){
                    defaultObj.attackPow = Number(statsArry.Value)
                }else if(statsArry.Type == "치명"){
                    let regex = />(\d+(\.\d+)?)%/;
                    defaultObj.criticalChancePer = Number(statsArry.Tooltip[0].match(regex)[1])
                    defaultObj.crit = Number(statsArry.Value)
                }else if(statsArry.Type == "신속"){
                    let atkMoveSpeed = statsArry.Tooltip[0].match(/>(\d+(\.\d+)?)%<\/font>/)[1]
                    let skillCool = statsArry.Tooltip[2].match(/>(\d+(\.\d+)?)%<\/font>/)[1]
                    defaultObj.atkSpeed += Number(atkMoveSpeed)
                    defaultObj.moveSpeed += Number(atkMoveSpeed)
                    defaultObj.skillCool = Number(skillCool)
                    defaultObj.haste = Number(statsArry.Value)
                }else if(statsArry.Type == "특화"){
                    defaultObj.special = Number(statsArry.Value)
                }else if(statsArry.Type == "최대 생명력"){
                    defaultObj.hp = Number(statsArry.Value)
                }
            })
    
            data.ArmoryEquipment.forEach(function(equip){
                if( equip.Type == "무기" ){
                    let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue
                    defaultObj.addDamagePer += 10 + 0.002 * (quality)**2
                }
            })
    
            // 무기 공격력
            data.ArmoryEquipment.forEach(function(weapon){
                if( weapon.Type == "무기" ){
                    const regex = /무기 공격력\s*\+(\d+)/;
                    defaultObj.weaponAtk = Number(weapon.Tooltip.match(regex)[1])
                }
            })
    
    
            // baseAttckPow(기본 공격력 stats)
            data.ArmoryProfile.Stats.forEach(function(stats){
                if( stats.Type == "공격력" ){
                    const regex = />(\d+)</
                    defaultObj.baseAttackPow += Number( stats.Tooltip[1].match(regex)[1] )
                }
            })
    
    
    
            // 직업별 기본점수
            let jobObj = {
                criticalChancePer:0,
                criticalDamagePer:0,
                moveSpeed:0,
                atkSpeed:0,
                skillCool:0,
                atkPer:0,
                stigmaPer:0,
                
                finalDamagePer:1,
                criFinalDamagePer:1,
            }
    
            arkFilter.forEach(function(filterArry){
    
                let plusArry = []
                let perArry = []
    
                objExtrudeFnc(jobObj,plusArry,perArry)
    
                plusArry.forEach(function(plusAttr){
                    if(filterArry.initial == supportCheck() && !(filterArry[plusAttr] == undefined)){
                        jobObj[plusAttr] = filterArry[plusAttr]
                    }
                })
                perArry.forEach(function(percent){
                    if(filterArry.initial == supportCheck() && !(filterArry[percent] == undefined)){
                        jobObj[percent] = (filterArry[percent]/100)+1
                    }
    
                })
    
            })
    
            // console.log(jobObj)
    
            function objExtrudeFnc(object,plus,percent){
                Object.keys(object).forEach(function(objAttr){
                    if (object[objAttr] == 0) {
                        plus.push(objAttr);
                    } else if (object[objAttr] == 1) {
                        percent.push(objAttr);
                    }
                })
            }
            
        
            // 악세서리 옵션별 
            // let accAddDamagePer = 0 // 추가 피해 %  삭제예정
            // let accFinalDamagePer = 1 //적에게 주는 피해가 %
            // let accWeaponAtkPlus = 0 //무기 공격력 +
            // let accWeaponAtkPer = 1 // 무기 공격력 %
            // let accAtkPlus = 0 // 공격력 +
            // let accAtkPer = 0 // 공격력 %   
            // let accCriticalChancePer = 0 // 치명타 적중률 %
            // let accCriticalDamagePer = 0 // 치명타 피해 %
            // let accStigmaPer = 0 // 낙인력 %
            // let accAtkBuff = 0 // 아군 공격력 강화 %
            // let accDamageBuffPer = 1 // 아군 피해량 강화 %
    
            
            let accObj = {
                addDamagePer:0,
                finalDamagePer:1,
                weaponAtkPlus:0,
                weaponAtkPer:0,
                atkPlus:0,
                atkPer:0,
                criticalChancePer:0,
                criticalDamagePer:0,
                stigmaPer:0,
                atkBuff:0,
                damageBuff:0,
    
                enlightPoint:0,
    
                carePower:1,
            }
    
    
            function equimentCalPoint(){
                data.ArmoryEquipment.forEach(function(equipArry){
                    let accOption
                    try{
                        accOption = JSON.parse(equipArry.Tooltip).Element_005.value.Element_001
                        accessoryFilterFnc(accOption)
                    }
                    catch{}
                    
                })
            }
    
            
            equimentCalPoint()
            function accessoryFilterFnc(accessoryOption){
                calAccessoryFilter.forEach(function(filterArry){
                    let optionCheck = accessoryOption.includes(filterArry.name)
                    if(optionCheck&&filterArry.attr=="AddDamagePer"){ //추가 피해 %
                        accObj.addDamagePer += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="FinalDamagePer"){ //에게 주는 피해가 %
                        accObj.finalDamagePer += (filterArry.value/100)
                    }else if(optionCheck&&filterArry.attr=="WeaponAtkPlus"){ //무기 공격력 +
                        accObj.weaponAtkPlus += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="WeaponAtkPer"){ //무기 공격력 %
                        accObj.weaponAtkPer += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="AtkPlus"){ //공격력 +
                        accObj.atkPlus += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="AtkPer"){ //공격력 %   
                        accObj.atkPer += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="CriticalChancePer"){ //치명타 적중률 %
                        accObj.criticalChancePer += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="CriticalDamagePer"){ //치명타 피해 %
                        accObj.criticalDamagePer += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="StigmaPer"){ //낙인력 %
                        accObj.stigmaPer += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="AtkBuff"){ //아군 공격력 강화 %
                        accObj.atkBuff += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="DamageBuff"){ //아군 피해량 강화 %
                        accObj.damageBuff += filterArry.value
                    }else if(optionCheck&&filterArry.attr=="CarePower"){ // 아군 보호막, 회복 강화 %
                        accObj.carePower += filterArry.value
                    }
                })
            }
    
            accObj.finalDamagePer *= ((accObj.criticalChancePer * 0.684)/100+1)
            //console.log("치적 적용"+accObj.finalDamagePer)
            accObj.finalDamagePer *= ((accObj.criticalDamagePer * 0.3625)/100+1)
            //console.log (accObj.criticalDamagePer)
            //console.log("치적,치피 적용"+accObj.finalDamagePer)
            accObj.finalDamagePer *= ((accObj.weaponAtkPer * 0.4989)/100+1)
            //console.log("치적,치피,무공퍼 적용" + accObj.finalDamagePer)
            accObj.finalDamagePer *= ((accObj.atkPer * 0.9246)/100+1)
            //console.log(accObj)
    
    
            // 악세 깨달음 포인트
            data.ArmoryEquipment.forEach(function(arry){
                let regex = /"([^"]*)"/g;
                let matches = [];
                let match;
                if(/목걸이|귀걸이|반지/.test(arry.Type)){
                    while ((match = regex.exec(arry.Tooltip)) !== null) {             // ""사이값 추출
                        matches.push(match[1]);
                    }
                    let enlightStr = matches.filter(item => /깨달음/.test(item));     // 깨달음 포인트값 추출
                    accObj.enlightPoint += Number(enlightStr[0]?.match(/\d+/)[0]);
                }
            })
    
    
            // 팔찌
            let bangleObj = {
                atkPlus : 0,
                atkPer : 0,
                weaponAtkPlus : 0,
                criticalDamagePer : 0,
                criticalChancePer : 0,
                addDamagePer : 0,
                moveSpeed : 0,
                atkSpeed : 0,
                skillCool : 0,
                atkBuff : 0,
                atkBuffPlus : 0,
                damageBuff : 0,
                
                crit : 0 ,
                special : 0,
                haste : 0,
    
                str : 0,
                dex : 0,
                int : 0,
    
                weaponAtkPer : 1,
                finalDamagePer : 1,
                finalDamagePerEff : 1,
                criFinalDamagePer : 1,
            }
    
            bangleOptionArry.forEach(function(realBangleArry,realIdx){
    
                let plusArry = ['atkPlus','atkPer','weaponAtkPlus','criticalDamagePer','criticalChancePer','addDamagePer','moveSpeed','atkSpeed', "skillCool", 'atkBuff', 'damageBuff', 'atkBuffPlus']
                let perArry = ['weaponAtkPer','finalDamagePer','criFinalDamagePer','finalDamagePerEff']
                let statsArry = ["치명:crit","특화:special","신속:haste","힘:str","민첩:dex","지능:int"];
    
                statsArry.forEach(function(stats){
                    let regex = new RegExp(`${stats.split(":")[0]}\\s*\\+\\s*(\\d+)`);
                    if(regex.test(realBangleArry)){
    
                        // console.log(realBangleArry.match(regex)[1])
                        bangleObj[stats.split(":")[1]] += Number(realBangleArry.match(regex)[1]);
    
                    }
    
                })
    
    
                bangleFilter.forEach(function(filterArry){
    
                    if(realBangleArry == filterArry.name && bangleOptionArry[realIdx + 1] == filterArry.option && filterArry.secondCheck == null ){
                        typeCheck(filterArry)
    
                    }else if(realBangleArry == filterArry.name && filterArry.option == null && filterArry.secondCheck == null ){
                        typeCheck(filterArry)
                        
                    }else if(realBangleArry == filterArry.name && bangleOptionArry[realIdx + 1] == filterArry.option && bangleOptionArry[realIdx + 2] != filterArry.secondCheck){
                        typeCheck(filterArry)
    
                    }
    
                })
                function typeCheck(validValue){
                    plusArry.forEach(function(value){
                        if(!(validValue[value] == undefined)){
    
                            bangleObj[value] += validValue[value]
                            // console.log(value+" : "+bangleObj[value])
                        }
                    })
                    perArry.forEach(function(value){
                        if(!(validValue[value] == undefined)){
                            // console.log(value+" : "+ bangleObj[value])
                            bangleObj[value] *= (validValue[value]/100)+1
                        }
                    })
                }
            })
            // console.log(bangleObj)
    
            // 초월
            let hyperSum = hyperWeaponLevel+hyperArmoryLevel
    
    
    
            let hyperObj = {
                atkPlus : 0,
                weaponAtkPlus : 0,
                atkBuff : 0,
                stigmaPer : 0,
    
    
                str : 0,
                dex : 0,
                int : 0,
                
                finalDamagePer : 1,
    
            }
    
    
            // hyperObj객체에 무언가 영향을 미침 원인 해명 필요
            data.ArmoryEquipment.forEach(function(equip,equipIdx){
                
                // function hyperInfoFnc(e ,parts){
                    let hyperStr = data.ArmoryEquipment[equipIdx].Tooltip;
                    
                    const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
                    const hyperMatch = hyperStr.match(regex);
                    
                    try{
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
                    }catch{}
                // }
    
                // hyperInfoFnc(equipIdx, equip.Type)
            })
            
    
            function hyperStageCalc(e){
                let hyperStr = data.ArmoryEquipment[e].Tooltip;
    
    
                const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
                const hyperMatch = hyperStr.match(regex);
    
                try{
                    let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
                    hyperReplace = hyperReplace.replace(/\s+/g, ',')
                    let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
                    return Number(hyperArry[1])
                    
                    // return Number(hyperArry[3])*3750 + Number(hyperArry[1]*7500)
                    
                }catch{
                    return 0
                }
            }
    
    
            let armoryListArry  = ["투구", "상의", "하의", "장갑", "어깨"]
            data.ArmoryEquipment.forEach(function(equip, equipIdx){
                if(equip.Type == "무기"){
    
                    let n = hyperStageCalc(equipIdx)
                    hyperObj.weaponAtkPlus += 280*n + 20*(n**2)
                    // console.log(equip.Type + "초월 단계 " + n )
                    // console.log("무공 초월 "+ ( 280*n + 20*(n**2) ))
                }
                armoryListArry.forEach(function(armoryList){
                    if(equip.Type == armoryList){
    
                        let n = hyperStageCalc(equipIdx)
                        // console.log(equip.Type + "초월 단계 " + n )
                        // console.log(equip.Type+" 초월 "+" : "+ ( 560*n + 40*(n**2) ))
                        hyperObj.str += 560*n + 40*(n**2)
                        hyperObj.dex += 560*n + 40*(n**2)
                        hyperObj.int += 560*n + 40*(n**2)
                    }
                })
            })
    
    
    
    
            // 투구 N성
            function headStarCal(value, parts){
                let check = (parts == "투구")
                if(value >= 20 && check){
                    
                    hyperObj.atkBuff += hyperSum*0.04
                    hyperObj.atkPlus += hyperSum*6
                    hyperObj.weaponAtkPlus += hyperSum*14
                    hyperObj.str += hyperSum*55
                    hyperObj.dex += hyperSum*55
                    hyperObj.int += hyperSum*55
                }else if(value >= 15 && check){
                    hyperObj.atkBuff += hyperSum*0.03
                    hyperObj.weaponAtkPlus += hyperSum*14
                    hyperObj.str += hyperSum*55
                    hyperObj.dex += hyperSum*55
                    hyperObj.int += hyperSum*55
                }else if(value >= 10 && check){
                    hyperObj.atkBuff += hyperSum*0.02
                    hyperObj.str += hyperSum*55
                    hyperObj.dex += hyperSum*55
                    hyperObj.int += hyperSum*55
                }else if(value >= 5 && check){
                    atkBuff += hyperSum*0.01
                }
            }
            
            // 어깨 N성
            function shoulderStarCal(value, parts){
                let check = (parts == "어깨")
                if(value >= 20 && check){
                    hyperObj.atkBuff += 3 
                    hyperObj.weaponAtkPlus += 3600
                    
                }else if(value >= 15 && check){
                    hyperObj.atkBuff += 2
                    hyperObj.weaponAtkPlus += 2400
                }else if(value >= 10 && check){
                    hyperObj.atkBuff += 1
                    hyperObj.weaponAtkPlus += 1200
                }else if(value >= 5 && check){
                    hyperObj.atkBuff += 1
                    hyperObj.weaponAtkPlus += 1200
                }
            }
            // 상의 N성
            function shirtStarCal(value, parts){
                let check = (parts == "상의")
                if(value >= 20 && check){
                    hyperObj.weaponAtkPlus += 7200
                }else if(value >= 15 && check){
                    hyperObj.weaponAtkPlus += 4000
                }else if(value >= 10 && check){
                    hyperObj.weaponAtkPlus += 2000
                }else if(value >= 5 && check){
                    hyperObj.weaponAtkPlus += 2000
                }
            }
            // 하의 N성
            function pantsStarCal(value, parts){
                let check = (parts == "하의")
                if(value >= 20 && check){
                    hyperObj.atkBuff += 6
                    hyperObj.finalDamagePer *= (1.5/100) + 1
                }else if(value >= 15 && check){
                    hyperObj.atkBuff += 3
                }else if(value >= 10 && check){
                    hyperObj.atkBuff += 1.5
                    
                }
            }
            // 하의 N성
            function gloveStarCal(value, parts){
                let check = (parts == "장갑")
                if(value >= 20 && check){
                    hyperObj.str += 12600
                    hyperObj.dex += 12600
                    hyperObj.int += 12600
                    hyperObj.atkBuff += 3
                }else if(value >= 15 && check){
                    hyperObj.str += 8400
                    hyperObj.dex += 8400
                    hyperObj.int += 8400
                    hyperObj.atkBuff += 2
                }else if(value >= 10 && check){
                    hyperObj.str += 4200
                    hyperObj.dex += 4200
                    hyperObj.int += 4200
                    hyperObj.atkBuff += 1
                }else if(value >= 5 && check){
                    hyperObj.str += 4200
                    hyperObj.dex += 4200
                    hyperObj.int += 4200
                    hyperObj.atkBuff += 1
                }
            }
            // 무기 N성
            function weaponStarCal(value, parts){
                let check = (parts == "무기")
                if(value >= 20 && check){
                    hyperObj.atkPlus += 3525
                    hyperObj.stigmaPer += 8
                    hyperObj.atkBuff += 2
                }else if(value >= 15 && check){
                    hyperObj.atkPlus += 2400
                    hyperObj.stigmaPer += 4
                    hyperObj.atkBuff += 2
                }else if(value >= 10 && check){
                    hyperObj.atkPlus += 1600
                    hyperObj.stigmaPer += 2
                    hyperObj.atkBuff += 2
                }else if(value >= 5 && check){
                    hyperObj.atkPlus += 800
                    hyperObj.stigmaPer += 2
                }
            }
    
    
    
            // 투구, 상의, 하의, 장갑, 어깨 힘민지 구하기
            function armorStatus(){
                let result = 0;
                data.ArmoryEquipment.forEach(function(armor){
    
                    if( /^(투구|상의|하의|장갑|어깨|목걸이|귀걸이|반지|)$/.test(armor.Type) ){
    
                        
                        let firstExtract = armor.Tooltip.match(/>([^<]+)</g).map(match => match.replace(/[><]/g, ''))
                        let secondExtract = firstExtract.filter(item => item.match(/^(힘|민첩|지능) \+\d+$/));
                        let thirdExtract = secondExtract[0].match(/\d+/)[0]
                        result += Number(thirdExtract)
    
                    }
                    
    
                })
                return result
    
            }
            
    
    
            // 각인
    
            // 4티어 딜러 각인(그냥각인 예정)
            // finalDamagePer:적에게 주는 피해 , criticalChancePer:치명타 적중률, criticalDamage:치명타 피해량, atkPer: 공격력
    
            let engObj = {
                finalDamagePer:1,
                criticalChancePer:0,
                criticalDamagePer:0,
                atkPer:0,
                atkSpeed:0,
                moveSpeed:0,
                engBonusPer:1,
    
                carePower:1,
                utilityPower:1,
            }
    
    
            // 4티어 각인 모든 옵션 값 계산(무효옵션 하단 제거)
            engravingCheckFilter.forEach(function(checkArry){
                if(!(data.ArmoryEngraving == null) &&!(data.ArmoryEngraving.ArkPassiveEffects == null)){
                    data.ArmoryEngraving.ArkPassiveEffects.forEach(function(realEngArry){
                        if(checkArry.name == realEngArry.Name && checkArry.grade == realEngArry.Grade && checkArry.level == realEngArry.Level ){
        
                            
                            engCalMinus(checkArry.name, checkArry.finalDamagePer, checkArry.criticalChancePer, checkArry.criticalDamagePer, checkArry.atkPer, checkArry.atkSpeed, checkArry.moveSpeed, checkArry.carePower, checkArry.utilityPower, checkArry.engBonusPer )
                            
                            engObj.finalDamagePer = (engObj.finalDamagePer * (checkArry.finalDamagePer/100+1));
                            engObj.engBonusPer = (engObj.engBonusPer * (checkArry.engBonusPer/100+1));
                            engObj.criticalChancePer = (engObj.criticalChancePer + checkArry.criticalChancePer);
                            engObj.criticalDamagePer = (engObj.criticalDamagePer + checkArry.criticalDamagePer);
                            engObj.atkPer= (engObj.atkPer + checkArry.atkPer);
                            engObj.atkSpeed = (engObj.atkSpeed + checkArry.atkSpeed);
                            engObj.moveSpeed = (engObj.moveSpeed + checkArry.moveSpeed);
                            engObj.carePower = (engObj.carePower + checkArry.carePower);
                            
                            // console.log("------------------"+realEngArry.Name+"----------------")
                            // console.log("engFinalDamagePer : "+engFinalDamagePer)
                            // console.log("engCriticalChancePer : "+engCriticalChancePer)
                            // console.log("engCriticalDamagePer : "+engCriticalDamagePer)
                            // console.log("engAtkPer : "+engAtkPer)
        
                            stoneCalc(realEngArry.Name, checkArry.finalDamagePer)
                        }
                    })    
                }
    
                
            })
            // 무효옵션 값 제거4티어만 해당
            function engCalMinus(name,finalDamagePer,criticalChancePer,criticalDamagePer,atkPer){
                engravingCalFilter.forEach(function(FilterArry){
                    if(FilterArry.job == supportCheck()){
                        FilterArry.block.forEach(function(blockArry){
                            if(blockArry == name){
                                // console.log("무효옵션 : "+name)
                                engObj.finalDamagePer = (engObj.finalDamagePer / (finalDamagePer/100+1));
                                engObj.criticalChancePer = (engObj.criticalChancePer - criticalChancePer);
                                engObj.criticalDamagePer = (engObj.criticalDamagePer - criticalDamagePer);
                                engObj.atkPer = (engObj.atkPer - atkPer);
                            }
                        })
                    }    
                })
            }
    
    
    
            
            
            // 3티어 각인
            if( !data.ArkPassive.IsArkPassive ){
    
                let plusArry = []
                let perArry = []
                objExtrudeFnc(engObj,plusArry,perArry)
    
    
                data.ArmoryEngraving.Effects.forEach(function(lowEng){
                    engravingCheckFilterLowTier.forEach(function(filter){
    
                        let [, name, level] = lowEng.Name.match(/(.*)\sLv\.\s(\d+)/); //이름 레벨 분리
                        let result = {
                            name: name.trim(),
                            level: Number(level)
                        };
                        
                        if(result.name == filter.name && result.level == filter.level){
                            engCalMinusLowTier(result, filter, plusArry, perArry)
                            plusArry.forEach(function(validValue){
                                engObj[validValue] += filter[validValue]
                            })
                            perArry.forEach(function(validValue){
                                engObj[validValue] *= (filter[validValue]/100) + 1
                            })
                            
                        }
                    })
                })
            }
    
            // 무효옵션 값 제거 3티어
            function engCalMinusLowTier(realEng,filterEng,plusArry,perArry){
    
                engravingCalFilter.forEach(function(filter){
                    if(filter.job == supportCheck()){
                        filter.block.forEach(function(blockName){
                            if( blockName == realEng.name && realEng.name == filterEng.name ){
                                plusArry.forEach(function(plusName){
                                    // console.log(filterEng.name)
                                    // console.log(plusName)
                                    // console.log(-filterEng[plusName])
                                    engObj[plusName] -= filterEng[plusName]
                                })
                                perArry.forEach(function(perName){
                                    // console.log(filterEng.name)
                                    // console.log(perName)
                                    // console.log(-filterEng[perName])
                                    engObj[perName] /= (filterEng[perName]/100) + 1
    
                                })
                            }
                        })
                    }
                })
            }
    
    
            // 어빌리티스톤(곱연산 제거 후 곱연산+어빌리티스톤 적용)
            function stoneCalc(name, minusVal){
                function notZero(num){
                    if(num == 0){
                        return 1;
                    }else{
                        return  num/100 +1
                    }
                }
                data.ArmoryEngraving.ArkPassiveEffects.forEach(function(stoneArry){
                    stoneCheckFilter.forEach(function(filterArry){
        
                        if(stoneArry.AbilityStoneLevel == filterArry.level && stoneArry.Name == filterArry.name && stoneArry.Name == name){
                            engObj.finalDamagePer = (engObj.finalDamagePer)/notZero(minusVal) //퐁트라이커기준 저주받은 인형(돌맹이) 제거값
                            // console.log(stoneArry.Name+" 고유값 : "+notZero(minusVal))
                            // console.log(stoneArry.Name+" 제거된 값 : "+engFinalDamagePer)
                            // console.log("돌맹이 고유 값 : "+filterArry.finalDamagePer/100)
                            
                            // engObj.finalDamagePer = parseFloat(engObj.finalDamagePer).toFixed(4)
                            
    
    
                            engObj.finalDamagePer = (engObj.finalDamagePer * (notZero(minusVal) + filterArry.finalDamagePer / 100));
                            engObj.engBonusPer = (engObj.engBonusPer * (notZero(minusVal) + filterArry.engBonusPer / 100));
                            engObj.criticalChancePer = (engObj.criticalChancePer + filterArry.criticalChancePer);
                            engObj.criticalDamagePer = (engObj.criticalDamagePer + filterArry.criticalDamagePer);
                            engObj.atkPer = (engObj.atkPer + filterArry.atkPer);
    
                            engObj.atkSpeed = (engObj.atkSpeed + filterArry.atkSpeed);
                            engObj.moveSpeed = (engObj.moveSpeed + filterArry.moveSpeed);
    
                            // 유얼마하앍브레이커
    
                            // console.log("-----------------------"+stoneArry.Name+" : 돌맹이"+"---------------------")
                            // console.log("engFinalDamagePer : "+engFinalDamagePer)
                            // console.log("engCriticalChancePer : "+engCriticalChancePer)
                            // console.log("engCriticalDamagePer : "+engCriticalDamagePer)
                            // console.log("engAtkPer : "+engAtkPer)
                            
                        }
                    })
        
                })    
            }
    
            // 엘릭서
    
            let elixirObj = {
                atkPlus:0,
                atkBuff:0,
                weaponAtkPlus:0,
                criticalDamagePer:0,
                criticalChancePer:0,
                criFinalDamagePer:1,
                addDamagePer:0,
                atkPer:0,
                finalDamagePer:1,
                carePower:0,
                str:0,
                dex:0,
                int:0,
            }
    
    
            elixirData.forEach(function(realElixir){
                // console.log(realElixir.name)
                
                elixirCalFilter.forEach(function(filterArry){
                    if(realElixir.name == filterArry.name && !(filterArry.atkPlus == undefined)){
    
                        elixirObj.atkPlus += filterArry.atkPlus[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirAtkPlus)
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.weaponAtkPlus == undefined)){
    
                        elixirObj.weaponAtkPlus += filterArry.weaponAtkPlus[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirWeaponAtkPlus)
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.criticalDamage == undefined)){
    
                        elixirObj.criticalDamagePer += filterArry.criticalDamagePer[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirCriticalDamage)
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.addDamagePer == undefined)){
    
                        elixirObj.addDamagePer += filterArry.addDamagePer[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirAddDamagePer)
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.atkPer == undefined)){
    
                        elixirObj.atkPer += filterArry.atkPer[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + elixirAtkPer)
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.finalDamagePer == undefined)){
                        // console.log(realElixir.name)
    
                        elixirObj.finalDamagePer *= filterArry.finalDamagePer[realElixir.level - 1]/100 + 1
                        // console.log(realElixir.name+" : " + elixirFinalDamagePer)
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.str == undefined)){
    
                        elixirObj.str += filterArry.str[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + filterArry.stats[realElixir.level - 1])
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.dex == undefined)){
    
                        elixirObj.dex += filterArry.dex[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + filterArry.dex[realElixir.level - 1])
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.int == undefined)){
    
                        elixirObj.int += filterArry.int[realElixir.level - 1]
                        // console.log(realElixir.name+" : " + filterArry.stats[realElixir.level - 1])
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.atkBuff == undefined)){
    
                        elixirObj.atkBuff += filterArry.atkBuff[realElixir.level - 1]
    
                    }else if(realElixir.name == filterArry.name && !(filterArry.carePower == undefined)){
    
                        elixirObj.carePower += filterArry.carePower[realElixir.level - 1]
                    }
    
                })
            })
    
            elixirCalFilter.forEach(function(arr){
                
                // console.log("> 추가 피해 " == arr.name && !(arr.finalDamagePer == undefined))
                // console.log(arr.name)
                // console.log(arr.finalDamagePer)
            })
    
    
            // 더블엘릭서 N단계별 점수
            // let doubleElixirArry = ["회심","달인 (","강맹","칼날방패","선봉대"]
            // elixirData
            // containsTwoWord(data,doubleString)
            // elixirLevel
    
    
    
            function doubleElixir(){
                if(containsTwoWord(elixirData,"회심") && elixirLevel >= 40 ){
                    elixirObj.criFinalDamagePer *= 1.12
                    elixirObj.finalDamagePer *= 1.12
                }else if(containsTwoWord(elixirData,"회심") && elixirLevel >= 35 ){
                    elixirObj.criFinalDamagePer *= 1.06
                    elixirObj.finalDamagePer *= 1.06
                }else if(containsTwoWord(elixirData,"달인 (") && elixirLevel >= 40 ){
                    elixirObj.criticalChancePer += 7
                    elixirObj.finalDamagePer *= 1.12
                }else if(containsTwoWord(elixirData,"달인 (") && elixirLevel >= 35 ){
                    elixirObj.criticalChancePer += 7
                    elixirObj.finalDamagePer *= 1.06
                }else if(containsTwoWord(elixirData,"강맹") && elixirLevel >= 40 ){
                    elixirObj.finalDamagePer *= 1.08
                }else if(containsTwoWord(elixirData,"강맹") && elixirLevel >= 35 ){
                    elixirObj.finalDamagePer *= 1.04
                }else if(containsTwoWord(elixirData,"칼날방패") && elixirLevel >= 40 ){
                    elixirObj.finalDamagePer *= 1.08
                }else if(containsTwoWord(elixirData,"칼날방패") && elixirLevel >= 35 ){
                    elixirObj.finalDamagePer *= 1.04
                }else if(containsTwoWord(elixirData,"선봉대") && elixirLevel >= 40 ){
                    defaultObj.attackPow *= 1.03
                    elixirObj.finalDamagePer *= 1.12
                }else if(containsTwoWord(elixirData,"선봉대") && elixirLevel >= 35 ){
                    defaultObj.attackPow *= 1.03
                    elixirObj.finalDamagePer *= 1.06
                }else if(containsTwoWord(elixirData,"선각자") && elixirLevel >= 40 ){
                    elixirObj.atkBuff += 14
                }else if(containsTwoWord(elixirData,"선각자") && elixirLevel >= 35 ){
                    elixirObj.atkBuff += 8
                }else if(containsTwoWord(elixirData,"신념") && elixirLevel >= 40 ){
                    elixirObj.atkBuff += 14
                }else if(containsTwoWord(elixirData,"신념") && elixirLevel >= 35 ){
                    elixirObj.atkBuff += 8
                }else if(containsTwoWord(elixirData,"진군") && elixirLevel >= 40 ){
                    elixirObj.atkBuff += 6
                }else if(containsTwoWord(elixirData,"진군") && elixirLevel >= 35 ){
                    elixirObj.atkBuff += 0
                }
            }
            doubleElixir()
    
    
            // console.log(elixirObj)
    
            let gemsCool = 0;
            let gemsCoolCount = 0;
            
    
            if(!(data.ArmoryGem.Gems == null)){
                data.ArmoryGem.Gems.forEach(function(arry){
                    if(arry.Name.includes("10레벨 작열")){
                        gemsCool += 24
                        gemsCoolCount += 1
                    }else if(arry.Name.includes("9레벨 작열")){
                        gemsCool += 22
                        gemsCoolCount += 1
                    }else if(arry.Name.includes("8레벨 작열")||arry.Name.includes("10레벨 홍염")){
                        gemsCool += 20
                        gemsCoolCount += 1
                    }else if(arry.Name.includes("7레벨 작열")||arry.Name.includes("9레벨 홍염")){
                        gemsCool += 18
                        gemsCoolCount += 1
                    }else if(arry.Name.includes("6레벨 작열")||arry.Name.includes("8레벨 홍염")){
                        gemsCool += 16
                        gemsCoolCount += 1
                    }else if(arry.Name.includes("5레벨 작열")||arry.Name.includes("7레벨 홍염")){
                        gemsCool += 14
                        gemsCoolCount += 1
                    }else if(arry.Name.includes("4레벨 작열")||arry.Name.includes("6레벨 홍염")){
                        gemsCool += 12
                        gemsCoolCount += 1
                    }else if(arry.Name.includes("3레벨 작열")||arry.Name.includes("5레벨 홍염")){
                        gemsCool += 10
                        gemsCoolCount += 1
                    }else if(arry.Name.includes("2레벨 작열")||arry.Name.includes("4레벨 홍염")){
                        gemsCool += 8
                        gesmCoolCount += 1
                    }else if(arry.Name.includes("1레벨 작열")||arry.Name.includes("3레벨 홍염")){
                        gemsCool += 6
                        gemsCoolCount += 1
                    }
                })
            }else{
                gemsCool = 1
                gemsCoolCount = 1
            }
            // console.log(gemsCool)
            let gemsCoolAvg = ((gemsCool / gemsCoolCount)).toFixed(1)
            
    
    
            // 아크패시브
    
            let arkPassiveArry = [];
            let arkObj = {
                skillCool:0,
                evolutionDamage:0,
                enlightenmentDamage:0,
                leapDamage:0,
                criticalChancePer:0,
                moveSpeed:0,
                atkSpeed:0,
                stigmaPer:0,
                criticalDamagePer:0,
                evolutionBuff:0,
                enlightenmentBuff:0,
                weaponAtk:1,
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
            
            arkPassiveArry.forEach(function(ark){
                arkCalFilter.forEach(function(filter){
                    if(ark.name == filter.name && ark.level == filter.level){
                        arkAttrCheck(filter)
                    }
                })
            })
    
            function arkAttrCheck(validValue){
                let arkAttr = ['skillCool', 'evolutionDamage', 'criticalChancePer', 'moveSpeed', 'atkSpeed', 'stigmaPer', 'criticalDamagePer','evolutionBuff']
                arkAttr.forEach(function(attrArry){
                    if(!(validValue[attrArry] == undefined) && data.ArkPassive.IsArkPassive){
                        arkObj[attrArry] += validValue[attrArry];
                    }
                })    
            }
    
            let criticalChanceResult = (defaultObj.criticalChancePer + jobObj.criticalChancePer + engObj.criticalChancePer + accObj.criticalChancePer + bangleObj.criticalChancePer + arkObj.criticalChancePer + elixirObj.criticalChancePer) // 치명타 적중률
            let atkSpeedResult = (defaultObj.atkSpeed + jobObj.atkSpeed + engObj.atkSpeed + bangleObj.atkSpeed + arkObj.atkSpeed) // 최종 공속
            let moveSpeedResult = (defaultObj.moveSpeed + jobObj.moveSpeed + engObj.moveSpeed + bangleObj.moveSpeed + arkObj.moveSpeed) // 최종 이속
    
    
    
            // 뭉툭한 가시
            let evolutionArry = []
            data.ArkPassive.Effects.forEach(function(arkArry){
                const regex = /<FONT.*?>(.*?)<\/FONT>/g;
                let match;
    
                if(arkArry.Name == 'evolution'){
                    while ((match = regex.exec(arkArry.Description)) !== null) {
                        const text = match[1];
                        const levelMatch = text.match(/(.*) Lv\.(\d+)/);
                        if (levelMatch) {
                            const name = levelMatch[1];
                            const level = parseInt(levelMatch[2], 10);
                            evolutionArry.push({ name, level });
                          }
                      }
                }
            })
            
    
            // 치명타 적중률 100% 이상시 100% 고정
            if( !evolutionOverCritical() ){
                criticalChanceResult = Math.min(criticalChanceResult,100);
            }  
            
            function evolutionOverCritical(){
    
                let check = false;
                for (let i = 0; i < evolutionArry.length; i++) {
                    if (evolutionArry[i].name === "뭉툭한 가시") {
                        check = true;
                        return check
                    }
                }
    
            }
    
            let spikeDamage = 0
            evolutionArry.forEach(function(evolution){
                if(evolution.name == "뭉툭한 가시" && evolution.level == 1){
    
                    let overcritical = Math.max(criticalChanceResult-80, 0);
                    criticalChanceResult = Math.min(criticalChanceResult, 80);
                    spikeDamage = Math.min(7.5+overcritical*1.2, 50)
    
    
                }else if(evolution.name == "뭉툭한 가시" && evolution.level == 2){
                    
                    let overcritical = Math.max(criticalChanceResult-80, 0);  //오버 치적
                    criticalChanceResult = Math.min(criticalChanceResult, 80);
                    spikeDamage = Math.min(15+overcritical*1.4, 70)
    
                }
    
    
                if(evolution.name == "음속 돌파" && evolution.level == 1){
    
                    let mStone = {
                        damage:0,
                        atkSpeed:0,
                        moveSpeed:0,
                    }
    
                    mStone.atkSpeed = atkSpeedResult
                    mStone.moveSpeed = moveSpeedResult
                    mStone.damage += mStone.atkSpeed * 0.05 + mStone.moveSpeed * 0.05
                    
                    if (atkSpeedResult > 40 && moveSpeedResult > 40 ){
                        
                        let atkOverSpeed = atkSpeedResult-40
                        let moveOverSpeed = moveSpeedResult-40
                        mStone.damage += atkOverSpeed*0.1 + moveOverSpeed*0.1 + 4
                        
                    }
                    mStone.damage = Math.min(mStone.damage, 12)
                    
                    
                    
                    
                }else if(evolution.name == "음속 돌파" && evolution.level == 2){
                    
                    
                    let mStone = {
                        damage:0,
                        atkSpeed:0,
                        moveSpeed:0,
                    }
                    
                    mStone.atkSpeed = atkSpeedResult
                    mStone.moveSpeed = moveSpeedResult
                    mStone.damage += mStone.atkSpeed * 0.1 + mStone.moveSpeed * 0.1
                    
                    if (atkSpeedResult > 40 && moveSpeedResult > 40 ){
                        
                        let atkOverSpeed = atkSpeedResult-40
                        let moveOverSpeed = moveSpeedResult-40
                        mStone.damage += atkOverSpeed*0.2 + moveOverSpeed*0.2 + 8
                        
                    }
                    mStone.damage = Math.min(mStone.damage, 24)
    
                    
                }
            })
    
    
            function arkPassiveValue(e){
                let arkPassiveVal = data.ArkPassive.Points[e].Value
                return arkPassiveVal
            }
    
    
    
            if(arkPassiveValue(0) >= 120){ // arkPassiveValue(0) == 진화수치
    
                arkObj.evolutionDamage += 1.45
    
            }else if(arkPassiveValue(0) >= 105){
    
                arkObj.evolutionDamage += 1.35
    
            }else if(arkPassiveValue(0) >= 90){
    
                arkObj.evolutionDamage += 1.30
    
            }else if(arkPassiveValue(0) >= 80){
    
                arkObj.evolutionDamage += 1.25
    
            }else if(arkPassiveValue(0) >= 70){
    
                arkObj.evolutionDamage += 1.20
    
            }else if(arkPassiveValue(0) >= 60){
    
                arkObj.evolutionDamage += 1.15
                
            }else if(arkPassiveValue(0) >= 50){
    
                arkObj.evolutionDamage += 1.10
    
            }else if(arkPassiveValue(0) >= 40){
    
                arkObj.evolutionDamage += 1
            }
            
            
            
    
            
            // enlightenmentArry
            if(arkPassiveValue(1) >= 100){ // arkPassiveValue(1) == 깨달음수치
    
                arkObj.enlightenmentDamage += 1.42
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 98){
    
                arkObj.enlightenmentDamage += 1.40
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 97){
    
                arkObj.enlightenmentDamage += 1.37
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 96){
    
                arkObj.enlightenmentDamage += 1.37
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 95){
    
                arkObj.enlightenmentDamage += 1.36
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 94){
    
                arkObj.enlightenmentDamage += 1.36
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 93){
    
                arkObj.enlightenmentDamage += 1.35
                arkObj.enlightenmentBuff += 1.33
            
            }else if(arkPassiveValue(1) >= 92){
    
                arkObj.enlightenmentDamage += 1.35
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 90){
    
                arkObj.enlightenmentDamage += 1.34
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 88){
    
                arkObj.enlightenmentDamage += 1.33
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 86){
    
                arkObj.enlightenmentDamage += 1.28
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 84){
    
                arkObj.enlightenmentDamage += 1.27
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 82){
    
                arkObj.enlightenmentDamage += 1.26
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 80){
    
                arkObj.enlightenmentDamage += 1.25
                arkObj.enlightenmentBuff += 1.33
    
            }else if(arkPassiveValue(1) >= 78){
    
                arkObj.enlightenmentDamage += 1.18
                arkObj.enlightenmentBuff += 1.32
    
            }else if(arkPassiveValue(1) >= 76){
    
                arkObj.enlightenmentDamage += 1.17
                arkObj.enlightenmentBuff += 1.31
    
            }else if(arkPassiveValue(1) >= 74){
    
                arkObj.enlightenmentDamage += 1.16
                arkObj.enlightenmentBuff += 1.30
    
            }else if(arkPassiveValue(1) >= 72){
    
                arkObj.enlightenmentDamage += 1.15
                arkObj.enlightenmentBuff += 1.29
    
            }else if(arkPassiveValue(1) >= 64){
    
                arkObj.enlightenmentDamage += 1.13
                arkObj.enlightenmentBuff += 1.28
    
            }else if(arkPassiveValue(1) >= 56){
    
                arkObj.enlightenmentDamage += 1.125
                arkObj.enlightenmentBuff += 1.27
    
            }else if(arkPassiveValue(1) >= 48){
    
                arkObj.enlightenmentDamage += 1.12
                arkObj.enlightenmentBuff += 1.26
    
            }else if(arkPassiveValue(1) >= 40){
    
                arkObj.enlightenmentDamage += 1.115
                arkObj.enlightenmentBuff += 1.25
    
            }else if(arkPassiveValue(1) >= 32){
    
                arkObj.enlightenmentDamage += 1.11
                arkObj.enlightenmentBuff += 1.24
    
            }else if(arkPassiveValue(1) >= 24){
    
                arkObj.enlightenmentDamage += 1.10
                arkObj.enlightenmentBuff += 1.23
    
            }else{
                arkObj.enlightenmentDamage += 1
            }
    
    
            if(arkPassiveValue(2) >= 70){ // arkPassiveValue(2) == 도약 수치
    
                arkObj.leapDamage += 1.15
    
            }else if(arkPassiveValue(2) >= 68){
    
                arkObj.leapDamage += 1.14
    
            }else if(arkPassiveValue(2) >= 66){
    
                arkObj.leapDamage += 1.13
    
            }else if(arkPassiveValue(2) >= 64){
    
                arkObj.leapDamage += 1.12
    
            }else if(arkPassiveValue(2) >= 62){
    
                arkObj.leapDamage += 1.11
    
            }else if(arkPassiveValue(2) >= 60){
    
                arkObj.leapDamage += 1.10
    
            }else if(arkPassiveValue(2) >= 50){
    
                arkObj.leapDamage += 1.05
    
            }else if(arkPassiveValue(2) >= 40){
    
                arkObj.leapDamage += 1.03
    
            }else{
                arkObj.leapDamage += 1
            }
    
    
    
    
    
            let gemObj = {
                atkBuff:0,
                damageBuff:0,
            }
    
    
    
            // 보석4종 레벨별 비율
            let gemPerObj = [
                {name:"겁화",level1:8, level2:12, level3:16, level4:20, level5:24, level6:28, level7:32, level8:36, level9:40, level10:44 },
                {name:"멸화",level1:3, level2:6, level3:9, level4:12, level5:15, level6:18, level7:21, level8:24, level9:30, level10:40 },
                {name:"홍염",level1:2, level2:4, level3:6, level4:8, level5:10, level6:12, level7:14, level8:16, level9:18, level10:20 },
                {name:"작열",level1:6, level2:8, level3:10, level4:12, level5:14, level6:16, level7:18, level8:20, level9:22, level10:24 },
            ]
            
    
            
    
            let gemSkillArry = [];
            let specialClass;
    
            // 유저가 착용중인 보석,스킬 배열로 만들기
    
            if(data.ArmoryGem.Gems != null){
                data.ArmoryGem.Gems.forEach(function(gem){
                    
                    data.ArmoryProfile.CharacterClassName
        
                    let regex = />([^<]*)</g;
                    let match;
                    let results = [];
                    while ((match = regex.exec(gem.Tooltip)) !== null) {
                        results.push(match[1]);
                    }
        
        
                    results.forEach(function(toolTip, idx){
    
                        toolTip = toolTip.replace(/"/g, '');
    
                        if(toolTip.includes(data.ArmoryProfile.CharacterClassName) && /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")){
        
                            let etcGemValue = results[idx+2].substring(0, results[idx+2].indexOf('"'))
                            let gemName;
                            let level = null;
                            if(results[1].match(/홍염|작열|멸화|겁화/) != null){
                                gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                                level = Number(results[1].match(/(\d+)레벨/)[1])
                            }else{
                                gemName = "기타보석"
                            }
                            // let obj = { name: results[idx+1], gem: gemName, level : level};
                            let obj = { skill: results[idx+1], name: gemName, level : level};
                            gemSkillArry.push(obj)
        
                        }else if( !(toolTip.includes(data.ArmoryProfile.CharacterClassName)) &&  /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")){  // 자신의 직업이 아닌 보석을 장착중인 경우
    
                            console.log(toolTip)
                            let gemName;
                            let level = null;
                            if(results[1].match(/홍염|작열|멸화|겁화/) != null){
                                gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                                level = Number(results[1].match(/(\d+)레벨/)[1])
                            }else{
                                gemName = "기타보석"
                            }
                            let obj = { skill: "직업보석이 아닙니다", name: gemName, level : level};
                            gemSkillArry.push(obj)
    
                        }
        
                    })
        
                })
        
            }
    
    
            // console.log(gemSkillArry)
    
    
            if(true){
    
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
                function classCheck(className){
                    return supportCheck() == className;
                }
    
    
    
                if( classCheck("전태") && skillCheck(gemSkillArry, "버스트 캐넌", dmg) ){
                    specialClass = "버캐 채용 전태";
                }else if( classCheck("세맥") && !skillCheck(gemSkillArry, "환영격", dmg)  ){
                    specialClass = "5멸 세맥";
                }else if( classCheck("핸건") && skillCheck(gemSkillArry, "데스파이어", dmg)  ){
                    specialClass = "7멸 핸건";
                }else if( classCheck("포강") && skillCheck(gemSkillArry, "에너지 필드", per)  ){
                    specialClass = "에필 포강";
                }else if( classCheck("환류") && skillCheck(gemSkillArry, "종말의 날", dmg)  ){
                    specialClass = "데이터 없음";
                }else if( classCheck("환류") && !skillCheck(gemSkillArry, "인페르노", dmg)  ){
                    specialClass = "6딜 환류";
                }else if( classCheck("질풍") && !skillCheck(gemSkillArry, "여우비 스킬", dmg)  ){
                    specialClass = "5멸 질풍";
                }else if( classCheck("그믐") && !skillCheck(gemSkillArry, "소울 시너스", dmg)  ){
                    specialClass = "데이터 없음";
                }else if( classCheck("광기") && !skillCheck(gemSkillArry, "소드 스톰", dmg) && !skillCheck(gemSkillArry, "마운틴 크래쉬", dmg)){
                    specialClass = "6겁 광기";
                }else if( classCheck("광기") && !skillCheck(gemSkillArry, "소드 스톰", dmg)  ){
                    specialClass = "7겁 광기";
                }else if( classCheck("포식") && !skillCheck(gemSkillArry, "페이탈 소드", dmg)  ){
                    specialClass = "크블 포식";
                }else if( classCheck("피메") && !skillCheck(gemSkillArry, "대재앙", dmg)  ){
                    specialClass = "6M 피메";
                }else if( classCheck("잔재") && skillCheck(gemSkillArry, "블리츠 러시", dmg)  ){
                    specialClass = "슈차 잔재";
                }else if( classCheck("억제") && !skillCheck(gemSkillArry, "피어스 쏜", dmg)  ){
                    specialClass = "데이터 없음";
                }else if( classCheck("야성") || classCheck("두동")|| classCheck("환각")|| classCheck("서폿")|| classCheck("진실된 용맹")|| classCheck("심판자")|| classCheck("회귀")){
                    specialClass = "데이터 없음";
                }else{
                    specialClass = supportCheck();
                }
    
            }
            // console.log("보석전용 직업 : ",specialClass)
    
    
            gemSkillArry.forEach(function(gemSkill, idx){
                
                let realClass = classGemFilter.filter(item => item.class == specialClass);
                
                if(realClass.length == 0){
                    gemSkillArry[idx].skillPer = "none"
                }else{
                    
                    let realSkillPer = realClass[0].skill.filter(item => item.name == gemSkill.skill );
        
                    if(realSkillPer[0] != undefined){
                        gemSkillArry[idx].skillPer = realSkillPer[0].per;
                    }else{
                        gemSkillArry[idx].skillPer = "none";
                    }
                }
            })
    
    
            // 직업별 보석 지분율 필터
            let classGemEquip = classGemFilter.filter(function(filterArry){
                return filterArry.class == specialClass;
            })
            //console.log(classGemEquip)
    
            function gemCheckFnc(){
                try{
    
    
    
    
    
                    // console.log(classGemEquip)
                    let realGemValue = classGemEquip[0].skill.map(skillObj =>{
        
                        let matchValue = gemSkillArry.filter(item => item.skill == skillObj.name);
                        if( !(matchValue.length == 0)  ){
                            // console.log(matchValue)
                            return{
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
        
                    gemSkillArry.forEach(function(gemListArry){
                        if( gemListArry.name == "홍염" || gemListArry.name == "작열" ){
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
                    if(specialClass == "데이터 없음"){
                        gemSkillArry.forEach(function(gemListArry){
                            if( gemListArry.name == "멸화" || gemListArry.name == "겁화" ){
                                let perValue = gemPerObj.filter(item => gemListArry.name == item.name);
                                // console.log(perValue[0][`level${gemListArry.level}`]);
            
                                dmgGemTotal += perValue[0][`level${gemListArry.level}`]; 
                                dmgCount++;
                            }
                        })
            
                        etcAverageValue = dmgCount > 0 ? dmgGemTotal / dmgCount : 0;
                    }else{
                        etcAverageValue = 1;
                    }
                    
        
        
                    // 실제 유저가 장착한 보석의 딜 비율을 가져오는 함수
                    function getLevels(gemPerObj, skillArray) {
                        let result = [];
    
        
                        skillArray.forEach(skill => {
                            if( skill.per != "etc" ){
                                skill.gem.forEach(gem => {
                                    let gemObj = gemPerObj.find(gemPerObj => gemPerObj.name == gem.name && (gem.name == "겁화"|| gem.name == "멸화"));
                                    if (!(gemObj == undefined)) {
                                        let level = gemObj[`level${gem.level}`];
                                        result.push({skill: skill.name, gem: gem.name, per: level, skillPer:skill.per});
                                    }
                                });
                            }else if(skill.per == "etc"){
                                skill.gem.forEach(gem => {
                                    let gemObj = gemPerObj.find(gemPerObj => gemPerObj.name == gem.name && (gem.name == "겁화"|| gem.name == "멸화"));
                                    if (!(gemObj == undefined)) {
                                        let level = gemObj[`level${gem.level}`];
                                        result.push({skill: skill.name, gem: gem.name, per: level, skillPer:etcValue/etcLength});
                                    }
                                });
                            }
                        });
                        return result;
                    }
                    // console.log(getLevels(gemPerObj, realGemValue))
                    let gemValue = getLevels(gemPerObj, realGemValue).reduce( (gemResultValue, finalGemValue) => {
                        return gemResultValue + finalGemValue.per*finalGemValue.skillPer
                    },0)
        
    
                    // special skill Value 값 계산식
                    function specialSkillCalc(){
                        let result = 0;
                        classGemEquip[0].skill.forEach(function(skill){
                            if(skill.per != "etc"){
                                result += skill.per;
                            }
                        })
                        return 1/result
                    }
    
    
                    // 홍염,작열 평균레벨
                    return {
                        specialSkill:specialSkillCalc(),
                        originGemValue:gemValue,
                        gemValue:(gemValue*specialSkillCalc())/100+1 ,
                        gemAvg : averageValue,
                        etcAverageValue:etcAverageValue/100 + 1,
                    }
                }catch(error){
                    console.log(error)
                    return {
                        specialSkill:1,
                        originGemValue:1,
                        gemValue:1 ,
                        gemAvg : 0,
                        etcAverageValue:1,
                    }
    
                }
            }
            // gemCheckFnc() // <==보석 딜지분 최종값
            //console.log(gemCheckFnc())
                
            // 원정대 힘민지
            let expeditionStats =  Math.floor(( data.ArmoryProfile.ExpeditionLevel - 1 ) / 2) * 5 + 5
            
    
    
    
    
    
            // "천상의 축복" > atkBuff 
            // "천상의 연주" > atkBuff
            // "묵법 : 해그리기" > atkBuff
    
            // "신성의 오라" > damageBuff
            // "세레나데 스킬" > damageBuff
            // "음양 스킬" > damageBuff
    
    
            
    
            // 서폿용 보석 스킬명, 스킬수치 구하기
    
            if(!(data.ArmoryGem.Gems == null) && supportCheck() == "서폿"){
    
                data.ArmoryGem.Gems.forEach(function(gem){
                    let atkBuff = ['천상의 축복', '천상의 연주', '묵법 : 해그리기']
                    let damageBuff = ['신성의 오라', '세레나데 스킬', '음양 스킬']
                    let gemInfo = JSON.parse(gem.Tooltip)
                    let type = gemInfo.Element_000.value
                    let level
                    if(!(gemInfo.Element_004.value == null)){
                        level = gemInfo.Element_004.value.replace(/\D/g, "")
                    }
                    let skill
                    if(!(gemInfo.Element_006.value.Element_001 == undefined)){
                        skill = gemInfo.Element_006.value.Element_001.match(/>([^<]+)</)[1]
                    }
    
                    atkBuff.forEach(function(buffSkill){
                        if(skill == buffSkill && type.includes("겁화")){
                            gemObj.atkBuff += Number(level)
                        }
                    })
    
                    damageBuff.forEach(function(buffSkill){
                        if(skill == buffSkill && type.includes("겁화")){
                            gemObj.damageBuff += Number(level)
                        }
                    })
    
                })
            }
    
    
    
    
            // 추가 기본공격력 총합
            function gemAttackBonus(){
                let regex = /:\s*([\d.]+)%/
                if(!( data.ArmoryGem.Effects.Description == "" ) ){
                    return Number(data.ArmoryGem.Effects.Description.match(regex)[1])
                }else{
                    return 0
                }
            }
            function abilityAttackBonus(){
                let result = 0
                data.ArmoryEquipment.forEach(function(equip){
                    if(equip.Type == "어빌리티 스톤"){
                        let regex = /기본 공격력\s\+([0-9.]+)%/;
                        if( regex.test(equip.Tooltip) ){
                            result = Number( equip.Tooltip.match(regex)[1] );
                            return result
                        }
    
                    }
                })
                return result
            }
    
    
    
            // 전설/영웅 아바타 힘민지
            function avatarStats(){
    
                let result;
    
                const validTypes = ["무기 아바타", "머리 아바타", "상의 아바타", "하의 아바타"];
                const seenTypes = new Set();
                let bonusTotal = 0;
                let hasTopBottomLegendary = false;
    
                if(data.ArmoryAvatars != null){
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
    
                    result = bonusTotal/100+1;
                }else{
                    
                    result = 1;
                }
                
                return result
            }
            // console.log(avatarStats()) <= 전설/영웅 아바타 스텟
    
            let karmaPoint = (arkPassiveValue(1)-(data.ArmoryProfile.CharacterLevel-50)-accObj.enlightPoint-14)
            if (karmaPoint >= 6){
                arkObj.weaponAtk = 1.021
            }else if(karmaPoint >=5){
                arkObj.weaponAtk = 1.017
            }else if(karmaPoint >=4){
                arkObj.weaponAtk = 1.013
            }else if(karmaPoint >=3){
                arkObj.weaponAtk = 1.009
            }else if(karmaPoint >=2){
                arkObj.weaponAtk = 1.005
            }else if(karmaPoint >=1){
                arkObj.weaponAtk = 1.001
            }else{
                arkObj.weaponAtk = 1
            } 
    
            // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
            // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
            // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
            let attackBonus = ((gemAttackBonus() + abilityAttackBonus())/100)+1 // 기본 공격력 증가(보석, 어빌리티 스톤)
            let attackPowResult = (defaultObj.attackPow).toFixed(0) // 최종 공격력 (아드 등 각인 포함된)
            let criticalDamageResult = (defaultObj.criticalDamagePer + engObj.criticalDamagePer + accObj.criticalDamagePer + bangleObj.criticalDamagePer + arkObj.criticalDamagePer + elixirObj.criticalDamagePer + jobObj.criticalDamagePer) //치명타 피해량
            let criticalFinalResult = (jobObj.criFinalDamagePer * elixirObj.criFinalDamagePer) // 치명타시 적에게 주는 피해
            let evolutionDamageResult = (arkObj.evolutionDamage) //진화형 피해
            let addDamageResult = ((defaultObj.addDamagePer + accObj.addDamagePer + elixirObj.addDamagePer)/100)+1 // 추가 피해
            let finalDamageResult = ((jobObj.finalDamagePer * engObj.finalDamagePer * accObj.finalDamagePer * hyperObj.finalDamagePer * addDamageResult * elixirObj.finalDamagePer)).toFixed(2) // 적에게 주는 피해
            let enlightResult = arkObj.enlightenmentDamage // 깨달음 딜증
            let enlightBuffResult = arkObj.enlightenmentBuff
            let weaponAtkResult = ((defaultObj.weaponAtk + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus) * accObj.weaponAtkPer)
            let bangleStatValue = ((bangleObj.str+bangleObj.dex+bangleObj.int)*0.00011375)/100+1
    
            let totalStat = (armorStatus() + expeditionStats + hyperObj.str + elixirObj.str + elixirObj.dex + elixirObj.int + bangleObj.str + bangleObj.dex + bangleObj.int ) * avatarStats() // 최종 힘민지 계산값
            let totalWeaponAtk = ( (defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * arkObj.weaponAtk) // 최종 무공 계산값
            let totalWeaponAtk2 = ( (defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * (arkObj.weaponAtk + (accObj.weaponAtkPer/100))) // 최종 무공 계산값
    
            let totalAtk0 = (Math.sqrt((totalStat * totalWeaponAtk) / 6))
            let totalAtk1 = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * attackBonus
            let totalAtk2 = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * ( ((accObj.atkPer + elixirObj.atkPer) === 0 ? 1 : (accObj.atkPer + elixirObj.atkPer))/100 + 1 ) * attackBonus
            let totalAtk3 = ((Math.sqrt((totalStat * totalWeaponAtk2) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * ( ((accObj.atkPer + elixirObj.atkPer) === 0 ? 1 : (accObj.atkPer + elixirObj.atkPer))/100 + 1 ) * attackBonus
    
            let gemsCoolValue = (1/(1-(gemCheckFnc().gemAvg)/100)-1)+1
    
            let bangleCriticalFinalResult = (jobObj.criFinalDamagePer * elixirObj.criFinalDamagePer * bangleObj.criFinalDamagePer) // 치명타시 적에게 주는 피해
            let bangleAddDamageResult = ((defaultObj.addDamagePer + accObj.addDamagePer + elixirObj.addDamagePer)/100)+1 // 추가 피해
            let bangleFinalDamageResult = (engObj.finalDamagePer * accObj.finalDamagePer * hyperObj.finalDamagePer * bangleAddDamageResult * bangleObj.finalDamagePer * elixirObj.finalDamagePer) // 적에게 주는 피해
            
            let bangleCriDamage = (1 * criticalChanceResult * bangleCriticalFinalResult * (criticalDamageResult/100) + 1 *(100-criticalChanceResult)) / (1 * (criticalChanceResult-bangleObj.criticalChancePer) * criticalFinalResult * (criticalDamageResult-bangleObj.criticalDamagePer)/100 + 1*(100-(criticalChanceResult-bangleObj.criticalChancePer))) // 팔찌 치피 상승 기대값
            
            let minusHyperStat = (armorStatus() + expeditionStats + elixirObj.str + elixirObj.dex + elixirObj.int + bangleObj.str + bangleObj.dex + bangleObj.int ) * avatarStats()
            let minusHyperWeaponAtk = ( (defaultObj.weaponAtk + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * arkObj.weaponAtk)
            let minusHyperAtk = ((Math.sqrt((minusHyperStat * minusHyperWeaponAtk) / 6)) + (elixirObj.atkPlus)) * attackBonus
            let minusHyperFinal = (engObj.finalDamagePer * accObj.finalDamagePer * bangleAddDamageResult * bangleObj.finalDamagePer * elixirObj.finalDamagePer)
    
            let minusElixirStat = (armorStatus() + expeditionStats + hyperObj.str + bangleObj.str + bangleObj.dex + bangleObj.int ) * avatarStats()
            let minusElixirWeaponAtk = ( (defaultObj.weaponAtk + hyperObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * arkObj.weaponAtk)
            let minusElixirAtk = ((Math.sqrt((minusElixirStat * minusElixirWeaponAtk) / 6)) + (hyperObj.atkPlus)) * attackBonus
            let minusElixirFinal = (engObj.finalDamagePer * accObj.finalDamagePer * hyperObj.finalDamagePer * bangleAddDamageResult * bangleObj.finalDamagePer)
    
            let minusBangleStat = (armorStatus() + expeditionStats + hyperObj.str + elixirObj.str + elixirObj.dex + elixirObj.int) * avatarStats()
            let minusBangleWeaponAtk = ( (defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus) * arkObj.weaponAtk)
            let minusBangleWeaponAtk2 = ( (defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus) * (arkObj.weaponAtk + (accObj.weaponAtkPer/100)) )
    
            let minusBangleAtk = ((Math.sqrt((minusBangleStat * minusBangleWeaponAtk) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * attackBonus
            let minusBangleAtk2 = ((Math.sqrt((minusBangleStat * minusBangleWeaponAtk2) / 6)) + (elixirObj.atkPlus + hyperObj.atkPlus)) * ( ((accObj.atkPer + elixirObj.atkPer) === 0 ? 1 : (accObj.atkPer + elixirObj.atkPer))/100 + 1 ) * attackBonus
            let minusBangleFinal = (engObj.finalDamagePer * accObj.finalDamagePer * hyperObj.finalDamagePer * bangleAddDamageResult * elixirObj.finalDamagePer)
            let bangleAtkValue = ((totalAtk3-minusBangleAtk2)/minusBangleAtk2)+1
    
        
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1차 환산 공격력////   
            let finalValue = (totalAtk1 * criticalFinalResult * finalDamageResult * evolutionDamageResult * enlightResult  * (((defaultObj.crit+defaultObj.haste+defaultObj.special-bangleObj.crit-bangleObj.haste-bangleObj.special)/100*1)/100+1))
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1차 환산 공격력////
    
    
            
            
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 포함 환산////
            let bangleFinalValue = (totalAtk1 * criticalFinalResult * bangleFinalDamageResult * evolutionDamageResult * enlightResult * (((defaultObj.crit+defaultObj.haste+defaultObj.special)/100*1)/100+1))
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 포함 환산////
            
            
            
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 딜증율////
            let bangleEff = ((((bangleFinalValue-finalValue)/finalValue)+1) * (bangleObj.finalDamagePerEff) * bangleStatValue * 1.03 ).toFixed(4)
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 딜증율////
            
            
            /////////////////////////////////////////////////////////////특성 포함 최종 환산 공격력////////////////////////////////////////////////////////////////////////////////////////////////////////   
            let lastFinalValue = ((totalAtk1) * evolutionDamageResult * bangleFinalDamageResult * enlightResult * arkObj.leapDamage * gemCheckFnc().gemValue * gemCheckFnc().etcAverageValue * gemsCoolValue * bangleStatValue * (((defaultObj.crit+defaultObj.haste+defaultObj.special)/100*2)/100+1+0.3))
            /////////////////////////////////////////////////////////////특성 포함 최종 환산 공격력////////////////////////////////////////////////////////////////////////////////////////////////////////
    
            let minusHyperValue = ((minusHyperAtk) * evolutionDamageResult * minusHyperFinal * enlightResult * arkObj.leapDamage *  gemCheckFnc().gemValue * gemCheckFnc().etcAverageValue * gemsCoolValue * bangleStatValue *(((defaultObj.crit+defaultObj.haste+defaultObj.special)/100*2)/100+1+0.3))
            let hyperValue = ((lastFinalValue-minusHyperValue)/lastFinalValue*100).toFixed(2)
            //console.log("초월 효율" + hyperValue)
            
            let minusElixirValue = ((minusElixirAtk) * evolutionDamageResult * minusElixirFinal * enlightResult * arkObj.leapDamage *  gemCheckFnc().gemValue * gemCheckFnc().etcAverageValue * gemsCoolValue *bangleStatValue* (((defaultObj.crit+defaultObj.haste+defaultObj.special)/100*2)/100+1+0.3))
            let elixirValue = ((lastFinalValue-minusElixirValue)/lastFinalValue*1.1*100).toFixed(2)
            //console.log("엘릭서 효율" + elixirValue)
    
            let minusBangleValue = ((minusBangleAtk) * evolutionDamageResult * minusBangleFinal * enlightResult * arkObj.leapDamage *  gemCheckFnc().gemValue * gemCheckFnc().etcAverageValue * gemsCoolValue * bangleStatValue * (((defaultObj.crit+defaultObj.haste+defaultObj.special-bangleObj.crit-bangleObj.haste-bangleObj.special)/100*2)/100+1+0.3))
            let bangleValue = (((1 * bangleAtkValue * bangleObj.finalDamagePer * (((bangleObj.crit+bangleObj.haste+bangleObj.special)/100*2.55)/100+1))-1)*100).toFixed(2)
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
            let supportTotalWeaponAtk = ( (defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus + bangleObj.weaponAtkPlus) * (arkObj.weaponAtk + (accObj.weaponAtkPer/100))) // 서폿 무공 계산값
            let totalAtk4 = (Math.sqrt((totalStat * supportTotalWeaponAtk) / 6)) * attackBonus
    
            let finalStigmaPer = ((jobObj.stigmaPer * ((accObj.stigmaPer + arkObj.stigmaPer + hyperObj.stigmaPer)/100+1)).toFixed(1)) // 낙인력
    
            let atkBuff = (1 + ((accObj.atkBuff+elixirObj.atkBuff+hyperObj.atkBuff+bangleObj.atkBuff+gemObj.atkBuff)/100)) // 아공강 
            let finalAtkBuff = (totalAtk4 * 0.15 * atkBuff) // 최종 공증
    
            let damageBuff = (accObj.damageBuff + bangleObj.damageBuff + gemObj.damageBuff)/100+1 // 아피강
            let hyperBuff = (10 * ((accObj.damageBuff + bangleObj.damageBuff)/100+1))/100+1 // 초각성
    
    
            let statDamageBuff = ((defaultObj.special+defaultObj.haste)*0.015)/100+1 // 특화 신속
            let finalDamageBuff = (13 * damageBuff * statDamageBuff)/100+1 // 최종 피증
            
            let evolutionBuff = (arkObj.evolutionBuff/100) // 진화형 피해 버프
    
            let beforeBuff  = ((150000**1.095) * 1.7 * (5.275243**1.01) * 1.4 * 1.1 * 1.80978) // 가상의 딜러
            let afterBuff =  ((((150000+finalAtkBuff)*1.06)**1.095) * (1.7+evolutionBuff) * (5.275243**1.01) * 1.4 * 1.1 * 1.80978) * (finalStigmaPer/100+1) * 1.035 * (bangleObj.atkBuffPlus/100+1)
            let afterFullBuff =  ((((150000+finalAtkBuff)*1.06)**1.095) * (1.7+evolutionBuff) * (5.275243**1.01) * 1.4 * 1.1 * 1.80978) * (finalStigmaPer/100+1) * 1.035 * (bangleObj.atkBuffPlus/100+1) * finalDamageBuff * hyperBuff
            
            let allTimeBuffPower =  ((afterBuff-beforeBuff)/beforeBuff)*100
            let fullBuffPower = ((afterFullBuff-beforeBuff)/beforeBuff)*100
    
    
            //console.log("최종 공증" + finalAtkBuff)
            //console.log("진피" + evolutionBuff)
            //console.log("낙인력" + finalStigmaPer)
            //console.log("최종 피증" + finalDamageBuff)
            //console.log("팔찌 추가" + (bangleObj.atkBuffPlus/100+1))
            //console.log("풀버프 전" + beforeBuff)
            //console.log("풀버프 후" + afterFullBuff)
    
    
    
    
            //console.log(bangleObj.atkBuff/100+1)
            //console.log(bangleObj.atkBuffPlus/100+1)
            //console.log((bangleObj.damageBuff/100)/30+1)
            //console.log((bangleObj.special*0.017/100+1))
            //console.log((bangleObj.haste*0.017/100+1))
    
            // 4티어 서폿 최종 스펙포인트1
            let supportSpecPoint = (fullBuffPower**2.546)*20 * enlightBuffResult * arkObj.leapDamage * engObj.engBonusPer * ((1/(1-gemsCoolAvg/100)-1)+1)
    
            let supportTotalWeaponAtkMinusBangle = ( (defaultObj.weaponAtk + hyperObj.weaponAtkPlus + elixirObj.weaponAtkPlus + accObj.weaponAtkPlus) * (arkObj.weaponAtk + (accObj.weaponAtkPer/100)))
            let totalAtk5 = (Math.sqrt((totalStat * supportTotalWeaponAtkMinusBangle) / 6)) * attackBonus
    
            let atkBuffMinusBangle = (1 + ((accObj.atkBuff+elixirObj.atkBuff+hyperObj.atkBuff+gemObj.atkBuff)/100)) // 팔찌 제외 아공강
            let finalAtkBuffMinusBangle = (totalAtk5 * 0.15 * atkBuffMinusBangle) // 팔찌 제외 최종 공증
    
            let damageBuffMinusBangle = (accObj.damageBuff+gemObj.damageBuff)/100+1 // 팔찌 제외 아피강
            let hyperBuffMinusBangle = (10 * ((accObj.damageBuff)/100+1))/100+1 // 팔찌 제외 초각성
    
            let statDamageBuffMinusBangle = ((defaultObj.special+defaultObj.haste-bangleObj.special-bangleObj.haste)*0.015)/100+1 // 팔찌 제외 스탯
            let finalDamageBuffMinusBangle = (13 * damageBuffMinusBangle * statDamageBuffMinusBangle)/100+1 // 팔찌 제외 최종 피증
            
    
            let afterBuffMinusBangle = ((((150000+finalAtkBuffMinusBangle)*1.06)**1.095) * (1.7+evolutionBuff) * (5.275243**1.01) * 1.36 * 1.1 * 1.80978) * (finalStigmaPer/100+1) * 1.035
            let afterFullBuffMinusBangle = ((((150000+finalAtkBuffMinusBangle)*1.06)**1.095) * (1.7+evolutionBuff) * (5.275243**1.01) * 1.36 * 1.1 * 1.80978) * (finalStigmaPer/100+1) * 1.035 * finalDamageBuffMinusBangle * hyperBuffMinusBangle
    
            let allTimeBuffPowerMinusBangle = ((afterBuffMinusBangle-beforeBuff)/beforeBuff)*100
            let fullBuffPowerMinusBangle = ((afterFullBuffMinusBangle-beforeBuff)/beforeBuff)*100
    
            let supportSpecPointMinusBangle = (fullBuffPowerMinusBangle**2.526)*21 * enlightBuffResult * arkObj.leapDamage * engObj.engBonusPer * ((1/(1-gemsCoolAvg/100)-1)+1)
            let supportBangleEff = ((fullBuffPower-fullBuffPowerMinusBangle)/fullBuffPowerMinusBangle*100)
            //+ 1 * (bangleObj.special*0.01/100+1) * (bangleObj.haste*0.01/100+1)) * 100 - 100
    
            //console.log ( supportSpecPointMinusBangle )
            //console.log("팔찌 효율" + ((fullBuffPower)))
            //console.log("특화 효율" + (bangleObj.special*0.045/100+1))
            //console.log("신속 효율" + (bangleObj.haste*0.045/100+1))
    
            //////////////////////////////////////// 서폿 케어력 계산식 ////////////////////////////////////////
    
    
            let carePower = (engObj.carePower/100+1) * (accObj.carePower/100+1) * (elixirObj.carePower/100+1)
            let finalCarePower = (defaultObj.hp*0.3) * (engObj.carePower/100+1) * (accObj.carePower/100+1) * (elixirObj.carePower/100+1)
        
    
    
            
    
    
    
    
    
            //console.log("각인 케어력 : " + engObj.carePower)
            //console.log("악세 케어력 : " + accObj.carePower)
            //console.log("엘릭서 케어력 : " + elixirObj.carePower)
    
    
    
            //console.log("아공강 총합 : " + atkBuff)
            //console.log("낙인력 : "+finalStigmaPer + "%")
            //console.log("기준 딜러 버프 전 : " + beforeBuff)
            //console.log("기준 딜러 버프 후 : " + afterBuff )
    
    
    
    
    
    
    
            // export용 3티어 스펙포인트 객체에 값 넣기
            lowTierSpecPointObj.characterPoint = characterPoint
            lowTierSpecPointObj.armorPoint = armorPoint
            lowTierSpecPointObj.weaponPoint = weaponPoint
            lowTierSpecPointObj.arkPoint = arkPoint
            lowTierSpecPointObj.accessoryPoint = accessoryPoint
            lowTierSpecPointObj.elixirPoint = elixirPoint
            lowTierSpecPointObj.gemsPoint = gemsPoint
            lowTierSpecPointObj.engravingPoint = engravingPoint
            lowTierSpecPointObj.hyperPoint = hyperPoint
            lowTierSpecPointObj.cardPoint = cardPoint
            lowTierSpecPointObj.abilityStonePoint = abilityStonePoint
            lowTierSpecPointObj.setPoint = setPoint
            lowTierSpecPointObj.banglePoint = banglePoint
            lowTierSpecPointObj.specPoint = specPoint
    
    
            // console.log(lowTierSpecPointObj)
    
    
    
            // export용 4티어 스펙포인트 값 저장
    
            // 딜러
            highTierSpecPointObj.dealerAttackPowResult = totalAtk1
            highTierSpecPointObj.dealerTotalStatus = (defaultObj.crit+defaultObj.haste+defaultObj.special)
            highTierSpecPointObj.dealerEngResult = (engObj.finalDamagePer*100-100)
            highTierSpecPointObj.dealerEvloutionResult = ((evolutionDamageResult-1)*100)
            highTierSpecPointObj.dealerEnlightResult = ((enlightResult-1)*100)
            highTierSpecPointObj.dealerLeapResult = ((arkObj.leapDamage-1)*100)
            highTierSpecPointObj.dealerBangleResult = (bangleEff*100-100)
    
            // 서폿
            highTierSpecPointObj.supportStigmaResult = finalStigmaPer
            highTierSpecPointObj.supportAllTimeBuff = allTimeBuffPower
            highTierSpecPointObj.supportFullBuff = fullBuffPower
            highTierSpecPointObj.supportEngBonus = ((engObj.engBonusPer-1)*100)
            highTierSpecPointObj.supportgemsCoolAvg = gemsCoolAvg
            highTierSpecPointObj.supportCarePowerResult =  ((finalCarePower/280000)*100)
            highTierSpecPointObj.supportBangleResult = supportBangleEff
    
    
            // 최종 스펙 포인트
            highTierSpecPointObj.dealerlastFinalValue = lastFinalValue //딜러 스펙포인트
            highTierSpecPointObj.supportSpecPoint = supportSpecPoint //서폿 스펙포인트
    
            // console.log(highTierSpecPointObj)
    
    
    
            // 스펙포인트 db저장 통합
            if( !(supportCheck() == "서폿") ){   // 딜러
                highTierSpecPointObj.completeSpecPoint = lastFinalValue
            }else if(supportCheck() == "서폿"){
                highTierSpecPointObj.completeSpecPoint = supportSpecPoint
            }
    
    
            // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
            // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
            // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
    
    
    
            // ---------------------------DB저장---------------------------
            // ---------------------------DB저장---------------------------
            // ---------------------------DB저장---------------------------
    
    
    
    
    
    
    
    
    
    
            // 유저 api 데이터 저장
            // insertLopecApis( inputName, JSON.stringify(data) )
    
    
            // 검색로그저장
            // insertLopecSearch(inputName)
    
    
            // 유저 캐릭터 정보
            // function insertCharacter(){
            //     let level = data.ArmoryProfile.CharacterLevel
            //     let image = data.ArmoryProfile.CharacterImage
            //     let server = data.ArmoryProfile.ServerName
            //     let itemLevel = parseFloat(data.ArmoryProfile.ItemMaxLevel.replace(/,/g, ''))
            //     // console.log(itemLevel);
            //     let guild = data.ArmoryProfile.GuildName
            //     let title = data.ArmoryProfile.Title
            //     let classFullName = supportCheck() +" "+ data.ArmoryProfile.CharacterClassName
    
            //     insertLopecCharacters( inputName,level,classFullName,image,server,itemLevel,guild,title,lastFinalValue,supportSpecPoint,allTimeBuffPower,fullBuffPower)
            // }
    
    
            // insertCharacter()
    
    

            // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
            // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
            // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------



            // ---------------------------DB저장---------------------------
            // ---------------------------DB저장---------------------------
            // ---------------------------DB저장---------------------------











            // ---------------------------DB저장---------------------------
            // ---------------------------DB저장---------------------------
            // ---------------------------DB저장---------------------------







            // HTML코드


            // 프로필




            // 카드

            let cardEff
            let cardStr
            let cardSet

            function cardNull() {
                if (data.ArmoryCard == null) {

                } else {
                    cardEff = data.ArmoryCard.Effects
                    cardStr = JSON.stringify(cardEff)
                    cardSet = cardStr.includes(cardFilter[0]) && cardStr.includes(cardFilter[1])
                }
            }

            // let cardFilter = ['세 우마르가 오리라',"라제니스의 운명"]
            cardNull()



            // 카드 복수 여부 체크
            function cardArryCheckFnc() {
                if (!(cardEff.length == 1)) {
                    return "2개이상"
                }
            }
            // console.log(cardEff[0].Items.length)

            let etcCardArry = ""

            function cardArryFnc() {
                try {
                    if (cardEff.length == 1) {

                        let cardLength = cardEff[0].Items.length
                        let cardName = cardEff[0].Items[cardLength - 1].Name
                        let cardNameVal = cardName.replace(/\s*\d+세트(?:\s*\((\d+)각.*?\))?/g, function (match, p1) {
                            return p1 ? ` (${p1}각)` : '';
                        }).trim();

                        return `
                    <li class="tag-item">
                        <p class="tag radius">카드</p>
                        <span class="name">${cardNameVal}</span>
                    </li>`

                    } else if (cardArryCheckFnc() == "2개이상" && cardSet) {

                        return `
                    <li class="tag-item">
                        <p class="tag radius">카드</p>
                        <span class="name">세우라제</span>
                    </li>`
                    } else {
                        cardEff.forEach(function (arry, index) {
                            let cardName = arry.Items[arry.Items.length - 1].Name;
                            let cardNameList = cardName.replace(/\s*\d+세트(?:\s*\((\d+)각.*?\))?/g, function (match, p1) {
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
                } catch {
                    return `
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
            function tagItemFnc(a, b) { //("태그명","태그내용")
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


            // 아크패시브 활성화의 경우 각인
            // console.log(data.ArmoryEngraving)
            function arkGradeCheck(idx) {
                try {
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
                } catch (err) {
                    console.log(err)
                    return "unknown";
                }
            }

            function arkNullCheck(checkVal) {
                if (checkVal == null) {
                    return "unknown"
                } else if (checkVal == -1) {
                    return "red"
                }
            }

            function arkMinusCheck(checkVal) {
                if (checkVal < 0) {
                    return "LV." + Math.abs(checkVal)
                } else if (checkVal == null) {
                    return ""
                } else if (checkVal > 0) {
                    return "LV." + checkVal
                }
            }


            let arkPassiveEffects = null
            let disableArkPassive = []
            if (!(data.ArmoryEngraving == null)) {
                arkPassiveEffects = data.ArmoryEngraving.ArkPassiveEffects
                disableArkPassive = data.ArmoryEngraving.Effects
            }

            function engravingBox() {

                let engravingResult = ""
                if (!(data.ArmoryEngraving == null)) {
                    if (!(arkPassiveEffects == null)) {
                        // console.log(arkPassiveEffects)
                        arkPassiveEffects.forEach(function (arry, idx) {
                            // console.log(arkGradeCheck(arry))


                            engravingImg.forEach(function (filterArry) {
                                let engravingInput = filterArry.split("^")[0]
                                let engravingOutput = filterArry.split("^")[1]

                                if (arry.Name.includes(engravingInput)) {

                                    return engravingResult += `
                                <div class="engraving-box">
                                    <img src="${engravingOutput}" class="engraving-img" alt="">
                                    <div class="relic-ico engraving-ico ${arkGradeCheck(arry)}"></div>
                                    <span class="grade ${arkGradeCheck(arry)}">X ${arry.Level}</span>
                                    <span class="engraving-name">${arry.Name}</span>
                                    <div class="ability-ico engraving-ico ${arkNullCheck(arry.AbilityStoneLevel)}"></div>
                                    <span class="ability-level">${arkMinusCheck(arry.AbilityStoneLevel)}</span>
                                    ${jobBlockEngAlert(engravingInput)}

                                </div>`
                                }
                            })
                        })
                        return engravingResult
                    } else {
                        disableArkPassive.forEach(function (arry) {
                            // console.log(arry)
                            return engravingResult += `
                            <div class="engraving-box">
                                <img src="${arry.Icon}" class="engraving-img" alt="">
                                <span class="engraving-name">${arry.Name}</span>
                            </div>`
                        })
                        return engravingResult
                    }
                } else {
                    return engravingResult = "각인 미장착"
                }
            }




            function jobBlockEngAlert(realEng) {
                let result = ""

                engravingCalFilter.forEach(function (filter) {
                    if (supportCheck() == filter.job) {
                        filter.block.forEach(function (blockEng) {
                            if (blockEng == realEng) {
                                result = `
                                <div class="alert">
                                    <span class="block-text">무효각인 장착중</span>
                                </div>`
                                return result
                            }
                        })
                    }
                })
                return result
            }






            // 스펙포인트 레벨대 평균 점수
            function averageLevelPoint() {
                let itemLevel = Number(data.ArmoryProfile.ItemMaxLevel.replace(/,/g, ''))
                let range = ""


                if (!(supportCheck() == "서폿")) {
                    range = (levelRange, value) => `레벨 구간 : ${levelRange}<br>평균 점수 : ${value}<br>기준 일자 : 2024.12.20 <br><br> ※딜러 티어 <br> 브론즈 : 250만점 미만 <br> 실버 : 250만점 이상 <br> 골드 : 370만점 이상 <br> 다이아 : 600만점 이상 <br> 마스터 : 850만점 이상 <br> 에스더 : 1050만점 이상`
                    if (itemLevel >= 1725) {
                        return range("1725이상 1740이하", "1097만")
                    } else if (itemLevel >= 1715) {
                        return range("1715이상 1725미만", "953만")
                    } else if (itemLevel >= 1710) {
                        return range("1710이상 1715미만", "868만")
                    } else if (itemLevel >= 1705) {
                        return range("1705이상 1710미만", "804만")
                    } else if (itemLevel >= 1700) {
                        return range("1700이상 1705미만", "749만")
                    } else if (itemLevel >= 1695) {
                        return range("1695이상 1700미만", "705만")
                    } else if (itemLevel >= 1690) {
                        return range("1690이상 1695미만", "664만")
                    } else if (itemLevel >= 1685) {
                        return range("1685이상 1690미만", "625만")
                    } else if (itemLevel >= 1680) {
                        return range("1680이상 1685미만", "574만")
                    } else if (itemLevel >= 1675) {
                        return range("1675이상 1680미만", "455만")
                    } else if (itemLevel >= 1670) {
                        return range("1670이상 1675미만", "428만")
                    } else if (itemLevel >= 1665) {
                        return range("1665이상 1670미만", "400만")
                    } else if (itemLevel >= 1660) {
                        return range("1660이상 1665미만", "339만")
                    } else {
                        return '구간별 평균 점수는 <br> 1660 이상 부터 제공됩니다.<br><br> ※딜러 티어 <br> 브론즈 : 250만점 미만 <br> 실버 : 250만점 이상 <br> 골드 : 370만점 이상 <br> 다이아 : 600만점 이상 <br> 마스터 : 850만점 이상 <br> 에스더 : 1050만점 이상'
                    }

                } else if (supportCheck() == "서폿") {
                    range = (levelRange, value) => `레벨 구간 : ${levelRange}<br>평균 점수 : ${value}<br>기준 일자 : 2024.12.20 <br><br> ※서폿 티어 <br> 브론즈 : 400만점 미만 <br> 실버 : 400만점 이상 <br> 골드 : 500만점 이상 <br> 다이아 : 650만점 이상 <br> 마스터 : 820만점 이상 <br> 에스더 : 1020만점 이상`
                    if (itemLevel >= 1725) {
                        return range("1725이상 1740이하", "1112만")
                    } else if (itemLevel >= 1715) {
                        return range("1715이상 1725미만", "983만")
                    } else if (itemLevel >= 1710) {
                        return range("1710이상 1715미만", "939만")
                    } else if (itemLevel >= 1705) {
                        return range("1705이상 1710미만", "880만")
                    } else if (itemLevel >= 1700) {
                        return range("1700이상 1705미만", "816만")
                    } else if (itemLevel >= 1695) {
                        return range("1695이상 1700미만", "747만")
                    } else if (itemLevel >= 1690) {
                        return range("1690이상 1695미만", "702만")
                    } else if (itemLevel >= 1685) {
                        return range("1685이상 1690미만", "673만")
                    } else if (itemLevel >= 1680) {
                        return range("1680이상 1685미만", "631만")
                    } else if (itemLevel >= 1675) {
                        return range("1675이상 1680미만", "551만")
                    } else if (itemLevel >= 1670) {
                        return range("1670이상 1675미만", "532만")
                    } else if (itemLevel >= 1665) {
                        return range("1665이상 1670미만", "515만")
                    } else if (itemLevel >= 1660) {
                        return range("1660이상 1665미만", "507만")
                    } else {
                        return '구간별 평균 점수는 <br> 1660 이상 부터 제공됩니다.<br><br> ※서폿 티어 <br> 브론즈 : 400만점 미만 <br> 실버 : 400만점 이상 <br> 골드 : 500만점 이상 <br> 다이아 : 650만점 이상 <br> 마스터 : 820만점 이상 <br> 에스더 : 1020만점 이상'
                    }

                }
            }


            // 7,238,805 만점

            function specPointGauge() {
                return (specPoint / 7238805 * 100).toFixed(2)
            }

            function specPointGaugeColor(percent) {
                if (percent >= 90) {
                    return "legendary-progressbar"
                } else if (percent >= 70) {
                    return "epic-progressbar"
                } else if (percent >= 50) {
                    return "rare-progressbar"
                } else if (percent >= 30) {
                    return "uncommon-progressbar"
                } else if (percent >= 0) {
                    return "common-progressbar"
                }
            }


            // group-info 점수별 등급 아이콘


            function characterGradeCheck() {
                let gradeIco = ""
                let gradeInfo = ""

                function grade(ico, info, lowtier) {
                    return `
                <div class="tier-box">
                    <img src="${ico}" ${lowtier} alt="">
                    <p class="tier-info" ${lowtier}>${info}</p>
                </div>`;
                }
                // 스펙포인트
                function point(point, average) {


                    if (defaultObj.crit + defaultObj.haste + defaultObj.special < 1000) { // 기원의 섬 경고
                        return `
                    <div class="spec-point" style="color:#f00">
                        ${point}
                        <div class="question alert">
                            <span class="detail">
                                현재 캐릭터가 보정지역에 있는 것으로 예상됩니다.<br>
                                비보정 지역(마을, 도시 등)으로 이동한 뒤 갱신해주세요.
                            </span>
                        </div>
                    </div>`
                    } else {
                        return `
                    <div class="spec-point">
                        ${point}
                        <div class="question">
                            <span class="detail">
                                ${average}
                            </span>
                        </div>
                    </div>`

                    }
                }

                if (!(supportCheck() == "서폿") && data.ArkPassive.IsArkPassive) {// 4티어 딜러 스펙포인트
                    if (lastFinalValue < 1000000) { //브론즈
                        gradeIco = "  https://lopec.kr/asset/image/bronze.png"
                        gradeInfo = "브론즈 티어"
                        gradeObj.og = `https://lopec.kr/openGraph/bronze.html?name=${value}`
                    }else if(lastFinalValue >= 1000000 && lastFinalValue < 1500000){ //실버
                        gradeInfo = "실버 티어"
                        gradeIco = "https://lopec.kr/asset/image/silver.png"
                        gradeObj.og = `https://lopec.kr/openGraph/silver.html?name=${value}`
                    }else if(lastFinalValue >= 1500000 && lastFinalValue < 2500000){ //골드
                        gradeInfo = "골드 티어"
                        gradeIco = "https://lopec.kr/asset/image/gold.png"
                        gradeObj.og = `https://lopec.kr/openGraph/gold.html?name=${value}`
                }else if(lastFinalValue >= 2500000 && lastFinalValue < 3300000){ //다이아
                        gradeInfo = "다이아몬드 티어"
                        gradeIco = "https://lopec.kr/asset/image/diamond.png"
                        gradeObj.og = `https://lopec.kr/openGraph/diamond.html?name=${value}`
                }else if(lastFinalValue >= 3300000 && lastFinalValue < 4500000){ //마스터
                        gradeInfo = "마스터 티어"
                        gradeIco = "https://lopec.kr/asset/image/master.png"
                        gradeObj.og = `https://lopec.kr/openGraph/master.html?name=${value}`
                }else if(lastFinalValue >= 4500000){ //에스더
                        gradeInfo = "에스더 티어"
                        gradeIco = "https://lopec.kr/asset/image/esther.png"
                        gradeObj.og = `https://lopec.kr/openGraph/esther.html?name=${value}`
                    }

                    gradeObj.ico = gradeIco
                    gradeObj.info = gradeInfo

                    return `
                ${grade(gradeIco, gradeInfo)}
                ${point(formatNumber(Math.round(lastFinalValue)), averageLevelPoint())}`;

                } else if (supportCheck() == "서폿" && data.ArkPassive.IsArkPassive) { //4티어 서폿 스펙포인트
                if(supportSpecPoint < 4000000){ //브론즈
                        gradeIco = "  https://lopec.kr/asset/image/bronze.png"
                        gradeInfo = "브론즈 티어"
                        gradeObj.og = `https://lopec.kr/openGraph/bronze.html?name=${value}`
                }else if(supportSpecPoint >= 4000000 && supportSpecPoint < 5000000){ //실버
                        gradeInfo = "실버 티어"
                        gradeIco = "https://lopec.kr/asset/image/silver.png"
                        gradeObj.og = `https://lopec.kr/openGraph/silver.html?name=${value}`
                }else if(supportSpecPoint >= 5000000 && supportSpecPoint < 6000000){ //골드
                        gradeInfo = "골드 티어"
                        gradeIco = "https://lopec.kr/asset/image/gold.png"
                        gradeObj.og = `https://lopec.kr/openGraph/gold.html?name=${value}`
                }else if(supportSpecPoint >= 6000000 && supportSpecPoint < 8000000){ //다이아
                        gradeInfo = "다이아몬드 티어"
                        gradeIco = "https://lopec.kr/asset/image/diamond.png"
                        gradeObj.og = `https://lopec.kr/openGraph/diamond.html?name=${value}`
                }else if(supportSpecPoint >= 8000000 && supportSpecPoint < 10000000){ //마스터
                        gradeInfo = "마스터 티어"
                        gradeIco = "https://lopec.kr/asset/image/master.png"
                        gradeObj.og = `https://lopec.kr/openGraph/master.html?name=${value}`
                }else if(supportSpecPoint >= 10000000){ //에스더
                        gradeInfo = "에스더 티어"
                        gradeIco = "https://lopec.kr/asset/image/esther.png"
                        gradeObj.og = `https://lopec.kr/openGraph/esther.html?name=${value}`
                    }
                    gradeObj.ico = gradeIco
                    gradeObj.info = gradeInfo


                    return `
                ${grade(gradeIco, gradeInfo)}
                ${point(formatNumber(Math.round(supportSpecPoint)), averageLevelPoint())}`;

                }
            }
            characterGradeCheck()



            // 표본조사용 임시 함수


            // if( !(supportCheck() == '서폿') && data.ArkPassive.IsArkPassive && data.ArmoryGem.Gems.length == 11){
            //     console.log('=====================================')
            //     console.log(formatNumber(Math.round(lastFinalValue)))
            //     console.log('=====================================')
            // }





            // group-info HTML
            let groupInfo = ""

            function groupInfoUseCheck() {

                let userDevice = navigator.userAgent.toLowerCase();
                let mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userDevice);
                let searchPath = ""
                if (mobileCheck) {    //모바일
                    searchPath = "/mobile/split/split.html"
                } else (              //데스크탑
                    searchPath = "/split/split.html"
                )



                function infoBox(name, point, message) {
                    return `
                    <div class="info-box">
                        <p class="text">${name} : ${point}</p>
                        <div class="question">
                            <span class="detail">
                                ${message}
                            </span>
                        </div>
                    </div>`
                }


                let infoStart = `
                <div class="group-info">
                    <div class="spec-area shadow minimum flag">
                        <p class="title">스펙 포인트</p>
                        ${characterGradeCheck()}
                    <div class="extra-info">
                    <p class="detail-info">세부정보</p>
            `;


                let infoEnd = `
                </div>

                <span class="extra-btn" id="extra-btn"></span>

                </div>
                <div class="button-area">
                    <a href="https://cool-kiss-ec2.notion.site/2024-10-16-121758f0e8da8029825ef61b65e22568" target="_blink" class="link-block">무효각인 목록</a>
                    <form class="link-split" target="_blink" action="${searchPath}" method="get" >
                        <button type="button" id="split-input">캐릭터 비교하기</button>
                    </form>
                </div>
                    <div class="engraving-area shadow">
                        ${engravingBox()}
                    </div>
                </div>
            `;

                if (!(supportCheck() == "서폿") && data.ArkPassive.IsArkPassive) { //4티어 딜러

                    infoStart += infoBox("공격력", attackPowResult, '공격력 수치입니다.<br>만찬/버프 등으로 변할 수 있습니다.')
                    infoStart += infoBox("특성합", (defaultObj.crit + defaultObj.haste + defaultObj.special), '치특신 합계')
                    infoStart += infoBox("각인", (engObj.finalDamagePer * 100 - 100).toFixed(2) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoBox("진화", ((evolutionDamageResult - 1) * 100).toFixed(1) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoBox("깨달음", ((enlightResult - 1) * 100).toFixed(0) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoBox("도약", ((arkObj.leapDamage - 1) * 100).toFixed(1) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoBox("팔찌", (bangleEff * 100 - 100).toFixed(2) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoEnd

                    return infoStart


                } else if (supportCheck() == "서폿" && data.ArkPassive.IsArkPassive) { //4티어 서폿

                    infoStart += infoBox("낙인력", finalStigmaPer + "%", '낙인 데미지 증가율')
                    infoStart += infoBox("특성합", (defaultObj.haste + defaultObj.special), '특신 합계')
                    infoStart += infoBox("상시버프", (allTimeBuffPower).toFixed(2) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoBox("풀버프", (fullBuffPower).toFixed(2) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoBox("각인 보너스", ((engObj.engBonusPer - 1) * 100).toFixed(2) + "%", '각인 보너스 점수')
                    infoStart += infoBox("평균 쿨감", gemsCoolAvg + "%", '보석으로 인한 쿨감 평균')
                    infoStart += infoBox("케어력", ((finalCarePower / 280000) * 100).toFixed(2) + "%", '최대 생명력 기반 케어력 <br> 스펙포인트에 포함되지 않습니다.')
                    infoStart += infoBox("팔찌", (supportBangleEff).toFixed(2) + "%", '로펙 환산이 적용된 수치입니다.<br>아직은 재미로만 봐주세요.')
                    infoStart += infoEnd

                    return infoStart



                } else {  //3티어 서폿,딜러

                    infoStart += infoBox("기존 스펙포인트", specPoint, '업데이트 전 스펙포인트입니다.')
                    infoStart += infoBox("공격력", attackPowResult, '공격력 수치입니다.<br>만찬/버프 등으로 변할 수 있습니다.')
                    infoStart += infoBox("각인", (engObj.finalDamagePer * 100 - 100).toFixed(2) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoBox("팔찌", (bangleEff * 100 - 100).toFixed(2) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoBox("팔찌", (bangleEff * 100 - 100).toFixed(2) + "%", '로펙 환산이 적용된 수치입니다.')
                    infoStart += infoEnd

                    return infoStart


                }

            }



            // 억천만
            function formatNumber(num) {
                if (num >= 100000000) {
                    return Math.floor(num / 100000000) + '억 ' + formatNumber(num % 100000000);
                } else if (num >= 10000) {
                    const remainder = num % 10000;
                    return Math.floor(num / 10000) + '만' + (remainder > 0 ? ' ' + formatNumber(remainder) : '');
                } else {
                    return num.toString();
                }
            }







            // 보석

            let gemImage = data.ArmoryGem.Gems //보석이미지


            // null값 체크하기
            function nullCheck(checkVal, trueVal, falseVal) {
                if (checkVal == null || checkVal == undefined) {
                    return (falseVal)
                } else {
                    return (trueVal)
                }
            }



            function gemBox(e) {

                return `
            <div class="gem-box radius ${(() => {
                        try {
                            return nullCheck(gemImage, gradeCheck(gemImage[e]), "빈값")
                        } catch {
                            return nullCheck(gemImage, true, "empty")
                        }
                    })()
                    }">
            <img src="
            ${(() => {
                        // gemImage[e]가 없는 값일 경우 오류가 생겨 try문을 사용
                        try {
                            return nullCheck(gemImage, gemImage[e].Icon, "빈값")//gemImage[e].Icon가 있을경우 실행됨
                        } catch {
                            return nullCheck(gemImage, true, "/asset/image/skeleton-img.png")//위의gemImage[e].Icon가 없을경우 실행됨
                        }
                    })()
                    }
            " alt="">
            <span class="level">
            ${(() => {
                        try {
                            return nullCheck(gemImage, gemImage[e].Level, " ")
                        } catch {
                            return nullCheck(gemImage, true, "N")
                        }
                    })()
                    }</span>
            </div>`
            }

            // 보석 아이콘의 개수만큼 자동 추가
            let gemArea = '<div class="gem-area shadow">';
            try {
                for (let i = 0; i < gemImage.length; i++) {
                    gemArea += gemBox(i);
                }
            } catch {
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


            function equipTierSet(e) {
                let equipTier = armorEquipment[e].Tooltip;
                let equipTierSliceStart = equipTier.indexOf('(티어 ') + 1
                let equipTierSliceEnd = equipTier.indexOf(')')

                let equipTierSlice = equipTier.substring(equipTierSliceStart, equipTierSliceEnd)

                let equipTierNum = equipTierSlice.slice(3, 4);

                return (equipTierNum)
                // console.log(equipTierNum)
            }
            // 착용장비 품질
            function qualityValSet(e) {
                let qualityValJson = JSON.parse(armorEquipment[e].Tooltip)
                let qualityVal = qualityValJson.Element_001.value.qualityValue;
                if (qualityVal == -1) {
                    return armorEquipment[e].Grade
                } else {
                    return qualityVal
                }

                return (qualityVal)
                // console.log(qualityVal)
            }

            // 상급재련 수치
            function reforgeValSet(e) {
                let reforgeValJson = JSON.parse(armorEquipment[e].Tooltip)
                let reforgeVal = reforgeValJson.Element_005.value


                if (typeof reforgeVal === 'string' && reforgeVal.includes("상급 재련")) {
                    // console.log("상급 재련이 포함되어 있습니다.");
                    let reforgeValArry = reforgeVal.match(/\d+/g); // 숫자를 찾는 정규 표현식
                    let reforgeValLastNum = reforgeValArry.length
                    // console.log(reforgeValArry[reforgeValLastNum-1]); 
                    return ("X" + reforgeValArry[reforgeValLastNum - 1])//상급재련 값

                } else {
                    // console.log("상급 재련이 포함되어 있지 않습니다.");
                    return ("")
                }

            }


            // 태그명
            function tagValSet(e) {
                let tagValCheck = JSON.parse(armorEquipment[e].Tooltip)
                let tagVal = tagValCheck.Element_010?.value?.firstMsg;

                if (tagVal) {
                    // console.log("태그가 있습니다.")
                    let extractedTag = tagVal.replace(/<[^>]*>/g, '').trim();
                    return (extractedTag)
                } else {
                    // console.log("태그가 없습니다.")
                    return ("")
                }

            }


            // 엘릭서
            // 엘릭서 키워드 lv추출
            function elixirVal(e) {
                let elixirValJson = JSON.parse(armorEquipment[e].Tooltip);

                const elixirValString = JSON.stringify(elixirValJson);

                const matchedKeywordsWithContext = keywordList.flatMap(keyword => {
                    const index = elixirValString.indexOf(keyword);
                    if (index !== -1) {
                        const endIndex = Math.min(index + keyword.length + 4, elixirValString.length);
                        return [elixirValString.slice(index, endIndex).replace(/<[^>]*>/g, '')];
                    }
                    return [];
                });


                // span태그로 반환
                let elixirSpan = ""
                let i
                for (i = 0; i < matchedKeywordsWithContext.length; i++) {
                    elixirSpan +=
                        `<span class="elixir radius">${matchedKeywordsWithContext[i]}</span>`
                }
                return (elixirSpan)
            }






            // 초월

            let hyperImg = `<img src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_transcendence.png" alt="꽃모양 아이콘">`

            function hyperWrap(e) {
                // let hyperValJson = JSON.parse(armorEquipment[e].Tooltip); // 추후 문제없을시 삭제
                // let hyperStr = JSON.stringify(hyperValJson) // 추후 문제없을시 삭제
                let hyperStr = armorEquipment[e].Tooltip


                const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
                const hyperMatch = hyperStr.match(regex);

                try {
                    let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
                    hyperReplace = hyperReplace.replace(/\s+/g, ',')
                    let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
                    // console.log(hyperArry)
                    return `
                <div class="hyper-wrap">
                    <span class="hyper">${hyperImg}${hyperArry[3]}</span>
                    <span class="level">${hyperArry[1]}단계</span>
                    </div>`
                } catch {
                    return ""
                }
            }







            // 장비 


            function gradeCheck(idx) {
                try {
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
                } catch (err) {
                    console.log(err)
                    return "unknown";
                }
            }


            let armorEmpty = `
        <li class="armor-item">
            <div class="img-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="정보를 불러오지 못함">
            </div>
            <div class="text-box">
            </div>
        </li>
        `
            let i

            // console.log(armorEquipment)
            // 장비 슬롯 검사
            function equipmentCheck(checkEquip) {
                for (i = 0; i < armorEquipment.length + 1; i++) {
                    try {
                        if (armorEquipment[i].Type == checkEquip) {
                            return armorItem(i);
                        }
                    } catch {
                        return armorEmpty
                    }
                }
            }



            function progress(idx) {
                if (idx <= 9) {
                    return "common-progressbar"
                } else if (idx <= 29) {
                    return "uncommon-progressbar"
                } else if (idx <= 69) {
                    return "rare-progressbar"
                } else if (idx <= 89) {
                    return "epic-progressbar"
                } else if (idx <= 99) {
                    return "legendary-progressbar"
                } else if (idx == 100) {
                    return "mythic-progressbar"
                } else if (idx == "고대") {
                    return "mythic-progressbar"
                } else if (idx == "유물") {
                    return "relics-progressbar"
                } else if (idx == "영웅") {
                    return "legendary-progressbar"
                } else {
                    return 'unknown'
                }
            }


            function armorItem(e) {



                return `
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

            let elixirDouble = ["회심", "달인 (", "강맹", "칼날방패", "선봉대", "행운", "선각자", "진군", "신념"]
            let elixirDoubleVal

            function elixirDoubleCheck() {
                let result
                elixirDouble.forEach(function (elixirDoubleArry) {
                    result = elixirData.filter(item => item.name.includes(elixirDoubleArry)).length;
                    if (result >= 2) {
                        elixirDoubleVal = elixirDoubleArry
                    } else {
                    }
                })
            }
            elixirDoubleCheck()


            function nameWrap() {
                if (!(elixirDoubleVal == undefined) && elixirLevel >= 35 && elixirLevel < 40) {
                    return `
                    <div class="name-wrap">
                        ${elixirDoubleVal.replace(/\(/g, "").trim()} 1단계
                    </div>`
                } else if (!(elixirDoubleVal == undefined) && elixirLevel >= 40) {
                    return `
                    <div class="name-wrap">
                        ${elixirDoubleVal.replace(/\(/g, "").trim()} 2단계
                    </div>`

                } else {
                    return `
                    <div class="name-wrap">
                        비활성화
                    </div>`
                }
            }


            // let hyperSum = hyperWeaponLevel+hyperArmoryLevel

            function elixirProgressGrade() {
                if (elixirLevel < 35) {
                    return "common"
                } else if (elixirLevel < 40) {
                    return "epic"
                } else if (elixirLevel < 50) {
                    return "legendary"
                } else if (elixirLevel < 999) {
                    return "mythic"
                }
            }

            function hyperProgressGrade() {
                if (hyperSum < 100) {
                    return "common"
                } else if (hyperSum < 120) {
                    return "epic"
                } else if (hyperSum < 126) {
                    return "legendary"
                } else if (hyperSum < 999) {
                    return "mythic"
                }
            }


            let armorEtc = `
            <li class="armor-item">
                <div class="img-box radius ultra-background">
                    <img src="/asset/image/elixir.png" alt="">
                    <span class="progress ${elixirProgressGrade()}-progressbar">${elixirLevel}</span>
                </div>
                <div class="text-box">
                    <div class="name-wrap">
                        엘릭서
                    </div>
                    ${nameWrap()}
                </div>
                <div class="img-box radius ultra-background">
                    <img src="/asset/image/hyper.png" alt="">
                    <span class="progress ${hyperProgressGrade()}-progressbar">${hyperSum}</span>
                </div>
                <div class="text-box">
                    <div class="name-wrap">
                        초월
                    </div>
                    <div class="name-wrap">
                        평균 ${(hyperSum / 6).toFixed(1)}성
                    </div>
                </div>
            </li>`
                ;





            // 장신구

            // 부위별 장신구 확인
            let accessoryEmpty = `
        <li class="accessory-item">
            <div class="img-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="">
            </div>
            <div class="option-box">
            </div>
        </li>`

            function equipmentCheckAcc(checkEquip) {
                for (i = 0; i < armorEquipment.length + 1; i++) {
                    try {
                        if (armorEquipment[i].Type == checkEquip) {
                            return accessoryItem(i);
                        }
                    } catch {
                        return accessoryEmpty
                    }
                }
            }
            function equipmentCheckAccDouble(checkEquip) {
                for (i = 0; i < armorEquipment.length + 1; i++) {
                    try {
                        if (armorEquipment[i].Type == checkEquip) {
                            return accessoryItem(i + 1);
                        }
                    } catch {
                        return accessoryEmpty
                    }
                }
            }


            // 장신구 티어 확인 함수
            function accessoryTierFnc(e) {
                let accessoryTier = JSON.parse(armorEquipment[e].Tooltip);
                let accessoryTierSlice = accessoryTier.Element_001.value.leftStr2.replace(/<[^>]*>|아이템|티어|\s/g, '');

                return (accessoryTierSlice)
            }

            function accessoryItem(e) {


                return `
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
            function accessoryOptionBox(e) {
                return `
            <div class="option-box">
                ${accessoryVal(e)}
                ${buffVal(e)}
            </div>`
            }

            // 상중하 판별 필터
            // 악세서리 스텟


            let grindingFilterMtl = grindingFilter.map(item => item.split(':'));
            // console.log(grindingFilterMtl[0])
            function accessoryVal(e) {
                let accessoryJson = JSON.parse(armorEquipment[e].Tooltip);
                try {
                    let accessoryOptionVal = accessoryJson.Element_005.value.Element_001;
                    let accessorySplitVal = accessoryOptionVal.split("<BR>");

                    // console.log(accessorySplitVal[0].replace(/<[^>]*>/g, ''))
                    // console.log(grindingFilterMtl[i][0])

                    function qualityCheck(q) {
                        if (accessorySplitVal[q]) {
                            for (let i = 0; i < grindingFilterMtl.length; i++) {
                                if (accessorySplitVal[q].replace(/<[^>]*>/g, '') === grindingFilterMtl[i][0]) {
                                    return grindingFilterMtl[i][1];
                                }
                            }
                        }
                        return null;
                    }
                    function getGrade(level) {
                        switch (level) {
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
                    if (accessorySplitVal[1] == undefined && false) {
                        return `
                    <div class="option-wrap">
                        <span class="option">${accessorySplitVal[0]}</span>
                    </div>`
                    } else if (accessorySplitVal[2] == undefined) {
                        return `
                    <div class="text-box">
                        <div class="grinding-wrap">
                            <span class="quality ${qualityCheck(0)}">${getGrade(qualityCheck(0))}</span>
                            <span class="option">${accessorySplitVal[0]}</span>
                        </div>
                        <div class="grinding-wrap">
                            <span class="quality ${qualityCheck(1)}">${getGrade(qualityCheck(1))}</span>
                            <span class="option">${accessorySplitVal[1]}</span>
                        </div>
                    </div>`
                    } else {
                        return `
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
                    </div>`

                    }
                } catch (err) {
                    console.log(err)
                    return `<span class="option">${armorEquipment[e].Name}</span>`
                }
            }




            // 버프 스텟
            function buffVal(e) {
                let buffJson = JSON.parse(armorEquipment[e].Tooltip);

                try {
                    let buffVal1 = buffJson.Element_006.value.Element_000.contentStr.Element_000.contentStr.replace(/[\[\]]|<[^>]*>|활성도|[+]/g, '');
                    let buffVal2 = buffJson.Element_006.value.Element_000.contentStr.Element_001.contentStr.replace(/[\[\]]|<[^>]*>|활성도|[+]/g, '');
                    let buffVal3 = buffJson.Element_006.value.Element_000.contentStr.Element_002.contentStr.replace(/[\[\]]|<[^>]*>|활성도|[+]/g, '');

                    return `
                <div class="buff-wrap">
                    <span class="buff">${buffVal1}</span>
                    <span class="buff">${buffVal2}</span>
                    <span class="buff minus">${buffVal3}</span>
                </div>
                `
                } catch {
                    return ``
                }
            }



            // 팔찌 HTML

            let bangleStats = ["치명", "특화", "신속", "제압", "인내", "숙련"]
            let bangleOptionWrap = "" //.option-wrap
            let bangleOption = "" //.option
            let bangleTmlWrap = "" //.grinding-wrap
            let bangleTextbox = "" //.text-box


            function bangleCheck() {
                let result = ""
                data.ArmoryEquipment.forEach(function (arry, idx) {
                    if (arry.Type == "팔찌") {
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

            bangleOptionArry.forEach(function (optionArry, optionIndex) {

                // 일반 스텟 표시
                bangleStats.forEach(function (statsArry) {
                    let regex = new RegExp(`${statsArry} \\+\\d+`);
                    // console.log(statsArry+":"+regex.test(optionArry))

                    if (regex.test(optionArry)) {
                        bangleOption += `<span class="option">${optionArry.match(regex)[0]}</span>`
                        bangleOptionWrap = `
                    <div class="option-wrap">
                        ${bangleOption}
                    </div>`
                    }

                })

                // 특수 스텟 표시
                bangleSpecialStats.forEach(function (specialStatsArry) {
                    let regex = new RegExp(`${specialStatsArry} \\+\\d+`);
                    if (regex.test(optionArry)) {
                        let tml = "", tmlClass = "", val = optionArry.replace(/\D/g, '')
                        if (val >= 6400 && val <= 12160) {
                            tml = "하", tmlClass = "low"
                        } else if (val > 12160 && val <= 14080) {
                            tml = "중", tmlClass = "middle"
                        } else if (val > 14080 && val <= 16000) {
                            tml = "상", tmlClass = "high"
                        } else if (val >= 0) {
                            tml = "하", tmlClass = "low"
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
                bangleFilter.forEach(function (filterArry) {
                    let bangleCheck = optionArry == filterArry.name && bangleOptionArry[optionIndex + 1] == filterArry.option
                    // console.log(optionArry)
                    if (bangleCheck && filterArry.secondCheck == null) {

                        bangleTmlWrap += `
                    <div class="grinding-wrap">
                        <span class="quality ${filterArry.tier.replace(/[0-9]/g, '')}">
                            ${bangleTierCheck(filterArry.tier)}
                        </span>
                        <span class="option">
                            ${bangleFilterInitialCheck(filterArry.initial, filterArry.name)}
                        </span>
                    </div>
                    `;

                        bangleTextbox = `
                    <div class="text-box">
                        ${bangleTmlWrap}
                    </div>
                    `;
                    } else if (optionArry == filterArry.name && filterArry.option == null) {
                        bangleTmlWrap += `
                    <div class="grinding-wrap">
                        <span class="quality ${filterArry.tier.replace(/[0-9]/g, '')}">
                            ${bangleTierCheck(filterArry.tier)}
                        </span>
                        <span class="option">
                            ${bangleFilterInitialCheck(filterArry.initial, filterArry.option)}
                        </span>
                    </div>
                    `;

                        bangleTextbox = `
                    <div class="text-box">
                        ${bangleTmlWrap}
                    </div>
                    `;

                    } else if (bangleCheck && !(bangleOptionArry[optionIndex + 2] == filterArry.secondCheck)) {
                        bangleTmlWrap += `
                    <div class="grinding-wrap">
                        <span class="quality ${filterArry.tier.replace(/[0-9]/g, '')}">
                            ${bangleTierCheck(filterArry.tier)}
                        </span>
                        <span class="option">
                            ${bangleFilterInitialCheck(filterArry.initial, filterArry.option)}
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
            // console.log(bangleTmlWrap)

            function bangleFilterNullCheck(option) {
                if (!(option == null)) {
                    return option
                } else {
                    return ""
                }
            }
            // 팔찌 상중하 축약어 표시하기
            function bangleFilterInitialCheck(initial, name) {
                if (!(initial == undefined)) {
                    return initial
                } else {
                    return name
                }
            }



            // 팔찌 상중하 체크
            function bangleTierCheck(tier) {
                // 접두사 z = 무효 / Sp = 서폿용 / P = 더 높은 점수 / L = 낮은 점수 



                let tierName = {
                    Flow1: "하",
                    Flow2: "하",
                    Fmiddle: "중",
                    Fhigh: "상",

                    low1: "하",
                    low2: "하",
                    middle: "중",
                    high: "상",

                    zlow1: "하",
                    zlow2: "하",
                    zmiddle: "중",
                    zhigh: "상",

                    Duellow1: "하",
                    Duellow2: "하",
                    Duelmiddle: "중",
                    Duelhigh: "상",

                    SpPlow1: "하",
                    SpPlow2: "하",
                    SpPmiddle: "중",
                    SpPhigh: "상",

                    SpMlow1: "하",
                    SpMlow2: "하",
                    SpMmiddle: "중",
                    SpMhigh: "상",

                    SpLlow1: "하",
                    SpLlow2: "하",
                    SpLmiddle: "중",
                    SpLhigh: "상",

                    Splow1: "하",
                    Splow2: "하",
                    Spmiddle: "중",
                    Sphigh: "상",

                    Plow1: "하",
                    Plow2: "하",
                    Pmiddle: "중",
                    Phigh: "상",

                    Llow1: "하",
                    Llow2: "하",
                    Lmiddle: "중",
                    Lhigh: "상",

                    DuelPlow1: "하",
                    DuelPlow2: "하",
                    DuelPmiddle: "중",
                    DuelPhigh: "상",

                    Duellow1: "하",
                    Duellow2: "하",
                    Duelmiddle: "중",
                    Duelhigh: "상",

                    DuelLlow1: "하",
                    DuelLlow2: "하",
                    DuelLmiddle: "중",
                    DuelLhigh: "상",
                };
                return tierName[tier]
            }

            // 유물 고대 띠 이미지
            function progressColor(tier) {
                if (tier == "고대") {
                    return "mythic"
                } else if (tier == "유물") {
                    return "relics"
                } else if (tier == "영웅") {
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
            let evolutionImg = 'https://pica.korlark.com/2018/obt/assets/images/common/game/ico_arkpassive_evolution.png'
            let enlightenmentImg = 'https://pica.korlark.com/2018/obt/assets/images/common/game/ico_arkpassive_enlightenment.png'
            let leapImg = 'https://pica.korlark.com/2018/obt/assets/images/common/game/ico_arkpassive_leap.png?502a2419e143bd895b66'
            function arkPassiveValue(e) {
                let arkPassiveVal = data.ArkPassive.Points[e].Value
                return arkPassiveVal
            }
            // let arkTitleWrap =   //제거예정
            // `
            // <div class="ark-title-wrap">
            //     <div class="title-box evolution">
            //         <span class="tag">진화</span>
            //         <span class="title">${arkPassiveValue(0)}</span>
            //     </div>
            //     <div class="title-box enlightenment">
            //         <span class="tag">깨달음</span>
            //         <span class="title">${arkPassiveValue(1)}</span>
            //     </div>
            //     <div class="title-box leap">
            //         <span class="tag">도약</span>
            //         <span class="title">${arkPassiveValue(2)}</span>
            //     </div>
            // </div>`


            // 아크패시브 리스트 wrap

            //console.log(data.ArkPassive.Effects)
            let enlightenment = []
            let evolution = []
            let leap = []
            data.ArkPassive.Effects.forEach(function (arkArry) {
                if (arkArry.Name == '깨달음') {
                    enlightenment.push(arkArry)
                } else if (arkArry.Name == '진화') {
                    evolution.push(arkArry)
                } else if (arkArry.Name == '도약') {
                    leap.push(arkArry)
                }
            })
            // console.log(enlightenment)
            // console.log(evolution)
            // console.log(leap)



            // // 아크패시브 아이콘, 이름, 

            function arkNameArry(arkName) {
                let arkItem = ""
                arkName.map(function (arkNameArry) {
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



            // function arkJob(){  삭제예정
            //     let arkResult =""
            //     try{
            //         arkFilter.forEach(function(arry){
            //             let arkInput = arry.name;
            //             let arkOutput = arry.initial;

            //             // console.log(arkInput)
            //             if(arkNameArry(enlightenment).includes(arkInput)){
            //                 arkResult = arkOutput
            //                 return arkResult
            //             }
            //         })
            //     }catch(err){
            //         console.log(err)
            //     }
            //     return arkResult
            // }








            // 모바일 검색영역










            // 아크패시브 리스트 wrap HTML
            let arkListWrap =
                `<div class="ark-list-wrap">
            <ul class="ark-list evolution">
                <div class="title-box evolution">
                    <span class="tag">진화</span>
                    <span class="title">${arkPassiveValue(0)}</span>
                </div>

                ${arkNameArry(evolution)}
            </ul>
            <ul class="ark-list enlightenment">
                <div class="title-box enlightenment">
                    <span class="tag">깨달음</span>
                    <span class="title">${arkPassiveValue(1)}</span>
                </div>

                ${arkNameArry(enlightenment)}
            </ul>
            <ul class="ark-list leap">
                <div class="title-box leap">
                    <span class="tag">도약</span>
                    <span class="title">${arkPassiveValue(2)}</span>
                </div>

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

            function arkArea() {
                if (data.ArkPassive.IsArkPassive == true) {
                    return `
                <div class="ark-area shadow">
                ${arkListWrap}
                </div>`
                } else {
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





            // lopecApi

            let lopecJson = {
                "name": value,                                                            // 닉네임
                "specPoint": highTierSpecPointObj.completeSpecPoint,                      // 스펙포인트
                "class": supportCheck() + "" + data.ArmoryProfile.CharacterClassName,     // 직업
                "alwaysBuff": highTierSpecPointObj.supportAllTimeBuff,                    // 상시버프
                "fullBuff": highTierSpecPointObj.supportFullBuff,                         // 풀버프
                "tierIco": gradeObj.ico,                                                  // 티어이미지
                "urlThumbnail": gradeObj.og,                                              // url공유 미리보기
            }

            console.log(lopecJson)

            res.json({ lopecJson })
        })
        .catch(error => {
            console.error('Fetch error:', error);
            res.json({ error: error.message }); // 오류 메시지를 클라이언트로 반환
        });


})

app.listen(8080)