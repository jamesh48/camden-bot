#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import * as cdk from 'aws-cdk-lib';
import { CamdenBotStack } from '../lib/camden-bot-stack';

const app = new cdk.App();
new CamdenBotStack(app, 'CamdenBotStack', {
  env: {
    account: '471507967541',
    region: 'us-east-1',
  },
});
