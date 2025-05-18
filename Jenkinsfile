pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = 'your-dockerhub-username/wellbeing-journey-mate'
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
        stage('Docker Build & Push') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:$BUILD_NUMBER").push()
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker stack deploy -c docker-compose.yml wellbeing_stack'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
