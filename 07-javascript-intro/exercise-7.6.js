// Connecting to ROS
// -----------------

let disconnected = true;
let connected = false;
let error = false;

var ros;

const showError = (message) => {
    console.log(message);
    const errorMessageDiv = document.getElementById('error_message');
    errorMessageDiv.innerText = message;
    errorMessageDiv.style.display = 'block';
};

const hideError = () => {
    const errorMessageDiv = document.getElementById('error_message');
    errorMessageDiv.innerText = '';
    errorMessageDiv.style.display = 'none';
};

// Modify the connectToROS function
const connectToROS = () => {
    const rosbridgeAddress = document.getElementById('rosbridge_address').value;

    try {
        ros = new ROSLIB.Ros({
            url: rosbridgeAddress,
        });

        ros.on('connection', function () {
            console.log('Connected to websocket server.');
            connected = true;
            disconnected = false;
            error = false;
            hideError(); // Hide error message when connection is successful
            updateUI();
        });

        ros.on('error', function (error) {
            console.log('Error connecting to websocket server: ', error);
            connected = false;
            disconnected = true;
            error = true;
            showError('Error connecting to ROS: ' + error.message); // Show error message
            updateUI();
        });

        ros.on('close', function () {
            console.log('Connection to websocket server closed.');
            connected = false;
            disconnected = true;
            error = true;
            showError('Connection to ROS closed.'); // Show error message
            updateUI();
        });

        updateUI();
    } catch (error) {
        // Catch any error that occurs during the creation of ROSLIB.Ros
        console.error('Error creating ROS instance: ', error);
        showError('Error creating ROS instance: ' + error.message);
    }
};


const disconnectFromROS = () => {
    ros.close();
    connected = false;
    disconnected = true;
    error = false;
    updateUI();
};

document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        const form = document.getElementById('form');
        form.onsubmit = (e) => {
            e.preventDefault();
        };

        const btnSet = document.getElementById('btn_set');
        btnSet.onclick = (e) => {
            const x = +document.getElementById('linear_x').value;
            const z = +document.getElementById('angular_z').value;
            const topic = document.getElementById('topic_name').value;
            sendTopicMsg(topic, x, z);
            e.preventDefault();
        };

        const btnStop = document.getElementById('btn_stop');
        btnStop.onclick = (e) => {
            const topic = document.getElementById('topic_name').value;
            sendTopicMsg(topic, 0, 0);
            e.preventDefault();
        };
    }
};

const sendTopicMsg = (topic_name, x, z) => {
    if (connected) {
        var topic = new ROSLIB.Topic({
            ros: ros,
            name: topic_name,
            messageType: 'geometry_msgs/Twist',
        });
        var msg = new ROSLIB.Message({
            linear: { x, y: 0, z: 0 },
            angular: { x: 0, y: 0, z },
        });
        topic.publish(msg);
    }
};

const updateUI = () => {
    const rosbridgeAddressField = document.getElementById('rosbridge_address');
    const topicNameField = document.getElementById('topic_name');
    const linearXField = document.getElementById('linear_x');
    const angularZField = document.getElementById('angular_z');
    const btnConnect = document.getElementById('btn_connect');
    let btnDisconnect = document.getElementById('btn_disconnect');
    const btnSet = document.getElementById('btn_set');
    const btnStop = document.getElementById('btn_stop');

    if (disconnected) {
        // Enable rosbridge address input
        rosbridgeAddressField.disabled = false;

        // Disable other input fields and buttons
        topicNameField.disabled = true;
        linearXField.disabled = true;
        angularZField.disabled = true;
        btnSet.disabled = true;
        btnStop.disabled = true;

        // Show Connect button and hide Disconnect button
        btnConnect.style.display = 'block';
        btnDisconnect.style.display = 'none';
    }

    if (connected) {
        // Disable rosbridge address input
        rosbridgeAddressField.disabled = true;
        // Enable other input fields and buttons
        topicNameField.disabled = false;
        linearXField.disabled = false;
        angularZField.disabled = false;
        btnSet.disabled = false;
        btnStop.disabled = false;

        // Show Disconnect button and hide Connect button
        btnConnect.style.display = 'none';
        btnDisconnect.style.display = 'block';
        btn_disconnect.disabled = false
    }

    if (error) {
        // Disable rosbridge address input
        rosbridgeAddressField.disabled = false;

        // Disable other input fields and buttons
        topicNameField.disabled = true;
        linearXField.disabled = true;
        angularZField.disabled = true;
        btnSet.disabled = true;
        btnStop.disabled = true;

        // Show Connect button and hide Disconnect button
        btnConnect.style.display = 'block';
        btnDisconnect.style.display = 'none';
    }
};
