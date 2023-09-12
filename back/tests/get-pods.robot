*** Settings ***
Documentation  API Testing in Robot Framework
Library  SeleniumLibrary
Library  RequestsLibrary
Library  JSONLibrary
Library  Collections
Library  OperatingSystem
Library  String
Library  Process
*** Variables ***

*** Test Cases ***
Drop existing config
    Create Session  mysession  http://127.0.0.1:5000
    ${response}=  GET On Session  mysession  /robot/drop  
    Status Should Be  201  ${response}  
Add kubeconfig secret
    Create Session  mysession  http://127.0.0.1:5000
    ${body}=  Create Dictionary  
    ...  name=kubeconfig  
    ...  secret={true}
    ...  default= 
    ...  pattern= 
    ...  description=kubeconfig yaml
    ...  example=For examples, start here https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
    ${response}=  POST On Session  mysession  /variables/robot/secret  
    ...  json=${body}
    Status Should Be  200  ${response}  
Add CONTEXT variable
    Create Session  mysession  http://127.0.0.1:5000
    ${body}=  Create Dictionary  
    ...  name=CONTEXT  
    ...  secret=${false}
    ...  default=default
    ...  pattern=\w
    ...  description=Which Kubernetes context to operate within.
    ...  example=my-main-cluster
    ${response}=  POST On Session  mysession  /variables/robot/plain  
    ...  json=${body}
    Status Should Be  200  ${response}  
Add NAMESPACE variable
    Create Session  mysession  http://127.0.0.1:5000
    ${body}=  Create Dictionary  
    ...  name=NAMESPACE  
    ...  secret={false}
    ...  default=default
    ...  pattern=\w
    ...  description=The name of the Kubernetes namespace to scope actions and searching to. Accepts a single namespace in the format `-n namespace-name` or `--all-namespaces`
    ...  example=default
    ${response}=  POST On Session  mysession  /variables/robot/plain  
    ...  json=${body}
    Status Should Be  200  ${response}  
Add kubectl service
    Create Session  mysession  http://127.0.0.1:5000
    ${body}=  Create Dictionary  
    ...  name=kubectl  
    ...  default=kubectl-service.shared
    ...  description=The location service used to interpret shell commands.
    ...  example=kubectl-service.shared
    ${response}=  POST On Session  mysession  /variables/service  
    ...  json=${body}
    Status Should Be  200  ${response}  
Add KUBECONFIG env
    Create Session  mysession  http://127.0.0.1:5000
    ${body}=  Create Dictionary  
    ...  name=KUBECONFIG  
    ...  value=./\${kubeconfig.key}
    ${response}=  POST On Session  mysession  /variables/env  
    ...  json=${body}
    Status Should Be  200  ${response}  
Add kubectl command
    Create Session  mysession  http://127.0.0.1:5000
    ${body}=  Create Dictionary  
    ...  name=kubectl  
    ...  command=kubectl get pod -n online-boutique
    ...  regex=
    ${response}=  POST On Session  mysession  /command  
    ...  json=${body}
    Status Should Be  200  ${response}
Add Issue
    [documentation]  This test case verifies that the response code of the GET Request should be 200
    Create Session  mysession  http://127.0.0.1:5000
    ${assertion}=    Create Dictionary
    ...  condition=_raise_issue_if_contains
    ...  target=_line
    ...  value=adservice
    ${assertions}=  Create List 
    ...    ${assertion}
    ${body}=  Create Dictionary  
    ...  response=kubectl  
    ...  description=no description
    ...  severity=1
    ...  assertions=${assertions}
    ${response}=  POST On Session  mysession  /issue  
    ...  json=${body}
    Log to console  ${body}
    Status Should Be  200  ${response}  
Get RobotFile
    Create Session  mysession  http://127.0.0.1:5000
    ${response}=  GET On Session  mysession  /robot
    Status Should Be  200  ${response}  
    Log To Console  ${response.json()['data']}
    Create File          /home/iplink/projects/runwhen/rw-cli-codecollection/codebundles/dupa/runbook.robot   ${response.json()['data']}
    # Create Session  mysession  http://127.0.0.1:8001
    # ${body}=  Create Dictionary  
    # ...  data=${response.json()['data']}
    # ${response}=  POST On Session  mysession  /  
    # ...  json=${body}
    # Status Should Be  200  ${response}

