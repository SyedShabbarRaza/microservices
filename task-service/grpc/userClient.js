import { grpc, proto } from "./protoLoader.js";

const userProto = proto.user;

const client = new userProto.UserService(
    "user-service:50051",
    grpc.credentials.createInsecure()
);

export default client;