const AWS = require('aws-sdk')
const helpers = require('./helpers')
const env = require('../../config.js');

AWS.config.update({ region: env.REGION })

// Declare local variables
const autoscaling = new AWS.AutoScaling()

const lcName = 'hamster-lc'
const roleName = 'hamster-lc-role'
const sgName = env.SG_NAME
const keyName = env.KEY_NAME_MP
const profileArn = 'arn:aws:iam::241369606124:instance-profile/hamster-lc-role_profile'

// helpers.createIamRole(roleName)
createLaunchConfiguration(lcName, profileArn)
.then(data => console.log(data))

function createLaunchConfiguration (lcName, profileArn) {
  const params = {
    IamInstanceProfile: profileArn,
    ImageId: env.HAMSTER_IMAGE,
    InstanceType: env.INSTANCE_TYPE,
    LaunchConfigurationName: lcName,
    KeyName: keyName,
    SecurityGroups:[
      sgName
    ],
    UserData: env.USER_DATA_MP
  }

  return new Promise((resolve, reject) => {
    autoscaling.createLaunchConfiguration(params, (err, data) => {
      if(err) reject(err)
      else resolve(data)
    })
  });
}
