import mongoose from "mongoose";

 export function validateobjectid(req,res,next){

    if(!mongoose.isValidObjectId(req.params.userId)){
        return res.status(400).json({
            msg:"invalid id ",
        })
    }
    next();
}
