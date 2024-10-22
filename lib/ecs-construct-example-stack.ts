import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elasticloadbalancing from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface ECSStackProps extends cdk.StackProps {
  projectName: string;
  environment: string;
}

export class EcsFargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ECSStackProps) {
    super(scope, id, props);

    const projectName = props.projectName;
    const projectPrefix = `${projectName}-${props.environment}-server`;

    // We create a vpc for the ecs. We can also reference a vpc if it has been created prior this deployment
    const vpc = new ec2.Vpc(this, 'Primary-Vpc', {
      maxAzs: 2, 
    });
     
    // Create an ECR repo to store images to be used by the ECS task definition
    const repository = new ecr.Repository(this, `${projectPrefix}-repository`, {
      repositoryName: `${projectPrefix}-repository`,
    });

    const cluster = new ecs.Cluster(this, `ECS-Cluster`, {
      clusterName: `${projectPrefix}-cluster`,
      vpc,
    });

     // load balancer resources
     const elb = new elasticloadbalancing.ApplicationLoadBalancer(
      this,
      `LoadBalancer`,
      {
        vpc,
        vpcSubnets: { subnets: vpc.publicSubnets },
        internetFacing: true,
      }
    );



  }
}
