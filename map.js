var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(36.601659208879646, 127.29777601594054), // 지도의 중심좌표
        level: 6 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);


// 이동 제한 ... 왜 안 되지 ? ㅠ 
var pos1 = new kakao.maps.LatLng(36, 127);
var pos2 = new kakao.maps.LatLng(37, 128);

var bounds = new kakao.maps.LatLngBounds(pos1, pos2);

var constrainBounds = function() {
    var center = map.getCenter();

    if (!bounds.contain(center)) {
        map.setCenter(new kakao.maps.LatLng(36.601659208879646, 127.29777601594054));
    }
};

kakao.maps.event.addListener( map, 'drag', constrainBounds); 
kakao.maps.event.addListener( map, 'zoom_changed', constrainBounds);


//현재 브라우저크기 변하면 중심을 다시 셋팅하는 함수
/* [html 화면 사이즈 변경 이벤트 감지] */
window.onresize = function() {
    console.log("");
    console.log("[window onresize] : [start]");
    console.log(""); 

    // [이벤트 함수 호출]
    panTo(new kakao.maps.LatLng(36.601659208879646, 127.29777601594054));
};

//중심으로 이동하는 함수
function panTo(moveLatLon) {

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);            
}     

// // // 아래 코드는 지도 위의 마커를 제거하는 코드입니다
// // // marker.setMap(null);    

// 마커이벤트 1
var MARKER_WIDTH = 36, // 기본, 클릭 마커의 너비
    MARKER_HEIGHT = 36, // 기본, 클릭 마커의 높이
    OFFSET_X = 12, // 기본, 클릭 마커의 기준 X좌표
    OFFSET_Y = MARKER_HEIGHT, // 기본, 클릭 마커의 기준 Y좌표
    OVER_MARKER_WIDTH = 42, // 오버 마커의 너비
    OVER_MARKER_HEIGHT = 42, // 오버 마커의 높이
    OVER_OFFSET_X = 13, // 오버 마커의 기준 X좌표
    OVER_OFFSET_Y = OVER_MARKER_HEIGHT, // 오버 마커의 기준 Y좌표
    SPRITE_MARKER_URL1 = 'pin2.png',
    SPRITE_MARKER_URL2 = 'pin.png'; // 스프라이트 마커 이미지 URL

var markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT), // 기본, 클릭 마커의 크기
    markerOffset = new kakao.maps.Point(OFFSET_X, OFFSET_Y), // 기본, 클릭 마커의 기준좌표
    overMarkerSize = new kakao.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT), // 오버 마커의 크기
    overMarkerOffset = new kakao.maps.Point(OVER_OFFSET_X, OVER_OFFSET_Y); // 오버 마커의 기준 좌표


// 마커를 표시할 위치와 title 객체 배열입니다
var positions = [];

for ( let i=0 ; i < jsonData.length ; i++ ) {
    const value = jsonData[i];
    var newPos = {}
    newPos["idx"] = i;
    console.log(newPos);
    newPos["title"] = value["Place"];  
    const coords = jsonData[i]["Coord"].split(','); 
    newPos["latlng"] = new kakao.maps.LatLng( parseFloat(coords[0]), parseFloat(coords[1]));
    positions.push(newPos);
}

var  selectedMarker = null;
/*
    {
        title: '카카오', 
        latlng: new kakao.maps.LatLng(36.601659208879646, 127.29777601594054)
    },
    {
        title: '생태연못', 
        latlng: new kakao.maps.LatLng(36.602, 127.29777601594054)
    },
    {
        title: '텃밭', 
        latlng: new kakao.maps.LatLng(36.601659208879646, 127.299)
    },
    {
        title: '근린공원',
        latlng: new kakao.maps.LatLng(36.6013, 127.29777601594054)
    }
]
*/

// 지도 위에 마커를 표시합니다
for (var i = 0, len = positions.length; i < len; i++) {
    var gapX = (MARKER_WIDTH), // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
        originY = (MARKER_HEIGHT) * i, // 스프라이트 이미지에서 기본, 클릭 마커로 사용할 Y좌표 값
        overOriginY = (OVER_MARKER_HEIGHT) * i, // 스프라이트 이미지에서 오버 마커로 사용할 Y좌표 값
        normalOrigin = new kakao.maps.Point(0, originY), // 스프라이트 이미지에서 기본 마커로 사용할 영역의 좌상단 좌표
        clickOrigin = new kakao.maps.Point(gapX, originY), // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
        overOrigin = new kakao.maps.Point(gapX * 2, overOriginY); // 스프라이트 이미지에서 클릭 마커로 사용할 영역의 좌상단 좌표
        
    // 마커를 생성하고 지도위에 표시합니다
    addMarker(positions[i].latlng, normalOrigin, overOrigin, clickOrigin, positions[i].title, positions[i].idx);

}

