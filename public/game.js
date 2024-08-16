// Define constants for width and height as that of the page
const WIDTH = $(window).width()
const HEIGHT = $(window).height()

// Initialise Kaboom engine
kaboom({
    width: WIDTH,
    height: HEIGHT,
    background: [255, 255, 255]
})

// Load graphics for player and ball
loadRoot("https://i.ibb.co/")
loadSprite("doge", "8BbNfDk/image.png")
loadSprite("chuck", "w4JcHfs/image.png")
loadSprite("ball", "sqC2Gth/image.png")
loadFont("Teko", "5cnqmZ8/Teko.png", 28, 50) // Load the "Teko" font

// Setup two player sprites
const players = [
    add([
        sprite("doge"),
        area(),
        solid(),
        origin("center"),
        pos(65, HEIGHT / 2), // Left
        { score: 0 },
        "player"
    ]),
    add([
        sprite("chuck"),
        area(),
        solid(),
        origin("center"),
        pos(WIDTH-65, HEIGHT / 2), // Right
        { score: 0 },
        "player"
    ])
]

// Setup scoreboard
const scoreboard = add([
    text("0:0", {
        size: 48,
        font: "Teko"
    }),
    area(),
    origin("center"),
    pos(WIDTH / 2, 24), // Top centre
    color(0, 0, 0)
])

// Player speed constant
const PLAYER_SPEED = 500

// Setup ball sprite and speed
const ball = add([
    sprite("ball"),
    area(),
    solid(),
    origin("center"),
    pos(WIDTH / 2, HEIGHT / 2), // Middle of screen
    { // Horizontal and vertical speeds
        speed_x: -2400,
        speed_y: 0
    }
])

// Continually move the ball
loop(0.1, function () {
    ball.move(ball.speed_x, ball.speed_y)
    if (ball.pos.y < 8 || ball.pos.y > HEIGHT-8) {
        ball.speed_y = -ball.speed_y
    }
})

// Number of player being controlled by arrow keys
var playerSelected = 0

// When ball collides with player, change direction
ball.onCollide("player", function () {
    ball.speed_x = -ball.speed_x // Change direction of horizontal speed
    ball.speed_y = Math.floor(Math.random() * 250) + 150 // Vertical speed is random number between 150 and 400
    const negative = Math.floor(Math.random() * 2)
    if (negative == 1) {
        ball.speed_y = -ball.speed_y
    }

    playerSelected = 1 - playerSelected // Switch player selected
})

// Check if ball goes off screen horizontally
ball.onUpdate(function () {
    // X coordinate less than 8 or more than WIDTH subtract 8, meaning player has failed to catch it
    if (ball.pos.x < 8 || ball.pos.x > WIDTH-8) {
        // Reset ball to centre of screen
        ball.speed_x = -2400
        ball.speed_y = 0
        ball.moveTo(WIDTH / 2, HEIGHT / 2)

        // Increment other player's score
        players[1 - playerSelected].score++
        scoreboard.text = `${players[0].score}:${players[1].score}`
        playerSelected = 0
    }
})

// Up key pressed
onKeyDown('up', function () {
    players[playerSelected].move(0, -PLAYER_SPEED) // Move vertically up
})

// Down key pressed
onKeyDown('down', function () {
    players[playerSelected].move(0, PLAYER_SPEED) // Move vertically down
})

// Q key pressed
onKeyPress('q', function () {
    debug.paused = !debug.paused // Pause/unpause game
})
