import * as cdk from '@aws-cdk/core';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';

export interface LambdaNodejsProps {
  func?: lambdaNodejs.NodejsFunctionProps,
}

export class LambdaNodejs extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: LambdaNodejsProps = {}) {
    super(scope, id);

    new lambdaNodejs.NodejsFunction(this, 'NodejsFunction', props.func);
  }
}
