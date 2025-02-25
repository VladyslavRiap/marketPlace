const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
const mime = require("mime-types");
const s3 = new S3Client({
  region: "eu-north-1",
  credentials: fromEnv(),
});

const uploadFile = async (bucketName, fileName, fileBuffer) => {
  try {
    const contentType = mime.lookup(fileName) || "application/octet-stream";
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
      Metadata: {
        "x-amz-object-ownership": "BucketOwnerFullControl",
      },
    });

    await s3.send(command);

    return `https://${bucketName}.s3.eu-north-1.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error("Ошибка при загрузке файла в S3:", err);
    throw err;
  }
};

module.exports = uploadFile;