// 마커를 생성하고 지도 위에 표시하고, 마커에 mouseover, mouseout, click 이벤트를 등록하는 함수입니다
function addMarker(position, normalOrigin, overOrigin, clickOrigin, title, idx) {

    // 기본 마커이미지, 오버 마커이미지, 클릭 마커이미지를 생성합니다
    var normalImage = createMarkerImage(SPRITE_MARKER_URL1, markerSize, markerOffset, normalOrigin),
        overImage = createMarkerImage(SPRITE_MARKER_URL2, overMarkerSize, overMarkerOffset, overOrigin),
        clickImage = createMarkerImage(SPRITE_MARKER_URL2, markerSize, markerOffset, clickOrigin);
    
    // 마커를 생성하고 이미지는 기본 마커 이미지를 사용합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: position,
        image: normalImage
    });

    // 마커 객체에 마커아이디와 마커의 기본 이미지를 추가합니다
    marker.normalImage = normalImage;

    // 마커에 mouseover 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseover', function() {

        // 클릭된 마커가 없고, mouseover된 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 오버 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(overImage);
        }
    });

    // 마커에 mouseout 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseout', function() {

        // 클릭된 마커가 없고, mouseout된 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 기본 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(normalImage);
        }
    });

    // 마커에 click 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {

        // 클릭된 마커가 없거나, click 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 클릭 이미지로 변경합니다
        // !selectedMarker || selectedMarker !== marker
        if (true) {

            // 클릭된 마커 객체가 null이 아니면
            // 클릭된 마커의 이미지를 기본 이미지로 변경하고
            !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);

            // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
            marker.setImage(clickImage);

            // data 채우기 
            const tags = jsonData[idx]["Tag"].split(',');
            document.getElementsByClassName("tags")[0].innerHTML = tags[0];
            document.getElementsByClassName("tags")[1].innerHTML = tags[1];
            document.getElementsByClassName("tags")[2].innerHTML = tags[2];
            document.getElementsByClassName("tag-item")[0].innerHTML = tags[0];
            document.getElementsByClassName("tag-item")[1].innerHTML = tags[1];
            document.getElementsByClassName("tag-item")[2].innerHTML = tags[2];
            document.getElementById("tag-marker").innerHTML = jsonData[idx]["Place"];

            document.getElementById("tag").value = idx;

            // tag 컴포넌트 띄우기 
            document.getElementById("tag-marker").style.display = "flex";
            document.getElementById("tag-marker").style.transform = "scale(1, 1)";
            document.getElementById("tag-back").style.display = "block";
            document.getElementsByClassName("tags")[0].style.transform = "scale(1, 1)";
            document.getElementsByClassName("tags")[1].style.transform = "scale(1, 1)";
            document.getElementsByClassName("tags")[2].style.transform = "scale(1, 1)";

            setDraggable(false);

            panTo(position);
        }

        // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
        selectedMarker = marker;
    });

    // 마커에 표시할 인포윈도우를 생성합니다 
    var infowindow = new kakao.maps.InfoWindow({
        //content: title // 인포윈도우에 표시할 내용
    });

    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다 
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
    // kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
    // kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

};


// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function() {
        infowindow.open(map, marker);
    };
};

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
    return function() {
        infowindow.close();
    };
};

// MakrerImage 객체를 생성하여 반환하는 함수입니다
function createMarkerImage(markerSprite, markerSize, offset, spriteOrigin) {
    var markerImage = new kakao.maps.MarkerImage(
        markerSprite, // 스프라이트 마커 이미지 URL
        markerSize, // 마커의 크기
        {
            offset: offset, // 마커 이미지에서의 기준 좌표
        }
    );
    
    return markerImage;
};

// 버튼 클릭에 따라 지도 이동 기능을 막거나 풀고 싶은 경우에는 map.setDraggable 함수를 사용합니다
function setDraggable(draggable) {
    // 마우스 드래그로 지도 이동 가능여부를 설정합니다
    map.setDraggable(draggable);    
};

document.getElementById("title").onclick = function () {
    map.setCenter(new kakao.maps.LatLng(36.601659208879646, 127.29777601594054));
    document.getElementById("info").style.transition = "all 1s";
    document.getElementById("info").style.top = "100vh";
    document.getElementById("tag-marker").style.transform = "scale(1, 1)";
    document.getElementsByClassName("tags")[0].style.transform = "scale(1, 1)";
    document.getElementsByClassName("tags")[1].style.transform = "scale(1, 1)";
    document.getElementsByClassName("tags")[2].style.transform = "scale(1, 1)";
    document.getElementById("footer").style.display = "flex";
    document.getElementById("logo").style.display = "block";
};
