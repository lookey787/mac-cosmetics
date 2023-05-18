// jQuery
$(document).ready(function () {
    //모바일 메뉴
    const mobileMenu = $('.mobile-menu'),
        mobileBt = $('.all-menu'),
        mMenu = $('.m-menu'),
        mMenuLi = $('.m-menu > li'),
        mMainMenu = $('.m-mainmenu'),
        mSubMenu = $('.m-submenu'),
        mDepth3 = $('.m-depth3');

    mobileBt.click(function (e) {
        e.preventDefault();
        let windowWidth = window.innerWidth;
        if (window > 1000) {
            return;
        }
        mMainMenu.removeClass('m-mainmenu-active')
        mSubMenu.hide();
        mDepth3.hide();
        mobileMenu.toggleClass('mobile-menu-active')
        let temp = mobileMenu.hasClass('mobile-menu-active')
        if (temp) {
            $('html').css('overflow', 'hidden')
            $(this).find('img').attr('src', 'images/search_close.png')
        } else {
            $('html').css('overflow-y', 'auto')
            $(this).find('img').attr('src', 'images/main_allmenu.png')
        }
    })
    //depth1 - li a 메뉴 클릭시
    $.each(mMenuLi, function (index, item) {
        let depth1 = $(this).find('.m-mainmenu')
        depth1.click(function (event) {
            event.preventDefault();
            //현재 포커스가 있는지 없는지 확인
            let temp = $(this).hasClass('m-mainmenu-active')
            if (temp) {
                //depth2가 열린상태
                $(this).removeClass('m-mainmenu-active')
                $(this).next().stop().slideUp();
            } else {
                mMainMenu.removeClass('m-mainmenu-active')
                $(this).addClass('m-mainmenu-active')
                mSubMenu.stop().slideUp();
                $(this).next().stop().slideDown();
            }
        })
    })
    //depth2 - li a 메뉴 클릭시
    console.log(mSubMenu)
    $.each(mSubMenu, function (index, item) {
        let mSubMenuA = $(this).find('>li>a')
        mSubMenuA.click(function (e) {
            let depth3 = $(this).next();
            console.log(depth3)
            if (depth3.length) {
                e.preventDefault();
                let tempShow = depth3.css('display')
                if (tempShow == 'none') {
                    mDepth3.stop().slideUp();
                    depth3.stop().slideDown();
                }
            } else {
                depth3.stop().slideUp();
            }
        })
    })




    const section = $('.wrap > section')
    const footer = $('.footer')
    let sectionSpeed = 500;

    let sectionPos = [];
    // 각각의 section의 위치값 저장. 홈페이지 리사이즈 되었을때
    let sectionIndex = 0;
    // 인덱스값도 필요함. 디폴트로 0 저장되어있음.
    let scrolling = false;
    // false일때 연속 휠 막기. section 내릴때 막 휠해도 한section만 내려가게 하기위해
    // true일때 풀페이지 모드 on / false일때 fullpage모드 off 
    let wheeling = true;
    const sectionMenu = $('.section-menu')
    // 화면 사이즈 체크
    // 화면 너비 1000px 이하에서는 휠작동시켜도 fullpage식 섹션 전환이 되지 않게 막아주는 변수
    // true일때 풀페이지식 섹션전환이 작동됨. 

    function wheelCheckFn() {
        let windowWidth = window.innerWidth;
        // 윈도우가 1000이하면 풀페이지 모드 off + section메뉴 없앰
        if (windowWidth <= 1000) {
            wheeling = false;
            sectionMenu.hide();
        } else {
            wheeling = true;
            sectionMenu.show();
        }
        // console.log(windowWidth)
    }
    wheelCheckFn();
    // $(window).resize(function(){
    //     wheelCheckFn();
    //     resetSection();
    // }) 확인하기위해서 씀

    // 위치파악(y스크롤이동 px)
    // 화면 리사이징이 일어날때마다 호출됨
    // 화면 리사이징시 변경되는 section위치값을 다시 sectioPos배열 안에 저장함.
    function resetSection() {
        sectionPos = [];
        $.each(section, function (index, item) {
            let tempY = $(this).offset().top;
            // this는 여러 section중에 하나하나씩 첫번째면 첫번째, 두번째면 두번째섹션
            // 받는 값은 index값이다. 이건 약속이다. 
            // console.log(index + ":" + tempY)
            tempY = Math.ceil(tempY);
            sectionPos[index] = tempY;

        })
        sectionPos[sectionPos.length] = Math.ceil(footer.offset().top)
        console.log(sectionPos);
        // 0~6번방과 푸터를 저장한다?
    }
    // 최초에 새로고침 또는 실행시 위치값파악 => sectionPos배열에 저장
    resetSection();
    // 
    let sectionTotal = sectionPos.length;

    $(window).resize(function () {
        wheelCheckFn();
        // 너비체크
        resetSection();
        // 위치체크
        if (wheeling) {
            // gsap.새($(요소명),durationTime.{설정})
            gsap.to($('html'), sectionSpeed / 1000, {
                // 1000으로 나누면 0.5초 이렇게 나옴
                scrollTop: sectionPos[sectionIndex],
                onComplete: function () {
                    scrolling: false;
                }
                // 리사이즈될때 스크롤탑을 섹션 위치로 움직여라
                // ex) 위치가 이렇게 [0,734,1400,1500,2000]일때 위치가 1200에 있을때 734인 1번 index(0부터 시작하니까) 734의 index값인 1이 값에 들어간다.
            })
        }
    })
    //스크롤바의 위쪽 위치값을 파악한다.
    $(window).scroll(function () {
        if (wheeling) {
            return;
            // wheeling이 트루되어있으면 아무것도 안하고 나감 
        }
        let tempY = $(window).scrollTop();
        tempY = Math.ceil(tempY);
        for (let i = sectionTotal - 1; i >= 0; i--) {
            let tempMax = sectionPos[1];
            if (tempY >= tempMax) {
                sectionIndex = i;
                break;
            }
            // 요소.오프셋탑은 그 요소의 위치, 스크롤탑은 스크롤한 양이다. 
            // 섹션 index번호와 스크롤양을 비교해서 해당하는 섹션 index값을 찾아줌. 현재 위치에 해당하는 section번호를 넘겨줌.
        }
    })
    // $(window).bind('mousewheel', function(event){
    //     if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
    //         // scroll up
    //         console.log("스크롤 위로");
    //         // wheel델타값이 양수이거나 detail이 음수이면,"스크롤 위로"
    //     }
    //     else {
    //         // scroll down
    //         console.log("스크롤 아래로");
    //     }
    // });
    let resizeTimer;
    $(window).bind('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout
            (resizeFunction, 500)
    })
    function resizeFunction() {
        //리사이즈시 실행할 코드
        wheelCheckFn();
        // 너비체크
        resetSection();
        // 위치체크
        if (wheeling) {
            // gsap.새($(요소명),durationTime.{설정})
            gsap.to($('html'), sectionSpeed / 1000, {
                // 1000으로 나누면 0.5초 이렇게 나옴
                scrollTop: sectionPos[sectionIndex],
                onComplete: function () {
                    scrolling: false;
                }
                // 리사이즈될때 스크롤탑을 섹션 위치로 움직여라
                // ex) 위치가 이렇게 [0,734,1400,1500,2000]일때 위치가 1200에 있을때 734인 1번 index(0부터 시작하니까) 734의 index값인 1이 값에 들어간다.
            })
        }

    }
    // 마우스 휠체크
    $(window).bind('mousewheel DOMMouseScroll', function (event) {

        let distance = event.originalEvent.wheelDelta;
        if (distance == null) {
            distance = event.originalEvent.detail * -1;
        }
        console.log(distance)
        // 화면 사이즈에 따른 작동여부
        if (wheeling != true) {
            return;
        }
        // wheeling이 트루일때 연속휠 막아준다
        if (scrolling) {
            return;
        }


        // 연속휠 작동 막기
        scrolling = true;
        if (distance < 0) {
            sectionIndex++;
            if (sectionIndex >= sectionTotal) {
                sectionIndex = sectionTotal - 1;
            }
            console.log(sectionIndex)
        } else {
            sectionIndex--;
            if (sectionIndex <= 0) {
                sectionIndex = 0;
            }
            console.log(sectionIndex)
        }
        gsap.to($('html'), sectionSpeed / 1000, {
            scrollTop: sectionPos[sectionIndex],
            // scrollTo 대신 scrollTop으로 해도됨. 어디까지 이동할때 쓰이는거
            onComplete: function () {
                scrolling = false
            }
        })
        sectionColor();
        // 스크롤할때 색깔 바뀌게 하기
    })
    // 섹션메뉴클릭시 섹션이동
    const sectionLink = $('.section-menu a')
        // header = $('.header')
    console.log(sectionLink)
    $.each(sectionLink, function (index, item) {
        $(this).click(function (e) {
            e.preventDefault();
            // gsap.to($('html'), sectionSpeed/1000, {
            //     scrollTop: sectionPos[index],

            //     onComplete: function(){
            //         scrolling=false;
            //     }
            // })
            moveSection(index);
            sectionColor();
        })
    })
    function moveSection(_index) {
        sectionIndex = _index;
        gsap.to($('html'), sectionSpeed / 1000, {
            scrollTo: sectionPos[sectionIndex],
            onComplete: function () {
                scrolling = false;
            }
        })
    }
    function sectionColor() {
        // 포커스 표현
        sectionLink.removeClass('section-menu-active')
        // 전역변수라 조작되는거에 따라 변함. 그래서 let sectionLink로 주면 안됨. 그럼 지역변수로 바껴서 실행이 안됨
        sectionLink.eq(sectionIndex).addClass('section-menu-active')
        // sectionLink.eq($(this).sectionIndex()).header.addClass('best-on')
        // 색상 표현
        sectionLink.removeClass('section-menu-blue')
        sectionLink.eq(sectionIndex).addClass('section-menu-blue')
    }
    // 최초 또는 새로고침시 셋팅
    sectionColor();






    //검색필드 기능
    //검색필드를 보여주는 버튼
    const searchBt = $('.search-bt')
    //검색필드 요소
    const searchWrap = $('.search-wrap')
    searchWrap.click(function (e) {
        e.stopPropagation();
    })
    searchBt.click(function (event) {
        event.preventDefault();
        event.stopPropagation()
        searchWrap.fadeToggle(300)
        //검색버튼 이미지 교체하기
        let imgName = $(this).find('img').attr('src')
        // console.log(imgName)
        if (imgName == 'images/gnb_search_white.png') {
            $(this).find('img').attr('src', 'images/gnb_search_white_close.png')
            // $(this).css('background', '#3d66c4')
        } else {
            $(this).find('img').attr('src', 'images/gnb_search_white.png')
            // $(this).css('background', '#fff')
        }
    })
    $('body').click(function () {
        searchWrap.fadeOut(300)
        searchBt.find('img').attr('src', 'images/gnb_search_white.png')


    })
});

