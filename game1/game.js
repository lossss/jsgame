imgFromPath = function(src) {
    var img = new Image()
    img.src = src
    return img
}
//滑块类
class Paddle {
    constructor(img, x, y, speed) {
        this.img = imgFromPath(img)
        this.x = x
        this.y = y
        this.speed = speed
    }
    moveRight() {
        this.x -= this.speed
    }
    moveLeft() {
        this.x += this.speed
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }
}
var __main = function() {
    log = console.log.bind(console)
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')
    var rightdown = false
    var leftdown = false

    var paddle = new Paddle('paddle.png', 150, 200, 5)

    window.addEventListener('keydown', function(event) {
        var key = event.key
        if (key == "a") {
            rightdown = true
        } else if (key == "d") {
            leftdown = true
        }
    })
    window.addEventListener('keyup', function(event) {
        if (event.key == "a") {
            rightdown = false
        } else if (event.key == "d") {
            leftdown = false
        }
    })
    setInterval(function() {
        if (rightdown == true) {
            paddle.moveRight()
        } else if (leftdown == true) {
            paddle.moveLeft()
        }
        //清屏
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        //重新画图
        ctx.drawImage(paddle.img, paddle.x, paddle.y)
    }, 1000 / 30) //1000 1秒 一秒钟刷新30张
}
__main()
