# ECS Fargate Service Example

Deploying ECS fargate container with AWS CDK v2 typescript.

Deploy a fargate service having a nginx server container. The Ecs services passes information of the dynamo db to store the creation of messages and its id. 


### File structure

`/lib/ecs-construct-example-stack.ts` where the defined stack is located

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
