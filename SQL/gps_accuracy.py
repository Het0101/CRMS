import serial
import json
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# --- CONFIGURATION ---
# Change this to match your Due (e.g., 'COM3' for Windows, '/dev/ttyACM0' for Linux/Mac)
PORT = 'COM11'  
BAUD = 115200  # Must match the Serial.begin() in your Arduino code

MAX_POINTS = 500 # How many history points to keep on screen

lats = []
lngs = []
latest_stats = {"satellites": 0, "hdop": 0}

# Setup the matplotlib window
fig, ax = plt.subplots(figsize=(8, 8))
fig.canvas.manager.set_window_title('Live GPS Sensor Fusion Monitor')

# Attempt to connect to the Arduino
try:
    ser = serial.Serial(PORT, BAUD, timeout=0.1)
    print(f"Connected to {PORT} at {BAUD} baud.")
    print("Waiting for valid GPS JSON data... (Close the plot window to quit)")
except Exception as e:
    print(f"Error opening serial port: {e}")
    print("--> Fix: Make sure the Arduino IDE Serial Monitor is CLOSED.")
    exit()

def update_plot(frame):
    # Read all lines currently waiting in the serial buffer
    while ser.in_waiting > 0:
        try:
            line = ser.readline().decode('utf-8').strip()
            if not line: continue
            
            # Parse the incoming JSON
            data = json.loads(line)
            
            # Check for error messages from the Arduino
            if "error" in data:
                print(f"Arduino Warning: {data['error']}")
                continue
            
            # Extract coordinates
            if "lat" in data and "lng" in data:
                lats.append(data["lat"])
                lngs.append(data["lng"])
                
                # Update our live stats for the title bar
                latest_stats["satellites"] = data.get("satellites", "?")
                latest_stats["hdop"] = data.get("hdop", "?")
                
                # Prevent memory overload by popping old data
                if len(lats) > MAX_POINTS:
                    lats.pop(0)
                    lngs.pop(0)
                    
        except json.JSONDecodeError:
            pass # Ignore half-written lines when the script first starts
        except UnicodeDecodeError:
            pass # Ignore garbled bytes

    # Redraw the plot if we have data
    if len(lats) > 0:
        ax.clear()
        
        ax.set_title(f'Live GPS Position | Sats: {latest_stats["satellites"]} | HDOP: {latest_stats["hdop"]}')
        ax.set_xlabel('Longitude')
        ax.set_ylabel('Latitude')
        
        # Stop matplotlib from rounding our precise coordinates into scientific notation
        ax.ticklabel_format(useOffset=False, style='plain')
        ax.grid(True, linestyle='--', alpha=0.6)
        
        # Plot the history "cloud" (Blue dots)
        ax.scatter(lngs, lats, c='blue', alpha=0.3, s=15, label='History')
        
        # Plot the most recent exact position (Large Red dot)
        ax.scatter(lngs[-1], lats[-1], c='red', s=80, marker='X', label='Current')
        
        ax.legend(loc='upper right')

# The FuncAnimation runs the update_plot function every 50 milliseconds to match your 20Hz Arduino output
ani = FuncAnimation(fig, update_plot, interval=50, cache_frame_data=False)

plt.show()

# When you close the window, cleanly close the serial port
ser.close()
print("Serial port closed. Script ended.")