// chap01. setup canvas

// html에서 canvas 태그 확인
var canvas = document.querySelector('canvas');

// cnaavs를 2d로 드로잉.
var ctx = canvas.getContext('2d');

// canvas의 너비 높이는 브라우저 뷰포트의 너비와 높이와 동일하게 설정
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// 이 함수는 두 개의 숫자를 인수로 취해 그 사이의 범위에서 임의의 숫자를 반환함.
function random(min, max) {
    var num = Math.floor(Math.random() * (max - min +1)) + min;
    return num;
}

// chap02. 공 모델링하기

// 공 정의.
function Ball(x, y, velX, velY, color, size) {
    // x,y 좌표는 볼이 화면에서 시작할 수평 및 수직 좌표.
    this.x = x;
    this.y = y;
    // velX, velY는 각 공에 수평 및 수직 속도가 주어짐.
    this.velX = velX;
    this.velY = velY;
    // 각 공은 하나의 색을 얻음.
    this.color = color;
    // 각 공의 크기를 가짐.
    this.size = size;
}

// 공 그리기 draw() 함수 사용.
Ball.prototype.draw = function() {
    ctx.beginPath(); // 도형을 그리기 위한 준비.
    ctx.fillStyle = this.color; // fillStyle로 원하는 속성 설정.
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // arc()로 원 정의
    // x, y는 원의 중심 위치 / size : 호의 반경 / 마지막 두 매개 변수는 호가 그려지는 원 둘레의 시작 및 끝 각도를 지정함. (시작 : 0도 , 끝 : 2 * PI (360도))
    // 360도에 해당하는 라디안 값임.
    ctx.fill(); // 마지막으로 그림.
}

// 테스트 (HTML 공 그려보기)
/*
var testBall = new Ball(50, 100, 4, 4, 'blue', 10);

testBall.x;
testBall.size;
testBall.color;
testBall.draw();
*/

// 공 데이터 업데이트
Ball.prototype.update = function() {
    // 밑 네 부분(제어문)은 공이 캔버스의 가장자리에 도달했는지 여부를 확인.
    
    // x좌표가 캔버스의 너비보다 큰지 확인
    // (볼이 오른쪽 가장자리에서 벗어남)
    if ((this.x + this.size) >= width){
        this.velX = -(this.velX);
    }
    
    // x좌표가 0보다 작은지 확인
    // (볼이 왼쪽 가장자리에서 벗어남)
    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    // y좌표가 캔버스의 높이보다 큰지 확인
    // (볼이 위쪽 가장자리에서 벗어남)
    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    // y좌표가 0보다 작은지 확인
    // (볼이 아래쪽 가장자리에서 벗어남)
    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    // 해당 값을 x, y좌표에 더하기
    this.x += this.velX;
    this.y += this.velY;
}

// chap03. 공 애니메이션하기

var balls = [];

// Ball(x, y, velX, velY, color, size)
while (balls.length < 25) {
    var size = random(10, 20);
    var ball = new Ball (
        random(0 + size, width - size),
        random(0 + size,height - size),
        random(7, -7),
        random(-7, 7),
        'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')', size
    );

    balls.push(ball);
}

function loop() {
    // 캔버스 색상을 반투명한 검정색으로 설정
    // 이 네모 채우기가 있고 없고를 체험해보기.
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, width, height);

    // 프레임의 위치와 속도에 대한 필요한 업데이트 수행.
    for (var i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    // 함수가 실행될 때마다 함수 자체가 호출되어 반복 실행.
    requestAnimationFrame(loop);
}

// 애니메이션 시작!
// loop();

// chap04. 충돌 감지 추가

// 실행 문은 loop()안에 추가
// 충돌 감지 시 색깔 변경.
Ball.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

// 애니메이션 시작!
loop();