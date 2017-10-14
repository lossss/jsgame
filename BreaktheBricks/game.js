log = console.log.bind(console)
imgFromPath = function(src) {
  var img = new Image()
  img.src = src
  return img
}
screenX = 400
screenY = 300
paused = false
//判断两个物体是否相撞
pub_collide = function(i, j) {
  //(x,y) (x,y+h)(x+w,y)(x+w,y+h)
  //x  j.x j.x+w j.y j.y+h
  var iheight = i.img.height
  var iwidth = i.img.width
  var jheight = j.img.height
  var jwidth = j.img.width
  var d1x = i.x
  var d1y = i.y
  var d2x = i.x
  var d2y = i.y + iheight
  var d3x = i.x + iwidth
  var d3y = i.y
  var d4x = i.x + iwidth
  var d4y = i.y + iheight
  // alert("!!!d1x " + d1x + " d1y " + d1y + " d4x " + d4x + " d4y " + d4y + " j.x " + j.x + " j.width " + j.width + " j.y " + j.y + " j.height " + j.height)
  var result = 0
  if ((d1x < j.x + jwidth && d1x > j.x) && (d1y < j.y + jheight && d1y > j.y)) {
    result += 1
  }
  if ((d2x < j.x + jwidth && d2x > j.x) && (d2y < j.y + jheight && d2y > j.y)) {
    result += 1
  }
  if ((d3x < j.x + jwidth && d3x > j.x) && (d3y < j.y + jheight && d3y > j.y)) {
    result += 1
  }
  if ((d4x < j.x + jwidth && d4x > j.x) && (d4y < j.y + jheight && d4y > j.y)) {
    result += 1
  }
  if (result > 1) {
    log("相撞")
    return {"collide": true, "side": false}
  } else if (result == 1) {
    //侧面相撞
    log("侧面相撞")
    return {"collide": true, "side": true}
  } else {
    return {"collide": false, "side": false}
  }
  // alert("相撞!!!" + d1x + "d1y" + d1y + "d4x" + d4x + "d4y" + d4y + "j.x" + j.x + "j.width" + j.width + "j.y" + j.y + "j.height" + j.height)
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
  move(x) {
    if (x < 0) {
      x = 0
    }
    if (x > screenX - this.x) {
      x = screenX - this.x
    }
    return x
  }
  moveRight() {
    this.x = this.move(this.x + this.speed)
  }
  moveLeft() {
    this.x = this.move(this.x - this.speed)
  }
  collide(ball) {
    return pub_collide(ball, this)
    // if (ball.y + 50 > this.img.y) {
    //
    //     if (ball.x > this.img.x && ball.x < this.img.x + this.img.width) {
    //         return true
    //     }
    // }
    // return false
  }
  getX() {
    return this.x
  }
  getY() {
    return this.y
  }
}
class Block {
  constructor(img, x, y) {
    this.img = imgFromPath(img)
    this.x = x
    this.y = y
    this.alive = true
  }
  kill() {
    this.alive = false
  }
  collide(ball) {
    return pub_collide(ball, this)
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
      if (this.x < 0 || this.x > screenX) {
        this.speedX = -this.speedX
      }
      if (this.y < 0 || this.y > screenY) {
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
  var block = new Block('block.png', 50, 20)
  g.registerAction('a', function() {
    paddle.moveLeft()
  })
  g.registerAction('d', function() {
    paddle.moveRight()
  })
  g.registerAction('f', function() {
    ball.fire()
  })
  window.addEventListener('keydown',function(event){
    if(event.key == 'p'){
      paused = !paused
    }
  })
  g.update = function() {
    if(paused == true){
      return
    }
    ball.move()
    var result = paddle.collide(ball)
    if (result["collide"]) {
      ball.speedY *= -1
      if (result["side"]) {
        ball.speedX *= -1
      }
    }
    result = block.collide(ball)
    if (block.alive && result.collide) {
      ball.speedY *= -1
      block.kill()
      if (result.side) {
        ball.speedX *= -1
      }
    }
  }

  g.draw = function() {
    g.drawImage(paddle)
    g.drawImage(ball, 50, 50)
    log(block.alive)
    if (block.alive) {
      g.drawImage(block)
    }
  }
}
__main()
