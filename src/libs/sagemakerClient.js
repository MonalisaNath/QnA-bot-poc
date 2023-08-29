import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import * as awsID from "./awsID.js";

let sagemakerClient = undefined;
export const queryEndpoint = async (endpoint,data) => {
  createSagemakerClient();
  return await query(endpoint,data);
};

const createSagemakerClient = () => {
  sagemakerClient = new SageMakerRuntimeClient({
    region: awsID.REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: awsID.REGION }),
      identityPoolId: awsID.IDENTITY_POOL_ID,
    }),
  });
}

const query = async (endpoint,text) => {
   
    const command = new InvokeEndpointCommand({ EndpointName: endpoint,
    ContentType: 'application/json',
    Body: JSON.stringify(text),
    CustomAttributes: 'accept_eula=true'});
    const response = await sagemakerClient.send(command);
    const jsonString = Buffer.from(response.Body).toString('utf8')
    const parsedData = JSON.parse(jsonString)
    console.log(parsedData)
    return parsedData[0].generation.content;

};

  
    
    
    
    //const responseBody = command.Body.toString('utf-8');
    //const parsedResponse = JSON.parse(responseBody);


        
