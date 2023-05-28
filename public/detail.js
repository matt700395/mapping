function openInfo() {
    document.getElementById("info").style.transition = "all 1s";
    document.getElementById("info").style.top = "16vh";
    document.getElementById("tag-marker").style.transform = "scale(0, 0)";
    document.getElementById("footer").style.display = "none";
    document.getElementById("logo").style.display = "none";
    document.getElementsByClassName("tags")[0].style.transform = "scale(0, 0)";
    document.getElementsByClassName("tags")[1].style.transform = "scale(0, 0)";
    document.getElementsByClassName("tags")[2].style.transform = "scale(0, 0)";


    
    // data 채우기
    let idx = document.getElementById("tag").value;
    document.getElementById("place").innerHTML = jsonData[idx]["Place"];
    document.getElementById("Q1").innerHTML = jsonData[idx]["Q1"];
    document.getElementById("Q2").innerHTML = jsonData[idx]["Q2"];
    document.getElementById("Q3").innerHTML = jsonData[idx]["Q3"];
    document.getElementById("Q4").innerHTML = jsonData[idx]["Q4"];
    document.getElementById("writer").innerHTML = jsonData[idx]["Writer"];
    if (  jsonData[idx]["Category"] == "Last") {
        document.getElementById("category").innerHTML = "마지막으로 방문하고 싶은 곳은 어디인가요?";
    } else {
        document.getElementById("category").innerHTML = "돌아와서 처음으로 방문하고 싶은 곳은 어디인가요?";
    }
    const img = document.querySelector("img")
    img.src = jsonData[idx]["Image1"];
}



function closeInfo() {
    document.getElementById("info").style.transition = "all 1s";
    document.getElementById("info").style.top = "100vh";
    document.getElementById("tag-marker").style.transform = "scale(1, 1)";
    document.getElementsByClassName("tags")[0].style.transform = "scale(1, 1)";
    document.getElementsByClassName("tags")[1].style.transform = "scale(1, 1)";
    document.getElementsByClassName("tags")[2].style.transform = "scale(1, 1)";
    document.getElementById("footer").style.display = "flex";
    document.getElementById("logo").style.display = "block";
}

function cancelInfo() {
    setDraggable(true);
    document.getElementById("tag-marker").style.transform = "scale(0, 0)";
    document.getElementById("tag-back").style.display = "none";
    document.getElementsByClassName("tags")[0].style.transform = "scale(0, 0)";
    document.getElementsByClassName("tags")[1].style.transform = "scale(0, 0)";
    document.getElementsByClassName("tags")[2].style.transform = "scale(0, 0)";
}

