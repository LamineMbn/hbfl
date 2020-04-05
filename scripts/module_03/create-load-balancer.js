// Imports
const AWS = require('aws-sdk')
const helpers = require('./helpers')
const env = require('../../config.js');

AWS.config.update({ region: env.REGION })

// Declare local variables
const elbv2 = new AWS.ELBv2()

const sgName = 'hamster-elb-sg'
const tgName = 'hamster-tg'
const elbName = 'hamsterELB'
const vpcId = env.DEFAULT_VPC_ID
const subnets = [
  'subnet-6fbc8106','subnet-c6f5a1bd'
]

helpers.createSecurityGroup(sgName, 80)
.then((sgId) =>
  Promise.all([
    createTargetGroup(tgName),
    createLoadBalancer(elbName, sgId)
  ])
)
.then((results) => {
  const tgArn = results[0].TargetGroups[0].TargetGroupArn
  const lbArn = results[1].LoadBalancers[0].LoadBalancerArn
  console.log('Target Group Name ARN:', tgArn)
  return createListener(tgArn, lbArn)
})
.then((data) => console.log(data))

function createLoadBalancer (lbName, sgId) {
  const params = {
    Name: lbName,
    Subnets: subnets,
    SecurityGroups: [
      sgId
    ]
  }
  return new Promise((resolve, reject) => {
    elbv2.createLoadBalancer(params, (err, data) => {
      if(err) reject(err)
      else resolve(data)
    })
  });
}

function createTargetGroup (tgName) {
  const params = {
    Name: tgName,
    Port: 3000,
    Protocol: 'HTTP',
    VpcId: vpcId
  }

  return new Promise((resolve, reject) => {
    elbv2.createTargetGroup(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function createListener (tgArn, lbArn) {
  const params = {
    DefaultActions: [
      {
        TargetGroupArn: tgArn,
        Type: 'forward'
      }
    ],
    LoadBalancerArn: lbArn,
    Port: 80,
    Protocol: 'HTTP'
  }

  return new Promise((resolve, reject) => {
    elbv2.createListener(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
