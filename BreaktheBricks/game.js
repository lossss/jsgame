log = console.log.bind(console)
imgFromPath = function(src) {
    var img = new Image()
    img.src = src
    return img
}
var Game = function() {
    var g = {
        actions: {},
        keydowns: {}
    }
    var canvas = document.getElementById('canvas')
    var context = canvas.getContext('2d')
    g.canvas = canvas
    g.context = context
    g.drawImage = function(img, width = img.img.width, height = img.img.height) {
        g.context.drawImage(img.img, img.x, img.y, width, height)
    }
    g.clear = function() {
        g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)
    }
    g.registerAction = function(key, callback) {
        g.actions[key] = callback
    }
    window.addEventListener('keydown', function(event) {
        g.keydowns[event.key] = true
    })
    window.addEventListener('keyup', function() {
        g.keydowns[event.key] = false
    })

    setInterval(function() {
        var actions = Object.keys(g.actions)
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i]
            if (g.keydowns[key]) {
                g.actions[key]()
            }
        }
        g.clear()
        g.update()
        g.draw()
    }, 1000 / 30)
    return g
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
    collide(ball) {
        if (ball.y + 50 > this.y) {
            if (ball.x > this.x && ball.x < this.x + this.img.width) {
                return true
            }
        }
        return false
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }
}
//ball
class Ball {
    constructor(img, x, y, speedX, speedY) {
        this.img = imgFromPath(img)
        this.x = x
        this.y = y
        this.speedX = speedX
        this.speedY = speedY
        this.fired = false
    }

    move() {
        if (this.fired) {
            log(this.x)
            log(this.y)
            if (this.x < 0 || this.x > 400) {
                this.speedX = -this.speedX
            }
            if (this.y < 0 || this.y > 300) {
                this.speedY = -this.speedY
            }
            this.x += this.speedX
            this.y += this.speedY
        }
    }
    fire() {
        this.fired = true
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }
}
var __main = function() {
    var g = Game()
    var paddle = new Paddle('paddle.png', 150, 200, 5)
    var ball = new Ball('ball.png', 250, 150, -5, -5)
    g.registerAction('a', function() {
        paddle.moveLeft()
    })
    g.registerAction('d', function() {
        paddle.moveRight()
    })
    g.registerAction('f', function() {
        ball.fire()
    })
    g.update = function() {
        ball.move()
        if (paddle.collide(ball)) {
            ball.speedY *= -1
        }
    }
    g.draw = function() {
        g.drawImage(paddle)
        g.drawImage(ball, 50, 50)
    }
}
__main()
