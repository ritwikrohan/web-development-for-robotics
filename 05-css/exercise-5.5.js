// Connecting to ROS
// -----------------

var ros = new ROSLIB.Ros({
    url: 'wss://i-0e0ccbe0c27cd7447.robotigniteacademy.com/3d20b330-a03b-4744-8556-86838ce2b9de/rosbridge/'
});
ros.on('connection', function () {
    console.log('Connected to websocket server.');
});
ros.on('error', function (error) {
    console.log('Error connecting to websocket server: ', error);
});
ros.on('close', function () {
    console.log('Connection to websocket server closed.');
});

document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        const form = document.getElementById('form')
        form.onsubmit = (e) => {
            e.preventDefault()
        }

        const btnSet = document.getElementById('btn_set')
        btnSet.onclick = (e) => {
            document.getElementById('robot_status').className = 'moving'
            sendTopicMsg('/cmd_vel', 0.2, 0.5)
            e.preventDefault()
        }

        const btnStop = document.getElementById('btn_stop')
        btnStop.onclick = (e) => {
            document.getElementById('robot_status').className = 'stopped'
            sendTopicMsg('/cmd_vel', 0, 0)
            e.preventDefault()
        }
    }
}

const sendTopicMsg = (topic, x, z) => {
    var topic = new ROSLIB.Topic({
        ros: ros,
        name: topic,
        messageType: 'geometry_msgs/Twist'
    })
    var msg = new ROSLIB.Message({
        linear: { x, y: 0, z: 0 },
        angular: { x: 0, y: 0, z },
    })
    topic.publish(msg)
}

// end