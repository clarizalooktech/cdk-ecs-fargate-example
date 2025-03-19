## Building Serverless Applications with AWS CDK: ECS Fargate & DynamoDB

This repository provides an example of setting up a serverless architecture using AWS CDK (TypeScript) to deploy an ECS Fargate service with Nginx, backed by DynamoDB. The infrastructure is deployed in a VPC with an Application Load Balancer (ALB) for public access.

The Ecs services passes information of the dynamo db to store the creation of messages and its id.

### 🏗 Architecture Overview
                 ┌───────────────────────────────────┐
                 │      Internet Users               │
                 └───────────────────────────────────┘
                                 │
                                 ▼
                 ┌───────────────────────────────────┐
                 │  Application Load Balancer (ALB)  │
                 │       - Listens on Port 80        │
                 │       - Routes to ECS Service     │
                 └───────────────────────────────────┘
                                 │
                                 ▼
         ┌─────────────────────────────────────────────┐
         │          ECS Fargate Service (2 Tasks)      │
         │ ┌─────────────────────────────────────────┐ │
         │ │  Task Definition                        │ │
         │ │  - Nginx Container (Port 3000)          │ │
         │ │  - Logs to AWS CloudWatch               │ │
         │ │  - Reads/Writes to DynamoDB             │ │
         │ └─────────────────────────────────────────┘ │
         └─────────────────────────────────────────────┘
                                 │
                                 ▼
               ┌───────────────────────────────────┐
               │        DynamoDB Table             │
               │  - Stores messages data           │
               │  - PAY_PER_REQUEST mode           │
               └───────────────────────────────────┘

 - AWS CDK (TypeScript) to define and deploy infrastructure.

 - Amazon ECS (Fargate) for containerized deployment.

 - Amazon DynamoDB for NoSQL storage.

 - Application Load Balancer (ALB) for routing traffic.

 - AWS CloudWatch for logging.

 - AWS IAM Roles & Security Groups for security and access control.

### 🖥 Technologies Used

 - AWS CDK (TypeScript)

 - Amazon ECS Fargate

 - Amazon DynamoDB

 - Amazon EC2 VPC & Security Groups

 - Amazon Elastic Load Balancer (ALB)

 - AWS CloudWatch Logs

 - AWS IAM Roles & Policies

### 📂 Project Structure
```
├── bin/		# CDK entry point
├── lib/		# CDK Stack Definition
│   ├── ecs-construct-example-stack.ts  # Main CDK Stack
├── cdk.json	# CDK Configuration
├── package.json # Dependencies
├── tsconfig.json # TypeScript Configuration
└── README.md # Project Documentation
```
### 🚀 Deployment

##### 1️⃣ Prerequisites

 - Ensure you have the following installed:

 - Node.js (>= 18.x)

 - AWS CLI (Configured with necessary permissions)

 - AWS CDK (npm install -g aws-cdk)

##### 2️⃣ Install Dependencies
```
npm install
```

##### 3️⃣ Deploy the Infrastructure
```
cdk deploy
```

This will:

 - Create a VPC with public & private subnets.

 - Deploy an ECS Fargate Service with an Nginx container.

 - Set up DynamoDB for storing application data.

 - Configure an Application Load Balancer (ALB) for public access.

 - Create necessary IAM roles & policies.

#### Screehots
1. Cdk synth json file
https://github.com/clarizalooktech/cdk-ecs-fargate-example/blob/master/assets/cdk_synth.json

2. Example of the cdk synth
![Example of the cdk synth ](https://github.com/clarizalooktech/cdk-ecs-fargate-example/blob/master/assets/cdksynth.JPG)

3. Cdk Deploy
![Cdk Deploy ](https://github.com/clarizalooktech/cdk-ecs-fargate-example/blob/master/assets/cdkdeploy.jpg)

4. How it looks like in CloudFormation
![How it looks like in CloudFormation ](https://github.com/clarizalooktech/cdk-ecs-fargate-example/blob/master/assets/how_it_looks_in_cloudformation_stack.jpg)

5. How the ECS looked like
![How the ECS looked like ](https://github.com/clarizalooktech/cdk-ecs-fargate-example/blob/master/assets/how_ecs_server_looks_inside_cluster.jpg)

#### Useful commands

* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
* `npx cdk deploy`  deploy this stack to your default AWS account/region
