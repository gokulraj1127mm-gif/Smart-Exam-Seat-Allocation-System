pipeline {
    agent any

    // Defines parameters you can choose when clicking "Build with Parameters"
    parameters {
      
        choice(
            name: 'Environment', 
            choices: ['testing', 'verbose', 'error'], 
            description: 'Specify the logging verbosity output for the test execution runtime'
        )
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Git Clone') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github-credentials', 
                    url: 'https://github.com/gokulraj1127mm-gif/Smart-Exam-Seat-Allocation-System.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'cd server && npm install'
            }
        }

        // =============================================================
        // ONE SIMPLE PARAMETERIZED TESTING STAGE
        stage('Unit Testing') {
        when {
                expression {
                    // FIXED: Changed "params.Environment" to match your actual choice parameter "params.Environment"
                    return params.Environment == 'testing'
                }
            }
            steps {
        
                echo 'Executing Backend Unit Testing Suites...'
                bat 'cd server && npm run test:unit'
            }
        }

        stage('Build Frontend Assets') {
            steps {
                bat 'cd client && npm run build'
            }
        }
    }
}