// vanilla Javascript
window.onload = function () {
    //메뉴 기능
    const header = $('.header'),
        gnb = $('.gnb'),
        searchBt = $('.search-bt'),
        myPage = $('.my-page'),
        cartBt = $('.cart-bt')
        // best = $('.best')
        // submenu = $('.')

    let gnbHeight = gnb.height();
    // console.log(gnbHeight)
    gnb.mouseenter(function () {
        header.css('height', gnbHeight)
        header.addClass('active')
        searchBt.find('img').attr('src', 'images/gnb_search_black.png')
        myPage.find('img').attr('src', 'images/gnb_mypage_black.png')
        cartBt.find('img').attr('src', 'images/gnb_cart_black.png')

    });
    gnb.mouseleave(function () {
        header.css('height', 100)
        header.removeClass('active')
        searchBt.find('img').attr('src', 'images/gnb_search_white.png')
        myPage.find('img').attr('src', 'images/gnb_mypage_white.png')
        cartBt.find('img').attr('src', 'images/gnb_cart_white.png')

    });
   




    // var menu = ['Slide 1', 'Slide 2', 'Slide 3'] 
    var swiper = new Swiper(".sw-new-visual", {
        slidesPerView: 3,
        // spaceBetween: 30,
        loop: true,
        autoplay: true,
        // effect: "fade",
        speed:800,

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            //   renderBullet: function (index, className) {
            //     return '<span class="' + className + '">' + (menu[index]) + '</span>';
            //   },
        },

        navigation: {
            nextEl: ".button-next",
            prevEl: ".button-prev",
        },
        // on: {
        //     slideChange: function () {
        //       alert('슬라이드 변경');
        //     }
        //   }
    });

    var swiper = new Swiper(".sw-tab", {
        slidesPerView: 2,
        spaceBetween: 30,
        // autoplay: true,
        // effect: "fade-in",
        // speed:3000,
        loop: true,
        navigation: {
            nextEl: ".sw-button-next",
            prevEl: ".sw-button-prev",
        },

    });

    $(function () {
        const tabAnchor = $('.tabs li'),
            tabPanel = $('.tabpanel'),
            tabPanel2 = $('.background-img .bg')

        //링크를 클릭했을 때 할일
        tabAnchor.click(function (e) {
            e.preventDefault();
            //내가 클릭한 탭메뉴의 a태그만 active추가
            tabAnchor.find('a').removeClass('is-active');
            $(this).find('a').addClass('is-active')


            tabPanel.hide(); //display: none;
            tabPanel.eq($(this).index()).show();
            tabPanel2.hide();
            tabPanel2.eq($(this).index()).fadeIn();
            // let target = $(this).find('a').attr('href')
            // $(target).find('a').show();
            // console.log($(this).index())
        })
        tabAnchor.eq(0).trigger("click")
    });












};



