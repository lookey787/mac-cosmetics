// https://developers.google.com/youtube/iframe_api_reference?hl=ko
 
 // 2. This code loads the IFrame Player API code asynchronously.
 var tag = document.createElement('script');

 tag.src = "https://www.youtube.com/iframe_api";

 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 // 3. This function creates an <iframe> (and YouTube player)
 //    after the API code downloads.
 // onYouTubePlayerAPIReady 함수 이름은,
// Youtube IFrame Player API에서 사용하는 이름이기 때문에,
// 다르게 지정하면 동작하지 않습니다!
// 그리고 함수는 전역(Global) 등록해야 합니다!



// https://www.youtube.com/watch?v=Pn4o-j52rKY 
 function onYouTubeIframeAPIReady() {
    new YT.Player('player', {
    //  height: '360',
    //  width: '640',
     videoId: 'Pn4o-j52rKY', //최초재생할 유투브 영상 아이디 //  https://www.youtube.com/watch?v=An6LvWQuj_8
     playerVars: {
        autoplay: true, //자동재생 유무
        loop: true, //반복 재생 유무
        playlist:'Pn4o-j52rKY', //반복재생할 유투브 영상 id 목록
        controls: 0,
     },
     events: {
        //영상이 준비되었을때
        onReady: function(event){
            event.target.mute() //음소거
        }
     }
   });
 }