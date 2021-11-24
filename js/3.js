/*-------------------------------计时器部分---------------------------*/
var oclock = document.getElementById("clock");
var start1 = oclock.innerHTML;
var finish = "00:00:00:00";
var timer = null;

function ReStartCountDown() {
    oclock.innerHTML = "00:5:00:00";
    start1 = oclock.innerHTML;
    timer = setInterval("onTimer()", 100);//100ms的定时器
}

function onTimer() {
    if (start1 == finish)//如果倒计时结束清除时间函数
    {
        clearInterval(timer);
        start1 = "00:00:00:10";//(清除时间函数后还是会执行一次 所以多给一个10ms再动态赋值)
    }
    var hms = new String(start1).split(":");//以:作为分隔符号取字符串内的数据
    var ms = new Number(hms[3]);//给每个数据定义对象
    var s = new Number(hms[2]);
    var m = new Number(hms[1]);
    var h = new Number(hms[0]);
    ms -= 10;//每次执行ms减10
    if (ms < 0)//判断时间并进行变化
    {
        ms = 90;
        s -= 1;
        if (s < 0) {
            s = 59;
            m -= 1;
        }
        if (m < 0) {
            m = 59;
            h -= 1;
        }
    }
    var ms = ms < 10 ? ("0" + ms) : ms;//如果出现个位数给个位数前面添加0
    var ss = s < 10 ? ("0" + s) : s;
    var sm = m < 10 ? ("0" + m) : m;
    var sh = h < 10 ? ("0" + h) : h;
    start1 = sh + ":" + sm + ":" + ss + ":" + ms;
    oclock.innerHTML = start1;//重新给oclock赋值
}


/**
 * 下棋部分
 *
 */
var canvas;
var context;
var isWhite = true;//设置是否该轮到白棋
var isWell = false;//设置该局棋盘是否赢了，如果赢了就不能再走了
var img_b = new Image();
img_b.src = "./img/w.png";//白棋图片
var img_w = new Image();
img_w.src = "./img/b.png";//黑棋图片
var chessData = new Array(15);//这个为棋盘的二维数组用来保存棋盘信息，初始化0为没有走过的，1为白棋走的，2为黑棋走的
for (var x = 0; x < 15; x++) {
    chessData[x] = new Array(15);
    for (var y = 0; y < 15; y++) {
        chessData[x][y] = 0;
    }
}

function drawRect() {//页面加载完毕调用函数，初始化棋盘
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    for (var i = 0; i <= 640; i += 40) {//绘制棋盘的线
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(640, i);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, 640);
        context.closePath();
        context.stroke();
    }
}
function play(e) {//鼠标点击时发生
    var x = parseInt((e.clientX - 20) / 40);//计算鼠标点击的区域，如果点击了（65，65），那么就是点击了（1，1）的位置
    var y = parseInt((e.clientY - 20) / 40);

    if (chessData[x][y] != 0) {//判断该位置是否被下过了
        alert("你不能在这个位置下棋");
        return;
    }

    if (isWhite) {
        ReStartCountDown();
        isWhite = false;
        drawChess(1, x, y);
    }
    else {
        ReStartCountDown();
        isWhite = true;
        drawChess(2, x, y);
    }

}
function drawChess(chess, x, y) {//参数为，棋（1为白棋，2为黑棋），数组位置
    if (isWell == true) {
        alert("已经结束了，如果需要重新玩，请刷新");
        return;
    }
    if (x >= 0 && x < 15 && y >= 0 && y < 15) {
        if (chess == 1) {
            context.drawImage(img_w, x * 40 + 20, y * 40 + 20);//绘制白棋
            chessData[x][y] = 1;
        }
        else {
            context.drawImage(img_b, x * 40 + 20, y * 40 + 20);
            chessData[x][y] = 2;
        }
        judge(x, y, chess);
    }
}
function judge(x, y, chess) {//判断该局棋盘是否赢了
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;

    //左右判断
    for (var i = x; i >= 0; i--) {
        if (chessData[i][y] != chess) {
            break;
        }
        count1++;
    }
    for (var i = x + 1; i < 15; i++) {
        if (chessData[i][y] != chess) {
            break;
        }
        count1++;
    }
    //上下判断
    for (var i = y; i >= 0; i--) {
        if (chessData[x][i] != chess) {
            break;
        }
        count2++;
    }
    for (var i = y + 1; i < 15; i++) {
        if (chessData[x][i] != chess) {
            break;
        }
        count2++;
    }
    //左上右下判断
    for (var i = x, j = y; i >= 0, j >= 0; i--, j--) {
        if (chessData[i][j] != chess) {
            break;
        }
        count3++;
    }
    for (var i = x + 1, j = y + 1; i < 15, j < 15; i++, j++) {
        if (chessData[i][j] != chess) {
            break;
        }
        count3++;
    }
    //右上左下判断
    for (var i = x, j = y; i >= 0, j < 15; i--, j++) {
        if (chessData[i][j] != chess) {
            break;
        }
        count4++;
    }
    for (var i = x + 1, j = y - 1; i < 15, j >= 0; i++, j--) {
        if (chessData[i][j] != chess) {
            break;
        }
        count4++;
    }

    if (count1 === 5 || count2 === 5 || count3 === 5 || count4 === 5) {
        if (chess == 1) {
            alert("白棋赢了");
        }
        else {
            alert("黑棋赢了");
        }
        isWell = true;//设置该局棋盘已经赢了，不可以再走了
    }
    if (count1 > 5 || count2 > 5 || count3 > 5 || count4 > 5) {
        if (chess == 1) {
            alert("白器禁手,黑棋赢了");
        }
        else {
            alert("黑棋禁手,白棋赢了");
        }
        isWell = true;//设置该局棋盘已经赢了，不可以再走了
    }
}