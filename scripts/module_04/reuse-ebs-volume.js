// Imports
const AWS = require('aws-sdk')
const env = require('../../config.js');

AWS.config.update({ region: env.REGION })

// Declare local variables
const ec2 = new AWS.EC2()
const volumeId = 'vol-04e99030e208bd598'
const instanceId = 'i-0f04f2428870746ce'

// detachVolume(volumeId)
// .then(() => attachVolume(instanceId, volumeId))
attachVolume(instanceId, volumeId)

function detachVolume (volumeId) {
  const params = {
    VolumeId: volumeId
  }

  return new Promise((resolve, reject) => {
    ec2.detachVolume(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function attachVolume (instanceId, volumeId) {
  const params = {
    InstanceId: instanceId,
    VolumeId: volumeId,
    Device: '/dev/sdf'
  }

  return new Promise((resolve, reject) => {
    ec2.attachVolume(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
