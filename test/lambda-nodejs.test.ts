import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AwsCdkLibLambdaNodejs from '../lib/index';

test('Lambda Function Created', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");
    // WHEN
    new AwsCdkLibLambdaNodejs.LambdaNodejs(stack, 'MyTestConstruct');
    // THEN
    expectCDK(stack).to(haveResource("AWS::Lambda::Function"));
});
