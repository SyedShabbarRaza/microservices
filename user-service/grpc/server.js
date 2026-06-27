import { grpc, proto } from "./protoLoader.js";
import User from "../models/userModel.js";

const userProto = proto.user;

async function ValidateUser(call, callback) {

    try {

        const { userId } = call.request;

        const user = await User.findById(userId);

        callback(null, {
            exists: !!user,
        });

    } catch (err) {

        callback(err);

    }
}

export function startGrpcServer() {

    const server = new grpc.Server();

    server.addService(userProto.UserService.service, {
        ValidateUser,
    });

    server.bindAsync(
        "0.0.0.0:50051",
        grpc.ServerCredentials.createInsecure(),
        (err) => {

            if (err) {
                console.error(err);
                return;
            }

            server.start();

            console.log("✅ gRPC Server running on port 50051");
        }
    );
}