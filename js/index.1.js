let total=16;
let oVenue=document.getElementsByClassName('venue')[0];
let oSpan=document.querySelector('.source span');
let oImgs=oVenue.getElementsByTagName('img');
let imgArr=[2,4];
let source=0;

function initVenue(){
    var imgstr='';
    var iW=oVenue.offsetWidth/Math.sqrt(total);
    var iH=oVenue.offsetHeight/Math.sqrt(total);
    for(var i=0;i<total;i++){
        imgstr+=`<img
            src="./img/cube_0.png"
            alt=""
            data-num="0"
            style="left:${i%4*iW}px;top:${Math.floor(i/4)*iH}px"
        />`;
    }
    oVenue.innerHTML=imgstr;
}

function getNumber(rand){
    try{
        var randarr = new Set();
        for(let i=0;i<rand;i++){
            var num = Math.ceil(Math.random()*16)-1;
            if(oImgs[num].dataset.num==0){
                randarr.add(num);
            }
        }

        randarr = Array.from(randarr);
        if(randarr.length!=rand){
            getNumber(rand);
        }else{
            for(var i=0;i<randarr.length;i++){
                let iX=getOddnum();
                oImgs[randarr[i]].src='./img/cube_'+iX+'.png';
                oImgs[randarr[i]].dataset.num=iX;
            }
        }
    }catch(e){
        alert('游戏结束,你死了');
    }
}

function getOddnum(){
    return imgArr[Math.floor(Math.random()*imgArr.length)];
}

function setArray(){
    var newArr=[];
    var len=Math.sqrt(total);
    for(let i=0;i<len;i++){
        newArr[i]=[];
        for(var j=0;j<len;j++){
            if(oImgs[i*len+j].dataset.num==0){
                newArr[i][j]={
                    num : 0,
                    target : [0,0],
                    current : [oImgs[i*len+j].offsetLeft,oImgs[i*len+j].offsetTop]
                };
            }else{
                newArr[i][j]={
                    num: Number(oImgs[i*len+j].dataset.num),
                    target: [0,0],
                    current : [oImgs[i*len+j].offsetLeft,oImgs[i*len+j].offsetTop]
                };
            }
        }
    }
    return newArr;
}

function operationLeft(arr){
    let len=arr.length;
    for(let i=0;i<len;i++){
        var q=0;
        for(let j=0;j<len;j++){
            var k=j+1;
            if(arr[i][j].num!=0&&k<len){
                var jv=arr[i][k].num;
                if(jv===0){
                    while(jv===0&&k<len-1){
                        k++;jv=arr[i][k].num;
                    }
                }
                if(arr[i][j].num===jv){
                    arr[i][q].num=arr[i][j].num+jv;
                    source+=arr[i][q].num;
                    arr[i][j].num=j!==q?0:arr[i][j].num;
                    arr[i][k].num=0;
                    k=k===j+1?k+=1:k;
                    j=k;
                }else{
                    arr[i][q].num=arr[i][j].num;
                    arr[i][j].num=j!==q?0:arr[i][j].num;
                }
                q++;
            }else if(j+1>=len&&q!=j){
                arr[i][q].num=arr[i][j].num;
                arr[i][j].num=0;
            }
        }
    }
    return arr;
}

function operationRight(arr){
    let len=arr.length;
    for(let i=len-1;i>=0;i--){
        var q=len-1;
        for(let j=len-1;j>=0;j--){
            var k=j;
            if(arr[i][j].num!=0&&j-1>=0){
                var jv=arr[i][j-1].num;
                if(jv===0){
                    k=j-1;
                    while(jv===0&&k>0){
                        k--;jv=arr[i][k].num;
                    }
                }
                if(arr[i][j].num===jv){
                    arr[i][q].num=arr[i][j].num+jv;
                    source+=arr[i][q].num;
                    arr[i][j].num=j!==q?0:arr[i][j].num;
                    k=k===j?k-=1:k;
                    arr[i][k].num=0;
                    j=k;
                }else{
                    arr[i][q].num=arr[i][j].num;
                    arr[i][j].num=j!==q?0:arr[i][j].num;
                }
                q--;
            }else if(j-1<0&&q!=j){
                arr[i][q].num=arr[i][j].num;
                arr[i][j].num=0;
            }
        }
    }
    return arr;
}

function operationTop(arr){
    let len=arr.length;
    for(let i=0;i<len;i++){
        var q = 0;
        for(let j=0;j<len;j++){
            var k=j;
            if(arr[j][i].num!=0&&j+1<=len-1){
                var jv=arr[j+1][i].num;
                if(jv===0){
                    k=j+1;
                    while(jv===0&&k<len-1){
                        k++;jv=arr[k][i].num;
                    }
                }
                if(arr[j][i].num===jv){
                    arr[q][i].num=arr[j][i].num+jv;
                    source+=arr[q][i].num;
                    arr[j][i].num=j!==q?0:arr[j][i].num;
                    k=k===j?k+=1:k;
                    arr[k][i].num=0;
                    j=k;
                }else{
                    arr[q][i].num=arr[j][i].num;
                    arr[j][i].num=j!==q?0:arr[j][i].num;
                }
                q++;
            }else if(j+1>=len&&q!=j){
                arr[q][i].num=arr[j][i].num;
                arr[j][i].num=0;
            }
        }
    }
    return arr;
}

function operationBottom(arr){
    let len=arr.length;
    for(let i=len-1;i>=0;i--){
        var q=len-1;
        for(let j=len-1;j>=0;j--){
            var k=j;
            if(arr[j][i].num!=0&&j-1>=0){
                var jv=arr[j-1][i].num;
                if(jv===0){
                    k=j-1;
                    while(jv===0&&k>0){
                        k--;jv=arr[k][i].num;
                    }
                }
                if(arr[j][i].num===jv){
                    arr[q][i].num=arr[j][i].num+jv;
                 source+=arr[q][i].num;
                    arr[j][i].num=j!==q?0:arr[j][i].num;
                    k=k===j?k-=1:k;
                    arr[k][i].num=0;
                    j=k;
                }else{
                    arr[q][i].num=arr[j][i].num;
                    arr[j][i].num=j!==q?0:arr[j][i].num;
                }
                q--;
            }else if(j-1<0&&q!=j){
                arr[q][i].num=arr[j][i].num;
                arr[j][i].num=0;
            }
        }
    }

    return arr;
}

initVenue();    //初始化场景数据
getNumber(2);    //获取2个随机数字

function renderVenue(arr){
    let len=arr.length;
    oSpan.innerHTML=source;
    for(var i=0;i<len;i++){
       for(var j=0;j<len;j++){
            oImgs[i*len+j].src='./img/cube_'+arr[i][j].num+'.png';
            oImgs[i*len+j].dataset.num=arr[i][j].num;
        }
    }

    getNumber(1);
}

let pxarr=setArray();

document.onkeydown=function(ev){
    pxarr=setArray();
    switch(ev.keyCode){
        case 37:
            renderVenue(operationLeft(pxarr));
            break;
        case 38:
            renderVenue(operationTop(pxarr));
            break;
        case 39:
            renderVenue(operationRight(pxarr));
            break;
        case 40:
            renderVenue(operationBottom(pxarr));
            break;
    }
}