
var canvas,
    context,
    shape,
    dragging = false,
    dragStartLocation,
    snapshot;


function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}
function drawLine(position) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();
}

function drawTriangleRight(position) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(dragStartLocation.x, position.y);
    context.lineTo(position.x, position.y);

    context.closePath();
}
function drawTriangleIso(position) {
    context.beginPath();
    context.moveTo(position.x, position.y);
    context.lineTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(dragStartLocation.x+(dragStartLocation.x-position.x), dragStartLocation.y-(dragStartLocation.y-position.y));
    
    context.closePath();
}
function drawTriangleEqi(position) {
    var angle= Math.PI/2;
    var coordinates = [],
        radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
        index = 0;

    for (index = 0; index < 3; index++) {
        coordinates.push({x: dragStartLocation.x + radius * Math.cos(angle), y: dragStartLocation.y - radius * Math.sin(angle)});
        angle += (2 * Math.PI) / 3;
    }

    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 1; index < 3; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y);
    }

    context.closePath();
}
function rotate(){
    console.log('rotate');
    context.rotate(Math.PI/2);
}

function draw(position) {
    if (shape === "line") {
        drawLine(position);
    }
    if (shape === "triangleRight") {
        drawTriangleRight(position);
    }
    if (shape === "triangleEqi") {
        drawTriangleEqi(position);
    }
    if (shape === "triangleIso") {
        drawTriangleIso(position);
    }
    context.stroke();
}
function setShape(event) {
    shape= event.target.id;
}
function setFill(event) {
    context.fillStyle = document.getElementById('colorInput').value;
    context.fill();
}
function clear() {
    var canvas = document.getElementById('canvas');
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}
function dragStart(event) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapshot();
}

function drag(event) {
    var position;
    if (dragging === true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        draw(position);
    }
}

function dragStop(event) {
    dragging = false;
    restoreSnapshot();
    var position = getCanvasCoordinates(event);
    draw(position);
}

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    context.strokeStyle = '#038C84';
    context.fillStyle= '#038C84';
    context.lineWidth = 4;
    context.lineCap = 'round';

    document.getElementById('download').addEventListener('click', function() {
        downloadCanvas(this, 'canvas', 'test.jpg');
    }, false);
    document.getElementById('clear').addEventListener('click', clear, false);
    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
}

window.addEventListener('load', init, false);
