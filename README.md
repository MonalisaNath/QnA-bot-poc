# Cross-service example: Building an Amazon Transcribe streaming app

## Purpose
This example demonstrates how to build an app that records and transcribes an audio stream in real-time. It
also demonstrates how to invoke a genarative AI model endpoint and convert the output of the model back to audio. The app uses the following
AWS services:
- [Amazon Transcribe](https://aws.amazon.com/transcribe/)
- [Amazon Sagemaker jumpstart](https://aws.amazon.com/sagemaker/jumpstart/)
- [Amazon Polly](https://aws.amazon.com/polly/)
  

The JavaScript SDK Transcribe Streaming client encapsulates the API into a JavaScript 
library that can be run on browsers, Node.js and potentially React Native. By default, 
the client uses HTTP/2 connection on Node.js, and uses WebSocket connection on browsers 
and React Native.


## Prerequisites


* An AWS account. For more information see [AWS SDKs and Tools Reference Guide](https://docs.aws.amazon.com/sdkref/latest/guide/overview.html).
* A project environment to run this Node JavaScript example, and install the required AWS SDK for JavaScript and third-party modules.  For instructions, see [Create a Node.js project environment](#create-a-nodejs-project-environment) on this page.

* The following AWS resources:
    - An unauthenticated AWS Identity and Access Management (IAM) user role with the following permissions:
        - polly:full access
        - transcribe:StartStreamTranscriptionWebSocket
        - sagemaker: InvokeEndpoint
* Creat an Amazon Cognito Identity Pool .
        

**Note**: An unauthenticated role enables you to provide permissions to unauthenticated users to use the AWS Services. To create an authenticated role, see [Amazon Cognito Identity Pools (Federated Identities)](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html).    

## Create a Node.js project environment

1. Clone this git repo or download it in your local environment.

2. Run the following commands in sequence in the terminal to install the AWS service client modules and third-party modules listed in the *package.json*:

```
npm install node -g
cd transcribe-streaming-app
npm install
```
## Building the code
This app runs from the browser, so we create the interface using HTML and CSS. 
The app uses JavaScript to provide basic interactive features, and Node.js to invoke the AWS Services.

### Creating the HTML and CSS
In **index.html**, the **head** section invoke the **recorder.css**, which applies styles to the HTML,
and the **index.js**, which contains JavaScript and Node.js functions used in the app.

Each button on the interface invokes one of these functions when clicked.

### Creating the JavaScript and Node.js
The **./src/libs/** folders contains a file for each of the AWS Service clients required. In the **awsID.js** file, you must
replace "REGION" with your AWS Region (e.g. us-west-2), and replace "IDENTITY_POOL_ID" with the Amazon Cognito identity pool id you created in [Create the resources](#create-the-resources) on this page.

**./src/index.js** imports all the required AWS Service and third party modules and contains the UI logic of the app.

Note: When using the app, make sure you use an email address you verified on Amazon SES in [Create the resources](#create-the-resources) on this page. 

**Important**: You must bundle all the JavaScript and Node.js code required for the app into a single
 file (**main.js**) to run the app.

### Bundling the scripts
This is a static site consisting only of HTML, CSS, and client-side JavaScript. 
However, a build step is required to enable the modules to work natively in the browser.

To bundle the JavaScript and Node.js for this example in a single file named main.js, 
enter the following commands in sequence in the AWS CLI command line:

```
npm run build
```
This will create a minified js file called **main.js** in the src folder.
## Run the app
Open the index.html in src in your favorite browser, and follow the onscreen instructions.
