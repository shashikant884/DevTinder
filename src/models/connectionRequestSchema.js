const  mongoose  = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
    },
    toUserId : {   
        type : mongoose.Schema.Types.ObjectId,
    },
    status : {
        type : String,
        emum : {
            values : ["ignored", "interested", "accepeted", "rejected"],
            message : `{VALUE} is incorrect status type`,
        }
    }
},
{
    timestamps : true,
}
);

connectionRequestSchema.pre("save" , function (next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;

