*** Settings ***
Documentation  API Testing in Robot Framework
Library  SeleniumLibrary
Library  RequestsLibrary
Library  JSONLibrary
Library  Collections
Library  OperatingSystem
Library  String
*** Variables ***

*** Test Cases ***
Add kubeconfig secret
    [documentation]  This test case verifies that the response code of the GET Request should be 200
    Create Session  mysession  http://127.0.0.1:5127
    ${body}=  Create Dictionary  
    ...  name=kubeconfig  
    ...  secret=True
    ...  default=""
    ...  pattern="\w"
    ...  description="kubeconfig yaml"  
    ...  example="For examples, start here https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/"
    ${response}=  POST On Session  mysession  /variables/robot/secret  
    ...  json=${body}
    Status Should Be  200  ${response}  
Add CONTEXT variable
    [documentation]  This test case verifies that the response code of the GET Request should be 200
    Create Session  mysession  http://127.0.0.1:5127
    ${body}=  Create Dictionary  
    ...  name=CONTEXT  
    ...  secret=False
    ...  default="default"
    ...  pattern="\w"
    ...  description="Which Kubernetes context to operate within."  
    ...  example="my-main-cluster"
    ${response}=  POST On Session  mysession  /variables/robot/plain  
    ...  json=${body}
    Status Should Be  200  ${response}  
Add NAMESPACE variable
    [documentation]  This test case verifies that the response code of the GET Request should be 200
    Create Session  mysession  http://127.0.0.1:5127
    ${body}=  Create Dictionary  
    ...  name=NAMESPACE  
    ...  secret=False
    ...  default="default"
    ...  pattern="\w"
    ...  description="The name of the Kubernetes namespace to scope actions and searching to. Accepts a single namespace in the format `-n namespace-name` or `--all-namespaces`"  
    ...  example="default"
    ${response}=  POST On Session  mysession  /variables/robot/plain  
    ...  json=${body}
    Status Should Be  200  ${response}  
Add kubectl service
    [documentation]  This test case verifies that the response code of the GET Request should be 200
    Create Session  mysession  http://127.0.0.1:5127
    ${body}=  Create Dictionary  
    ...  name=kubectl  
    ...  default="kubectl-service.shared"
    ...  description="The location service used to interpret shell commands."
    ...  example="kubectl-service.shared"
    ${response}=  POST On Session  mysession  /variables/service  
    ...  json=${body}
    Status Should Be  200  ${response}  
Add KUBECONFIG env
    [documentation]  This test case verifies that the response code of the GET Request should be 200
    Create Session  mysession  http://127.0.0.1:5127
    ${body}=  Create Dictionary  
    ...  name=KUBECONFIG  
    ...  value="./\${kubeconfig.key}"
    ${response}=  POST On Session  mysession  /variables/env  
    ...  json=${body}
    Status Should Be  200  ${response}  
Get RobotFile
    [documentation]  This test case verifies that the response code of the GET Request should be 200
    Create Session  mysession  http://127.0.0.1:5127
    ${response}=  GET On Session  mysession  /robot
    Status Should Be  200  ${response}  
    ${robotfile} = 	Decode Bytes To String 	${response.content} 	UTF-8 	
    # ${decoded_robotfile} =  Replace String    ${robotfile}    \n    ${EMPTY}
    ${decoded_robotfile}=  Replace String    ${robotfile}    \\n    \n
    Create File          ./runbook.robot    ${decoded_robotfile} 
