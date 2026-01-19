pipeline {
   agent any
   environment {
     SERVICE_NAME = "mf-qdc"
	 NAMESPACE = "platform-app"
	 WEB_FOLDER= "/var/www/html"
   }

   stages {
     stage('Preparation') {
        steps {
           cleanWs deleteDirs: true, patterns: [[pattern: 'node_modules', type: 'EXCLUDE']]
           git credentialsId: '63978329-a1ea-4d66-9048-4f19d66444f5', url: "https://gitlab.com/tmcp/${SERVICE_NAME}.git"
        }
   }
   
   stage('Build Compile') {
     steps {
	   sh 'npm install'
	   sh 'npm run build:dev'
    }
   }

  stage('Deploy to Cluster') {
    steps {
	  sh 'mkdir -p ${WEB_FOLDER}/${SERVICE_NAME}'
      sh 'cp -R dist/* ${WEB_FOLDER}/${SERVICE_NAME}'
    }
  }
  
 }
}