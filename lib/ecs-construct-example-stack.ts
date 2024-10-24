import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import * as elasticloadbalancing from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface ECSStackProps extends cdk.StackProps {
  projectName: string;
  environment: string;
}

export class EcsFargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ECSStackProps) {
    super(scope, id, props);

    const projectName = props.projectName;
    const projectPrefix = `${projectName}-${props.environment}-server`;
    
    // Create a Dynamo db table
    const dynamoTable = new dynamodb.Table(this, 'DynamoDbMessages', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }, 
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.NUMBER
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY, 
    });

    new CfnOutput(this, 'TableName', { value: dynamoTable.tableName });

    /******** 
     * 1. Create a vpc for the ecs or Can also reference a vpc if 
     * it has been created prior this deployment
    *********/
    const vpc = new ec2.Vpc(this, "Vpc", {
      vpcName:'primary-vpc',
      natGateways: 1,
      subnetConfiguration: [{  
          cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC, name: "Public" },
        {  
          cidrMask: 24, subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, name: "Private"}],
      maxAzs: 2 
    });
    
    // Create a security group that allows HTTP traffic on port 80 for the ECS container
    const ecsSecGroup = new ec2.SecurityGroup(this, 'EcsSecurityGroup', {
      securityGroupName: `${projectName}-${props.environment}-SecGroup`,
      vpc,
      allowAllOutbound: false,
    });

    ecsSecGroup.addIngressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(3000));

    // Create cluster
    const cluster = new ecs.Cluster(this, `ECS-Cluster`, {
      clusterName: `${projectPrefix}-cluster`,
      vpc,
    });

    const executionRolePolicy =  new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ]
    });

    // Create a fargate task definition 
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(
      this, 'FargateTaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    fargateTaskDefinition.addToExecutionRolePolicy(executionRolePolicy);

    fargateTaskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [dynamoTable.tableArn],
      actions: ['dynamodb:*']
    }));
  
    const ecsContainer = fargateTaskDefinition.addContainer('NginxServerContainer', {
      image: ecs.ContainerImage.fromRegistry('nginx:latest'),
      cpu: 100,
      memoryLimitMiB: 256,
      essential: true,
      logging: ecs.LogDrivers.awsLogs({streamPrefix: 'nginx-ecs-server'}),
      environment: { 
        'DYNAMODB_MESSAGES_TABLE': dynamoTable.tableName,
        'APP_ID' : 'nginx-ecs-server'
      }
    });

    ecsContainer.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    });

    // Create the service
    const ecsFargateService = new ecs.FargateService(this, 'Ecs-Service', {
      cluster,
      taskDefinition: fargateTaskDefinition,
      desiredCount: 2,
      assignPublicIp: false,
      securityGroups: [ecsSecGroup],
    });

    const lb = new elasticloadbalancing.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true
    });

    const albListener = lb.addListener('AlbListener', {
      port: 80,
    });

    albListener.addTargets('Target', {
      port: 80,
      targets: [ecsFargateService],
      healthCheck: { path: '/api/' }
    });

    albListener.connections.allowDefaultPortFromAnyIpv4('Open to all');
  }
}
