# VPC Proxy Lambda

This Lambda function serves as a proxy to make external HTTP requests and S3 operations from a public VPC. It can be called by other Lambda functions running in private VPCs.

## Features

- Make HTTP requests to external services
- Download files and upload them to S3
- Handle different content types and response formats

## Deployment

1. Install dependencies:

```
npm install
```

2. Build the function:

```
npm run deploy
```

3. Upload the generated `function.zip` to AWS Lambda

## Usage

The Lambda accepts events with the following structure:

```javascript
// For making HTTP requests
{
"action": "makeRequest",
"requestConfig": {
"method": "GET",
"url": "https://api.example.com/data",
"headers": {},
"body": {},
"responseType": "json"
}
}
// For downloading and uploading to S3
{
"action": "downloadPhoto",
"requestConfig": {
"method": "GET",
"url": "https://example.com/photo.jpg",
"headers": {}
},
"s3": {
"bucket": "your-bucket-name",
"key": "photos/photo.jpg",
"contentType": "image/jpeg"
}
}
```

## Configuration

The Lambda requires the following environment variables:

- `AWS_REGION` (optional, defaults to us-east-1)

Make sure to configure appropriate IAM roles with:

- S3 write permissions
- Network access to make external HTTP requests

To deploy this Lambda:
Run the setup commands to create the project and install dependencies
Copy all the files into their respective locations
Run npm run deploy to create the deployment package
Create a new Lambda function in AWS:
Runtime: Node.js 18.x or later
Architecture: x86_64 or arm64
Handler: handler.handler
Upload the generated function.zip file
Make sure to:
Place this Lambda in a public subnet with internet access
Configure appropriate IAM roles with S3 access and network permissions
Set up the security groups to allow outbound internet access
The private VPC Lambda can then call this Lambda using the AWS SDK's Lambda.invoke() method to make external requests.
