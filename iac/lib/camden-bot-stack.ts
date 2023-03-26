import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as aws_ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as r53 from 'aws-cdk-lib/aws-route53';
import { Duration } from 'aws-cdk-lib';
import * as aws_r53_targets from 'aws-cdk-lib/aws-route53-targets';
// import { LoadBalancerTarget } from 'aws-cdk-lib/aws-route53-targets';

export class CamdenBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const parentHostedZone = r53.HostedZone.fromLookup(
      this,
      'cambot-parent-hosted-zone',
      { domainName: 'camdenbot.com' }
    );

    const hostedZone = new r53.HostedZone(this, 'cambot-hosted-zone', {
      zoneName: 'interlocken.camdenbot.com',
    });

    const certificate = new acm.Certificate(this, 'cambot-certificate', {
      certificateName: 'camden-bot-certificate',
      domainName: 'interlocken.camdenbot.com',
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const camdenBotService =
      new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        'cambot-loadbalancer',
        {
          certificate,
          loadBalancerName: 'cambot-loadbalancer',
          redirectHTTP: true,
          taskImageOptions: {
            image: ecs.ContainerImage.fromAsset('code/camden-bot'),
          },
        }
      );

    new r53.NsRecord(this, 'cambot-nsrecord', {
      values: hostedZone.hostedZoneNameServers as string[],
      zone: parentHostedZone,
      recordName: hostedZone.zoneName,
      ttl: Duration.seconds(60),
    });

    new r53.ARecord(this, 'cambot-alias-record', {
      recordName: 'interlocken.camdenbot.com',
      zone: hostedZone,
      target: r53.RecordTarget.fromAlias(
        new aws_r53_targets.LoadBalancerTarget(camdenBotService.loadBalancer)
      ),
      ttl: cdk.Duration.minutes(1),
    });
  }
}
