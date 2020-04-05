// Imports
const AWS = require('aws-sdk')
const env = require('../../config.js');

AWS.config.update({ region: env.REGION })

// Declare local variables
const autoScaling = new AWS.AutoScaling()
const asgName = 'hamster-scaler'
const lcName = 'hamster-lc'
const policyName = 'hamster-policy'
const tgArn = env.TARGET_GROUP_NAME

createAutoScalingGroup(asgName, lcName)
.then(() => createASGPolicy(asgName, policyName))
.then((data) => console.log(data))

function createAutoScalingGroup (asgName, lcName) {
  const params= {
    AutoScalingGroupName: asgName,
    LaunchConfigurationName: lcName,
    AvailabilityZones: [
      env.REGION + 'a',
      env.REGION + 'b'
    ],
    TargetGroupARNs: [
      tgArn
    ],
    MinSize: 1,
    MaxSize: 2

  }

  return new Promise((resolve, reject) => {
    autoScaling.createAutoScalingGroup(params, (err,data) => {
      if(err) reject(err)
      else resolve(data)
    })
  });
}

function createASGPolicy (asgName, policyName) {
  const params = {
    AdjustmentType: 'ChangeInCapacity',
    AutoScalingGroupName: asgName,
    PolicyName: policyName,
    PolicyType: 'TargetTrackingScaling',
    TargetTrackingConfiguration: {
      PredefinedMetricSpecification: {
        PredefinedMetricType: 'ASGAverageCPUUtilization'
      },
      TargetValue: 5
    }
  }

  return new Promise((resolve, reject) => {
    autoScaling.putScalingPolicy(params, (err, data) => {
      if(err) reject(err)
      else resolve(data)
    })
  });
}
