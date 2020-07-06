import { expect as expectCDK, countResources, haveResource, ABSENT, arrayWith, objectLike, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AwsCdkLibLambdaNodejs from '../lib/index';

describe('Test Construct "LambdaNodejs" by default', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  new AwsCdkLibLambdaNodejs.LambdaNodejs(stack, 'MyTestConstruct');
  // THEN
  test('Lambda Function x1 Created', () => {
    expectCDK(stack).to(countResources("AWS::Lambda::Function", 1));
  });
  test('IAM Role x0 Created', () => {
    expectCDK(stack).to(countResources("AWS::IAM::Role", 1));
  });
  test('Lambda Version x0 Created', () => {
    expectCDK(stack).to(countResources("AWS::Lambda::Version", 1));
  });
});

const testRolePropsData = [
  {},
  { description: 'Test Construct "LambdaNodejs"' },
  { managedPolicies: [ 'AWSLambdaBasicExecutionRole' ] },
  { description: 'Test Construct "LambdaNodejs"' , managedPolicies: [ 'AWSLambdaBasicExecutionRole' ] },
  { description: 'Test Construct "LambdaNodejs"' , managedPolicies: [ 'AWSLambdaBasicExecutionRole', 'AmazonS3ReadOnlyAccess' ] },
];
const testRolePropsTable = [];
for (const testRoleProps of testRolePropsData) {
  testRolePropsTable.push([
    JSON.stringify(testRoleProps),
    testRoleProps,
  ]);
}

console.log(JSON.stringify(testRolePropsTable, undefined, 2));

describe.each(testRolePropsTable)('Test Construct "LambdaNodejs" by option %j', (json, testRoleProps) => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  if (typeof testRoleProps != 'string') {
    new AwsCdkLibLambdaNodejs.LambdaNodejs(stack, 'MyTestConstruct', {
      role: testRoleProps,
    });
  } else {
    throw new Error('ERROR: Type of RoleProps is string');
  }
  
  test('Lambda Function x1 Created', () => {
    // THEN
    expectCDK(stack).to(countResources("AWS::Lambda::Function", 1));
  });
  
  test('IAM Role x1 Created', () => {
    // THEN
    expectCDK(stack).to(countResources("AWS::IAM::Role", 1));
  });

  test('IAM Role has Property "AssumeRolePolicyDocument"', () => {
    // THEN
    expectCDK(stack).to(haveResourceLike("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Statement: arrayWith(
          objectLike({
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
          }),
        ),
      },
    }));
  });

  if (testRoleProps.description) {
    test('IAM Role Property "Description" is "' + testRoleProps.description + '"', () => {
      // THEN
      expectCDK(stack).to(haveResourceLike("AWS::IAM::Role", {
        Description: testRoleProps.description,
      }));
    });
  } else {
    test('IAM Role Property "Description" is none', () => {
      // THEN
      expectCDK(stack).to(haveResourceLike("AWS::IAM::Role", {
        Description: ABSENT,
      }));
    });
  }

  if (testRoleProps.managedPolicies) {
    test.each(testRoleProps.managedPolicies)('IAM Role Property "ManagedPolicyArns" is "%s"', (managedPoliciesName) => {
      // THEN
      expectCDK(stack).to(haveResourceLike("AWS::IAM::Role", {
        ManagedPolicyArns: arrayWith(objectLike({
          "Fn::Join": [
            "",
            [
              "arn:",
              {
                "Ref": "AWS::Partition",
              },
              ":iam::aws:policy/" + managedPoliciesName,
            ],
          ]
        })),
      }));
    });
  } else {
    test('IAM Role Property "ManagedPolicyArns" is none', () => {
      // THEN
      expectCDK(stack).to(haveResourceLike("AWS::IAM::Role", {
        ManagedPolicyArns: ABSENT,
      }));
    });
  }

  test('Lambda Version x0 Created', () => {
    expectCDK(stack).to(countResources("AWS::Lambda::Version", 0));
  });

});

describe('Lambda Version', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  new AwsCdkLibLambdaNodejs.LambdaNodejs(stack, 'MyTestConstruct', {
    version: true,
  });

  // THEN
  test('Lambda Function x1 Created', () => {
    expectCDK(stack).to(countResources("AWS::Lambda::Function", 1));
  });
  test('IAM Role x0 Created', () => {
    expectCDK(stack).to(countResources("AWS::IAM::Role", 0));
  });
  test('Lambda Version x1 Created', () => {
    expectCDK(stack).to(countResources("AWS::Lambda::Version", 1));
  });
  
});