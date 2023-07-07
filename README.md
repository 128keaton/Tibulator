# Tibulator
[![](https://img.shields.io/badge/tibulator-npm-red)](https://www.npmjs.com/package/tibulator)

Probably the shittiest package known to man


## Changelog
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
  "deviceCount": 10,
  "firmwareVersion": "1.0",
  "firmwareName": "Test",
  "scanRate": 10000,
  "sensors": [
    {
      "type": "HUMIDITY"
    },
    {
      "type": "TEMPERATURE"
    }
  ],
  "inputs": [
    {
      "name": "motion",
      "probability": "never"
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
