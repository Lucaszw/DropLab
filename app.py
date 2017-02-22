import serial
import time

from flask import Flask, render_template , request
from flask_socketio import SocketIO
import numpy as np

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
socketio = SocketIO(app)

# UNCOMMENT:
# ser = serial.Serial('COM5', 9600)

def ByteArray(length, on):
    a= list('0' * length)
    for i in range(0, len(on)):
        a[on[i]] = '1'
    z = []
    for j in range(0, length/8):
        z.append (('0b' + ''.join(a[j*8 : j*8+8])))
    return(z)

def WriteToRegister(ser, onBits = (1, 11, 26), numBits = 128 ):
    z = ByteArray(numBits, onBits)
    e = []
    for k in range(0, len(z)):
        a = z[k]
        b = int(a, 2)
        b = chr(b)
        e.append(bytes(b))

    # UNCOMMENT:
    # ser.write(''.join(e))

@socketio.on("change pixels")
def changePixels(msg):
    pass
    # UNCOMMENT:
    # WriteToRegister(ser, msg['data'])

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('confirm connection')
def handle_message(message):
    print(message["data"])

if __name__ == "__main__":
    socketio.run(app)
