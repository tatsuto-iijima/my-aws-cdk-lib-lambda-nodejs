#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaNodejs } from '../lib/index';

const app = new cdk.App();
const stack = new cdk.Stack(app, "MyAwsCdkLibLambdaNodejsTestStack");
new LambdaNodejs(stack, 'LambdaNodejs');
