pipeline {
    agent any
    environment {
            AWS_DOCKER_REGISTRY = '703671926514.dkr.ecr.us-east-1.amazonaws.com'
            // AWS_DOCKER_REGISTRY = '703671926514.dkr.ecr.us-east-1.amazonaws.com'
            APP_NAME = 'finalproject-image'
            // APP_NAME = 'finalproject_group8'
            AWS_DEFAULT_REGION = 'us-east-1'
    }
    stages {
        // stage('Docker'){
        //     steps{
        //         sh 'docker build -t my-docker-image .'
        //     }
        // }
        stage('Build') {
            agent {
                docker { 
                    image 'node:20.17.0-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                ls -la
                    node --version
                    npm --version
                    # npm install
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }
        stage('Test') {
            agent {
                docker { 
                    image 'node:20.17.0-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    test -f build/index.html
                    npm test
                '''
            }
        }
        stage('Build My Docker Image'){
            agent {
                docker { 
                    image 'amazon/aws-cli'
                    reuseNode true
                    args '-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
                }
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'finalproject_credentials', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                sh '''
                amazon-linux-extras install docker
                docker build -t $AWS_DOCKER_REGISTRY/$APP_NAME .
                aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_DOCKER_REGISTRY
                docker push $AWS_DOCKER_REGISTRY/$APP_NAME:latest
                '''
            }
            }
        }
        
        stage('Deploy to AWS') {
            agent {
                docker { 
                    image 'amazon/aws-cli'
                    reuseNode true
                    args '-u root --entrypoint=""'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'finalproject_credentials', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                sh '''
                    aws --version
                    yum install jq -y

                    LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition.json | jq '.taskDefinition.revision')
                    aws ecs update-service --cluster finalProject-Cluster --service final-project-service --task-definition final-Project-Task-Definition:$LATEST_TD_REVISION
                '''
                }
            }
        }
    }
}

