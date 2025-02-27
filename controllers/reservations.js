const Reservation=require('../models/Reservation');
const CoWorkingSpace=require('../models/CoWorkingSpace');

//@desc     Get all Reservations
//@route    GET /api/v1/reservations
//@access   Public
exports.getReservations=async(req,res,next)=>{
    let query;

    //General users can see only their reservations!
    if(req.user.role!=='admin'){
        query=Reservation.find({user:req.user.id}).populate({
            path:'coWorkingSpace',
            select:'name province tel'
        });
    }else{ //If you are an admin, you can see all!
        if(req.params.coWorkingSpaceId){
            console.log(req.params.coWorkingSpaceId);
            query=Reservation.find({coWorkingSpace: req.params.coWorkingSpaceId}).populate({
                path:"coWorkingSpace",
                select:"name province tel"
            });
        } else query=Reservation.find().populate({
            path:'coWorkingSpace',
            select:'name province tel'
        });
    }
    try{
        const reservations=await query;

        res.status(200).json({
            success:true,
            count:reservations.length,
            data:reservations
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot find Reservation"
        });
    }
};


//@desc     Get single Reservation
//@route    GET /api/v1/reservations/:id
//@access   Public
exports.getReservation=async(req,res,next)=>{
    try{
        const reservation= await Reservation.findById(req.params.id).populate({
            path:'coWorkingSpace',
            select:'name description tel'
        });

        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});

        }

        res.status(200).json({
            success:true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: "Cannot find Reservation"});
    }
}


//@desc     Add Reservation
//@route    POST /api/v1/co-working-space/:coWorkingSpaceId/reservation
//@access   Private
exports.addReservation=async(req,res,next)=>{
    try {
        req.body.coWorkingSpace=req.params.coWorkingSpaceId;

        const coWorkingSpace= await CoWorkingSpace.findById(req.params.coWorkingSpaceId);

        if(!coWorkingSpace){
            return res.status(404).json({success:false,message: `No co-working space with the id of ${req.params.coWorkingSpaceId}`});
        }

        //add user Id to req.body
        req.body.user=req.user.id;

        //Check for existed reservation
        const existedReservations=await Reservation.find({user:req.user.id});

        //If the user is not an admin, they can only create 3 reservations.
        if(existedReservations.length>=3 && req.user.role!=='admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 reservations`});
        }

        const reservation = await Reservation.create(req.body);

        res.status(201).json({
            success:true,
            data: reservation
        });
    } catch(error) {
        console.log(error);

        return res.status(500).json({success:false,message:"Cannot create Reservation"});
    }
};

//@desc     Update Reservation
//@route    PUT /api/v1/reservations/:id
//@access   Private
exports.updateReservation=async(req,res,next)=>{
    try{
        let reservation=await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        //Make sure user is the reservation owner
        if(reservation.user.toString()!==req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this reservation`});
        }

        reservation=await Reservation.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data:reservation
        });
    } catch (error) {
        console.log(err.stack);

        return res.status(500).json({success:false,message:"Cannot update Reservation"});
    }
};

//@desc     Delete Reservation
//@route    DELETE /api/v1/reservations/:id
//@access   Private
exports.deleteReservation=async(req,res,next)=>{
    try{
        const reservation=await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        //Make sure user is the reservation owner
        if(reservation.user.toString()!==req.user.id && req.user.role!=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this reservation`});
        }

        await reservation.deleteOne();

        res.status(200).json({success:true,data:{}});
    }catch (error) {
        console.log(error);

        return res.status(500).json({success:false,message:"Cannot delete Reservation"});
    }
}