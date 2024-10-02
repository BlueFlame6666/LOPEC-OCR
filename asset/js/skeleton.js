
let skeleton = `
        <div class="loader"></div>

        <div class="group-profile">
            <div class="img-area shadow">
                <img id="character-image skeleton" src="./asset/image/skeleton-img.png" alt="프로필 이미지">
                <p class="level" id="character-level">Lv.N/A</p>
                <p class="name" id="character-nickname">닉네임</p>
                <p class="class" id="character-class">직업</p>
            </div>
            <ul class="tag-list shadow">
                <li class="tag-item">
                    <p class="tag radius">서버</p>
                    <span class="name"></span>
                </li>
                <li class="tag-item">
                    <p class="tag radius">레벨</p>
                    <span class="name"></span>
                </li>
                <li class="tag-item">
                    <p class="tag radius">길드</p>
                    <span class="name"></span>
                </li>
                <li class="tag-item">
                    <p class="tag radius">칭호</p>
                    <span class="name"></span>
                </li>
                <li class="tag-item">
                    <p class="tag radius">영지</p>
                    <span class="name"></span>
                </li>
                <li class="tag-item">
                    <p class="tag radius">카드</p>
                    <span class="name"></span>
                </li>
            </ul>

        </div>
        <div class="group-info">
            <div class="spec-area shadow">
                <p class="title">스펙 포인트</p>
                <div class="tier-box">
                    <img src="./asset/image/bronze.png" alt="">
                </div>
                <span class="spec-point">N/A</span>
                <div class="extra-info">
                    <p class="detail-info">세부정보</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                    <p class="text">전투레벨 : 100000</p>
                </div>
                <span class="extra-btn" id="extra-btn"></span>
            </div>
            <div class="engraving-area shadow">
                <div class="engraving-box">
                    <img src="./asset/image/skeleton-img.png" class="engraving-img" alt="">
                </div>
                <div class="engraving-box">
                    <img src="./asset/image/skeleton-img.png" class="engraving-img" alt="">
                </div>
                <div class="engraving-box">
                    <img src="./asset/image/skeleton-img.png" class="engraving-img" alt="">
                </div>
                <div class="engraving-box">
                    <img src="./asset/image/skeleton-img.png" class="engraving-img" alt="">
                </div>
                <div class="engraving-box">
                    <img src="./asset/image/skeleton-img.png" class="engraving-img" alt="">
                </div>
                <div class="engraving-box">
                    <img src="./asset/image/skeleton-img.png" class="engraving-img" alt="">
                </div>

            </div>
        </div>
        <div class="group-equip">
            <div class="gem-area shadow">
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
                <div class="gem-box radius">
                    <img src="./asset/image/skeleton-img.png" alt="">
                </div>
            </div>
            <div class="armor-wrap">
                <div class="armor-area shadow">
                    <ul class="armor-list">
                        <li class="armor-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="text-box">
                                <div class="name-wrap">
                                </div>
                                <div class="elixir-wrap">
                                </div>
                                <div class="hyper-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="armor-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="text-box">
                                <div class="name-wrap">
                                </div>
                                <div class="elixir-wrap">
                                </div>
                                <div class="hyper-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="armor-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="text-box">
                                <div class="name-wrap">
                                </div>
                                <div class="elixir-wrap">
                                </div>
                                <div class="hyper-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="armor-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="text-box">
                                <div class="name-wrap">
                                </div>
                                <div class="elixir-wrap">
                                </div>
                                <div class="hyper-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="armor-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="text-box">
                                <div class="name-wrap">
                                </div>
                                <div class="elixir-wrap">
                                </div>
                                <div class="hyper-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="armor-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="text-box">
                                <div class="name-wrap">
                                </div>
                                <div class="elixir-wrap">
                                </div>
                                <div class="hyper-wrap">
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="accessory-area shadow">
                    <ul class="accessory-list">
                        <li class="accessory-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="text-box">
                                <div class="grinding-wrap">
                                </div>
                                <div class="grinding-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="accessory-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="option-box">
                                <div class="option-wrap">
                                </div>
                                <div class="buff-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="accessory-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="option-box">
                                <div class="option-wrap">
                                </div>
                                <div class="buff-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="accessory-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="option-box">
                                <div class="option-wrap">
                                </div>
                                <div class="buff-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="accessory-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="option-box">
                                <div class="option-wrap">
                                </div>
                                <div class="buff-wrap">
                                </div>
                            </div>
                        </li>
                        <li class="accessory-item">
                            <div class="img-box radius">
                                <img src="./asset/image/skeleton-img.png" alt="">
                                <span class="progress">96</span>
                            </div>
                            <div class="option-box">
                                <div class="option-wrap">
                                </div>
                                <div class="buff-wrap">
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="ark-area shadow">
                <div class="ark-title-wrap">
                    <div class="title-box evolution">
                        <span class="tag">진화</span>
                        <span class="title">N/A</span>
                    </div>
                    <div class="title-box enlightenment">
                        <span class="tag">진화</span>
                        <span class="title">N/A</span>
                    </div>
                    <div class="title-box leap">
                        <span class="tag">진화</span>
                        <span class="title">N/A</span>
                    </div>
                </div>
                <div class="ark-list-wrap">
                    <ul class="ark-list evolution">
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                    </ul>
                    <ul class="ark-list enlightenment">
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>

                    </ul>
                    <ul class="ark-list leap">
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>
                        <li class="ark-item">
                            <div class="img-box">
                                <span class="tier">N</span>
                                <img src="./asset/image/skeleton-img.png" alt="아크패시브">
                            </div>
                            <div class="text-box">
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    </div>
`



export {skeleton}