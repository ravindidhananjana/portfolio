---
title: Autonomous-Garbage-Collecting-Smart-Monitoring-Robot
type: project
classification: PORTFOLIO_PROJECT
last_commit: 46c0f7d3225a5aa98a80de25adf82594082f7c2d
---

# Autonomous Garbage Collecting & Smart Monitoring Robot

## 📌 Overview

The **Autonomous Garbage Collecting & Smart Monitoring Robot** is an IoT-enabled robotic waste management system designed to automate garbage collection and real-time bin status monitoring. It combines embedded systems hardware (ESP32), multi-sensor navigation and safety routines, touchless lid mechanisms, and a cloud-connected web interface powered by Firebase Realtime Database and Chart.js.

VERIFIED (Source: `README.md`, `Garbage Web/script.js`)

---

## 🔧 Architecture & Hardware Components

The system relies on an ESP32 microcontroller acting as the central unit for processing sensor inputs, driving motor hardware, handling Bluetooth control commands, and communicating over Wi-Fi to Firebase.

* **Microcontroller:** ESP32 (NodeMCU) with integrated Wi-Fi & Bluetooth capability VERIFIED (Source: `README.md`)
* **Sensors:**
  * Ultrasonic Sensors: Used for front obstacle detection and real-time garbage fill level measurement VERIFIED (Source: `README.md`)
  * IR Sensors: Used for line-following navigation along fixed target paths VERIFIED (Source: `README.md`)
* **Actuators & Drivers:**
  * Servo Motor: Manages touchless bin lid opening and closing operations VERIFIED (Source: `README.md`)
  * Motor Driver Module & Hobby Gear Motors: Controls wheel propulsion and direction VERIFIED (Source: `README.md`)
* **Power Supply:** Dedicated Power Supply Unit VERIFIED (Source: `README.md`)

---

## 💻 Software & Technology Stack

* **Embedded Language / Environment:** C++ / Arduino IDE VERIFIED (Source: Repository Metadata, `README.md`)
* **Wireless Protocols:** ESP32 Bluetooth Serial, Wi-Fi IEEE 802.11 VERIFIED (Source: `README.md`)
* **Backend / Database:** Firebase Realtime Database VERIFIED (Source: `Garbage Web/script.js`, `README.md`)
* **Frontend Web Dashboard:** Vanilla JavaScript (ES6 Modules), HTML5, CSS3, Chart.js VERIFIED (Source: `Garbage Web/script.js`)

---

## 🚀 Key Features & Implementation Details

### 1. Line-Following & Target-Based Navigation
* Receives target destination commands wirelessly over ESP32 Bluetooth Serial (e.g., Command 1 $\rightarrow$ Location A, Command 2 $\rightarrow$ Location B). VERIFIED (Source: `README.md`)
* Executes target navigation logic using IR sensor array line-following mechanisms once a destination command is received. VERIFIED (Source: `README.md`)

### 2. Obstacle Detection & Safety Routines
* Ultrasonic sensors continuously monitor forward clearing distance. VERIFIED (Source: `README.md`)
* If an obstacle enters range, the robot halts, triggers avoidance logic, and resumes its path once clear. VERIFIED (Source: `README.md`)
* Web dashboard categorizes distance thresholds: Safe ($> 30\text{ cm}$), Caution ($15\text{ cm} - 30\text{ cm}$), and Danger ($< 15\text{ cm}$). VERIFIED (Source: `Garbage Web/script.js`)

### 3. Touchless Lid Mechanism & Bin Level Detection
* Integrated hand detection triggers a servo motor to open the bin lid without direct physical contact. VERIFIED (Source: `README.md`)
* Bin fill level is tracked via an ultrasonic sensor mounted inside the container, displayed as a fill percentage ($0\% - 100\%$) categorized into status levels: EMPTY ($<30\%$), HALF ($30\%-80\%$), and FULL ($\ge 80\%$). VERIFIED (Source: `Garbage Web/script.js`)

### 4. Real-Time Cloud Monitoring Web Dashboard
* Synchronizes real-time status attributes via Firebase Realtime Database listeners (`onValue` hooks). VERIFIED (Source: `Garbage Web/script.js`)
* Monitored cloud data points:
  * `dustbin/garbageLevel` (Garbage fill percentage)
  * `dustbin/lidStatus` (Lid open/close status)
  * `robot/state` (Current robotic state)
  * `robot/target` (Active destination command)
  * `robot/obstacleDistance` (Distance to nearest obstacle)
  * `dustbin/history` (Historical fill level records)
* Visualizes historical fill level records using Chart.js line graph, rendering up to the 30 most recent timestamped entries. VERIFIED (Source: `Garbage Web/script.js`)

---

## 🔄 Dual Communication Architecture

The system utilizes a hybrid, dual-layer communication model:

1. **Bluetooth Layer (Local Control):** Direct, short-range channel between user devices and ESP32 for command delivery, destination selection, and manual override capabilities. VERIFIED (Source: `README.md`)
2. **Wi-Fi Layer (Cloud Telemetry):** Long-range continuous telemetry channel pushing live metrics to Firebase Realtime Database for web monitoring. VERIFIED (Source: `README.md`)

---

## 🧪 Experiments, Results & Metrics

* **Quantitative Distance Thresholds:** Safe ($>30\text{ cm}$), Caution ($>15\text{ cm}$ and $\le 30\text{ cm}$), Danger ($\le 15\text{ cm}$). VERIFIED (Source: `Garbage Web/script.js`)
* **Fill Status Thresholds:** Empty ($<30\%$), Half ($30\% - 79\%$), Full ($\ge 80\%$). VERIFIED (Source: `Garbage Web/script.js`)
* **Historical Data Retention:** Visualized up to the 30 most recent historical records ordered chronologically. VERIFIED (Source: `Garbage Web/script.js`)
* **Empirical Performance Benchmarks:** UNKNOWN (No explicit latency or accuracy experiment logs are recorded in the repository files provided).

---

## 🛠 Challenges & Inferred Solutions

* **Challenge:** Maintaining reliable short-range command latency while concurrently streaming telemetry to cloud infrastructure.
  * **Inferred Solution:** Division of responsibilities across Bluetooth Serial for localized command parsing and Wi-Fi for asynchronous database sync. INFERRED (Based on `README.md`)
* **Challenge:** Preventing collision during dynamic autonomous execution along predefined lines.
  * **Inferred Solution:** Priority interrupt logic where obstacle detection overrides normal IR line-following loops. INFERRED (Based on `README.md`)

---

## 🔮 Limitations & Future Improvements

* Path planning is constrained to IR-line pathing rather than spatial mapping. VERIFIED (Source: `README.md`)
* **Planned Upgrades:**
  * Path planning algorithms (A* or SLAM concepts). VERIFIED (Source: `README.md`)
  * Computer vision integration via camera module for waste type classification. VERIFIED (Source: `README.md`)
  * Machine learning-based garbage fill rate forecasting. VERIFIED (Source: `README.md`)
  * Dashboard hosting via Firebase Hosting and native mobile app interface. VERIFIED (Source: `README.md`)
