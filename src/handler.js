import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

export const handler = async (event) => {
  try {
    console.log("Event:", event);
    const { action, requestConfig, s3: s3Config } = event;

    switch (action) {
      case "downloadPhoto":
        // Download photo
        const response = await axios({
          method: requestConfig.method,
          url: requestConfig.url,
          headers: requestConfig.headers,
          responseType: "arraybuffer",
        });

        // Upload to S3
        await s3.send(
          new PutObjectCommand({
            Bucket: s3Config.bucket,
            Key: s3Config.key,
            Body: response.data,
            ContentType: s3Config.contentType,
          })
        );

        return {
          statusCode: 200,
          success: true,
        };

      case "makeRequest":
        // Make generic external request
        const result = await axios({
          method: requestConfig.method,
          url: requestConfig.url,
          headers: requestConfig.headers,
          data: requestConfig.body,
          responseType: requestConfig.responseType || "json",
        });

        return {
          statusCode: 200,
          data: result.data,
        };

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("Lambda execution failed:", error);
    return {
      statusCode: 500,
      error: error.message,
    };
  }
};
