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
            alt="图片无法显示"
            data-num="0"
            style="left:${i%4*iW}px;top:${Math.floor(i/4)*iH}px"
        />`;
    }
    oVenue.innerHTML=imgstr;
}

function getNumber(rand){
    try{
        var randarr=new Set();
        for(let i=0;i<rand;i++){
            var num=Math.ceil(Math.random()*16)-1;
            if(oImgs[num].dataset.num==0){
                randarr.add(num);
            }
        }

        randarr = Array.from(randarr);
        if (randarr.length != rand) {
            getNumber(rand);
        } else {
            for (let i = 0; i < randarr.length; i++) {
                let iX = imgArr[Math.floor(Math.random() * imgArr.length)];
                oImgs[randarr[i]].src = './img/cube_' + iX + '.png';
                oImgs[randarr[i]].dataset.num = iX;
                css(oImgs[randarr[i]], 'scale', 0);
                oImgs[randarr[i]].style.transformOrigin = 'center center';
                mTween({
                    el: oImgs[randarr[i]],
                    target: {
                        scale: 1
                    },
                    time: 8,
                    type: 'backOut'
                })
            }
        }
    }catch(e){
        alert('游戏结束，game over');
        // throw 'is error';
    }
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
                    move : false,
                    now : [oImgs[i*len+j].offsetLeft,oImgs[i*len+j].offsetTop]
                };
            }else{
                newArr[i][j]={
                    num: Number(oImgs[i*len+j].dataset.num),
                    move: true,
                    now : [oImgs[i*len+j].offsetLeft,oImgs[i*len+j].offsetTop]
                };
            }
        }
    }
    return newArr;
}

initVenue();    //初始化场景数据
getNumber(2);    //获取2个随机数字

let dd=0;
function renderVenue(arr){
    let len=arr.length;
    let moveNum=0;
    dd=0;
    for(var n=0;n<len;n++){
        for(var m=0;m<len;m++){
            if(arr[n][m].move&&arr[n][m].info){
                moveNum++;
            }
        }
    }

    oSpan.innerHTML=source;
    for(let i=0;i<len;i++){
        for(let j=0;j<len;j++){
            move(i,j,arr,moveNum);
        }
    }
}

function move(i,j,arr,iNum){
    let len=arr.length;
    if(arr[i][j].move&&arr[i][j].info){
        mTween({
            el : oImgs[i*len+j],
            target : {
                left : arr[i][j].info.tar[0],
                top : arr[i][j].info.tar[1]
            },
            time : 15,
            type : 'easeOut',
            callBack(){
                dd++;
                if(dd>=iNum){
                    arr[i][j].info.elem.src='./img/cube_'+arr[i][j].info.num+'.png';
                    arr[i][j].info.elem.dataset.num = arr[i][j].info.num;
                    rest(arr);
                    getNumber(1);
                }
            }
        })
    }
}

function rest(arr){
    let len=arr.length;
    for(var i=0;i<len;i++){
        for(var j=0;j<len;j++){
            oImgs[i*len+j].src='./img/cube_'+arr[i][j].num+'.png';
            oImgs[i*len+j].dataset.num=arr[i][j].num;
            oImgs[i*len+j].style.left=arr[i][j].now[0]+'px';
            oImgs[i*len+j].style.top=arr[i][j].now[1]+'px';
        }
    }
}

function operation(init){
    let arr=init.arr;
    let len=arr.length;
    let ince=init.onff?0:len-1;
    let sign=init.onff?1:-1;
    for(let i=ince;init.onff?eval('i<len'):eval('i>=0');i+=sign){
        let q=ince;
        for(let j=ince;init.onff?eval('j<len'):eval('j>=0');j+=sign){
            let k=j+sign;
            let result=init.clock?arr[j][i].num:arr[i][j].num;
            if(result!=0&&(init.onff?eval('k<len'):eval('k>=0'))){
                let jv=init.clock?arr[k][i].num:arr[i][k].num;
                if(jv===0){
                    while(jv===0&&(init.onff?eval('k<len-1'):eval('k>0'))){
                        k+=sign;jv=init.clock?arr[k][i].num:arr[i][k].num;
                    }
                }
                
                if(init.clock){
                    if(result===jv){
                        arr[q][i].num=result+jv;
                        source+=arr[q][i].num;
                        arr[j][i].num=j!==q?0:arr[j][i].num;
                        arr[k][i].num=0;
                        arr[j][i].info={
                            elem : oImgs[q*len+i],
                            tar : arr[q][i].now,
                            num : arr[q][i].num
                        };
                        arr[k][i].info={
                            elem : oImgs[q*len+i],
                            tar : arr[q][i].now,
                            num : arr[q][i].num
                        }
                        j=k;
                    }else{
                        arr[q][i].num=arr[j][i].num;
                        arr[j][i].num=j!==q?0:arr[j][i].num;
                        arr[j][i].info={
                            elem : oImgs[q*len+i],
                            tar : arr[q][i].now,
                            num : arr[q][i].num
                        }
                    }
                }else{
                    if(result===jv){
                        arr[i][q].num=result+jv;
                        source+=arr[i][q].num;
                        arr[i][j].num=j!==q?0:arr[i][j].num;
                        arr[i][k].num=0;
                        arr[i][j].info={
                            elem : oImgs[i*len+q],
                            tar : arr[i][q].now,
                            num : arr[i][q].num
                        };

                        arr[i][k].info={
                            elem : oImgs[i*len+q],
                            tar : arr[i][q].now,
                            num : arr[i][q].num
                        }
                        j=k;
                    }else{
                        arr[i][q].num=arr[i][j].num;
                        arr[i][j].num=j!==q?0:arr[i][j].num;
                        arr[i][j].info={
                            elem : oImgs[i*len+q],
                            tar : arr[i][q].now,
                            num : arr[i][q].num
                        }
                    }
                }
                q+=sign;
            }else if((init.onff?eval('j+1>=len'):eval('j-1<0'))&&q!=j){
                if(init.clock){
                    arr[q][i].num=arr[j][i].num;
                    arr[j][i].num=0;
                    arr[j][i].info={
                        elem : oImgs[q*len+i],
                        tar : arr[q][i].now,
                        num : arr[q][i].num
                    };
                }else{
                    arr[i][q].num=arr[i][j].num;
                    arr[i][j].num=0;
                    arr[i][j].info={
                        elem : oImgs[i*len+q],
                        tar : arr[i][q].now,
                        num : arr[i][q].num
                    };
                }
            }
        }
    }
    return arr;
}

let clock=0;
document.onkeyup=function(ev){
    let pxarr=setArray();
    if(Math.floor(ev.timeStamp)-clock>600){
        clock=Math.floor(ev.timeStamp);
    }else{
        return null;
    }
    
    switch(ev.keyCode){
        case 37:
            renderVenue(operation({onff : true,arr : pxarr,clock : false}))
            break;
        case 38:
            renderVenue(operation({onff: true,arr: pxarr,clock : true}))
            break;
        case 39:
            renderVenue(operation({onff: false,arr: pxarr,clock : false}))
            break;
        case 40:
            renderVenue(operation({onff: false,arr: pxarr,clock : true}))
            break;
    }
}