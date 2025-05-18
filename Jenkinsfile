pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        IMAGE_NAME = 'juskythehusky/wellbeing-journey-mate'
        DOCKER_IMAGE_NAME = 'juskythehusky/wellbeing-journey-mate'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Ashutosh-Vaish/wellbeing-journey-mate.git'
            }
        }
        stage('Build & Test') {
            steps {
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm test'
                sh 'npm run build'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE_NAME} .'
            }
        }
        stage('Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "DockerHub", passwordVariable: "dockerpass", usernameVariable: "dockerhubuser")]) {
                        sh "docker login -u ${env.dockerhubuser} -p ${env.dockerpass}"
                        echo 'login successful'
                        sh "docker tag ${DOCKER_IMAGE_NAME} ${env.dockerhubuser}/${DOCKER_IMAGE_NAME}:latest"
                        sh "docker push ${env.dockerhubuser}/${DOCKER_IMAGE_NAME}:latest"
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker stack deploy -c docker-compose.yml wellbeing_stack'
            }
        }
    }
}
