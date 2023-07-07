# Tibulator
[![](https://img.shields.io/badge/tibulator-npm-red)](https://www.npmjs.com/package/tibulator)

Probably the shittiest package known to man


## Changelog
### 0.0.6
* New TUI

### 0.0.5
* Added Camera device
* Fixed emissionRate bug
* Adds ws-discover util

### 0.0.4
* Mapping of Input values

### 0.0.3
* Spawns MQTT client for each device

### 0.0.2
* Increases max device count

### 0.0.1
* Initial commit

## Usage
```shell
$ npx tibulator ./tibulator.json
```

## Configuration

Example of `tibulator.json`
```json
{
  "tibboCount": 5,
  "cameraCount": 5,
  "firmwareVersion": "1.0",
  "firmwareName": "Test",
  "scanRate": 50000,
  "sensors": [
    {
      "type": "HUMIDITY"
    },
    {
      "type": "TEMPERATURE",
      "emissionRate": 10000
    }
  ],
  "inputs": [
    {
      "name": "motion",
      "probability": 0.5
    },
    {
      "name": "door",
      "probability": 0.1,
      "trueValue": "open",
      "falseValue": "closed"
    },
    {
      "name": "alarm",
      "probability": "never",
      "trueValue": "yes",
      "falseValue": "no"
    }
  ],
  "mqtt": {
   "options": {
     "url": "mqtt://mqtt.vipbackend.com",
     "username": "prostor-api",
     "password": "password"
   },
    "rootTopic": "prostor-test"
  }
}
```

## Example
![Output](img/output.png)
![RabbitMQ](img/rabbitmq.png)
