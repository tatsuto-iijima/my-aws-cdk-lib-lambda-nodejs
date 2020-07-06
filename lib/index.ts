import * as cdk from '@aws-cdk/core';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';

export interface LambdaNodejsProps {
  func?: lambdaNodejs.NodejsFunctionProps,
  role?: {
    description?: string;
    managedPolicies?: string[];
  },
  version?: boolean;
}

export class LambdaNodejs extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: LambdaNodejsProps = {}) {
    super(scope, id);

    const finalLambdaNodejsProps: any = {};
    Object.assign(finalLambdaNodejsProps, props.func);
    
    if (props.role) {
      finalLambdaNodejsProps.role = new iam.Role(this, 'IamRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        description: props.role.description,
      });
      if (props.role.managedPolicies) {
        for (const mangagedPolicie of props.role.managedPolicies) {
          finalLambdaNodejsProps.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(mangagedPolicie));
        }
      }
    }

    const lambdaFunction = new lambdaNodejs.NodejsFunction(this, 'NodejsFunction', finalLambdaNodejsProps);

    if (props.version) {
      new lambda.Version(this, 'LambdaVersion', {
        lambda: lambdaFunction,
      });
    }
  }
}
